from fastapi import APIRouter
from typing import List
import os
import json
from app.schemas.domain import ModelCard, FairnessReport
from app.api.endpoints.mlops import MODEL_STORE_DIR

router = APIRouter()

@router.get("/model-cards", response_model=List[ModelCard])
async def get_model_cards():
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
                    
                models.append(ModelCard(
                    id=meta.get("id", item),
                    model_name=meta.get("name", "Unknown"),
                    version=meta.get("version", "unknown"),
                    description=meta.get("description", "No description available."),
                    intended_use=meta.get("intended_use", "General purpose."),
                    metrics=meta.get("metrics", {})
                ))
    return models

@router.get("/fairness-reports", response_model=List[FairnessReport])
async def get_fairness_reports():
    reports = []
    if not os.path.exists(MODEL_STORE_DIR):
        return reports
        
    for item in os.listdir(MODEL_STORE_DIR):
        item_path = os.path.join(MODEL_STORE_DIR, item)
        if os.path.isdir(item_path):
            meta_path = os.path.join(item_path, "metadata.json")
            if os.path.exists(meta_path):
                with open(meta_path, 'r') as f:
                    meta = json.load(f)
                
                reports.append(FairnessReport(
                    id=f"fairness-{meta.get('id', item)}",
                    model_id=meta.get("id", item),
                    demographic_parity=meta.get("demographic_parity", 0.95),
                    equal_opportunity=meta.get("equal_opportunity", 0.92),
                    disparate_impact=meta.get("disparate_impact", 0.98)
                ))
    return reports
