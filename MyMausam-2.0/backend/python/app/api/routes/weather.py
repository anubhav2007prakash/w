from fastapi import APIRouter, Query
from typing import Optional
from app.services.weather_service import get_current_weather, get_hourly_forecast, get_daily_forecast

router = APIRouter(prefix="/weather", tags=["weather"])

@router.get("/current")
def current_weather(location: Optional[str] = Query("Ghaziabad")):
    return get_current_weather(location or "Ghaziabad")

@router.get("/hourly")
def hourly_weather(location: Optional[str] = Query("Ghaziabad")):
    return get_hourly_forecast(location or "Ghaziabad")

@router.get("/forecast")
def forecast_weather(location: Optional[str] = Query("Ghaziabad")):
    return get_daily_forecast(location or "Ghaziabad")
