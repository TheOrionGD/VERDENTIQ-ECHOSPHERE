from fastapi import APIRouter, HTTPException
from typing import List
import os
import json
from app.schemas.domain import (
    MLModelRecord, RetrainSchedule, LabeledDataBatch, CanaryDeployment,
    PipelineNode, MLExperiment, RegistryDiffItem, AlertRule, FastApiServiceConfig
)

router = APIRouter()

MODEL_STORE_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "model_store")

# --- MODEL REGISTRY ---

@router.get("/models", response_model=List[MLModelRecord])
async def list_models():
    """Scans the physical artifact store for model versions."""
    models = []
    if not os.path.exists(MODEL_STORE_DIR):
        return models
        
    for item in os.listdir(MODEL_STORE_DIR):
        item_path = os.path.join(MODEL_STORE_DIR, item)
        if os.path.isdir(item_path):
            meta_path = os.path.join(item_path, "metadata.json")
            if os.path.exists(meta_path):
                with open(meta_path, 'r') as f:
                    meta = json.load(f)
                    
                models.append(MLModelRecord(
                    id=meta.get("id", item),
                    name=meta.get("name", "Unknown"),
                    version=meta.get("version", "unknown"),
                    status=meta.get("status", "archived"),
                    metrics=meta.get("metrics", {}),
                    artifact_path=os.path.join(item_path, "model.pkl"),
                    deployed_at=meta.get("deployed_at", "")
                ))
    return models

@router.post("/models/{model_id}/rollback")
async def rollback_model(model_id: str):
    """
    Rolls back (or promotes) a specific model version by physically altering
    the metadata.json files in the artifact store.
    """
    if not os.path.exists(MODEL_STORE_DIR):
        raise HTTPException(status_code=404, detail="Model store not found.")
        
    target_meta_path = None
    all_meta_paths = []
    
    # 1. Find all models and the target model
    for item in os.listdir(MODEL_STORE_DIR):
        item_path = os.path.join(MODEL_STORE_DIR, item)
        if os.path.isdir(item_path):
            meta_path = os.path.join(item_path, "metadata.json")
            if os.path.exists(meta_path):
                all_meta_paths.append(meta_path)
                with open(meta_path, 'r') as f:
                    meta = json.load(f)
                if meta.get("id") == model_id:
                    target_meta_path = meta_path
                    
    if not target_meta_path:
        raise HTTPException(status_code=404, detail=f"Model {model_id} not found in artifact store.")
        
    # 2. Archive all currently active models (simplistic approach: only 1 active at a time)
    for path in all_meta_paths:
        with open(path, 'r') as f:
            meta = json.load(f)
        if meta.get("status") == "active":
            meta["status"] = "archived"
            with open(path, 'w') as f:
                json.dump(meta, f, indent=4)
                
    # 3. Mark the target model as active
    with open(target_meta_path, 'r') as f:
        target_meta = json.load(f)
    target_meta["status"] = "active"
    with open(target_meta_path, 'w') as f:
        json.dump(target_meta, f, indent=4)
        
    return {"status": "success", "message": f"Successfully rolled back to {model_id}. Pointer updated."}


# --- MLOPS CONFIG & DASHBOARD SKELETONS ---

@router.get("/milp-weights")
async def get_milp_weights():
    return {"cost": 1.0, "carbon": 1.0, "comfort": 1.0}

@router.put("/milp-weights")
async def update_milp_weights(weights: dict):
    return weights

@router.get("/retrain-schedule", response_model=RetrainSchedule)
async def get_retrain_schedule():
    return RetrainSchedule(cron="0 2 * * 0", enabled=True)

@router.put("/retrain-schedule", response_model=RetrainSchedule)
async def update_retrain_schedule(schedule: RetrainSchedule):
    return schedule

@router.get("/labeled-batches", response_model=List[LabeledDataBatch])
async def get_labeled_batches():
    return []

@router.get("/canary-deployments", response_model=List[CanaryDeployment])
async def get_canary_deployments():
    return []

@router.get("/pipeline-nodes", response_model=List[PipelineNode])
async def get_pipeline_nodes():
    return []

@router.get("/experiments", response_model=List[MLExperiment])
async def get_experiments():
    return []

@router.get("/registry-diff", response_model=List[RegistryDiffItem])
async def get_registry_diff():
    return []

@router.get("/alert-rules", response_model=List[AlertRule])
async def get_alert_rules():
    return []

@router.get("/fastapi-config", response_model=FastApiServiceConfig)
async def get_fastapi_config():
    return FastApiServiceConfig(max_workers=4, timeout_ms=30000)

@router.put("/fastapi-config", response_model=FastApiServiceConfig)
async def update_fastapi_config(config: FastApiServiceConfig):
    return config
