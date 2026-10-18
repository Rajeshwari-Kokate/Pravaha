"""
FastAPI router for flood simulation endpoints.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..simulation import FloodSimulationEngine, SimulationInput, SimulationResult

router = APIRouter(prefix="/api/simulation", tags=["simulation"])

# Single shared engine instance (loads GeoJSON once at startup)
_engine: FloodSimulationEngine | None = None


def get_engine() -> FloodSimulationEngine:
    global _engine
    if _engine is None:
        _engine = FloodSimulationEngine()
    return _engine


@router.post("/run", response_model=SimulationResult, summary="Run a flood simulation")
def run_simulation(inp: SimulationInput) -> SimulationResult:
    """
    Execute a deterministic flood routing simulation.

    Provide either `return_period` (5yr / 10yr / 25yr / 50yr / 100yr)
    or `rainfall_intensity_mm_hr` for a custom storm event.
    """
    try:
        return get_engine().run(inp)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/runs", summary="List stored simulation runs")
def list_runs() -> list[dict]:
    return get_engine().list_runs()


@router.get("/runs/{run_id}", response_model=SimulationResult, summary="Get a simulation run by ID")
def get_run(run_id: str) -> SimulationResult:
    result = get_engine().get_run(run_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")
    return result
