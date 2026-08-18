from fastapi import APIRouter
from app.schemas.domain import MLPayloadRequest, MLResponse
import pandas as pd
from sklearn.ensemble import IsolationForest

router = APIRouter()

def detect_anomalies(request: MLPayloadRequest) -> MLResponse:
    if len(request.history) < 7:
        return MLResponse(
            status="insufficient_data",
            message="Insufficient historical data. At least 7 days of logs are required to generate meaningful anomaly trends."
        )
        
    records = []
    for log in request.history:
        records.append({
            "id": log.id,
            "timestamp": log.timestamp,
            "kwhSaved": log.kwhSaved,
            "carbonKgSaved": log.carbonKgSaved,
            "savingsUSD": log.savingsUSD,
            "ecoPointsEarned": log.ecoPointsEarned
        })
        
    df = pd.DataFrame(records)
    
    # Features for IsolationForest
    features = ['kwhSaved', 'carbonKgSaved', 'savingsUSD', 'ecoPointsEarned']
    X = df[features]
    
    # Train IsolationForest (contamination 5%)
    model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    model.fit(X)
    
    # -1 is anomaly, 1 is normal
    preds = model.predict(X)
    
    # Anomaly scores (lower means more abnormal)
    scores = model.decision_function(X)
    
    anomalies_list = []
    for i, row in df.iterrows():
        is_anomaly = bool(preds[i] == -1)
        anomalies_list.append({
            "log_id": row["id"],
            "timestamp": row["timestamp"],
            "score": float(scores[i]),
            "is_anomaly": is_anomaly
        })
        
    return MLResponse(
        status="success",
        anomalies=anomalies_list
    )

@router.post("/user/anomaly-trends")
async def user_anomaly_trends(request: MLPayloadRequest):
    return detect_anomalies(request)

@router.post("/student/anomaly-trends")
async def student_anomaly_trends(request: MLPayloadRequest):
    return detect_anomalies(request)
