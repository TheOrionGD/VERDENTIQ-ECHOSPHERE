from typing import Any, List
from fastapi import APIRouter
from app.schemas.domain import MLPayloadRequest, MLResponse
import pandas as pd
import numpy as np

try:
    from sklearn.ensemble import IsolationForest
    HAS_SKLEARN = True
except (ImportError, Exception):
    HAS_SKLEARN = False
    IsolationForest = None

router = APIRouter()

def _statistical_anomaly_detection(X: Any, contamination: float = 0.05):
    """Fallback anomaly detector using standardized z-scores when sklearn is blocked by OS policy."""
    means = X.mean()
    stds = X.std().replace(0, 1.0).fillna(1.0)
    z_scores = np.abs((X - means) / stds)
    composite_dev = z_scores.mean(axis=1).values
    
    threshold = np.quantile(composite_dev, 1.0 - contamination)
    preds = np.where(composite_dev >= threshold, -1, 1)
    # Decision score: higher = more normal, lower/negative = more anomalous
    scores = -(composite_dev - np.mean(composite_dev))
    return preds, scores

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
    
    # Features for IsolationForest / Anomaly Detection
    features = ['kwhSaved', 'carbonKgSaved', 'savingsUSD', 'ecoPointsEarned']
    X = df[features]
    
    preds = None
    scores = None
    
    if HAS_SKLEARN and IsolationForest is not None:
        try:
            model_params = {"n_estimators": 100, "contamination": 0.05, "random_state": 42}
            model = IsolationForest(**model_params)
            model.fit(X)
            preds = model.predict(X)
            scores = model.decision_function(X)
        except Exception:
            preds, scores = _statistical_anomaly_detection(X, contamination=0.05)
    else:
        preds, scores = _statistical_anomaly_detection(X, contamination=0.05)
    
    pred_list: List[int] = [int(p) for p in preds] if preds is not None else []
    score_list: List[float] = [float(s) for s in scores] if scores is not None else []

    anomalies_list = []
    for idx, log in enumerate(request.history):
        is_anomaly = bool(pred_list[idx] == -1) if idx < len(pred_list) else False
        anomalies_list.append({
            "log_id": log.id,
            "timestamp": log.timestamp,
            "score": score_list[idx] if idx < len(score_list) else 0.0,
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
