def test_llm_config(client, auth_headers):
    response = client.get("/api/v1/mlops/llm-gateway/config", headers=auth_headers)
    assert response.status_code == 200
    config = response.json()
    assert "primaryProvider" in config

def test_llm_routing_rules(client, auth_headers):
    response = client.get("/api/v1/mlops/llm-gateway/routing-rules", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_llm_query_unconfigured(client, auth_headers):
    response = client.post("/api/v1/mlops/llm-gateway/query", json={"prompt": "Hello"}, headers=auth_headers)
    # Returns 503 when LLM_API_KEY is not set
    assert response.status_code in [503, 200]
