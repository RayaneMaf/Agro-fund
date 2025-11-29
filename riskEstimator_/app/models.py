from pydantic import BaseModel, Field
from typing import Optional

class PredictionInput(BaseModel):
    """Input data structure for risk prediction"""
    
    wilaya: str = Field(..., description="wilaya name")
    zone: str = Field(..., description="Geographical zone")
    crop_type: str = Field(..., description="Type of crop")
    farm_size_ha: float = Field(..., description="Farm size in hectares")
    soil_quality: float = Field(..., description="Soil quality score (0-1)")
    soil_salinity: float = Field(..., description="Soil salinity level")
    altitude_m: float = Field(..., description="Altitude in meters")
    rainfall_mm: float = Field(..., description="Annual rainfall in mm")
    et0_mm: float = Field(..., description="Reference evapotranspiration")
    drought_index: float = Field(..., description="Drought risk index")
    experience_years: int = Field(..., description="Farmer's experience in years")
    irrigation_type: str = Field(..., description="Irrigation method")
    budget_needed: float = Field(..., description="Budget required for project")
    
    class Config:
        schema_extra = {
            "example": {
                "wilaya": "Alger",
                "zone": "Coastal",
                "crop_type": "tomato",
                "farm_size_ha": 3.5,
                "soil_quality": 0.78,
                "soil_salinity": 0.12,
                "altitude_m": 100,
                "rainfall_mm": 600,
                "et0_mm": 1100,
                "drought_index": 0.45,
                "experience_years": 5,
                "irrigation_type": "drip",
                "budget_needed": 2500
            }
        }

class PredictionOutput(BaseModel):
    """Output data structure - returns risk probability between 0 and 1"""
    
    risk_score: float = Field(..., ge=0, le=1, description="Risk probability between 0 and 1")
    input_features: dict = Field(..., description="Echo of input features for verification")
    
    class Config:
        schema_extra = {
            "example": {
                "risk_score": 0.23,
                "input_features": {
                    "wilaya": "Alger",
                    "zone": "Coastal",
                    "crop_type": "tomato",
                    "farm_size_ha": 3.5,
                    "soil_quality": 0.78,
                    "soil_salinity": 0.12,
                    "altitude_m": 100,
                    "rainfall_mm": 600,
                    "et0_mm": 1100,
                    "drought_index": 0.45,
                    "experience_years": 5,
                    "irrigation_type": "drip",
                    "budget_needed": 2500
                }
            }
        }