"""
FastAPI Router for Investigation Reports generated via Google Gemma 4 or deterministic fallback.
"""

from typing import Dict, Any, List, Optional
import sqlite3
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException

from backend.app.config import DB_PATH
from backend.app.gemma.schema import InvestigationReport, ReportGenerationRequest
from backend.app.gemma.client import gemma_generator
from backend.app.routers.simulation import get_engine
from backend.app.simulation.models import SimulationInput

router = APIRouter(prefix="/api/reports", tags=["reports"])

# In-memory store for fast retrieval + SQLite backing
_reports_cache: Dict[str, Dict[str, Any]] = {}


def _init_reports_table():
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB_PATH)
    con.execute("""
        CREATE TABLE IF NOT EXISTS investigation_reports (
            report_id TEXT PRIMARY KEY,
            run_id TEXT NOT NULL,
            scenario_name TEXT NOT NULL,
            generated_at TEXT NOT NULL,
            generated_by_model TEXT NOT NULL,
            is_fallback INTEGER NOT NULL,
            payload_json TEXT NOT NULL
        )
    """)
    con.commit()
    con.close()


_init_reports_table()


def save_report(report: InvestigationReport) -> None:
    _reports_cache[report.report_id] = report.model_dump()
    con = sqlite3.connect(DB_PATH)
    con.execute(
        """
        INSERT OR REPLACE INTO investigation_reports 
        (report_id, run_id, scenario_name, generated_at, generated_by_model, is_fallback, payload_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            report.report_id,
            report.run_id,
            report.scenario_name,
            report.generated_at,
            report.generated_by_model,
            1 if report.is_fallback else 0,
            report.model_dump_json(),
        ),
    )
    con.commit()
    con.close()


def load_report(report_id: str) -> Optional[Dict[str, Any]]:
    if report_id in _reports_cache:
        return _reports_cache[report_id]

    con = sqlite3.connect(DB_PATH)
    row = con.execute(
        "SELECT payload_json FROM investigation_reports WHERE report_id = ?",
        (report_id,)
    ).fetchone()
    con.close()

    if row:
        data = json.loads(row[0])
        _reports_cache[report_id] = data
        return data
    return None


@router.post("/generate", response_model=InvestigationReport, summary="Generate technical investigation report")
async def generate_report(req: ReportGenerationRequest) -> InvestigationReport:
    """
    Generates a structured, evidence-linked technical flood investigation report
    using Google Gemma 4 or deterministic heuristic fallback.
    """
    engine = get_engine()
    sim_result = engine.get_run(req.run_id)

    if sim_result is None:
        # If run_id not in database (or demo), run baseline 10yr scenario
        inp = SimulationInput(return_period="10yr", scenario_name="Baseline 10yr Storm")
        sim_result = engine.run(inp)

    # Convert SimulationResult to dict
    run_data = sim_result.model_dump() if hasattr(sim_result, "model_dump") else sim_result.dict()

    report = await gemma_generator.generate_report(
        run_data=run_data,
        custom_instructions=req.custom_instructions
    )

    save_report(report)
    return report


@router.get("/{report_id}", response_model=InvestigationReport, summary="Get report by ID")
async def get_report(report_id: str) -> InvestigationReport:
    """
    Retrieves an existing investigation report by its unique ID.
    If not found, generates a baseline report for that ID.
    """
    data = load_report(report_id)
    if data:
        return InvestigationReport(**data)

    # If demo or not yet generated, build a fresh report for baseline
    engine = get_engine()
    inp = SimulationInput(return_period="10yr", scenario_name="Baseline 10yr Storm")
    sim_result = engine.run(inp)
    run_data = sim_result.model_dump() if hasattr(sim_result, "model_dump") else sim_result.dict()

    report = await gemma_generator.generate_report(run_data=run_data)
    # preserve requested report_id for consistent URL access
    report.report_id = report_id
    save_report(report)
    return report


@router.get("", summary="List stored investigation reports")
def list_reports() -> List[Dict[str, Any]]:
    con = sqlite3.connect(DB_PATH)
    rows = con.execute(
        "SELECT report_id, run_id, scenario_name, generated_at, generated_by_model, is_fallback FROM investigation_reports ORDER BY generated_at DESC"
    ).fetchall()
    con.close()

    return [
        {
            "report_id": r[0],
            "run_id": r[1],
            "scenario_name": r[2],
            "generated_at": r[3],
            "generated_by_model": r[4],
            "is_fallback": bool(r[5]),
        }
        for r in rows
    ]
