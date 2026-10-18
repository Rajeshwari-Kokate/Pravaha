"""
Dataset and ML Susceptibility Router
Provides endpoints for regional aggregates, synthetic dataset profiling,
and machine learning flood susceptibility inference.
"""

import os
import json
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.app.ml.susceptibility import trainer

router = APIRouter(prefix="/api/dataset", tags=["dataset"])

try:
    from backend.app.config import DATA_PROCESSED
except ImportError:
    from app.config import DATA_PROCESSED

REGIONAL_AGGREGATES_PATH = str(DATA_PROCESSED / "regional_aggregates.json")
MODEL_CARD_PATH = str(DATA_PROCESSED / "model_card.json")


class SusceptibilityRequest(BaseModel):
    rainfall_mm: float = Field(default=150.0, ge=0.0, le=1000.0, description="Annual/event rainfall in mm")
    temperature_c: float = Field(default=28.0, ge=-20.0, le=60.0, description="Mean temperature in Celsius")
    humidity_pct: float = Field(default=75.0, ge=0.0, le=100.0, description="Relative humidity percentage")
    river_discharge_m3s: float = Field(default=2500.0, ge=0.0, description="River discharge in m3/s")
    water_level_m: float = Field(default=12.0, ge=0.0, description="Water level in meters")
    elevation_m: float = Field(default=4400.0, ge=-100.0, description="Elevation in meters above sea level")
    population_density: float = Field(default=500.0, ge=0.0, description="Persons per km2")
    infrastructure: int = Field(default=1, ge=0, le=1, description="Infrastructure present (0 or 1)")
    historical_floods: int = Field(default=1, ge=0, le=1, description="Historical flood record (0 or 1)")
    land_cover: str = Field(default="Urban", description="Agricultural, Desert, Forest, Urban, Water Body")
    soil_type: str = Field(default="Clay", description="Clay, Loam, Peat, Sandy, Silt")


@router.get("/summary")
def get_dataset_summary() -> Dict[str, Any]:
    """
    Returns statistical summary and regional aggregates of flood_risk_dataset_india.csv,
    highlighting data provenance and synthetic indicators.
    """
    if not os.path.exists(REGIONAL_AGGREGATES_PATH):
        raise HTTPException(status_code=404, detail="Regional aggregates not found")

    with open(REGIONAL_AGGREGATES_PATH, "r") as f:
        data = json.load(f)

    return {
        "status": "success",
        "data": data,
    }


@router.get("/susceptibility")
def get_susceptibility_model_card() -> Dict[str, Any]:
    """
    Returns the comprehensive Model Card for the Logistic Regression and Gradient Boosted Tree
    susceptibility models, including ROC AUC, F1, confusion matrices, and feature importances.
    """
    if os.path.exists(MODEL_CARD_PATH):
        with open(MODEL_CARD_PATH, "r") as f:
            card = json.load(f)
    else:
        card = trainer.train_and_evaluate()

    return {
        "status": "success",
        "model_card": card,
    }


@router.post("/susceptibility")
def predict_susceptibility(req: SusceptibilityRequest) -> Dict[str, Any]:
    """
    Computes flood susceptibility probabilities using trained baseline models
    along with feature attribution and transparency disclosures.
    """
    input_dict = req.model_dump()
    result = trainer.predict(input_dict)
    return {
        "status": "success",
        "result": result,
    }
