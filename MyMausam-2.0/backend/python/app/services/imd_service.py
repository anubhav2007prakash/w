"""
IMD (India Meteorological Department) API Integration Service.

Fetches real-time weather data from https://mausam.imd.gov.in
Requires an API key from https://api.imd.gov.in/public/register.php

Set IMD_API_KEY environment variable or configure in .env
"""

import os
import json
import datetime
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, List

# IMD API base URL
IMD_API_BASE = "https://api.imd.gov.in/api/v1"

# Get API key from environment
IMD_API_KEY = os.environ.get("IMD_API_KEY", "")

# City ID mapping for IMD API
IMD_CITY_IDS = {
    "Delhi": 42182,
    "Mumbai": 43003,
    "Kolkata": 44001,
    "Chennai": 43279,
    "Bengaluru": 43295,
    "Hyderabad": 42369,
    "Ahmedabad": 42557,
    "Pune": 43138,
    "Jaipur": 42395,
    "Lucknow": 42367,
    "Ghaziabad": 42182,  # Same as Delhi
    "Noida": 42182,
    "Shimla": 42027,
}

# Weather code to description mapping
WEATHER_CODE_MAP = {
    1: ("Mainly Clear", "sun"),
    2: ("Partly Cloudy", "cloud-sun"),
    3: ("Overcast", "cloud"),
    4: ("Haze", "cloud"),
    5: ("Fog", "cloud-fog"),
    6: ("Mist", "cloud-fog"),
    10: ("Mist", "cloud-fog"),
    13: ("Lightning", "cloud-lightning"),
    17: ("Thunderstorm", "cloud-lightning"),
    20: ("Drizzle", "cloud-rain"),
    21: ("Rain", "cloud-rain"),
    25: ("Rain Showers", "cloud-rain"),
    27: ("Hail", "cloud-lightning"),
    29: ("Thunderstorm", "cloud-lightning"),
    50: ("Light Drizzle", "cloud-rain"),
    51: ("Moderate Drizzle", "cloud-rain"),
    55: ("Heavy Drizzle", "cloud-rain"),
    60: ("Light Rain", "cloud-rain"),
    61: ("Moderate Rain", "cloud-rain"),
    65: ("Heavy Rain", "cloud-rain"),
    80: ("Light Showers", "cloud-rain"),
    81: ("Moderate Showers", "cloud-rain"),
    82: ("Heavy Showers", "cloud-rain"),
    95: ("Thunderstorm", "cloud-lightning"),
    96: ("Thunderstorm with Hail", "cloud-lightning"),
    99: ("Severe Thunderstorm", "cloud-lightning"),
}


def _make_request(url: str) -> Optional[Dict]:
    """Make HTTP request to IMD API."""
    if not IMD_API_KEY:
        return None

    headers = {
        "apikey": IMD_API_KEY,
        "User-Agent": "MyMausamApp/2.0",
    }

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"IMD API error: {e}")
        return None


def get_imd_city_weather(city_name: str) -> Optional[Dict[str, Any]]:
    """
    Fetch current weather from IMD API for a city.

    Returns None if API is unavailable or city not found.
    """
    city_id = IMD_CITY_IDS.get(city_name)
    if not city_id:
        return None

    url = f"{IMD_API_BASE}/current_wx?id={city_id}"
    data = _make_request(url)

    if not data or "data" not in data:
        return None

    records = data.get("data", [])
    if not records:
        return None

    record = records[0] if isinstance(records, list) else records

    # Parse weather code
    weather_code = int(record.get("weatherCode", 0))
    condition, icon = WEATHER_CODE_MAP.get(weather_code, ("Unknown", "cloud"))

    # Parse wind direction
    wind_dir = int(record.get("windDir", 0))
    direction_names = {
        0: "Calm", 20: "NNE", 50: "NE", 70: "ENE", 90: "E",
        110: "ESE", 140: "SE", 160: "SSE", 180: "S", 200: "SSW",
        230: "SW", 250: "WSW", 270: "W", 290: "WNW", 320: "NW",
        340: "NNW", 360: "N",
    }
    wind_direction = direction_names.get(wind_dir, "Unknown")

    return {
        "source": "IMD",
        "station": record.get("station", city_name),
        "date": record.get("dateOfObs", ""),
        "time": record.get("timeOfObs", ""),
        "temperature": float(record.get("temperature", 0)),
        "humidity": float(record.get("humidity", 0)),
        "wind_speed": float(record.get("windSpeed", 0)),
        "wind_direction": wind_direction,
        "wind_direction_deg": wind_dir,
        "pressure": float(record.get("mslp", 1013)),
        "rainfall_24h": float(record.get("rf24", 0)),
        "condition": condition,
        "icon": icon,
        "weather_code": weather_code,
        "visibility": "Good" if weather_code < 20 else "Reduced",
    }


def get_imd_city_forecast(city_name: str) -> Optional[List[Dict[str, Any]]]:
    """
    Fetch 7-day weather forecast from IMD API.

    Returns None if API is unavailable.
    """
    city_id = IMD_CITY_IDS.get(city_name)
    if not city_id:
        return None

    url = f"{IMD_API_BASE}/cityforecast?id={city_id}"
    data = _make_request(url)

    if not data or "data" not in data:
        return None

    records = data.get("data", [])
    if not records:
        return None

    record = records[0] if isinstance(records, list) else records
    forecasts = []

    now = datetime.datetime.now()

    for day in range(7):
        day_offset = now + datetime.timedelta(days=day)

        if day == 0:
            max_temp = record.get("Today_Max_temp")
            min_temp = record.get("Today_Min_temp")
            forecast_text = record.get("Todays_Forecast", "No data")
        else:
            max_temp = record.get(f"Day_{day}_Max_Temp")
            min_temp = record.get(f"Day_{day}_Min_temp")
            forecast_text = record.get(f"Day_{day}_Forecast", "No data")

        forecasts.append({
            "date": day_offset.strftime("%Y-%m-%d"),
            "day_name": day_offset.strftime("%A"),
            "max_temp": float(max_temp) if max_temp else None,
            "min_temp": float(min_temp) if min_temp else None,
            "forecast": forecast_text,
            "rainfall_24h": float(record.get("Past_24_hrs_Rainfall", 0)) if day == 0 else None,
        })

    return forecasts



