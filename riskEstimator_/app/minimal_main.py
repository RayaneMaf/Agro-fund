from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os
import pandas as pd
import numpy as np

app = FastAPI()

np.random.seed(42)

def soil_quality_floating(d):
    if d == 'poor':
        return 0.40  # Low quality
    elif d == 'average':
        return 0.55  # Medium quality
    elif d == 'good':
        return 0.70  # High quality
    elif d == 'excellent':
        return 0.85  # Very high quality
    else:
        return 0.50  # Default fallback

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable for model
model = None

@app.on_event("startup")
def load_model():
    global model
    try:
        model_path = os.path.join(os.path.dirname(__file__), '../model.joblib')
        model = joblib.load(model_path)
        print("✅ Model loaded successfully!")
        print(f"📊 Model type: {type(model).__name__}")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        # Print more details about the error
        import traceback
        traceback.print_exc()

@app.get("/")
def root():
    return {"message": "AI Risk Prediction Service Running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict")
def predict(data: dict):
    
    try:
        print("Received prediction request")
        if model is None:
            return {"error": "Model not loaded"}
        
        print(f"📨 Received prediction request: {data}")
        
        # Format input for your model
        prediction_input = [
            [
                data['wilaya'],
                data['zone'], 
                data['crop_type'],
                float(data['farm_size_ha']),
                soil_quality_floating(data['soil_quality']),
                float(data['soil_salinity']),
                float(data['altitude_m']),
                float(data['rainfall_mm']),
                float(data['et0_mm']),
                float(data['drought_index']),
                int(data['experience_years']),
                data['irrigation_type'],
                float(data['budget_needed'])
            ]
        ]
        
        print(f"🔧 Formatted input: {prediction_input}")

        # 1. Define the column names exactly as they were used during training
        column_names = [
            'wilaya', 'zone', 'crop_type', 'farm_size_ha', 'soil_quality',
            'soil_salinity', 'altitude_m', 'rainfall_mm', 'et0_mm',
            'drought_index', 'experience_years', 'irrigation_type', 'budget_needed'
        ]

        # 2. Create the values list in the EXACT same order as column_names
        values = [
            data['wilaya'],
            data['zone'], 
            data['crop_type'],
            float(data['farm_size_ha']),
            soil_quality_floating(data['soil_quality']),
            float(data['soil_salinity']),
            float(data['altitude_m']),
            float(data['rainfall_mm']),
            float(data['et0_mm']),
            float(data['drought_index']),
            int(data['experience_years']),
            data['irrigation_type'],
            float(data['budget_needed'])
        ]
        
        # 3. Create a DataFrame
        # This attaches the string names (e.g., 'wilaya') to the values so the ColumnTransformer can find them.
        df_input = pd.DataFrame([values], columns=column_names)
        
        print(f"🔧 Formatted DataFrame:\n{df_input}")
        
        # Make prediction using the DataFrame
        risk_score = model.predict(df_input)[0]
        
        risk_score = max(0.0, min(1.0, float(risk_score)))
        
        print(f"🎯 Prediction result: {risk_score}")
        
        return {
            "risk_score": round(risk_score, 4),
            "input_features": data
        }
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)