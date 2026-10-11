from fastapi import APIRouter, HTTPException
from app.schemas.domain import LLMQueryRequest, LLMQueryResponse, LLMConfig, LLMRoutingRule
from app.core.config import settings
import time
import json
import os

router = APIRouter()

# In-memory mock storage for tracking and configuration
TELEMETRY = []
CURRENT_CONFIG = LLMConfig()
ROUTING_RULES = [] # Empty until real configuration is added

def estimate_tokens(text: str) -> int:
    """Very rough token estimation."""
    return len(text) // 4

def calculate_cost(provider: str, tokens: int) -> float:
    # Fictional static rates
    if "Gemini" in provider:
        return (tokens / 1000) * 0.001
    elif "Groq" in provider:
        return (tokens / 1000) * 0.0005
    return 0.0

@router.post("/query", response_model=LLMQueryResponse)
async def query_omnibar(request: LLMQueryRequest):
    start_time = time.time()
    
    # Check if API keys are configured in settings or environment
    api_key_configured = bool(
        settings.LLM_API_KEY 
        or settings.GEMINI_API_KEY 
        or settings.GROQ_API_KEY
        or os.environ.get("LLM_API_KEY") 
        or os.environ.get("GEMINI_API_KEY") 
        or os.environ.get("GROQ_API_KEY")
    )
    if not api_key_configured:
        raise HTTPException(
            status_code=503, 
            detail={
                "status": "error",
                "message": "LLM provider not configured. Please set API keys."
            }
        )
        
    # Rest of the logic would go here if configured
    # For now, it will always raise the exception above

@router.get("/config", response_model=LLMConfig)
async def get_config():
    return CURRENT_CONFIG

@router.get("/routing-rules", response_model=list[LLMRoutingRule])
async def get_routing_rules():
    return ROUTING_RULES
