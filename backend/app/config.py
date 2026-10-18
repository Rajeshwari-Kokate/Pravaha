"""
Application configuration loaded from environment variables.
"""
from pathlib import Path

# Repository root (two levels up from this file)
REPO_ROOT = Path(__file__).resolve().parents[2]

DATA_RAW       = REPO_ROOT / "data" / "raw"
DATA_PROCESSED = REPO_ROOT / "data" / "processed"

# SQLite database for simulation runs
DB_PATH = REPO_ROOT / "data" / "simulations.db"

# Default Rational Method parameters
DEFAULT_RUNOFF_COEFF = 0.70   # weighted urban runoff coefficient (dimensionless)
DEFAULT_TC_MIN       = 15.0   # concentration time in minutes
DEFAULT_AREA_HA      = 50.0   # catchment area in hectares

# Rainfall intensity presets (mm/hr) keyed by return period label
RAINFALL_PRESETS = {
    "5yr":   30.0,
    "10yr":  50.0,
    "25yr":  75.0,
    "50yr": 100.0,
    "100yr":135.0,
}

# Gemma 4 LLM Inference Settings (OpenAI-compatible HTTP endpoint)
import os
GEMMA_BASE_URL        = os.getenv("GEMMA_BASE_URL", "http://localhost:11434/v1")
GEMMA_MODEL           = os.getenv("GEMMA_MODEL", "google/gemma-4-E4B-it")
GEMMA_API_KEY         = os.getenv("GEMMA_API_KEY", "")
GEMMA_TIMEOUT_SECONDS = int(os.getenv("GEMMA_TIMEOUT_SECONDS", "30"))
