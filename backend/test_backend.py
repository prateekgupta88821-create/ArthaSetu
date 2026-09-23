import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["app"] == "GigWealth AI"

def test_dashboard():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "income" in data
    assert "expenses" in data
    assert "financial_health" in data

def test_income_analyzer():
    response = client.get("/api/income")
    assert response.status_code == 200
    assert response.json()["metrics"]["average_income"] > 0

def test_affordability():
    payload = {
        "product_price": 60000,
        "down_payment": 10000,
        "emi_months": 24,
        "annual_interest_rate": 12.0
    }
    response = client.post("/api/affordability", json=payload)
    assert response.status_code == 200
    assert "affordability_category" in response.json()

def test_copilot():
    payload = {"question": "Can I afford this phone?"}
    response = client.post("/api/ai/chat", json=payload)
    assert response.status_code == 200
    assert "answer" in response.json()

def test_snapshot():
    response = client.get("/api/snapshot")
    assert response.status_code == 200
    assert "title" in response.json()
