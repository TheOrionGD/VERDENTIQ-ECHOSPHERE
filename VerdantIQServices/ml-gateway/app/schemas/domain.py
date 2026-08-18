from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class ActivityLogModel(BaseModel):
    id: Optional[str] = None
    householdId: Optional[str] = None
    timestamp: datetime
    kwhSaved: float
    carbonKgSaved: float
    savingsUSD: float
    ecoPointsEarned: int
    type: Optional[str] = None

class MLPayloadRequest(BaseModel):
    history: List[ActivityLogModel]

class ForecastPoint(BaseModel):
    timestamp: datetime
    predicted_kwh_saved: float

class MLResponse(BaseModel):
    status: str
    message: Optional[str] = None
    forecast: Optional[List[ForecastPoint]] = None
    anomalies: Optional[List[Dict[str, Any]]] = None

# Optimization Models

class OptimizationWeights(BaseModel):
    cost: float = 1.0
    carbon: float = 1.0
    comfort: float = 1.0

class CandidateAction(BaseModel):
    id: str
    title: str
    category: str
    description: str
    base_carbon_delta: float
    base_cost_delta: float
    base_ease_score: int
    base_eco_points: int

class OptimizationRequest(BaseModel):
    weights: OptimizationWeights
    max_actions: int = 5
    candidates: List[CandidateAction] 

class InstitutionOptimizationRequest(BaseModel):
    weights: OptimizationWeights
    max_actions_per_household: int = 3
    households: Dict[str, List[CandidateAction]]

class OptimizationAction(BaseModel):
    id: str
    title: str
    category: str
    rank: int
    description: str
    carbonDeltaKg: float
    costDeltaUSD: float
    ecoPointsBonus: int
    easeScore: int
    status: str = "recommended"
    household_id: Optional[str] = None 

# LLM Gateway Models

class LLMQueryRequest(BaseModel):
    prompt: str
    context_data: Optional[Dict[str, Any]] = None

class LLMQueryResponse(BaseModel):
    response: str
    provider: str
    latency_ms: int
    cost_usd: float

class LLMConfig(BaseModel):
    primaryProvider: str = "Gemini 3.5 Flash"
    fallbackProvider: str = "Groq LPU"
    maxLatencyMs: int = 250
    costCapPerRequest: float = 0.002

class LLMRoutingRule(BaseModel):
    id: str
    condition: str
    target_provider: str
    priority: int

# MLOps Models

class MLModelRecord(BaseModel):
    id: str
    name: str
    version: str
    status: str
    metrics: Dict[str, float]
    artifact_path: str
    deployed_at: str

class RetrainSchedule(BaseModel):
    cron: str
    enabled: bool

class CanaryDeployment(BaseModel):
    model_id: str
    traffic_percentage: int

class PipelineNode(BaseModel):
    id: str
    name: str
    status: str
    last_run: str

class MLExperiment(BaseModel):
    id: str
    name: str
    accuracy: float
    status: str

class RegistryDiffItem(BaseModel):
    file_name: str
    diff_type: str

class AlertRule(BaseModel):
    id: str
    metric: str
    threshold: float
    action: str

class FastApiServiceConfig(BaseModel):
    max_workers: int
    timeout_ms: int

class LabeledDataBatch(BaseModel):
    batch_id: str
    record_count: int
    label_quality_score: float

class XGBoostKPISuggestion(BaseModel):
    id: str
    kpi_name: str
    suggestion: str
    confidence_score: float
    impact_estimate: str

class AnomalyTrendItem(BaseModel):
    id: str
    timestamp: datetime
    description: str
    severity: str
    tenant_id: Optional[str] = None

class ModelCard(BaseModel):
    id: str
    model_name: str
    version: str
    description: str
    intended_use: str
    metrics: Dict[str, float]

class FairnessReport(BaseModel):
    id: str
    model_id: str
    demographic_parity: float
    equal_opportunity: float
    disparate_impact: float
