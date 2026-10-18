"""
Pravaha Flood Simulation Engine (Phase 4)
=========================================

Implements a deterministic, graph-based urban flood routing model:

1. Rational Method runoff:  Q = C * i * A / 360   [m3/s]
   - C  = runoff coefficient  (dimensionless)
   - i  = rainfall intensity  (mm/hr)
   - A  = catchment area      (ha)

2. NetworkX directed graph for conduit topology (topological sort ensures
   upstream-to-downstream propagation without iteration).

3. Conduit capacity exceedance:  flow_ratio = Q_in / Q_eff
   Excess from overloaded conduits is passed downstream as additional
   surface-runoff load.

4. Hotspot polygon generation: spatial clustering of overloaded conduit
   midpoints using a simple distance-based merge.

5. Road intersection detection: line-segment intersection test between
   overloaded conduits and the road network.

6. Timeline: rainfall is applied as a triangular hyetograph over the
   simulation duration; each time-step re-runs capacity routing.

7. SQLite persistence: every run is serialised (JSON) and stored.

Assumptions recorded in docs/DECISIONS.md.
"""
from __future__ import annotations

import json
import math
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import networkx as nx

from ..config import (
    DATA_PROCESSED,
    DB_PATH,
    RAINFALL_PRESETS,
)
from .models import (
    ChannelType,
    ConduitResult,
    HotspotPolygon,
    ReturnPeriod,
    RoadIntersection,
    SeverityLevel,
    SimulationInput,
    SimulationResult,
    TimelineStep,
)


# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------

def _severity(flow_ratio: float) -> SeverityLevel:
    if flow_ratio < 0.75:
        return SeverityLevel.low
    if flow_ratio < 1.0:
        return SeverityLevel.moderate
    if flow_ratio < 1.5:
        return SeverityLevel.high
    return SeverityLevel.critical


def _rational_q(coeff: float, intensity_mm_hr: float, area_ha: float) -> float:
    """Return peak discharge Q (m3/s) via Rational Method.

    Q = C * i * A / 360
    where  i [mm/hr],  A [ha],  Q [m3/s].
    """
    return coeff * intensity_mm_hr * area_ha / 360.0


def _midpoint(coords: list[list[float]]) -> tuple[float, float]:
    """Return the geographic midpoint of a LineString's coordinate list."""
    lons = [c[0] for c in coords]
    lats = [c[1] for c in coords]
    return (sum(lons) / len(lons), sum(lats) / len(lats))


def _haversine_m(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    """Approximate surface distance in metres between two lon/lat points."""
    R = 6_371_000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi  = math.radians(lat2 - lat1)
    dlam  = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _segments_intersect(
    p1: tuple[float, float], p2: tuple[float, float],
    p3: tuple[float, float], p4: tuple[float, float],
) -> tuple[float, float] | None:
    """Return intersection point of segments p1-p2 and p3-p4, or None."""
    x1, y1 = p1; x2, y2 = p2; x3, y3 = p3; x4, y4 = p4
    denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if abs(denom) < 1e-10:
        return None
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
    u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom
    if 0.0 <= t <= 1.0 and 0.0 <= u <= 1.0:
        xi = x1 + t * (x2 - x1)
        yi = y1 + t * (y2 - y1)
        return (xi, yi)
    return None


def _circle_polygon(lon: float, lat: float, radius_m: float, n_pts: int = 32) -> list[list[float]]:
    """Return a GeoJSON polygon ring approximating a circle."""
    # Degree per metre approximations
    deg_per_m_lat = 1.0 / 111_320.0
    deg_per_m_lon = 1.0 / (111_320.0 * math.cos(math.radians(lat)))
    ring: list[list[float]] = []
    for i in range(n_pts + 1):
        angle = 2 * math.pi * i / n_pts
        dlon  = radius_m * math.sin(angle) * deg_per_m_lon
        dlat  = radius_m * math.cos(angle) * deg_per_m_lat
        ring.append([round(lon + dlon, 7), round(lat + dlat, 7)])
    return ring


# ---------------------------------------------------------------------------
# Main simulation engine
# ---------------------------------------------------------------------------

class FloodSimulationEngine:
    """
    Deterministic flood simulation engine.

    Usage:
        engine = FloodSimulationEngine()
        result = engine.run(SimulationInput(return_period="10yr"))
    """

    def __init__(self) -> None:
        self._drainage: list[dict[str, Any]] = self._load_geojson("drainage_network.geojson")
        self._roads: list[dict[str, Any]]    = self._load_geojson("roads.geojson")
        self._graph: nx.DiGraph              = self._build_graph()
        self._ensure_db()

    # ------------------------------------------------------------------
    # Data loading
    # ------------------------------------------------------------------

    def _load_geojson(self, filename: str) -> list[dict[str, Any]]:
        path = DATA_PROCESSED / filename
        with open(path, encoding="utf-8") as fh:
            fc = json.load(fh)
        return fc["features"]

    # ------------------------------------------------------------------
    # Graph construction
    # ------------------------------------------------------------------

    def _build_graph(self) -> nx.DiGraph:
        G = nx.DiGraph()
        for feat in self._drainage:
            p  = feat["properties"]
            cid = p["id"]
            fn  = p["from_node"]
            tn  = p["to_node"]
            G.add_edge(
                fn, tn,
                conduit_id            = cid,
                channel_type          = p.get("channel_type", "secondary"),
                length_m              = float(p.get("length_m", 0)),
                nominal_capacity_m3s  = float(p.get("nominal_capacity_m3s", 1.0)),
                effective_capacity_m3s= float(p.get("effective_capacity_m3s", 0.5)),
                blockage_factor       = float(p.get("blockage_factor", 0.0)),
                coordinates           = feat["geometry"]["coordinates"],
            )
        return G

    # ------------------------------------------------------------------
    # Rainfall intensity resolution
    # ------------------------------------------------------------------

    def _resolve_intensity(self, inp: SimulationInput) -> tuple[str, float]:
        """Return (label, intensity_mm_hr)."""
        if inp.rainfall_intensity_mm_hr is not None:
            return "custom", inp.rainfall_intensity_mm_hr
        rp_val = inp.return_period.value  # type: ignore[union-attr]
        return rp_val, RAINFALL_PRESETS[rp_val]

    # ------------------------------------------------------------------
    # Triangular hyetograph
    # ------------------------------------------------------------------

    def _hyetograph(
        self,
        peak_mm_hr: float,
        n_steps: int,
        step_minutes: int,
    ) -> list[float]:
        """
        Simple triangular hyetograph peaking at step index n_steps // 2.
        Values are rainfall intensity in mm/hr for each time step.
        """
        peak_idx = n_steps // 2
        intensities: list[float] = []
        for i in range(n_steps):
            if i <= peak_idx:
                frac = i / peak_idx if peak_idx > 0 else 1.0
            else:
                frac = (n_steps - 1 - i) / (n_steps - 1 - peak_idx) if (n_steps - 1 - peak_idx) > 0 else 0.0
            intensities.append(round(peak_mm_hr * frac, 2))
        return intensities

    # ------------------------------------------------------------------
    # Catchment parameter lookup
    # ------------------------------------------------------------------

    def _catchment_params(
        self,
        conduit_id: str,
        inp: SimulationInput,
    ) -> tuple[float, float, float]:
        """Return (runoff_coeff, area_ha, tc_min) for a conduit."""
        for ov in inp.catchment_overrides:
            if ov.conduit_id == conduit_id:
                return ov.runoff_coeff, ov.area_ha, ov.tc_min
        return inp.global_runoff_coeff, inp.global_area_ha, inp.global_tc_min

    # ------------------------------------------------------------------
    # Single-step capacity routing
    # ------------------------------------------------------------------

    def _route_single_step(
        self,
        intensity_mm_hr: float,
        inp: SimulationInput,
    ) -> dict[str, float]:
        """
        Propagate runoff through the graph for one time step.

        Returns dict  conduit_id -> inflow_m3s.
        The graph is processed in topological order so upstream conduits
        are evaluated before downstream ones.

        Overflow: when a conduit's inflow exceeds its effective capacity,
        the excess is added to the inflow of the next downstream conduit.
        """
        # Initialise node accumulator: excess flow waiting at each node
        node_excess: dict[str, float] = {n: 0.0 for n in self._graph.nodes}

        conduit_inflow: dict[str, float] = {}

        try:
            topo_nodes = list(nx.topological_sort(self._graph))
        except nx.NetworkXUnfeasible:
            # If graph has cycles (should not), fall back to edge order
            topo_nodes = list(self._graph.nodes)

        for node in topo_nodes:
            # Process all outgoing edges from this node
            for _, tn, data in self._graph.out_edges(node, data=True):
                cid = data["conduit_id"]
                coeff, area_ha, _tc = self._catchment_params(cid, inp)
                # Base runoff from catchment tributary to this conduit
                q_runoff = _rational_q(coeff, intensity_mm_hr, area_ha)
                # Add any overflow that arrived at the upstream node
                q_total  = q_runoff + node_excess.get(node, 0.0)
                q_eff    = data["effective_capacity_m3s"]

                conduit_inflow[cid] = q_total

                if q_total > q_eff:
                    # Push excess downstream
                    node_excess[tn] = node_excess.get(tn, 0.0) + (q_total - q_eff)

        return conduit_inflow

    # ------------------------------------------------------------------
    # Road intersection detection
    # ------------------------------------------------------------------

    def _find_road_intersections(
        self,
        overloaded: list[ConduitResult],
    ) -> list[RoadIntersection]:
        results: list[RoadIntersection] = []
        seen: set[tuple[str, str]] = set()

        for cr in overloaded:
            c_coords = cr.coordinates
            # Check against every road segment
            for rd_feat in self._roads:
                rp = rd_feat["properties"]
                r_coords = rd_feat["geometry"]["coordinates"]
                rid = rp["id"]
                rname = rp.get("name", rid)

                if (cr.conduit_id, rid) in seen:
                    continue

                # Test every pair of consecutive segments
                for ci in range(len(c_coords) - 1):
                    found = False
                    for ri in range(len(r_coords) - 1):
                        pt = _segments_intersect(
                            tuple(c_coords[ci]),     # type: ignore[arg-type]
                            tuple(c_coords[ci + 1]),  # type: ignore[arg-type]
                            tuple(r_coords[ri]),      # type: ignore[arg-type]
                            tuple(r_coords[ri + 1]),  # type: ignore[arg-type]
                        )
                        if pt is not None:
                            results.append(RoadIntersection(
                                road_id          = rid,
                                road_name        = rname,
                                conduit_id       = cr.conduit_id,
                                intersection_lon = round(pt[0], 7),
                                intersection_lat = round(pt[1], 7),
                                severity         = cr.severity,
                            ))
                            seen.add((cr.conduit_id, rid))
                            found = True
                            break
                    if found:
                        break
        return results

    # ------------------------------------------------------------------
    # Hotspot polygon generation
    # ------------------------------------------------------------------

    def _build_hotspots(
        self,
        overloaded: list[ConduitResult],
    ) -> list[HotspotPolygon]:
        """
        Cluster overloaded conduit midpoints that are within MERGE_DIST_M
        of each other into single hotspot polygons.
        """
        MERGE_DIST_M = 400.0  # metres

        if not overloaded:
            return []

        # Collect midpoints
        midpoints: list[tuple[float, float, ConduitResult]] = []
        for cr in overloaded:
            lon, lat = _midpoint(cr.coordinates)
            midpoints.append((lon, lat, cr))

        # Simple greedy clustering
        clusters: list[list[tuple[float, float, ConduitResult]]] = []
        assigned: list[bool] = [False] * len(midpoints)

        for i, (lon_i, lat_i, cr_i) in enumerate(midpoints):
            if assigned[i]:
                continue
            cluster = [(lon_i, lat_i, cr_i)]
            assigned[i] = True
            for j in range(i + 1, len(midpoints)):
                if assigned[j]:
                    continue
                lon_j, lat_j, _ = midpoints[j]
                if _haversine_m(lon_i, lat_i, lon_j, lat_j) <= MERGE_DIST_M:
                    cluster.append(midpoints[j])
                    assigned[j] = True
            clusters.append(cluster)

        hotspots: list[HotspotPolygon] = []
        for idx, cluster in enumerate(clusters):
            lons = [m[0] for m in cluster]
            lats = [m[1] for m in cluster]
            c_lon = sum(lons) / len(lons)
            c_lat = sum(lats) / len(lats)

            # Radius = max distance from centroid + 150 m buffer
            radius_m = 150.0
            for lon, lat, _ in cluster:
                d = _haversine_m(c_lon, c_lat, lon, lat)
                if d + 150.0 > radius_m:
                    radius_m = d + 150.0

            # Worst severity in cluster
            sev_order = {
                SeverityLevel.low: 0,
                SeverityLevel.moderate: 1,
                SeverityLevel.high: 2,
                SeverityLevel.critical: 3,
            }
            worst_sev = max((m[2].severity for m in cluster), key=lambda s: sev_order[s])

            ring = _circle_polygon(c_lon, c_lat, radius_m)
            hotspots.append(HotspotPolygon(
                id           = f"HS-{idx + 1:03d}",
                severity     = worst_sev,
                center_lon   = round(c_lon, 7),
                center_lat   = round(c_lat, 7),
                radius_m     = round(radius_m, 1),
                conduit_ids  = [m[2].conduit_id for m in cluster],
                coordinates  = [ring],
            ))

        return hotspots

    # ------------------------------------------------------------------
    # Full simulation run
    # ------------------------------------------------------------------

    def run(self, inp: SimulationInput) -> SimulationResult:
        run_id = str(uuid.uuid4())
        rp_label, peak_intensity = self._resolve_intensity(inp)

        # Build hyetograph
        hyeto = self._hyetograph(peak_intensity, inp.duration_steps, inp.step_minutes)

        # Run peak-step routing (use peak intensity for hotspot/road analysis)
        peak_inflow = self._route_single_step(peak_intensity, inp)

        # Build ConduitResult list from graph edges
        conduit_results: list[ConduitResult] = []
        for fn, tn, data in self._graph.edges(data=True):
            cid = data["conduit_id"]
            q_in  = peak_inflow.get(cid, 0.0)
            q_eff = data["effective_capacity_m3s"]
            fr    = q_in / q_eff if q_eff > 0 else 0.0
            sev   = _severity(fr)

            conduit_results.append(ConduitResult(
                conduit_id            = cid,
                from_node             = fn,
                to_node               = tn,
                channel_type          = ChannelType(data["channel_type"]),
                length_m              = data["length_m"],
                nominal_capacity_m3s  = data["nominal_capacity_m3s"],
                effective_capacity_m3s= q_eff,
                blockage_factor       = data["blockage_factor"],
                inflow_m3s            = round(q_in, 4),
                flow_ratio            = round(fr, 4),
                is_overloaded         = fr >= 1.0,
                severity              = sev,
                coordinates           = data["coordinates"],
            ))

        overloaded = [cr for cr in conduit_results if cr.is_overloaded]

        # Road intersections (only overloaded conduits)
        road_intersections = self._find_road_intersections(overloaded)

        # Hotspot polygons
        hotspot_polygons = self._build_hotspots(overloaded)

        # Timeline
        timeline: list[TimelineStep] = []
        for step_idx, intensity in enumerate(hyeto):
            step_inflow = self._route_single_step(intensity, inp)
            step_overloaded = 0
            step_max_fr = 0.0
            step_total_q = 0.0
            for fn2, tn2, data2 in self._graph.edges(data=True):
                cid2  = data2["conduit_id"]
                q2    = step_inflow.get(cid2, 0.0)
                qe2   = data2["effective_capacity_m3s"]
                fr2   = q2 / qe2 if qe2 > 0 else 0.0
                step_total_q += q2
                if fr2 > step_max_fr:
                    step_max_fr = fr2
                if fr2 >= 1.0:
                    step_overloaded += 1
            timeline.append(TimelineStep(
                step             = step_idx,
                elapsed_minutes  = step_idx * inp.step_minutes,
                rainfall_mm_hr   = intensity,
                overloaded_count = step_overloaded,
                max_flow_ratio   = round(step_max_fr, 4),
                total_inflow_m3s = round(step_total_q, 4),
            ))

        # Summary stats
        max_fr    = max((cr.flow_ratio for cr in conduit_results), default=0.0)
        total_q   = sum(cr.inflow_m3s for cr in conduit_results)

        result = SimulationResult(
            run_id                    = run_id,
            scenario_name             = inp.scenario_name,
            return_period_label       = rp_label,
            rainfall_intensity_mm_hr  = peak_intensity,
            global_area_ha            = inp.global_area_ha,
            global_runoff_coeff       = inp.global_runoff_coeff,
            global_tc_min             = inp.global_tc_min,
            duration_minutes          = inp.duration_steps * inp.step_minutes,
            conduit_results           = conduit_results,
            road_intersections        = road_intersections,
            hotspot_polygons          = hotspot_polygons,
            timeline                  = timeline,
            summary_overloaded        = len(overloaded),
            summary_max_flow_ratio    = round(max_fr, 4),
            summary_total_inflow_m3s  = round(total_q, 4),
            created_at                = datetime.now(timezone.utc).isoformat(),
        )

        self._persist(result)
        return result

    # ------------------------------------------------------------------
    # SQLite persistence
    # ------------------------------------------------------------------

    def _ensure_db(self) -> None:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        con = sqlite3.connect(DB_PATH)
        con.execute("""
            CREATE TABLE IF NOT EXISTS simulation_runs (
                run_id       TEXT PRIMARY KEY,
                scenario     TEXT NOT NULL,
                return_period TEXT NOT NULL,
                intensity_mm_hr REAL NOT NULL,
                overloaded   INTEGER NOT NULL,
                max_flow_ratio REAL NOT NULL,
                created_at   TEXT NOT NULL,
                payload      TEXT NOT NULL
            )
        """)
        con.commit()
        con.close()

    def _persist(self, result: SimulationResult) -> None:
        payload = result.model_dump_json()
        con = sqlite3.connect(DB_PATH)
        con.execute(
            """
            INSERT OR REPLACE INTO simulation_runs
                (run_id, scenario, return_period, intensity_mm_hr,
                 overloaded, max_flow_ratio, created_at, payload)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                result.run_id,
                result.scenario_name,
                result.return_period_label,
                result.rainfall_intensity_mm_hr,
                result.summary_overloaded,
                result.summary_max_flow_ratio,
                result.created_at,
                payload,
            ),
        )
        con.commit()
        con.close()

    def list_runs(self) -> list[dict[str, Any]]:
        """Return summary rows for all stored runs."""
        con = sqlite3.connect(DB_PATH)
        con.row_factory = sqlite3.Row
        rows = con.execute(
            "SELECT run_id, scenario, return_period, intensity_mm_hr, "
            "overloaded, max_flow_ratio, created_at FROM simulation_runs "
            "ORDER BY created_at DESC"
        ).fetchall()
        con.close()
        return [dict(r) for r in rows]

    def get_run(self, run_id: str) -> SimulationResult | None:
        """Retrieve a single run by ID."""
        con = sqlite3.connect(DB_PATH)
        row = con.execute(
            "SELECT payload FROM simulation_runs WHERE run_id = ?", (run_id,)
        ).fetchone()
        con.close()
        if row is None:
            return None
        return SimulationResult.model_validate_json(row[0])
