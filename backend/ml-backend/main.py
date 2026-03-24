from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np

app = FastAPI(title="Agriscope ML Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model WITHOUT compiling legacy metrics/loss
model = tf.keras.models.load_model(
    "best_tomato_ann_srilanka_2025_final.h5",
    compile=False
)

# Scaler from notebook
scaler_mean = np.array([36219.1533, 0.46666667, 0.13333333])
scaler_scale = np.array([9715.88681, 0.498887652, 0.339934634])

class PredictInput(BaseModel):
    production: float
    season_encoded: int  # 0=Yala, 1=Maha
    period_encoded: int  # 0=Pre, 1=Post

@app.post("/predict")
async def predict(data: PredictInput):
    # Scale input
    input_array = np.array([[data.production, data.season_encoded, data.period_encoded]])
    scaled_input = (input_array - scaler_mean) / scaler_scale

    # Predict excess (raw tons)
    excess = model.predict(scaled_input)[0][0]

    return {
        "predicted_excess": float(excess),
        "input_used": data.dict()
    }