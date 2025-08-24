import os
from typing import Optional


class MessageSender:
    def __init__(self) -> None:
        self.scheduling_url: Optional[str] = os.getenv("SCHEDULING_URL")

    def send_sms(self, to_number: str, body: str) -> None:
        print(f"[SMS] -> {to_number}: {body}")

    def send_email(self, to_email: str, subject: str, body: str) -> None:
        print(f"[EMAIL] -> {to_email}: {subject}\n{body}")

    def call_to_action_text(self) -> str:
        if self.scheduling_url:
            return f"Book a quick video chat here: {self.scheduling_url}"
        return "Reply YES to schedule a quick video chat."