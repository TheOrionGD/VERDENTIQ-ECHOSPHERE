from fastapi import FastAPI
from app.core.config import settings
from app.api.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

@app.get("/health")
async def root_health():
    return {"status": "ok", "service": "ml-gateway"}

app.include_router(api_router, prefix="/api/v1")

