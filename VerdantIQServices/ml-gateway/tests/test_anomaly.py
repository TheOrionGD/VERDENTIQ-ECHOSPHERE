def test_anomaly_insufficient_data(client, auth_headers):
    payload = {"history": []}
    for endpoint in ["/api/v1/user/anomaly-trends", "/api/v1/student/anomaly-trends"]:
        response = client.post(endpoint, json=payload, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "insufficient_data"

def test_anomaly_success(client, auth_headers, sample_activity_logs):
    payload = {"history": sample_activity_logs}
    for endpoint in ["/api/v1/user/anomaly-trends", "/api/v1/student/anomaly-trends"]:
        response = client.post(endpoint, json=payload, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "anomalies" in data
        assert len(data["anomalies"]) == len(sample_activity_logs)
        first_anomaly = data["anomalies"][0]
        assert "log_id" in first_anomaly
        assert "is_anomaly" in first_anomaly
        assert "score" in first_anomaly
