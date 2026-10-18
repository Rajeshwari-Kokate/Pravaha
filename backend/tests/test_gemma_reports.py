"""
Tests for Phase 8: Google Gemma 4 AI Report Generation, schema validation,
evidence citation checking, anti-hallucination verification, and fallback handling.
"""

import json
import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

try:
    from backend.app.main import app
    from backend.app.gemma.schema import InvestigationReport, HotspotFinding, CandidateBottleneck
    from backend.app.gemma.client import GemmaReportGenerator
except ImportError:
    from app.main import app
    from app.gemma.schema import InvestigationReport, HotspotFinding, CandidateBottleneck
    from app.gemma.client import GemmaReportGenerator


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def sample_run_data():
    return {
        "run_id": "test-run-1234",
        "scenario_name": "Test 10yr Storm",
        "rainfall_intensity_mm_hr": 50.0,
        "summary": {
            "overloaded_count": 8,
            "total_conduits": 28,
            "max_flow_ratio": 1.45,
            "affected_roads_count": 4,
        },
        "conduit_results": [
            {
                "conduit_id": "DRN-TRUNK-01",
                "channel_type": "trunk",
                "flow_ratio": 1.45,
                "severity": "high",
                "effective_capacity_m3s": 10.4,
                "inflow_m3s": 15.08,
            },
            {
                "conduit_id": "DRN-PRIM-02",
                "channel_type": "primary",
                "flow_ratio": 1.15,
                "severity": "moderate",
                "effective_capacity_m3s": 6.0,
                "inflow_m3s": 6.9,
            },
        ],
    }


def test_evidence_registry_builder(sample_run_data):
    generator = GemmaReportGenerator()
    registry, context_block = generator.build_evidence_registry(sample_run_data)

    assert "[EVID-SIM-01]" in registry
    assert "[EVID-SIM-02]" in registry
    assert "[EVID-SIM-03]" in registry
    assert "[EVID-DS-01]" in registry
    assert "[EVID-DS-02]" in registry
    assert "50.0 mm/h" in registry["[EVID-SIM-01]"]
    assert "8 of 28" in registry["[EVID-SIM-02]"]


def test_hallucination_depth_rejection(sample_run_data):
    generator = GemmaReportGenerator()
    registry, _ = generator.build_evidence_registry(sample_run_data)

    # Report attempting to hallucinate physical water depths (not modeled in Rational Method)
    bad_report = InvestigationReport(
        report_id="REP-TEST-001",
        run_id="test-run-1234",
        scenario_name="Test Scenario",
        generated_at="2026-10-18T12:00:00Z",
        generated_by_model="test-model",
        executive_summary="Flood accumulation reaches 2.5 meters of water depth across 80ft road [EVID-SIM-01].",
        hotspot_findings=[],
        candidate_bottlenecks=[],
        intervention_comparison="Trunk desilting recommended [EVID-SIM-02].",
        data_limitations=["Rational method only [EVID-DS-01]."],
        inspection_recommendations=["Inspect culverts."],
        evidence_citations=["[EVID-SIM-01]", "[EVID-SIM-02]", "[EVID-DS-01]"],
    )

    with pytest.raises(ValueError, match="prohibited physical water depth hallucination"):
        generator.validate_and_sanitize_report(bad_report, registry)


def test_ungrounded_evidence_tag_rejection(sample_run_data):
    generator = GemmaReportGenerator()
    registry, _ = generator.build_evidence_registry(sample_run_data)

    # Report attempting to cite a fabricated evidence tag
    bad_report = InvestigationReport(
        report_id="REP-TEST-002",
        run_id="test-run-1234",
        scenario_name="Test Scenario",
        generated_at="2026-10-18T12:00:00Z",
        generated_by_model="test-model",
        executive_summary="High peak flow observed across Koramangala [EVID-SIM-99].",
        hotspot_findings=[],
        candidate_bottlenecks=[],
        intervention_comparison="Trunk desilting recommended [EVID-SIM-02].",
        data_limitations=["Rational method only [EVID-DS-01]."],
        inspection_recommendations=["Inspect culverts."],
        evidence_citations=["[EVID-SIM-99]", "[EVID-SIM-02]", "[EVID-DS-01]"],
    )

    with pytest.raises(ValueError, match="ungrounded evidence tags"):
        generator.validate_and_sanitize_report(bad_report, registry)


def test_deterministic_fallback_when_offline(sample_run_data):
    import asyncio
    generator = GemmaReportGenerator(base_url="http://127.0.0.1:59999/v1", timeout_seconds=1)
    report = asyncio.run(generator.generate_report(sample_run_data))

    assert report.is_fallback is True
    assert "deterministic" in report.generated_by_model
    assert len(report.hotspot_findings) > 0
    assert len(report.candidate_bottlenecks) > 0
    assert "[EVID-SIM-01]" in report.executive_summary
    assert len(report.data_limitations) > 0


def test_mocked_valid_gemma_llm_response(sample_run_data):
    import asyncio
    generator = GemmaReportGenerator()
    
    mock_llm_json = {
        "executive_summary": "Under the modeled 50.0 mm/h rainfall [EVID-SIM-01], 8 conduits exceed capacity [EVID-SIM-02] intersecting 4 road corridors [EVID-SIM-03].",
        "hotspot_findings": [
            {
                "conduit_id": "DRN-TRUNK-01",
                "channel_type": "trunk",
                "flow_ratio": 1.45,
                "severity": "high",
                "evidence_id": "[EVID-SIM-04]"
            }
        ],
        "candidate_bottlenecks": [
            {
                "conduit_id": "DRN-TRUNK-01",
                "rank": 1,
                "composite_score": 0.88,
                "primary_driver": "Cross section constriction under peak flow",
                "evidence_id": "[EVID-SIM-04]"
            }
        ],
        "intervention_comparison": "Widening primary conduits reduces flow exceedance across junctions [EVID-SIM-02].",
        "data_limitations": [
            "Conveyance assessment uses synthetic road-aligned topology [EVID-DS-01].",
            "Rational runoff calculation without hydrostatic depth [EVID-DS-02]."
        ],
        "inspection_recommendations": [
            "CCTV inspection of DRN-TRUNK-01."
        ],
        "evidence_citations": [
            "[EVID-SIM-01]", "[EVID-SIM-02]", "[EVID-SIM-03]", "[EVID-SIM-04]", "[EVID-DS-01]", "[EVID-DS-02]"
        ]
    }

    import httpx
    resp_obj = httpx.Response(
        status_code=200,
        json={
            "choices": [
                {
                    "message": {
                        "content": f"```json\n{json.dumps(mock_llm_json)}\n```"
                    }
                }
            ]
        },
        request=httpx.Request("POST", "http://test/chat/completions"),
    )

    with patch("httpx.AsyncClient.post", return_value=resp_obj):
        report = asyncio.run(generator.generate_report(sample_run_data))
        assert report.is_fallback is False
        assert report.generated_by_model == generator.model
        assert report.hotspot_findings[0].conduit_id == "DRN-TRUNK-01"
        assert "[EVID-SIM-01]" in report.evidence_citations


def test_reports_api_endpoints(client):
    # Test generation endpoint
    gen_resp = client.post("/api/reports/generate", json={"run_id": "demo"})
    assert gen_resp.status_code == 200
    report_data = gen_resp.json()
    assert "report_id" in report_data
    assert "executive_summary" in report_data
    report_id = report_data["report_id"]

    # Test retrieval by ID
    get_resp = client.get(f"/api/reports/{report_id}")
    assert get_resp.status_code == 200
    fetched_data = get_resp.json()
    assert fetched_data["report_id"] == report_id
    assert fetched_data["executive_summary"] == report_data["executive_summary"]

    # Test listing reports
    list_resp = client.get("/api/reports")
    assert list_resp.status_code == 200
    all_reports = list_resp.json()
    assert len(all_reports) >= 1
    ids = [r["report_id"] for r in all_reports]
    assert report_id in ids
