from fastapi import APIRouter
from app.schemas.domain import MLPayloadRequest, MLResponse, ForecastPoint
import pandas as pd
import xgboost as xgb
from datetime import timedelta

router = APIRouter()

def generate_forecast(request: MLPayloadRequest) -> MLResponse:
    if len(request.history) < 7:
        return MLResponse(
            status="insufficient_data",
            message="Insufficient historical data. At least 7 days of logs are required to generate a meaningful forecast."
        )
    
    # Prepare data for XGBoost
    records = [{"timestamp": log.timestamp, "kwhSaved": log.kwhSaved} for log in request.history]
    df = pd.DataFrame(records)
    
    # Ensure timestamp is datetime and sort
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values(by="timestamp")
    
    # Feature extraction
    df['dayofyear'] = df['timestamp'].dt.dayofyear
    df['dayofweek'] = df['timestamp'].dt.dayofweek
    df['month'] = df['timestamp'].dt.month
    
    X = df[['dayofyear', 'dayofweek', 'month']]
    y = df['kwhSaved']
    
    # Train model
    model = xgb.XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.1)
    model.fit(X, y)
    
    # Predict next 30 days
    last_date = df['timestamp'].iloc[-1]
    future_dates = [last_date + timedelta(days=i) for i in range(1, 31)]
    future_df = pd.DataFrame({"timestamp": future_dates})
    future_df['dayofyear'] = future_df['timestamp'].dt.dayofyear
    future_df['dayofweek'] = future_df['timestamp'].dt.dayofweek
    future_df['month'] = future_df['timestamp'].dt.month
    
    predictions = model.predict(future_df[['dayofyear', 'dayofweek', 'month']])
    
    forecast_points = []
    for dt, pred in zip(future_dates, predictions):
        forecast_points.append(ForecastPoint(
            timestamp=dt,
            predicted_kwh_saved=max(0.0, float(pred)) # prevent negative savings
        ))
        
    return MLResponse(
        status="success",
        forecast=forecast_points
    )

@router.post("/user/forecast")
async def user_forecast(request: MLPayloadRequest):
    return generate_forecast(request)

@router.post("/student/forecast")
async def student_forecast(request: MLPayloadRequest):
    return generate_forecast(request)
