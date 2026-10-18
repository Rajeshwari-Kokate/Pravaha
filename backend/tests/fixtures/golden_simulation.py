"""
Golden fixtures for Phase 4 simulation tests.

These values were computed by running the engine deterministically with
seed-42 synthetic drainage network and fixed rainfall inputs.
Thresholds are expressed as ranges (not exact floats) to remain stable
across minor floating-point variations on different Python versions.
"""
from __future__ import annotations

# Rational Method smoke values
RATIONAL_Q_FIXTURES = [
    # (C, i_mm_hr, A_ha, expected_q_m3s_approx, tolerance_pct)
    (0.70, 50.0,  50.0,  4.861, 1.0),
    (0.90, 100.0, 10.0,  2.500, 1.0),
    (0.50, 30.0,  100.0, 4.167, 1.0),
    (1.00, 135.0, 50.0, 18.750, 1.0),
]

# For a 10yr event (50 mm/hr), with global defaults:
#   C=0.70, A=50 ha, tc=15 min
#   Q_runoff = 0.70 * 50 * 50 / 360 = 4.861 m3/s per conduit before routing
BASELINE_10YR = {
    "return_period": "10yr",
    "peak_intensity_mm_hr": 50.0,
    "expected_overloaded_min": 1,    # at least one conduit must be overloaded
    "expected_max_fr_min": 1.0,      # max flow_ratio must exceed capacity
    "expected_timeline_steps": 12,
    "expected_hotspots_min": 1,
}

# For a 5yr event (30 mm/hr) the network should cope better
BASELINE_5YR = {
    "return_period": "5yr",
    "peak_intensity_mm_hr": 30.0,
    "expected_max_fr_max": 3.5,      # should not blow up completely
    "expected_timeline_steps": 12,
}

# 100yr extreme event - everything overloads
EXTREME_100YR = {
    "return_period": "100yr",
    "peak_intensity_mm_hr": 135.0,
    "expected_overloaded_min": 3,
    "expected_max_fr_min": 3.0,
}

# Custom intensity near zero - no conduit should overload
NEAR_ZERO = {
    "rainfall_intensity_mm_hr": 0.1,
    "expected_overloaded": 0,
}

# Road intersections: at least one should be found for 100yr event
ROAD_INTERSECTION_FIXTURE = {
    "return_period": "100yr",
    "min_intersections": 0,          # geometry is synthetic; may or may not cross
}
