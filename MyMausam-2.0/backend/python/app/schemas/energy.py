from typing import List
from pydantic import BaseModel

class ApplianceRecommendationSchema(BaseModel):
    appliance: str
    recommended_time: str
    energy_savings_kwh: float
    co2_reduced_kg: float
    reason: str

class EnergyOptimizationResponse(BaseModel):
    grid_demand_mw: float
    solar_generation_mw: float
    renewable_percentage: float
    carbon_intensity_gco2_kwh: float
    optimal_consumption_window: str
    recommendations: List[ApplianceRecommendationSchema]
