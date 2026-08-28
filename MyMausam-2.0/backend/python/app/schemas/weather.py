from typing import Optional, List
from pydantic import BaseModel

class AQISchema(BaseModel):
    aqi: int
    status: str
    color: str
    source: str
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    so2: Optional[float] = None
    co: Optional[float] = None
    o3: Optional[float] = None

class CurrentWeatherSchema(BaseModel):
    location: str
    district: str
    state: str
    date_str: str
    updated_at: str
    temperature: float
    feels_like: float
    maximum: float
    minimum: float
    humidity: int
    wind_speed: float
    wind_direction: str
    wind_direction_deg: int
    condition: str
    icon: str
    aqi: AQISchema
    uv_index: Optional[float] = None
    dew_point: Optional[float] = None
    visibility_km: Optional[float] = None
    pressure_hpa: Optional[float] = None
    sunrise: Optional[str] = None
    sunset: Optional[str] = None
