import os
from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings

from app.db import init_db, create_lead, get_lead, record_message, increment_nudges, set_next_nudge, due_nudges, set_scheduled, set_status
from app.models import LeadCreate, LeadOut, InboundMessage
from app.messaging import MessageSender
from app.faq import answer_for
from app.scheduler import NudgeScheduler


class Settings(BaseSettings):
    SCHEDULING_URL: str | None = None
    NUDGE_INTERVAL_MINUTES: int = 240
    ORIGINS: list[str] = ["*"]


settings = Settings()  # type: ignore
app = FastAPI(title="Lead Funnel")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sender = MessageSender()


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    global scheduler
    scheduler = NudgeScheduler(tick=nudge_tick)
    scheduler.start()


@app.on_event("shutdown")
def on_shutdown() -> None:
    try:
        scheduler.shutdown()  # type: ignore[name-defined]
    except Exception:
        pass


@app.post("/leads", response_model=LeadOut)
def create_lead_endpoint(payload: LeadCreate) -> LeadOut:
    lead_id = create_lead(name=payload.name, email=payload.email, phone=payload.phone, source=payload.source)
    lead = get_lead(lead_id)
    if not lead:
        raise HTTPException(500, "Lead not found after creation")
    # immediate welcome + CTA
    cta = sender.call_to_action_text()
    if lead.get("phone"):
        sender.send_sms(lead["phone"], f"Hi {lead['name']}! Thanks for reaching out. {cta}")
        record_message(lead_id, "outbound", "sms", f"Welcome CTA sent: {cta}")
    elif lead.get("email"):
        sender.send_email(lead["email"], "Welcome!", f"Hi {lead['name']},\n\nThanks for reaching out. {cta}")
        record_message(lead_id, "outbound", "email", f"Welcome CTA sent: {cta}")
    set_next_nudge(lead_id, settings.NUDGE_INTERVAL_MINUTES)
    return LeadOut(
        id=lead_id,
        name=lead["name"],
        email=lead.get("email"),
        phone=lead.get("phone"),
        source=lead.get("source"),
        status=lead.get("status", "new"),
        scheduled_url=lead.get("scheduled_url"),
    )


@app.get("/leads/{lead_id}", response_model=LeadOut)
def get_lead_endpoint(lead_id: int) -> LeadOut:
    lead = get_lead(lead_id)
    if not lead:
        raise HTTPException(404, "Lead not found")
    return LeadOut(
        id=lead["id"],
        name=lead["name"],
        email=lead.get("email"),
        phone=lead.get("phone"),
        source=lead.get("source"),
        status=lead.get("status"),
        scheduled_url=lead.get("scheduled_url"),
    )


@app.post("/webhooks/inbound")
def inbound_message(payload: InboundMessage) -> Dict[str, Any]:
    lead = get_lead(payload.lead_id)
    if not lead:
        raise HTTPException(404, "Lead not found")
    record_message(payload.lead_id, "inbound", payload.channel, payload.content)
    # Simple FAQ detection
    faq = answer_for(payload.content)
    if faq:
        if payload.channel == "sms" and lead.get("phone"):
            sender.send_sms(lead["phone"], faq)
            record_message(payload.lead_id, "outbound", "sms", faq)
        elif payload.channel == "email" and lead.get("email"):
            sender.send_email(lead["email"], "Re: your question", faq)
            record_message(payload.lead_id, "outbound", "email", faq)
    # Scheduling intent
    if payload.content.strip().lower() in {"yes", "book", "schedule"} and settings.SCHEDULING_URL:
        if lead.get("phone"):
            sender.send_sms(lead["phone"], f"Great! {sender.call_to_action_text()}")
            record_message(payload.lead_id, "outbound", "sms", "Scheduling link sent")
        elif lead.get("email"):
            sender.send_email(lead["email"], "Schedule link", sender.call_to_action_text())
            record_message(payload.lead_id, "outbound", "email", "Scheduling link sent")
        set_status(payload.lead_id, "engaged")
    return {"ok": True}


@app.post("/webhooks/scheduled")
def scheduled_callback(lead_id: int, meeting_url: str) -> Dict[str, Any]:
    lead = get_lead(lead_id)
    if not lead:
        raise HTTPException(404, "Lead not found")
    set_scheduled(lead_id, meeting_url)
    if lead.get("phone"):
        sender.send_sms(lead["phone"], "You're all set. Calendar invite sent!")
        record_message(lead_id, "outbound", "sms", "Scheduled confirmation sent")
    elif lead.get("email"):
        sender.send_email(lead["email"], "Confirmed", "You're all set. Calendar invite sent!")
        record_message(lead_id, "outbound", "email", "Scheduled confirmation sent")
    return {"ok": True}


def nudge_tick() -> None:
    for lead in due_nudges(limit=50):
        cta = sender.call_to_action_text()
        body = f"Hi {lead['name']}, just checking in. {cta}"
        if lead.get("phone"):
            sender.send_sms(lead["phone"], body)
            record_message(lead["id"], "outbound", "sms", body)
        elif lead.get("email"):
            sender.send_email(lead["email"], "Quick check-in", body)
            record_message(lead["id"], "outbound", "email", body)
        increment_nudges(lead["id"])
        set_next_nudge(lead["id"], settings.NUDGE_INTERVAL_MINUTES)