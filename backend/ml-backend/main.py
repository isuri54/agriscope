from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
from datetime import datetime
from typing import Optional

app = FastAPI(title="Agriscope ML Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model without compiling legacy metrics/loss
model = tf.keras.models.load_model(
    "best_tomato_ann_srilanka_2026_final.h5",
    compile=False
)

# Scaler from notebook
scaler_mean = np.array([36219.1533, 0.46666667, 0.13333333])
scaler_scale = np.array([9715.88681, 0.498887652, 0.339934634])

class PredictInput(BaseModel):
    production: Optional[float] = None
    season_encoded: Optional[int] = None
    period_encoded: Optional[int] = None

@app.post("/predict")
async def predict(data: Optional[PredictInput] = None):
    # Automatic prediction logic
    now = datetime.now()
    month = now.month
    year = now.year

    # Automatic season detection
    # June to Dec -> Preparing for Maha (0)
    # Jan to May -> Preparing for Yala (1)
    if 6 <= month <= 12:
        auto_season = 0 # Maha
        season_name = "Maha"
        # Typical Maha production average from past data
        auto_production = 41000.0 
    else:
        auto_season = 1 # Yala
        season_name = "Yala"
        # Typical Yala production average from past data
        auto_production = 31000.0

    # Automatic crisis period detection (Post-2021)
    auto_period = 1 if year >= 2021 else 0

    # Use user input if provided, otherwise use Auto-detected values
    prod = data.production if data and data.production is not None else auto_production
    seas = data.season_encoded if data and data.season_encoded is not None else auto_season
    peri = data.period_encoded if data and data.period_encoded is not None else auto_period
    
    # Scale input
    input_array = np.array([[prod, seas, peri]])
    scaled_input = (input_array - scaler_mean) / scaler_scale

    # Predict excess (raw tons)
    prediction = model.predict(scaled_input)
    excess = float(prediction[0][0])

    return {
        "success": True,
        "predicted_excess": round(excess, 2),
        "forecast_context": {
            "season": season_name,
            "year": year,
            "is_post_crisis": bool(auto_period),
            "production_used": prod
        }
    }