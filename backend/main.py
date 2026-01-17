from fastapi import FastAPI
import pickle
import numpy as np

app = FastAPI()

# Load model
with open("model.pkl", "rb") as f:
    model, scaler = pickle.load(f)

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
