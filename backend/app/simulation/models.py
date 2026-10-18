"""
Pydantic models (v2) for simulation I/O.

All rainfall and runoff quantities use SI units unless explicitly stated.
"""
from __future__ import annotations

from enum import Enum
from typing import Annotated, Literal

from pydantic import BaseModel, Field, model_validator


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------

class ReturnPeriod(str, Enum):
    yr5   = "5yr"
    yr10  = "10yr"
    yr25  = "25yr"
    yr50  = "50yr"
    yr100 = "100yr"
    custom = "custom"


class ChannelType(str, Enum):
    trunk    = "trunk"
    primary  = "primary"
    secondary = "secondary"
    tertiary = "tertiary"


class SeverityLevel(str, Enum):
    low      = "low"      # flow_ratio < 0.75
    moderate = "moderate" # 0.75 <= flow_ratio < 1.0
    high     = "high"     # 1.0 <= flow_ratio < 1.5
    critical = "critical" # flow_ratio >= 1.5


# ---------------------------------------------------------------------------
# Input models
# ---------------------------------------------------------------------------

class CatchmentOverride(BaseModel):
    """Per-conduit catchment override for scenario testing."""
    conduit_id:        str
    area_ha:           Annotated[float, Field(gt=0, le=5000)]
    runoff_coeff:      Annotated[float, Field(ge=0.0, le=1.0)]
    tc_min:            Annotated[float, Field(gt=0, le=360)]


class SimulationInput(BaseModel):
    """
    Full specification for a single flood-routing simulation run.

    Either `return_period` OR `rainfall_intensity_mm_hr` must be provided.
    """
    scenario_name:           str = Field(default="Baseline", max_length=120)
    return_period:           ReturnPeriod | None = None
    rainfall_intensity_mm_hr: Annotated[float, Field(gt=0, le=500)] | None = None

    # Global catchment defaults (applied when no per-conduit override given)
    global_area_ha:          Annotated[float, Field(gt=0, le=50000)] = 50.0
    global_runoff_coeff:     Annotated[float, Field(ge=0.0, le=1.0)] = 0.70
    global_tc_min:           Annotated[float, Field(gt=0, le=360)]   = 15.0

    # Optional per-conduit catchment overrides
    catchment_overrides:     list[CatchmentOverride] = Field(default_factory=list)

    # Temporal parameters
    duration_steps:          Annotated[int, Field(ge=1, le=144)] = 12  # 5-min steps = 1 hour
    step_minutes:            Annotated[int, Field(ge=1, le=60)]  = 5

    @model_validator(mode="after")
    def require_rainfall(self) -> "SimulationInput":
        if self.return_period is None and self.rainfall_intensity_mm_hr is None:
            raise ValueError(
                "Provide either 'return_period' or 'rainfall_intensity_mm_hr'."
            )
        return self


# ---------------------------------------------------------------------------
# Per-conduit result
# ---------------------------------------------------------------------------

class ConduitResult(BaseModel):
    conduit_id:           str
    from_node:            str
    to_node:              str
    channel_type:         ChannelType
    length_m:             float
    nominal_capacity_m3s: float
    effective_capacity_m3s: float
    blockage_factor:      float
    inflow_m3s:           float
    flow_ratio:           float        # inflow / effective_capacity
    is_overloaded:        bool
    severity:             SeverityLevel
    coordinates:          list[list[float]]  # [[lon, lat], ...]


# ---------------------------------------------------------------------------
# Road intersection record
# ---------------------------------------------------------------------------

class RoadIntersection(BaseModel):
    road_id:          str
    road_name:        str
    conduit_id:       str
    intersection_lon: float
    intersection_lat: float
    severity:         SeverityLevel


# ---------------------------------------------------------------------------
# Hotspot polygon
# ---------------------------------------------------------------------------

class HotspotPolygon(BaseModel):
    id:           str
    severity:     SeverityLevel
    center_lon:   float
    center_lat:   float
    radius_m:     float
    conduit_ids:  list[str]
    coordinates:  list[list[list[float]]]  # GeoJSON polygon ring


# ---------------------------------------------------------------------------
# Timeline step
# ---------------------------------------------------------------------------

class TimelineStep(BaseModel):
    step:              int
    elapsed_minutes:   int
    rainfall_mm_hr:    float
    overloaded_count:  int
    max_flow_ratio:    float
    total_inflow_m3s:  float


# ---------------------------------------------------------------------------
# Full simulation result
# ---------------------------------------------------------------------------

class SimulationResult(BaseModel):
    run_id:                  str
    scenario_name:           str
    return_period_label:     str
    rainfall_intensity_mm_hr: float
    global_area_ha:          float
    global_runoff_coeff:     float
    global_tc_min:           float
    duration_minutes:        int
    conduit_results:         list[ConduitResult]
    road_intersections:      list[RoadIntersection]
    hotspot_polygons:        list[HotspotPolygon]
    timeline:                list[TimelineStep]
    summary_overloaded:      int
    summary_max_flow_ratio:  float
    summary_total_inflow_m3s: float
    created_at:              str
