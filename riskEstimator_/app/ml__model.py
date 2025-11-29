import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any
import logging
import os

logger = logging.getLogger(__name__)

# Global variables
stack_pipeline = None
feature_columns = [
    'wilaya', 'zone', 'crop_type', 'farm_size_ha', 'soil_quality', 
    'soil_salinity', 'altitude_m', 'rainfall_mm', 'et0_mm', 
    'drought_index', 'experience_years', 'irrigation_type', 'budget_needed'
]

def load_model():
    """Load the trained joblib model pipeline"""
    global stack_pipeline
    
    try:
        # Model file is sibling of app folder
        model_path = os.path.join(os.path.dirname(__file__), '../model.joblib')
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        
        # Load the model pipeline
        stack_pipeline = joblib.load(model_path)
        logger.info(f"Model pipeline loaded successfully from {model_path}")
        
        # Log model information
        logger.info(f"Model type: {type(stack_pipeline).__name__}")
        
        # Check if it's a pipeline and log steps
        if hasattr(stack_pipeline, 'steps'):
            steps = [step[0] for step in stack_pipeline.steps]
            logger.info(f"Pipeline steps: {steps}")
            
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

def preprocess_features(input_data: Dict[str, Any]) -> pd.DataFrame:
    """Preprocess input features to match model expectations"""
    
    try:
        # Create DataFrame with exact column order expected by model
        processed_data = {
            'wilaya': [input_data['wilaya']],
            'zone': [input_data['zone']],
            'crop_type': [input_data['crop_type']],
            'farm_size_ha': [float(input_data['farm_size_ha'])],
            'soil_quality': [float(input_data['soil_quality'])],
            'soil_salinity': [float(input_data['soil_salinity'])],
            'altitude_m': [float(input_data['altitude_m'])],
            'rainfall_mm': [float(input_data['rainfall_mm'])],
            'et0_mm': [float(input_data['et0_mm'])],
            'drought_index': [float(input_data['drought_index'])],
            'experience_years': [int(input_data['experience_years'])],
            'irrigation_type': [input_data['irrigation_type']],
            'budget_needed': [float(input_data['budget_needed'])]
        }
        
        df = pd.DataFrame(processed_data)
        
        # Ensure correct data types
        df['experience_years'] = df['experience_years'].astype(int)
        
        logger.info(f"Processed features shape: {df.shape}")
        logger.info(f"Processed features columns: {list(df.columns)}")
        
        return df
        
    except Exception as e:
        logger.error(f"Feature preprocessing error: {str(e)}")
        raise ValueError(f"Feature processing failed: {str(e)}")

def predict_risk(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Make prediction using the loaded model pipeline - returns risk between 0 and 1"""
    
    if stack_pipeline is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")
    
    try:
        # Preprocess features to match training data format
        features_df = preprocess_features(input_data)
        
        logger.info(f"Making prediction with features:\n{features_df.iloc[0].to_dict()}")
        
        # Get prediction (assuming it returns failure probability)
        predicted_failure_prob = stack_pipeline.predict(features_df)
        
        logger.info(f"Raw prediction type: {type(predicted_failure_prob)}")
        logger.info(f"Raw prediction: {predicted_failure_prob}")
        
        # Extract the risk score (0-1)
        risk_score = 0.0
        
        if hasattr(stack_pipeline, 'predict_proba'):
            # Get probability predictions if available
            proba_predictions = stack_pipeline.predict_proba(features_df)
            logger.info(f"Probability predictions: {proba_predictions}")
            
            # Assuming binary classification: [success_prob, failure_prob]
            if proba_predictions.shape[1] == 2:
                risk_score = float(proba_predictions[0][1])  # Probability of failure
            else:
                risk_score = float(proba_predictions[0][0])
        else:
            # If no predict_proba, use the direct prediction
            if isinstance(predicted_failure_prob[0], (np.integer, int)):
                # If it's class prediction (0=success, 1=failure)
                risk_score = float(predicted_failure_prob[0])
            else:
                # If it's already probability
                risk_score = float(predicted_failure_prob[0])
        
        # Ensure risk score is between 0 and 1
        risk_score = max(0.0, min(1.0, risk_score))
        
        return {
            "risk_score": round(risk_score, 4),  # Risk probability between 0 and 1
            "input_features": input_data  # Echo input for verification
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        logger.error(f"Input data that caused error: {input_data}")
        raise

def get_model_info() -> Dict[str, Any]:
    """Get information about the loaded model"""
    if stack_pipeline is None:
        return {"error": "Model not loaded"}
    
    info = {
        "model_type": type(stack_pipeline).__name__,
        "features_expected": feature_columns,
        "model_loaded": True
    }
    
    # Add pipeline information if available
    if hasattr(stack_pipeline, 'steps'):
        info["pipeline_steps"] = [step[0] for step in stack_pipeline.steps]
    
    return info