from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.ml_model import load_model, predict_risk
from app.models import PredictionInput, PredictionOutput
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AgroConnect AI Risk Prediction Service",
    description="AI model for predicting agricultural project failure risk (0-1)",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
@app.on_event("startup")
async def startup_event():
    logger.info("Loading AI model...")
    try:
        load_model()
        logger.info("AI model loaded successfully!")
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        raise

@app.get("/")
async def root():
    return {"message": "AgroConnect AI Risk Prediction Service is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-risk-predictor"}

@app.post("/predict", response_model=PredictionOutput)
async def predict_risk_endpoint(input_data: PredictionInput):
    """
    Predict agricultural project failure risk (0-1)
    
    Accepts JSON with project features and returns risk probability between 0 and 1.
    """
    try:
        logger.info(f"Received prediction request: {input_data.dict()}")
        
        # Convert Pydantic model to dict for prediction
        features = input_data.dict()
        
        # Get prediction from ML model
        prediction_result = predict_risk(features)
        
        logger.info(f"Prediction completed: {prediction_result}")
        return prediction_result
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model/info")
async def model_info():
    """Get information about the loaded model"""
    try:
        from app.ml_model import get_model_info
        return get_model_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting model info: {str(e)}")