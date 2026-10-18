"""
Data integrity tests for PRAVAHA
Validates dataset loading, profile report generation, GeoJSON schemas, and synthetic drainage graph properties.
"""

import os
import json
from pathlib import Path
import pytest
from shapely.geometry import shape

# Absolute repo root: backend/tests/ is two levels below repo root
REPO_ROOT = Path(__file__).resolve().parents[2]


def test_dataset_raw_file_exists():
    env_p = os.environ.get("DATASET_PATH")
    if env_p and Path(env_p).exists():
        path = Path(env_p)
    elif (REPO_ROOT / "data" / "raw" / "flood_risk_dataset_india.csv").exists():
        path = REPO_ROOT / "data" / "raw" / "flood_risk_dataset_india.csv"
    else:
        path = REPO_ROOT / "flood_risk_dataset_india.csv"
    assert path.exists(), f"Raw dataset not found at {path}"
    assert path.stat().st_size > 1000000, "Dataset file size smaller than expected"


def test_dataset_report_generated():
    report_path = REPO_ROOT / "docs" / "DATASET_REPORT.md"
    assert report_path.exists(), "Dataset report does not exist"
    with open(report_path, "r", encoding="utf-8") as f:
        content = f.read()
    assert "origin and licence unverified" in content
    assert "10,000" in content
    assert "Flood Occurred" in content


def test_regional_aggregates_json():
    agg_path = REPO_ROOT / "data" / "processed" / "regional_aggregates.json"
    assert agg_path.exists(), "Regional aggregates JSON missing"
    with open(agg_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data["metadata"]["status"] == "origin and licence unverified"
    assert len(data["by_land_cover"]) > 0
    assert len(data["by_soil_type"]) > 0


def test_processed_geojson_validity():
    files = [
        "study_area.geojson",
        "roads.geojson",
        "public_assets.geojson",
        "drainage_network.geojson",
    ]
    for fname in files:
        path = REPO_ROOT / "data" / "processed" / fname
        assert path.exists(), f"Processed file {fname} not found"
        with open(path, "r", encoding="utf-8") as f:
            fc = json.load(f)
        assert fc["type"] == "FeatureCollection"
        assert len(fc["features"]) > 0

        # Validate Shapely geometries
        for feat in fc["features"]:
            geom = shape(feat["geometry"])
            assert geom.is_valid, f"Invalid geometry in {fname}: {feat['properties']}"


def test_synthetic_drainage_attributes():
    path = REPO_ROOT / "data" / "processed" / "drainage_network.geojson"
    with open(path, "r", encoding="utf-8") as f:
        fc = json.load(f)

    for feat in fc["features"]:
        props = feat["properties"]
        assert props["is_synthetic"] is True, "Synthetic flag must be True"
        assert "nominal_capacity_m3s" in props
        assert "effective_capacity_m3s" in props
        assert "blockage_factor" in props
        assert 0.0 <= props["blockage_factor"] <= 1.0
        assert props["effective_capacity_m3s"] <= props["nominal_capacity_m3s"]
