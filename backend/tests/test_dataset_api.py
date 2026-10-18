"""
Tests for Phase 7: Dataset analysis and ML susceptibility endpoints and model training.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.ml.susceptibility import trainer, SusceptibilityModelTrainer


@pytest.fixture
def client():
    return TestClient(app)


def test_dataset_summary_endpoint(client):
    response = client.get("/api/dataset/summary")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "success"
    assert "data" in json_data
    assert "metadata" in json_data["data"]
    assert json_data["data"]["metadata"]["total_records"] == 10000
    assert "by_land_cover" in json_data["data"]
    assert "by_soil_type" in json_data["data"]


def test_susceptibility_model_card_endpoint(client):
    response = client.get("/api/dataset/susceptibility")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "success"
    assert "model_card" in json_data
    card = json_data["model_card"]
    assert "models" in card
    assert "logistic_regression" in card["models"]
    assert "gradient_boosted_trees" in card["models"]
    assert "roc_auc" in card["models"]["logistic_regression"]
    assert "confusion_matrix" in card["models"]["logistic_regression"]
    assert "feature_attributions" in card
    assert len(card["feature_attributions"]) > 0


def test_susceptibility_prediction_endpoint(client):
    payload = {
        "rainfall_mm": 220.0,
        "temperature_c": 30.5,
        "humidity_pct": 82.0,
        "river_discharge_m3s": 3200.0,
        "water_level_m": 15.2,
        "elevation_m": 3500.0,
        "population_density": 850.0,
        "infrastructure": 1,
        "historical_floods": 1,
        "land_cover": "Urban",
        "soil_type": "Clay"
    }
    response = client.post("/api/dataset/susceptibility", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "success"
    assert "result" in res
    predictions = res["result"]["predictions"]
    assert "logistic_regression_prob" in predictions
    assert 0.0 <= predictions["logistic_regression_prob"] <= 1.0
    assert "gradient_boosted_prob" in predictions
    assert 0.0 <= predictions["gradient_boosted_prob"] <= 1.0
    assert "consensus_susceptibility" in predictions
    assert "top_drivers" in res["result"]


def test_susceptibility_validation_bounds(client):
    # Invalid rainfall (negative)
    bad_payload = {
        "rainfall_mm": -50.0
    }
    response = client.post("/api/dataset/susceptibility", json=bad_payload)
    assert response.status_code == 422
