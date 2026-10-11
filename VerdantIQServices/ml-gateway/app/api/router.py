from fastapi import APIRouter, Depends
from app.core.security import verify_internal_service_key
from app.api.endpoints import health, ocr, forecast, anomaly, optimization, mlops, llm_gateway, institution, audit

api_router = APIRouter()

# Health doesn't need auth, but if we want to enforce strictly on EVERYTHING:
api_router.include_router(health.router, tags=["health"])

# Group all authenticated routes
protected_router = APIRouter(dependencies=[Depends(verify_internal_service_key)])
protected_router.include_router(ocr.router, prefix="/ocr", tags=["ocr"])
protected_router.include_router(forecast.router, tags=["forecast"])
protected_router.include_router(anomaly.router, tags=["anomaly"])
protected_router.include_router(optimization.router, tags=["optimization"])
protected_router.include_router(mlops.router, prefix="/mlops", tags=["mlops"])
protected_router.include_router(llm_gateway.router, prefix="/mlops/llm-gateway", tags=["llm_gateway"])
protected_router.include_router(institution.router, prefix="/institution", tags=["institution"])
protected_router.include_router(audit.router, prefix="/audit", tags=["audit"])

api_router.include_router(protected_router)
