from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class ActivityLogModel(BaseModel):
    id: Optional[str] = None
    householdId: Optional[str] = None
    timestamp: datetime
    kwhSaved: float = 0.0
    carbonKgSaved: float = 0.0
    savingsUSD: float = 0.0
    ecoPointsEarned: int = 0
    type: Optional[str] = None

class MLPayloadRequest(BaseModel):
    history: List[ActivityLogModel]

class ForecastPoint(BaseModel):
    day: Optional[int] = 0
    date: Optional[str] = None
    timestamp: Optional[datetime] = None
    predicted_kwh_saved: float = 0.0
    baselineKw: float = 0.0
    actualOrForecastKw: float = 0.0
    confidenceLower: float = 0.0
    confidenceUpper: float = 0.0
    carbonGco2e: float = 0.0
    isAnomaly: Optional[bool] = False
    anomalyTitle: Optional[str] = None
    anomalyReason: Optional[str] = None
    recommendedAction: Optional[str] = None

class MLResponse(BaseModel):
    status: str
    message: Optional[str] = None
    forecast: Optional[List[ForecastPoint]] = None
    anomalies: Optional[List[Dict[str, Any]]] = None

# Optimization Models

class OptimizationWeights(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    cost: float = Field(default=0.0, alias="energyCost")
    carbon: float = Field(default=0.0, alias="carbonEmissions")
    comfort: float = Field(default=0.0, alias="thermalComfort")
    equipmentWear: float = 0.0
    energyCost: float = 0.0
    thermalComfort: float = 0.0
    carbonEmissions: float = 0.0

class CandidateAction(BaseModel):
    id: str
    title: str
    category: str
    description: str
    base_carbon_delta: float = 0.0
    base_cost_delta: float = 0.0
    base_ease_score: int = 0
    base_eco_points: int = 0

class OptimizationRequest(BaseModel):
    weights: OptimizationWeights
    max_actions: int = 0
    candidates: List[CandidateAction] = Field(default_factory=list)

class InstitutionOptimizationRequest(BaseModel):
    weights: OptimizationWeights
    max_actions_per_household: int = 0
    households: Dict[str, List[CandidateAction]] = Field(default_factory=dict)

class OptimizationAction(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    title: str
    category: str
    rank: int = 0
    description: str = ""
    carbonDeltaKg: float = 0.0
    costDeltaUSD: float = 0.0
    ecoPointsBonus: int = 0
    easeScore: int = 0
    status: str = "recommended"
    household_id: Optional[str] = Field(default=None, alias="householdId")
    householdId: Optional[str] = None

# LLM Gateway Models

class LLMQueryRequest(BaseModel):
    prompt: str
    context_data: Optional[Dict[str, Any]] = None

class LLMQueryResponse(BaseModel):
    response: str
    provider: str
    latency_ms: int = 0
    cost_usd: float = 0.0

class LLMConfig(BaseModel):
    primaryProvider: str = "Gemini 3.5 Flash"
    fallbackProvider: str = "Groq LPU"
    maxLatencyMs: int = 0
    costCapPerRequest: float = 0.0

class LLMRoutingRule(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str = ""
    condition: str = ""
    target_provider: str = ""
    primaryProvider: str = ""
    fallbackProvider: str = ""
    priority: int = 0
    maxLatencyMs: int = 0
    maxCostCapDollars: float = 0.0
    enabled: bool = False

# MLOps Models

class MLModelRecord(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    version: str
    framework: str = ""
    status: str = "INACTIVE"
    metrics: Dict[str, float] = Field(default_factory=dict)
    artifact_path: str = ""
    deployed_at: str = Field(default="", alias="deployedAt")
    deployedAt: str = ""
    rmse: float = 0.0
    mae: float = 0.0
    latencyMs: int = 0
    memoryMb: int = 0
    accuracy: float = 0.0
    description: str = ""
    featureImportance: List[Dict[str, Any]] = Field(default_factory=list)

class RetrainSchedule(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    cron: str = Field(default="", alias="cronSchedule")
    cronSchedule: str = ""
    enabled: bool = False
    driftThresholdPsi: float = 0.0
    escalationCountTrigger: int = 0
    autoDeployIfRmseLower: bool = False
    webhookUrl: str = ""

class CanaryDeployment(BaseModel):
    model_id: str
    traffic_percentage: int = 0

class PipelineNode(BaseModel):
    id: str
    name: str
    status: str
    last_run: str

class MLExperiment(BaseModel):
    id: str
    name: str
    accuracy: float = 0.0
    status: str = ""

class RegistryDiffItem(BaseModel):
    file_name: str
    diff_type: str

class AlertRule(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    modelName: str = ""
    metric: str = ""
    operator: str = ""
    threshold: float = 0.0
    duration: str = ""
    channel: str = ""
    action: str = ""
    enabled: bool = False

class FastApiServiceConfig(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    workers: int = Field(default=0, alias="max_workers")
    max_workers: int = 0
    maxConcurrency: int = 0
    timeoutSeconds: int = Field(default=0, alias="timeout_ms")
    timeout_ms: int = 0
    cacheTtlSeconds: int = 0
    healthEndpoint: str = "/health"
    logLevel: str = "INFO"

class LabeledDataBatch(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(default="", alias="batch_id")
    batch_id: str = ""
    source: str = ""
    recordCount: int = Field(default=0, alias="record_count")
    record_count: int = 0
    labelType: str = ""
    dateCollected: str = ""
    qualityScore: float = Field(default=0.0, alias="label_quality_score")
    label_quality_score: float = 0.0
    status: str = "PENDING"

class XGBoostKPISuggestion(BaseModel):
    id: str
    kpi_name: str
    suggestion: str
    confidence_score: float = 0.0
    impact_estimate: str = ""

class AnomalyTrendItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    timestamp: datetime
    description: str
    severity: str
    tenant_id: Optional[str] = Field(default=None, alias="tenantId")
    tenantId: Optional[str] = None

class ModelCard(BaseModel):
    id: str
    model_name: str
    version: str
    description: str
    intended_use: str
    metrics: Dict[str, float] = Field(default_factory=dict)

class FairnessReport(BaseModel):
    id: str
    model_id: str
    demographic_parity: float = 0.0
    equal_opportunity: float = 0.0
    disparate_impact: float = 0.0
