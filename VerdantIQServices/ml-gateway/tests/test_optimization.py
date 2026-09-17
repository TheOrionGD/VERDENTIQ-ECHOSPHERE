def test_single_household_optimization(client, auth_headers, sample_candidates):
    payload = {
        "weights": {"cost": 1.0, "carbon": 1.5, "comfort": 0.8},
        "max_actions": 2,
        "candidates": sample_candidates
    }
    for endpoint in ["/api/v1/user/optimization-actions", "/api/v1/student/optimization-actions"]:
        response = client.post(endpoint, json=payload, headers=auth_headers)
        assert response.status_code == 200
        actions = response.json()
        assert isinstance(actions, list)
        assert len(actions) <= 2
        if len(actions) > 0:
            assert "rank" in actions[0]
            assert "carbonDeltaKg" in actions[0]

def test_institution_milp_scenarios(client, auth_headers, sample_candidates):
    payload = {
        "weights": {"cost": 1.0, "carbon": 1.0, "comfort": 1.0},
        "max_actions_per_household": 1,
        "households": {
            "hh-101": sample_candidates,
            "hh-102": sample_candidates
        }
    }
    response = client.post("/api/v1/institution/milp-scenarios", json=payload, headers=auth_headers)
    assert response.status_code == 200
    actions = response.json()
    assert isinstance(actions, list)
    assert len(actions) <= 2
