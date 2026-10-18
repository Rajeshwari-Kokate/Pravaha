"""
Tests for Phase 10: Contact form submission with honeypot and consent,
and Operator Passcode authentication with constant-time verification.
"""

import pytest
from fastapi.testclient import TestClient
try:
    from backend.app.main import app
    from backend.app.routers.admin import ADMIN_PASSCODE
except ImportError:
    from app.main import app
    from app.routers.admin import ADMIN_PASSCODE


@pytest.fixture
def client():
    return TestClient(app)


def test_contact_submission_success(client):
    payload = {
        "name": "Dr. Ramesh Kumar",
        "email": "ramesh.kumar@bbmp.gov.in",
        "message": "Observed sediment accumulation along 80 Feet Road arterial drain near Sony World signal.",
        "consent": True,
        "website_hp": ""
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "success"
    assert "message_id" in res


def test_contact_honeypot_caught(client):
    # Spambot fills honeypot field
    bot_payload = {
        "name": "Spam Bot",
        "email": "bot@example.com",
        "message": "Buy cheap watches at spam dot com",
        "consent": True,
        "website_hp": "http://spam.example.com"
    }
    response = client.post("/api/contact", json=bot_payload)
    assert response.status_code == 200
    res = response.json()
    # Returns silent success without database id
    assert res["status"] == "success"
    assert "message_id" not in res


def test_contact_missing_consent(client):
    no_consent_payload = {
        "name": "Citizen User",
        "email": "citizen@example.com",
        "message": "Question about catchment area boundary.",
        "consent": False,
        "website_hp": ""
    }
    response = client.post("/api/contact", json=no_consent_payload)
    assert response.status_code == 400


def test_admin_passcode_verification(client):
    # Valid passcode
    ok_resp = client.post("/api/admin/verify", json={"passcode": ADMIN_PASSCODE})
    assert ok_resp.status_code == 200
    assert ok_resp.json()["status"] == "authorized"

    # Invalid passcode
    bad_resp = client.post("/api/admin/verify", json={"passcode": "incorrect-passcode"})
    assert bad_resp.status_code == 401


def test_admin_protected_endpoints(client):
    # Access contacts with valid header
    contacts_resp = client.get(
        "/api/admin/contacts",
        headers={"x-operator-passcode": ADMIN_PASSCODE}
    )
    assert contacts_resp.status_code == 200
    assert isinstance(contacts_resp.json(), list)

    # Access contacts without valid header
    unauth_resp = client.get(
        "/api/admin/contacts",
        headers={"x-operator-passcode": "wrong-code"}
    )
    assert unauth_resp.status_code == 401

    # Access stats
    stats_resp = client.get(
        "/api/admin/stats",
        headers={"x-operator-passcode": ADMIN_PASSCODE}
    )
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert "database_size_bytes" in stats
    assert "total_simulations" in stats
