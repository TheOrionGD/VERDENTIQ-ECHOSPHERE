def test_list_models(client, auth_headers):
    response = client.get("/api/v1/mlops/models", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_milp_weights(client, auth_headers):
    response = client.get("/api/v1/mlops/milp-weights", headers=auth_headers)
    assert response.status_code == 200
    weights = response.json()
    assert "cost" in weights
    assert "carbon" in weights

    update_resp = client.put("/api/v1/mlops/milp-weights", json={"cost": 1.2, "carbon": 1.5, "comfort": 0.9}, headers=auth_headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["cost"] == 1.2

def test_retrain_schedule(client, auth_headers):
    response = client.get("/api/v1/mlops/retrain-schedule", headers=auth_headers)
    assert response.status_code == 200
    schedule = response.json()
    assert "cron" in schedule
    assert schedule["enabled"] is True

def test_fastapi_config(client, auth_headers):
    response = client.get("/api/v1/mlops/fastapi-config", headers=auth_headers)
    assert response.status_code == 200
    config = response.json()
    assert config["max_workers"] == 4

def test_dashboard_skeletons(client, auth_headers):
    for path in [
        "/api/v1/mlops/labeled-batches",
        "/api/v1/mlops/canary-deployments",
        "/api/v1/mlops/pipeline-nodes",
        "/api/v1/mlops/experiments",
        "/api/v1/mlops/registry-diff",
        "/api/v1/mlops/alert-rules",
    ]:
        resp = client.get(path, headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)
