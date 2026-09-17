def test_institution_endpoints(client, auth_headers):
    payload = {"history": []}
    for endpoint in ["/api/v1/institution/xgboost-kpi-suggestions", "/api/v1/institution/anomaly-trends"]:
        response = client.post(endpoint, json=payload, headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

def test_audit_endpoints(client, auth_headers):
    for endpoint in ["/api/v1/audit/model-cards", "/api/v1/audit/fairness-reports"]:
        response = client.get(endpoint, headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
