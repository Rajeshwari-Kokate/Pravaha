"""
Pravaha Backend - FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.simulation import router as simulation_router
from .routers.dataset import router as dataset_router
from .routers.reports import router as reports_router
from .routers.contact import router as contact_router
from .routers.admin import router as admin_router

app = FastAPI(
    title="Pravaha Flood Intelligence API",
    version="0.10.0",
    description=(
        "Deterministic flood routing simulation, ML susceptibility analysis, "
        "Google Gemma 4 reporting, and secure municipal operations for Koramangala, Bengaluru. "
        "Dataset origin and licence unverified."
    ),
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulation_router)
app.include_router(dataset_router)
app.include_router(reports_router)
app.include_router(contact_router)
app.include_router(admin_router)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": "pravaha-backend"}
