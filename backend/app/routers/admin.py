"""
Admin & Operator Security Router
Protects operator maintenance features with constant-time passcode verification.
"""

import os
import hmac
import sqlite3
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field

from backend.app.config import DB_PATH

router = APIRouter(prefix="/api/admin", tags=["admin"])

ADMIN_PASSCODE = os.getenv("ADMIN_PASSCODE", "pravaha-operator-2026")


class VerifyRequest(BaseModel):
    passcode: str = Field(description="Operator access passcode")


def verify_operator_passcode(provided: str) -> bool:
    """Constant-time passcode comparison to prevent side-channel timing attacks."""
    return hmac.compare_digest(provided.encode("utf-8"), ADMIN_PASSCODE.encode("utf-8"))


@router.post("/verify")
def verify_passcode(req: VerifyRequest) -> Dict[str, Any]:
    if not verify_operator_passcode(req.passcode):
        raise HTTPException(status_code=401, detail="Invalid operator passcode.")
    return {"status": "authorized", "role": "operator"}


@router.get("/contacts")
def list_contact_inquiries(x_operator_passcode: str = Header(default="")) -> List[Dict[str, Any]]:
    if not verify_operator_passcode(x_operator_passcode):
        raise HTTPException(status_code=401, detail="Unauthorized operator credentials.")

    con = sqlite3.connect(DB_PATH)
    rows = con.execute(
        "SELECT id, name, email, message, submitted_at, client_ip FROM contact_submissions ORDER BY submitted_at DESC"
    ).fetchall()
    con.close()

    return [
        {
            "id": r[0],
            "name": r[1],
            "email": r[2],
            "message": r[3],
            "submitted_at": r[4],
            "client_ip": r[5],
        }
        for r in rows
    ]


@router.get("/stats")
def get_system_stats(x_operator_passcode: str = Header(default="")) -> Dict[str, Any]:
    if not verify_operator_passcode(x_operator_passcode):
        raise HTTPException(status_code=401, detail="Unauthorized operator credentials.")

    con = sqlite3.connect(DB_PATH)
    runs_count = con.execute("SELECT count(*) FROM simulation_runs").fetchone()[0]
    reports_count = con.execute("SELECT count(*) FROM investigation_reports").fetchone()[0]
    contacts_count = con.execute("SELECT count(*) FROM contact_submissions").fetchone()[0]
    con.close()

    db_size_bytes = os.path.getsize(DB_PATH) if os.path.exists(DB_PATH) else 0

    return {
        "database_size_bytes": db_size_bytes,
        "database_size_kb": round(db_size_bytes / 1024, 2),
        "total_simulations": runs_count,
        "total_reports": reports_count,
        "total_inquiries": contacts_count,
    }
