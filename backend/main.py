from fastapi import FastAPI
import pickle
import numpy as np
import os

app = FastAPI()

# Load model
model = None
scaler = None

try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "model.pkl")
    with open(model_path, "rb") as f:
        model, scaler = pickle.load(f)
except Exception as e:
    print(f"Warning: Could not load model: {e}")

@app.get("/health")
def health():
    return {"status": "API is running"}

@app.post("/predict")
def predict(data: dict):
    features = np.array([[
        data['city'],
        data['locality'],
        data['cuisines'],
        data['aggregate_rating'],
        data['votes']
    ]])

    scaled = scaler.transform(features)
    prediction = model.predict(scaled)

    return {"predicted_price": int(prediction[0])}
