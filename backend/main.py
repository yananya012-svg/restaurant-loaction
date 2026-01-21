from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pickle
import numpy as np
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Serve frontend files
frontend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")

@app.get("/")
def root():
    index_path = os.path.join(frontend_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type="text/html")
    return {"message": "Welcome to Restaurant Price Predictor API"}

@app.get("/style.css")
def get_style():
    style_path = os.path.join(frontend_path, "style.css")
    if os.path.exists(style_path):
        return FileResponse(style_path, media_type="text/css")
    return {"error": "style.css not found"}

@app.get("/script.js")
def get_script():
    script_path = os.path.join(frontend_path, "script.js")
    if os.path.exists(script_path):
        return FileResponse(script_path, media_type="application/javascript")
    return {"error": "script.js not found"}

# Mount static files for any other static assets
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")
