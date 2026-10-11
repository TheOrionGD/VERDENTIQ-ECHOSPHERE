from fastapi import APIRouter
from typing import List
from app.schemas.domain import XGBoostKPISuggestion, AnomalyTrendItem, MLPayloadRequest

router = APIRouter()

@router.post("/xgboost-kpi-suggestions", response_model=List[XGBoostKPISuggestion])
async def get_xgboost_kpi_suggestions(request: MLPayloadRequest):
    return []

@router.post("/anomaly-trends", response_model=List[AnomalyTrendItem])
async def get_anomaly_trends(request: MLPayloadRequest):
    return []
