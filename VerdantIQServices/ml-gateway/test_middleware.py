from fastapi.testclient import TestClient
from app.main import app
import os

client = TestClient(app)

def test_middleware():
    response = client.post("/api/v1/user/forecast", json={"history": []})
    print(f"Response without key: {response.status_code}")
    
    key = "dev_internal_key_123"
    response2 = client.post("/api/v1/user/forecast", json={"history": []}, headers={"X-Internal-Service-Key": key})
    print(f"Response with key: {response2.status_code}")
    
    if response.status_code == 403 and response2.status_code != 403:
        print("Middleware correctly rejects missing keys and accepts correct ones.")
    else:
        print("Middleware failed.")

if __name__ == "__main__":
    test_middleware()
