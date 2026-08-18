import re
import os
from fastapi import FastAPI
from app.main import app

def extract_fastapi_routes():
    routes = []
    for route in app.routes:
        if hasattr(route, "methods") and hasattr(route, "path"):
            for method in route.methods:
                if method != "HEAD":
                    routes.append(f"{method} {route.path}")
    return set(routes)

contract_endpoints = set()
with open(r"O:\PROJECTS\Ecosphere\VerdantIQCLIENT\docs\API_CONTRACT.md", "r", encoding="utf-8") as f:
    for line in f:
        match = re.search(r"### `(GET|POST|PUT|DELETE|PATCH) (/[^`]+)`", line)
        if match:
            contract_endpoints.add(f"{match.group(1)} {match.group(2)}")

fastapi_routes = extract_fastapi_routes()

print("Endpoints in Contract but NOT in FastAPI (might be handled by sb-gateway):")
# Filter to only show /api/v1/mlops, /api/v1/user/forecast, /api/v1/student/forecast, /api/v1/audit etc.
for ep in sorted(contract_endpoints - fastapi_routes):
    if "mlops" in ep or "forecast" in ep or "anomaly" in ep or "optimization" in ep or "audit" in ep or "model-card" in ep or "fairness" in ep or "llm-gateway" in ep:
        print(ep)

print("\nEndpoints in FastAPI but NOT in Contract:")
for ep in sorted(fastapi_routes - contract_endpoints):
    print(ep)
