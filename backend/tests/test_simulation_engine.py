"""
Phase 4 pytest suite: Deterministic Simulation Engine
=====================================================

Tests cover:
  - Rational Method formula (unit)
  - Helper utilities (segment intersection, haversine, circle polygon)
  - SimulationInput validation (Pydantic)
  - FloodSimulationEngine graph construction
  - Full simulation runs against golden fixtures (smoke + boundary)
  - Timeline shape and monotonicity (triangular hyetograph peak)
  - Hotspot polygon geometry validity
  - Road intersection detection
  - SQLite persistence (write + read-back)
"""
from __future__ import annotations

import math
import sqlite3
import sys
from pathlib import Path

import pytest

# Make backend importable from tests/
# parents[1] = backend/ (contains app/ package)
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

try:
    from backend.app.simulation.engine import (
        FloodSimulationEngine,
        _circle_polygon,
        _haversine_m,
        _rational_q,
        _segments_intersect,
        _severity,
    )
    from backend.app.simulation.models import (
        ReturnPeriod,
        SeverityLevel,
        SimulationInput,
    )
    from backend.tests.fixtures.golden_simulation import (
        BASELINE_10YR,
        BASELINE_5YR,
        EXTREME_100YR,
        NEAR_ZERO,
        RATIONAL_Q_FIXTURES,
    )
except ImportError:
    from app.simulation.engine import (
        FloodSimulationEngine,
        _circle_polygon,
        _haversine_m,
        _rational_q,
        _segments_intersect,
        _severity,
    )
    from app.simulation.models import (
        ReturnPeriod,
        SeverityLevel,
        SimulationInput,
    )
    from tests.fixtures.golden_simulation import (
        BASELINE_10YR,
        BASELINE_5YR,
        EXTREME_100YR,
        NEAR_ZERO,
        RATIONAL_Q_FIXTURES,
    )


# ===========================================================================
# Fixtures
# ===========================================================================

@pytest.fixture(scope="module")
def engine() -> FloodSimulationEngine:
    return FloodSimulationEngine()


@pytest.fixture(scope="module")
def result_10yr(engine):
    inp = SimulationInput(
        scenario_name="Test-10yr",
        return_period=ReturnPeriod.yr10,
    )
    return engine.run(inp)


@pytest.fixture(scope="module")
def result_100yr(engine):
    inp = SimulationInput(
        scenario_name="Test-100yr",
        return_period=ReturnPeriod.yr100,
    )
    return engine.run(inp)


# ===========================================================================
# 1. Rational Method unit tests
# ===========================================================================

class TestRationalMethod:
    def test_standard_formula(self):
        """Q = C * i * A / 360"""
        q = _rational_q(0.70, 50.0, 50.0)
        assert abs(q - 4.861) < 0.01, f"Expected ~4.861, got {q}"

    def test_golden_fixtures(self):
        for C, i, A, expected, tol_pct in RATIONAL_Q_FIXTURES:
            q = _rational_q(C, i, A)
            tol = expected * tol_pct / 100.0
            assert abs(q - expected) <= tol, (
                f"C={C}, i={i}, A={A}: expected {expected} ± {tol}, got {q}"
            )

    def test_zero_runoff_coeff(self):
        assert _rational_q(0.0, 100.0, 100.0) == 0.0

    def test_zero_intensity(self):
        assert _rational_q(0.9, 0.0, 50.0) == 0.0

    def test_positive_always(self):
        q = _rational_q(0.5, 25.0, 30.0)
        assert q > 0


# ===========================================================================
# 2. Helper utility unit tests
# ===========================================================================

class TestHelpers:
    def test_haversine_same_point(self):
        assert _haversine_m(77.6, 12.9, 77.6, 12.9) == pytest.approx(0.0, abs=1.0)

    def test_haversine_known_distance(self):
        # ~1 degree latitude ~ 111 km
        d = _haversine_m(77.0, 12.0, 77.0, 13.0)
        assert 110_000 < d < 112_000, f"Expected ~111 km, got {d:.0f} m"

    def test_segment_intersect_basic(self):
        # Crossing X
        pt = _segments_intersect((0, 0), (2, 2), (0, 2), (2, 0))
        assert pt is not None
        assert abs(pt[0] - 1.0) < 1e-6
        assert abs(pt[1] - 1.0) < 1e-6

    def test_segment_no_intersect(self):
        pt = _segments_intersect((0, 0), (1, 0), (0, 1), (1, 1))
        assert pt is None

    def test_segment_parallel(self):
        pt = _segments_intersect((0, 0), (2, 0), (0, 1), (2, 1))
        assert pt is None

    def test_circle_polygon_closure(self):
        ring = _circle_polygon(77.6, 12.9, 300.0)
        # First and last points must be equal (closed ring)
        assert ring[0] == ring[-1]

    def test_circle_polygon_radius(self):
        ring = _circle_polygon(0.0, 0.0, 100.0)
        # All points should be within ~5% of 100 m from centre
        for lon, lat in ring:
            d = _haversine_m(0.0, 0.0, lon, lat)
            assert abs(d - 100.0) < 6.0, f"Point at {d:.1f} m, expected ~100 m"

    def test_severity_thresholds(self):
        assert _severity(0.50) == SeverityLevel.low
        assert _severity(0.80) == SeverityLevel.moderate
        assert _severity(1.20) == SeverityLevel.high
        assert _severity(2.00) == SeverityLevel.critical
        assert _severity(0.749) == SeverityLevel.low
        assert _severity(0.750) == SeverityLevel.moderate
        assert _severity(1.499) == SeverityLevel.high
        assert _severity(1.500) == SeverityLevel.critical


# ===========================================================================
# 3. Pydantic input validation
# ===========================================================================

class TestSimulationInput:
    def test_valid_return_period(self):
        inp = SimulationInput(return_period=ReturnPeriod.yr25)
        assert inp.return_period == ReturnPeriod.yr25

    def test_valid_custom_intensity(self):
        inp = SimulationInput(rainfall_intensity_mm_hr=45.0)
        assert inp.rainfall_intensity_mm_hr == 45.0

    def test_missing_rainfall_raises(self):
        with pytest.raises(Exception):
            SimulationInput()

    def test_invalid_runoff_coeff(self):
        with pytest.raises(Exception):
            SimulationInput(return_period=ReturnPeriod.yr5, global_runoff_coeff=1.5)

    def test_invalid_intensity_negative(self):
        with pytest.raises(Exception):
            SimulationInput(rainfall_intensity_mm_hr=-10.0)

    def test_defaults(self):
        inp = SimulationInput(return_period=ReturnPeriod.yr10)
        assert inp.global_area_ha == 50.0
        assert inp.global_runoff_coeff == 0.70
        assert inp.duration_steps == 12


# ===========================================================================
# 4. Engine graph construction
# ===========================================================================

class TestEngineGraph:
    def test_graph_has_nodes(self, engine):
        assert engine._graph.number_of_nodes() > 0

    def test_graph_has_edges(self, engine):
        assert engine._graph.number_of_edges() > 0

    def test_graph_is_directed(self, engine):
        import networkx as nx
        assert isinstance(engine._graph, nx.DiGraph)

    def test_all_edges_have_required_attrs(self, engine):
        required = {"conduit_id", "effective_capacity_m3s", "nominal_capacity_m3s", "coordinates"}
        for _u, _v, data in engine._graph.edges(data=True):
            assert required.issubset(data.keys()), f"Edge missing attrs: {data}"

    def test_no_self_loops(self, engine):
        for u, v in engine._graph.edges():
            assert u != v, f"Self-loop on node {u}"


# ===========================================================================
# 5. Full simulation smoke tests - 10yr event
# ===========================================================================

class TestSimulationBaseline10yr:
    def test_run_id_is_uuid(self, result_10yr):
        import uuid
        uuid.UUID(result_10yr.run_id)  # raises if not valid UUID

    def test_scenario_name(self, result_10yr):
        assert result_10yr.scenario_name == "Test-10yr"

    def test_intensity_matches_preset(self, result_10yr):
        assert result_10yr.rainfall_intensity_mm_hr == BASELINE_10YR["peak_intensity_mm_hr"]

    def test_conduit_results_not_empty(self, result_10yr):
        assert len(result_10yr.conduit_results) > 0

    def test_at_least_one_overloaded(self, result_10yr):
        overloaded = [cr for cr in result_10yr.conduit_results if cr.is_overloaded]
        assert len(overloaded) >= BASELINE_10YR["expected_overloaded_min"], (
            f"Expected >= {BASELINE_10YR['expected_overloaded_min']} overloaded conduits, "
            f"got {len(overloaded)}"
        )

    def test_max_flow_ratio_exceeds_one(self, result_10yr):
        assert result_10yr.summary_max_flow_ratio >= BASELINE_10YR["expected_max_fr_min"]

    def test_timeline_step_count(self, result_10yr):
        assert len(result_10yr.timeline) == BASELINE_10YR["expected_timeline_steps"]

    def test_timeline_elapsed_minutes(self, result_10yr):
        for step in result_10yr.timeline:
            assert step.elapsed_minutes == step.step * 5

    def test_all_flow_ratios_non_negative(self, result_10yr):
        for cr in result_10yr.conduit_results:
            assert cr.flow_ratio >= 0.0

    def test_severity_consistent_with_flow_ratio(self, result_10yr):
        for cr in result_10yr.conduit_results:
            expected = _severity(cr.flow_ratio)
            assert cr.severity == expected, (
                f"Conduit {cr.conduit_id}: flow_ratio={cr.flow_ratio}, "
                f"severity={cr.severity}, expected={expected}"
            )

    def test_is_overloaded_consistent(self, result_10yr):
        for cr in result_10yr.conduit_results:
            assert cr.is_overloaded == (cr.flow_ratio >= 1.0)

    def test_conduit_coords_not_empty(self, result_10yr):
        for cr in result_10yr.conduit_results:
            assert len(cr.coordinates) >= 2

    def test_summary_counts_match(self, result_10yr):
        expected_overloaded = sum(1 for cr in result_10yr.conduit_results if cr.is_overloaded)
        assert result_10yr.summary_overloaded == expected_overloaded


# ===========================================================================
# 6. Timeline hyetograph shape
# ===========================================================================

class TestTimeline:
    def test_peak_at_midpoint(self, result_10yr):
        """Triangular hyetograph should peak near the middle step."""
        tl = result_10yr.timeline
        peak_step = max(tl, key=lambda s: s.rainfall_mm_hr)
        mid = len(tl) // 2
        assert abs(peak_step.step - mid) <= 1, (
            f"Peak at step {peak_step.step}, expected near {mid}"
        )

    def test_first_step_lower_than_peak(self, result_10yr):
        tl = result_10yr.timeline
        peak_r = max(s.rainfall_mm_hr for s in tl)
        assert tl[0].rainfall_mm_hr < peak_r

    def test_last_step_lower_than_peak(self, result_10yr):
        tl = result_10yr.timeline
        peak_r = max(s.rainfall_mm_hr for s in tl)
        assert tl[-1].rainfall_mm_hr < peak_r

    def test_all_overloaded_counts_non_negative(self, result_10yr):
        for step in result_10yr.timeline:
            assert step.overloaded_count >= 0

    def test_max_overloaded_at_peak(self, result_10yr):
        """Overloaded conduit count should be highest at or near peak intensity."""
        tl = result_10yr.timeline
        peak_step_idx = max(range(len(tl)), key=lambda i: tl[i].rainfall_mm_hr)
        max_overloaded_idx = max(range(len(tl)), key=lambda i: tl[i].overloaded_count)
        # Allow one step difference
        assert abs(peak_step_idx - max_overloaded_idx) <= 2


# ===========================================================================
# 7. Hotspot polygon geometry
# ===========================================================================

class TestHotspotPolygons:
    def test_hotspots_present_for_extreme_event(self, result_100yr):
        # 100yr event must generate at least one hotspot
        assert len(result_100yr.hotspot_polygons) >= 1

    def test_polygon_ring_is_closed(self, result_100yr):
        for hs in result_100yr.hotspot_polygons:
            ring = hs.coordinates[0]
            assert ring[0] == ring[-1], f"Hotspot {hs.id} polygon ring not closed"

    def test_polygon_ring_has_minimum_points(self, result_100yr):
        for hs in result_100yr.hotspot_polygons:
            ring = hs.coordinates[0]
            assert len(ring) >= 4, f"Hotspot {hs.id} ring has only {len(ring)} points"

    def test_hotspot_severity_values(self, result_100yr):
        for hs in result_100yr.hotspot_polygons:
            assert hs.severity in list(SeverityLevel)

    def test_hotspot_conduit_ids_not_empty(self, result_100yr):
        for hs in result_100yr.hotspot_polygons:
            assert len(hs.conduit_ids) >= 1

    def test_hotspot_radius_positive(self, result_100yr):
        for hs in result_100yr.hotspot_polygons:
            assert hs.radius_m > 0


# ===========================================================================
# 8. Extreme and boundary events
# ===========================================================================

class TestBoundaryConditions:
    def test_near_zero_rainfall_no_overload(self, engine):
        inp = SimulationInput(rainfall_intensity_mm_hr=NEAR_ZERO["rainfall_intensity_mm_hr"])
        result = engine.run(inp)
        assert result.summary_overloaded == NEAR_ZERO["expected_overloaded"]

    def test_100yr_many_overloaded(self, result_100yr):
        assert result_100yr.summary_overloaded >= EXTREME_100YR["expected_overloaded_min"]

    def test_100yr_high_flow_ratio(self, result_100yr):
        assert result_100yr.summary_max_flow_ratio >= EXTREME_100YR["expected_max_fr_min"]

    def test_5yr_max_flow_ratio_bound(self, engine):
        inp = SimulationInput(
            scenario_name="Test-5yr",
            return_period=ReturnPeriod.yr5,
        )
        result = engine.run(inp)
        assert result.summary_max_flow_ratio < BASELINE_5YR["expected_max_fr_max"]

    def test_custom_intensity(self, engine):
        inp = SimulationInput(rainfall_intensity_mm_hr=75.0, scenario_name="Custom-75")
        result = engine.run(inp)
        assert result.return_period_label == "custom"
        assert result.rainfall_intensity_mm_hr == 75.0

    def test_catchment_override_applied(self, engine):
        """Overriding a conduit's area should change its inflow."""
        try:
            from backend.app.simulation.models import CatchmentOverride
            from backend.app.config import RAINFALL_PRESETS
        except ImportError:
            from app.simulation.models import CatchmentOverride
            from app.config import RAINFALL_PRESETS
        conduit_id = list(engine._graph.edges(data=True))[0][2]["conduit_id"]
        baseline = SimulationInput(return_period=ReturnPeriod.yr10)
        r_base = engine.run(baseline)
        base_inflow = next(
            cr.inflow_m3s for cr in r_base.conduit_results if cr.conduit_id == conduit_id
        )

        override_inp = SimulationInput(
            return_period=ReturnPeriod.yr10,
            catchment_overrides=[
                CatchmentOverride(
                    conduit_id=conduit_id,
                    area_ha=500.0,   # 10x the default
                    runoff_coeff=0.70,
                    tc_min=15.0,
                )
            ],
        )
        r_override = engine.run(override_inp)
        override_inflow = next(
            cr.inflow_m3s for cr in r_override.conduit_results if cr.conduit_id == conduit_id
        )
        # Inflow should be significantly larger with 10x area
        assert override_inflow > base_inflow * 5.0, (
            f"Override inflow {override_inflow} not >> base {base_inflow}"
        )


# ===========================================================================
# 9. SQLite persistence
# ===========================================================================

class TestSQLitePersistence:
    def test_run_persisted(self, engine, result_10yr):
        rows = engine.list_runs()
        run_ids = [r["run_id"] for r in rows]
        assert result_10yr.run_id in run_ids

    def test_get_run_by_id(self, engine, result_10yr):
        fetched = engine.get_run(result_10yr.run_id)
        assert fetched is not None
        assert fetched.run_id == result_10yr.run_id
        assert fetched.scenario_name == result_10yr.scenario_name

    def test_get_nonexistent_run(self, engine):
        fetched = engine.get_run("00000000-0000-0000-0000-000000000000")
        assert fetched is None

    def test_payload_roundtrip(self, engine, result_10yr):
        fetched = engine.get_run(result_10yr.run_id)
        assert fetched.summary_max_flow_ratio == result_10yr.summary_max_flow_ratio
        assert len(fetched.conduit_results) == len(result_10yr.conduit_results)
        assert len(fetched.timeline) == len(result_10yr.timeline)

    def test_db_file_exists(self):
        try:
            from backend.app.config import DB_PATH
        except ImportError:
            from app.config import DB_PATH
        assert DB_PATH.exists()

    def test_db_table_exists(self):
        try:
            from backend.app.config import DB_PATH
        except ImportError:
            from app.config import DB_PATH
        con = sqlite3.connect(DB_PATH)
        tables = [r[0] for r in con.execute("SELECT name FROM sqlite_master WHERE type='table'")]
        con.close()
        assert "simulation_runs" in tables
