from dataclasses import dataclass

@dataclass
class SolarEstimateModel:
    location: str
    rooftop_area_sqft: float
    daily_generation_kwh: float
    monthly_savings_inr: float
    co2_offset_kg: float
