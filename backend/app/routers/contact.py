"""
Contact Inquiries Router
Handles contact form submissions with honeypot validation, Pydantic validation,
consent verification, and SQLite persistence.
"""

from typing import Dict, Any, Optional
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field, EmailStr

from backend.app.config import DB_PATH

router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactSubmission(BaseModel):
    name: str = Field(min_length=2, max_length=100, description="Sender name")
    email: str = Field(min_length=5, max_length=150, description="Institutional/personal email")
    message: str = Field(min_length=5, max_length=5000, description="Message or technical inquiry")
    consent: bool = Field(description="Consent to audit storage")
    website_hp: Optional[str] = Field(default="", description="Hidden honeypot field")


def _init_contact_table():
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB_PATH)
    con.execute("""
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            submitted_at TEXT NOT NULL,
            client_ip TEXT
        )
    """)
    con.commit()
    con.close()


_init_contact_table()


@router.post("", summary="Submit technical inquiry or feedback")
def submit_contact_form(sub: ContactSubmission, request: Request) -> Dict[str, Any]:
    # 1. Honeypot check: If filled, bot trapped -> return success without saving
    if sub.website_hp and len(sub.website_hp.strip()) > 0:
        return {"status": "success", "message": "Inquiry received"}

    # 2. Consent verification
    if not sub.consent:
        raise HTTPException(
            status_code=400,
            detail="You must consent to data processing for engineering review."
        )

    # 3. Simple email format validation
    if "@" not in sub.email or "." not in sub.email.split("@")[-1]:
        raise HTTPException(
            status_code=422,
            detail="A valid institutional or personal email address is required."
        )

    msg_id = str(uuid.uuid4())
    submitted_at = datetime.now(timezone.utc).isoformat()
    client_ip = request.client.host if request.client else "unknown"

    con = sqlite3.connect(DB_PATH)
    con.execute(
        """
        INSERT INTO contact_submissions (id, name, email, message, submitted_at, client_ip)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (msg_id, sub.name.strip(), sub.email.strip().lower(), sub.message.strip(), submitted_at, client_ip),
    )
    con.commit()
    con.close()

    return {
        "status": "success",
        "message_id": msg_id,
        "detail": "Inquiry recorded successfully in municipal audit log.",
    }
