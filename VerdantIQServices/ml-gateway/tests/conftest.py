import os
import pytest
from fastapi.testclient import TestClient

# Ensure INTERNAL_SERVICE_KEY is set in environment for testing
if "INTERNAL_SERVICE_KEY" not in os.environ:
    os.environ["INTERNAL_SERVICE_KEY"] = "txXAWT1rwc43vCeDWTot36HRysaDHzrouNC7wGr2juW9oHWOH0Dfh6BUH9XaJlDH"

from app.main import app
from app.core.config import settings

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def auth_headers():
    return {"X-Internal-Service-Key": settings.INTERNAL_SERVICE_KEY}

@pytest.fixture
def sample_activity_logs():
    base_date = "2026-09-01T10:00:00"
    logs = []
    for i in range(10):
        day = str(i + 1).zfill(2)
        logs.append({
            "id": f"log-{i}",
            "householdId": "hh-101",
            "timestamp": f"2026-09-{day}T10:00:00",
            "kwhSaved": 15.5 + i * 0.5,
            "carbonKgSaved": 6.2 + i * 0.2,
            "savingsUSD": 3.1 + i * 0.1,
            "ecoPointsEarned": 150 + i * 5,
            "type": "energy_saver"
        })
    return logs

@pytest.fixture
def sample_candidates():
    return [
        {
            "id": "act-1",
            "title": "Smart HVAC Scheduling",
            "category": "hvac",
            "description": "Adjust HVAC setpoint during peak hours",
            "base_carbon_delta": -12.5,
            "base_cost_delta": -5.0,
            "base_ease_score": 4,
            "base_eco_points": 50
        },
        {
            "id": "act-2",
            "title": "LED Retrofit",
            "category": "lighting",
            "description": "Replace incandescent bulbs with LEDs",
            "base_carbon_delta": -8.0,
            "base_cost_delta": -3.2,
            "base_ease_score": 5,
            "base_eco_points": 30
        }
    ]
