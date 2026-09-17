def test_unauthenticated_request_rejected(client):
    response = client.post("/api/v1/user/forecast", json={"history": []})
    assert response.status_code == 403
    assert response.json()["detail"] == "Could not validate credentials"

def test_invalid_key_rejected(client):
    headers = {"X-Internal-Service-Key": "invalid-secret-key-12345"}
    response = client.post("/api/v1/user/forecast", json={"history": []}, headers=headers)
    assert response.status_code == 403

def test_valid_key_accepted(client, auth_headers):
    response = client.post("/api/v1/user/forecast", json={"history": []}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "insufficient_data"
