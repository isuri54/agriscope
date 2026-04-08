import pytest
from fastapi.testclient import TestClient
from main import app

# Create test client
client = TestClient(app)

def test_predict_endpoint_success():
    """Test normal prediction with realistic values"""
    response = client.post("/predict", json={
        "production": 42459.75,
        "season_encoded": 1,      # 1 = Maha
        "period_encoded": 0       # 0 = Pre-Crisis
    })

    assert response.status_code == 200
    data = response.json()
    
    assert "predicted_excess" in data
    assert isinstance(data["predicted_excess"], float)
    assert data["predicted_excess"] > 0
    
    print(f"Prediction successful: {data['predicted_excess']:.2f} tons")


def test_predict_with_low_production():
    """Test with very low production value"""
    response = client.post("/predict", json={
        "production": 10000,
        "season_encoded": 0,      # 0 = Yala
        "period_encoded": 1       # 1 = Post-Crisis
    })

    assert response.status_code == 200
    data = response.json()
    assert data["predicted_excess"] > 0
    print(f"Low production test passed: {data['predicted_excess']:.2f} tons")