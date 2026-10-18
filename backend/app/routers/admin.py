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


def _init_db_schema() -> None:
    """Ensure all core tables exist so fresh environments or stats queries never fail."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB_PATH)
    con.executescript("""
        CREATE TABLE IF NOT EXISTS simulation_runs (
            run_id       TEXT PRIMARY KEY,
            scenario     TEXT NOT NULL,
            return_period TEXT NOT NULL,
            intensity_mm_hr REAL NOT NULL,
            overloaded   INTEGER NOT NULL,
            max_flow_ratio REAL NOT NULL,
            created_at   TEXT NOT NULL,
            payload      TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS investigation_reports (
            report_id TEXT PRIMARY KEY,
            run_id TEXT NOT NULL,
            scenario_name TEXT NOT NULL,
            generated_at TEXT NOT NULL,
            generated_by_model TEXT NOT NULL,
            is_fallback INTEGER NOT NULL,
            payload_json TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            submitted_at TEXT NOT NULL,
            client_ip TEXT
        );
    """)
    con.commit()
    con.close()


_init_db_schema()


def _safe_count(con: sqlite3.Connection, table_name: str) -> int:
    try:
        return con.execute(f"SELECT count(*) FROM {table_name}").fetchone()[0]
    except sqlite3.OperationalError:
        return 0


@router.post("/verify")
def verify_passcode(req: VerifyRequest) -> Dict[str, Any]:
    if not verify_operator_passcode(req.passcode):
        raise HTTPException(status_code=401, detail="Invalid operator passcode.")
    return {"status": "authorized", "role": "operator"}


@router.get("/contacts")
def list_contact_inquiries(x_operator_passcode: str = Header(default="")) -> List[Dict[str, Any]]:
    if not verify_operator_passcode(x_operator_passcode):
        raise HTTPException(status_code=401, detail="Unauthorized operator credentials.")

    _init_db_schema()
    con = sqlite3.connect(DB_PATH)
    try:
        rows = con.execute(
            "SELECT id, name, email, message, submitted_at, client_ip FROM contact_submissions ORDER BY submitted_at DESC"
        ).fetchall()
    except sqlite3.OperationalError:
        rows = []
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

    _init_db_schema()
    con = sqlite3.connect(DB_PATH)
    runs_count = _safe_count(con, "simulation_runs")
    reports_count = _safe_count(con, "investigation_reports")
    contacts_count = _safe_count(con, "contact_submissions")
    con.close()

    db_size_bytes = os.path.getsize(DB_PATH) if os.path.exists(DB_PATH) else 0

    return {
        "database_size_bytes": db_size_bytes,
        "database_size_kb": round(db_size_bytes / 1024, 2),
        "total_simulations": runs_count,
        "total_reports": reports_count,
        "total_inquiries": contacts_count,
    }

