import joblib
import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Global variable to store the model
model = None

def load_model():
    """Load the trained joblib model - SIMPLIFIED VERSION"""
    global model
    
    try:
        # Model file is in parent directory
        model_path = os.path.join(os.path.dirname(__file__), '../model.joblib')
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        
        # Load the model directly - no complex dependencies needed
        model = joblib.load(model_path)
        logger.info(f"✅ Model loaded successfully from {model_path}")
        logger.info(f"📊 Model type: {type(model).__name__}")
        
    except Exception as e:
        logger.error(f"❌ Error loading model: {str(e)}")
        raise

def predict_risk(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Make prediction using the loaded model - SIMPLIFIED"""
    
    if model is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")
    
    try:
        logger.info(f"📨 Received data for prediction: {input_data}")
        
        # Convert input data to the format your model expects
        # This depends on how your model was trained
        prediction_input = [
            [
                input_data['wilaya'],
                input_data['zone'], 
                input_data['crop_type'],
                float(input_data['farm_size_ha']),
                float(input_data['soil_quality']),
                float(input_data['soil_salinity']),
                float(input_data['altitude_m']),
                float(input_data['rainfall_mm']),
                float(input_data['et0_mm']),
                float(input_data['drought_index']),
                int(input_data['experience_years']),
                input_data['irrigation_type'],
                float(input_data['budget_needed'])
            ]
        ]
        
        logger.info(f"🔧 Formatted prediction input: {prediction_input}")
        
        # Make prediction
        risk_score = model.predict(prediction_input)[0]
        
        # Ensure it's a float between 0-1
        risk_score = float(risk_score)
        if risk_score < 0:
            risk_score = 0.0
        elif risk_score > 1:
            risk_score = 1.0
            
        logger.info(f"🎯 Prediction result: {risk_score}")
        
        return {
            "risk_score": round(risk_score, 4),
            "input_features": input_data
        }
        
    except Exception as e:
        logger.error(f"❌ Prediction error: {str(e)}")
        raise