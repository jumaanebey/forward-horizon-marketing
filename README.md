## Lead Funnel (FastAPI)

- Intake leads, auto-nudge via SMS/email, answer simple FAQs, and drive scheduling.

### Quickstart

1. Create env
```
cp .env.example .env
```
2. Install deps
```
pip install -r requirements.txt
```
3. Run server
```
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Endpoints
- POST `/leads` — create lead {name, email?, phone?, source?}
- GET `/leads/{id}` — fetch lead
- POST `/webhooks/inbound` — inbound message {lead_id, channel: sms|email, content}
- POST `/webhooks/scheduled` — scheduling webhook params: lead_id, meeting_url

### Notes
- Messages are logged to stdout by default; swap `MessageSender` with providers.
- Nudges run every `NUDGE_INTERVAL_MINUTES` (default 240). APScheduler runs in background.
- Data persisted to SQLite at `/workspace/data/leads.db`.

### Docker (FastAPI worker)

1. Copy env file
```
cp .env.docker.example .env
```
2. Build and run
```
docker compose up -d --build
```
3. Verify
```
curl http://localhost:8000/openapi.json
```

- Data persists in a named volume `lead_data` at `/data/leads.db` inside the container.
- Configure `SCHEDULING_URL` and `NUDGE_INTERVAL_MINUTES` in `.env`.