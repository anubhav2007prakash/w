from typing import List, Optional
from pydantic import BaseModel

class SolarEstimateRequestSchema(BaseModel):
    rooftop_area_sqft: float
    location: Optional[str] = "Delhi"
    panel_efficiency: Optional[float] = 0.18
    tilt_angle_deg: Optional[float] = 28.0

class SolarHourlyIrradianceSchema(BaseModel):
    time: str
    dni_w_m2: float
    ghi_w_m2: float
    generation_kwh: float

class SolarEstimateResponseSchema(BaseModel):
    location: str
    daily_generation_kwh: float
    monthly_savings_inr: float
    co2_offset_kg_year: float
    sunlight_hours: float
    peak_sun_window: str
    hourly_irradiance: List[SolarHourlyIrradianceSchema]
