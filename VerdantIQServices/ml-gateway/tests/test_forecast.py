def test_forecast_insufficient_data(client, auth_headers):
    payload = {"history": []}
    for endpoint in ["/api/v1/user/forecast", "/api/v1/student/forecast"]:
        response = client.post(endpoint, json=payload, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "insufficient_data"
        assert "At least 7 days" in data["message"]

def test_forecast_success(client, auth_headers, sample_activity_logs):
    payload = {"history": sample_activity_logs}
    for endpoint in ["/api/v1/user/forecast", "/api/v1/student/forecast"]:
        response = client.post(endpoint, json=payload, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "forecast" in data
        assert len(data["forecast"]) == 30
        assert "predicted_kwh_saved" in data["forecast"][0]
