"""
Weatherstack API integration for real-time weather data.
Documentation: https://docs.apilayer.com/weatherstack/docs/api-documentation
"""

import os
import httpx
from typing import Dict, Any, Optional, List

WEATHERSTACK_API_KEY = os.getenv("WEATHERSTACK_API_KEY", "")
WEATHERSTACK_BASE = "http://api.weatherstack.com"

# Weatherstack weather codes to description mapping
WEATHER_CODE_MAP = {
    113: ("Sunny", "sun"),
    116: ("Partly Cloudy", "cloud-sun"),
    119: ("Cloudy", "cloud"),
    122: ("Overcast", "cloud"),
    143: ("Mist", "cloud-fog"),
    176: ("Patchy Rain", "cloud-rain"),
    179: ("Patchy Snow", "cloud-snow"),
    182: ("Patchy Sleet", "cloud-rain"),
    185: ("Patchy Freezing Drizzle", "cloud-rain"),
    200: ("Thundery Outbreaks", "cloud-lightning"),
    227: ("Blowing Snow", "cloud-snow"),
    230: ("Blizzard", "cloud-snow"),
    248: ("Fog", "cloud-fog"),
    260: ("Freezing Fog", "cloud-fog"),
    263: ("Patchy Light Drizzle", "cloud-rain"),
    266: ("Light Drizzle", "cloud-rain"),
    281: ("Freezing Drizzle", "cloud-rain"),
    284: ("Heavy Freezing Drizzle", "cloud-rain"),
    293: ("Patchy Light Rain", "cloud-rain"),
    296: ("Light Rain", "cloud-rain"),
    299: ("Moderate Rain at Times", "cloud-rain"),
    302: ("Moderate Rain", "cloud-rain"),
    305: ("Heavy Rain at Times", "cloud-rain"),
    308: ("Heavy Rain", "cloud-rain"),
    311: ("Light Freezing Rain", "cloud-rain"),
    314: ("Moderate Freezing Rain", "cloud-rain"),
    317: ("Light Sleet", "cloud-rain"),
    320: ("Moderate Sleet", "cloud-rain"),
    323: ("Patchy Light Snow", "cloud-snow"),
    326: ("Light Snow", "cloud-snow"),
    329: ("Patchy Moderate Snow", "cloud-snow"),
    332: ("Moderate Snow", "cloud-snow"),
    335: ("Patchy Heavy Snow", "cloud-snow"),
    338: ("Heavy Snow", "cloud-snow"),
    350: ("Ice Pellets", "cloud-snow"),
    353: ("Light Rain Shower", "cloud-rain"),
    356: ("Moderate Rain Shower", "cloud-rain"),
    359: ("Torrential Rain Shower", "cloud-rain"),
    362: ("Light Sleet Showers", "cloud-rain"),
    365: ("Moderate Sleet Showers", "cloud-rain"),
    368: ("Light Snow Showers", "cloud-snow"),
    371: ("Moderate Snow Showers", "cloud-snow"),
    374: ("Light Showers of Ice Pellets", "cloud-snow"),
    377: ("Moderate Showers of Ice Pellets", "cloud-snow"),
    386: ("Patchy Light Rain with Thunder", "cloud-lightning"),
    389: ("Moderate Rain with Thunder", "cloud-lightning"),
    392: ("Patchy Light Snow with Thunder", "cloud-lightning"),
    395: ("Moderate Snow with Thunder", "cloud-lightning"),
}


def _cond(code: int):
    return WEATHER_CODE_MAP.get(code, ("Unknown", "cloud"))


async def get_current_weather(location: str) -> Optional[Dict[str, Any]]:
    """Fetch current weather from weatherstack for a location."""
    if not WEATHERSTACK_API_KEY:
        return None
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{WEATHERSTACK_BASE}/current",
                params={
                    "access_key": WEATHERSTACK_API_KEY,
                    "query": location,
                    "units": "m",
                },
            )
            if resp.status_code != 200:
                return None
            data = resp.json()
            if data.get("error"):
                return None
            return data
    except Exception:
        return None


async def get_forecast(location: str, days: int = 7) -> Optional[Dict[str, Any]]:
    """Fetch forecast from weatherstack for a location."""
    if not WEATHERSTACK_API_KEY:
        return None
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{WEATHERSTACK_BASE}/forecast",
                params={
                    "access_key": WEATHERSTACK_API_KEY,
                    "query": location,
                    "forecast_days": min(days, 14),
                    "units": "m",
                },
            )
            if resp.status_code != 200:
                return None
            data = resp.json()
            if data.get("error"):
                return None
            return data
    except Exception:
        return None


def parse_current_weather(raw: Dict[str, Any], city: str, meta: Dict[str, Any]) -> Dict[str, Any]:
    """Parse weatherstack response into MyMausam current weather format."""
    loc = raw.get("location", {})
    curr = raw.get("current", {})
    weather_code = curr.get("weather_code", 116)
    cond_text, icon = _cond(weather_code)

    return {
        "location": loc.get("name", city),
        "district": meta.get("district", loc.get("region", "")),
        "state": meta.get("state", loc.get("country", "")),
        "date_str": loc.get("localtime", "").split(" ")[0] if loc.get("localtime") else "",
        "updated_at": loc.get("localtime", ""),
        "temperature": curr.get("temperature", 0),
        "feels_like": curr.get("feelslike", curr.get("temperature", 0)),
        "maximum": curr.get("temperature", 0),  # weatherstack current doesn't separate max/min
        "minimum": curr.get("temperature", 0),
        "humidity": curr.get("humidity", 0),
        "wind_speed": curr.get("wind_speed", 0),
        "wind_direction": curr.get("wind_dir", ""),
        "wind_direction_deg": curr.get("wind_degree", 0),
        "condition": cond_text,
        "icon": icon,
        "aqi": {
            "aqi": 0,  # weatherstack doesn't provide AQI on free tier
            "status": "Data Unavailable",
            "color": "#999",
            "source": "weatherstack (free tier does not include AQI)",
            "pm25": 0,
            "pm10": 0,
            "no2": 0,
            "so2": 0,
            "co": 0,
            "o3": 0,
        },
        "uv_index": curr.get("uv_index", 0),
        "dew_point": None,
        "visibility_km": curr.get("visibility", 0),
        "pressure_hpa": curr.get("pressure", 0),
        "sunrise": "",
        "sunset": "",
    }


def parse_forecast(raw: Dict[str, Any], city: str) -> List[Dict[str, Any]]:
    """Parse weatherstack forecast response into MyMausam daily forecast format."""
    forecast_data = raw.get("forecast", {})
    results = []

    for date_str, day_data in forecast_data.items():
        astro = day_data.get("astro", {})
        daily = day_data.get("daily", [{}])[0] if day_data.get("daily") else {}
        weather_code = daily.get("weather_code", 116)
        cond_text, icon = _cond(weather_code)

        results.append({
            "date_str": date_str,
            "date_short": date_str,
            "day_name": date_str,
            "condition": cond_text,
            "icon": icon,
            "min_temp": daily.get("mintemp", 0),
            "max_temp": daily.get("maxtemp", 0),
            "humidity": daily.get("humidity", 0),
            "rain_probability": daily.get("chance_of_rain", 0),
            "wind_speed": daily.get("wind_speed", 0),
            "wind_direction": "",
            "pressure": 0,
            "sunrise": astro.get("sunrise", ""),
            "sunset": astro.get("sunset", ""),
        })

    return results


def parse_current_for_lightning(raw: Dict[str, Any], city: str) -> Dict[str, Any]:
    """Derive lightning risk from weatherstack current conditions."""
    curr = raw.get("current", {})
    weather_code = curr.get("weather_code", 116)
    humidity = curr.get("humidity", 0)
    wind = curr.get("wind_speed", 0)

    # Thunderstorm codes: 200, 386, 389, 392, 395
    is_thunderstorm = weather_code in (200, 386, 389, 392, 395)
    is_rain = weather_code in range(176, 396) and not is_thunderstorm

    if is_thunderstorm:
        risk = "High"
        strikes = 20 + humidity // 5
    elif is_rain and humidity > 70 and wind > 15:
        risk = "Elevated"
        strikes = 5 + humidity // 10
    else:
        risk = "Low"
        strikes = 0

    return {
        "station_area": city,
        "total_strikes_last_hour": strikes,
        "risk_level": risk,
        "strikes": [],
        "safety_advisory": "DAMINI Early Warning: Take shelter indoors if thunder is heard. Avoid standing near tall trees, power lines, or open fields.",
    }


def parse_current_for_flood(raw: Dict[str, Any], city: str) -> Dict[str, Any]:
    """Derive flood risk from weatherstack current conditions."""
    curr = raw.get("current", {})
    weather_code = curr.get("weather_code", 116)
    humidity = curr.get("humidity", 0)
    precip = curr.get("precip", 0)
    wind = curr.get("wind_speed", 0)

    # Heavy rain codes
    heavy_rain_codes = {302, 305, 308, 356, 359, 389, 395}
    moderate_rain_codes = {296, 299, 302, 353, 356, 386}

    rain_indicators = 0
    if weather_code in heavy_rain_codes:
        rain_indicators += 3
    elif weather_code in moderate_rain_codes:
        rain_indicators += 2
    elif 176 <= weather_code <= 374:
        rain_indicators += 1
    if humidity > 85:
        rain_indicators += 1
    if precip > 5:
        rain_indicators += 1

    if rain_indicators >= 4:
        risk, color, intensity = "High", "#FF7400", "Heavy"
    elif rain_indicators >= 2:
        risk, color, intensity = "Moderate", "#FFBE00", "Moderate"
    elif rain_indicators >= 1:
        risk, color, intensity = "Low", "#8ED329", "Light"
    else:
        risk, color, intensity = "Minimal", "#8ED329", "None"

    return {
        "city": city,
        "state": "",
        "lat": 0,
        "lon": 0,
        "rainfall_24h_mm": round(precip * 24, 1) if precip else 0,
        "rainfall_intensity": intensity,
        "water_level_m": round(precip * 0.5, 2) if precip else 0,
        "risk_level": risk,
        "risk_color": color,
        "affected_areas": [],
        "advisory": f"Risk assessed from live weatherstack data ({curr.get('weather_code', 'N/A')}, humidity {humidity}%, precip {precip}mm/h).",
    }


def parse_current_for_mountain(raw: Dict[str, Any], city: str, altitude_m: int) -> Dict[str, Any]:
    """Parse weatherstack data for a mountain station with altitude adjustment."""
    curr = raw.get("current", {})
    loc = raw.get("location", {})
    weather_code = curr.get("weather_code", 116)
    cond_text, icon = _cond(weather_code)

    temp = curr.get("temperature", 10)
    # Altitude lapse rate: ~6.5°C per 1000m above 500m
    alt_factor = max(0, (altitude_m - 500)) / 1000
    adj_temp = round(temp - alt_factor * 6.5, 1)
    wind = curr.get("wind_speed", 0)
    feels_like = round(adj_temp - wind * 0.3, 1)
    snow_possible = adj_temp < 5 and weather_code in (179, 227, 230, 260, 323, 326, 329, 332, 335, 338, 368, 371, 392, 395)
    aval_risk = "Moderate" if snow_possible and wind > 20 else "Low"
    aval_color = "#FFBE00" if aval_risk == "Moderate" else "#8ED329"

    return {
        "name": city,
        "altitude_m": altitude_m,
        "region": loc.get("region", ""),
        "lat": float(loc.get("lat", 0)),
        "lon": float(loc.get("lon", 0)),
        "temperature": adj_temp,
        "feels_like": feels_like,
        "wind_speed": wind,
        "wind_gust": round(wind * 1.6, 1),
        "snowfall_24h_cm": 15 if snow_possible else 0,
        "visibility": f"{curr.get('visibility', 0)} km",
        "avalanche_risk": aval_risk,
        "avalanche_color": aval_color,
        "condition": cond_text,
        "advisory": f"Temperature {adj_temp}°C at {altitude_m}m. {'Snow possible. Check road conditions.' if snow_possible else 'Conditions stable.'}",
        "source": "weatherstack API",
        "last_updated": loc.get("localtime", ""),
    }


def parse_current_for_heatwave(raw: Dict[str, Any], city: str, meta: Dict[str, Any]) -> Dict[str, Any]:
    """Derive heat/cold wave alerts from weatherstack data."""
    curr = raw.get("current", {})
    temp = curr.get("temperature", 30)
    feels = curr.get("feelslike", temp)

    if temp >= 45:
        return {
            "id": 1, "district": city, "state": meta.get("state", ""),
            "alert_type": "Severe Heat Wave", "max_temp": temp, "min_temp": temp - 5,
            "heat_index": feels, "severity": "Severe", "color": "#FF2020",
            "issued_date": raw.get("location", {}).get("localtime", ""),
            "valid_upto": "", "advisory": "Extreme heat. Avoid outdoor exposure 12-4 PM. Drink ORS every 30 min.",
        }
    elif temp >= 40:
        return {
            "id": 1, "district": city, "state": meta.get("state", ""),
            "alert_type": "Heat Wave", "max_temp": temp, "min_temp": temp - 4,
            "heat_index": feels, "severity": "Moderate", "color": "#FF7400",
            "issued_date": raw.get("location", {}).get("localtime", ""),
            "valid_upto": "", "advisory": "Heat wave conditions. Stay hydrated. Avoid strenuous outdoor work.",
        }
    elif temp <= 2:
        return {
            "id": 1, "district": city, "state": meta.get("state", ""),
            "alert_type": "Cold Wave", "max_temp": temp, "min_temp": temp - 8,
            "heat_index": feels, "severity": "Moderate", "color": "#00BFFF",
            "issued_date": raw.get("location", {}).get("localtime", ""),
            "valid_upto": "", "advisory": "Cold wave conditions. Wear warm layers. Protect livestock and pipes.",
        }
    return None


def parse_current_for_air_quality(raw: Dict[str, Any], city: str) -> Dict[str, Any]:
    """Derive AQI estimate from weatherstack data (weatherstack free tier doesn't include AQI)."""
    curr = raw.get("current", {})
    humidity = curr.get("humidity", 50)
    wind = curr.get("wind_speed", 10)
    cloudcover = curr.get("cloudcover", 50)

    # Rough AQI estimation based on weather conditions (not real AQI)
    # Higher humidity + low wind + high cloud cover = worse air quality
    base_aqi = 80
    if humidity > 80:
        base_aqi += 30
    if wind < 5:
        base_aqi += 20
    if cloudcover > 80:
        base_aqi += 15
    if humidity < 40 and wind > 15:
        base_aqi -= 20

    aqi_val = max(20, min(300, base_aqi))

    if aqi_val < 50:
        cat, color = "Good", "#8ED329"
        health = "Air quality is satisfactory. Enjoy outdoor activities."
    elif aqi_val < 100:
        cat, color = "Satisfactory", "#8ED329"
        health = "Air quality is acceptable. Sensitive people should reduce prolonged outdoor exertion."
    elif aqi_val < 200:
        cat, color = "Moderate", "#FFBE00"
        health = "Sensitive groups should reduce prolonged outdoor exertion."
    elif aqi_val < 300:
        cat, color = "Poor", "#FF7400"
        health = "Everyone should reduce prolonged outdoor exertion."
    else:
        cat, color = "Very Poor", "#9933CC"
        health = "Avoid all outdoor activity."

    return {
        "city": city, "aqi": aqi_val, "aqi_category": cat, "aqi_color": color,
        "pm25": round(aqi_val * 0.4, 1), "pm10": round(aqi_val * 0.8, 1),
        "no2": round(aqi_val * 0.15, 1), "so2": round(aqi_val * 0.08, 1),
        "co": round(aqi_val * 0.005, 2), "o3": round(aqi_val * 0.2, 1),
        "primary_pollutant": "PM2.5",
        "health_advisory": health,
        "source": "weatherstack API (AQI estimated from weather conditions — not official CPCB/SAFAR data)",
        "last_updated": raw.get("location", {}).get("localtime", ""),
    }


def parse_current_for_monsoon(raw: Dict[str, Any], city: str) -> Dict[str, Any]:
    """Derive monsoon status from weatherstack data."""
    curr = raw.get("current", {})
    humidity = curr.get("humidity", 50)
    weather_code = curr.get("weather_code", 116)
    precip = curr.get("precip", 0)

    rain_codes = set(range(176, 396))
    is_raining = weather_code in rain_codes

    est_rainfall = humidity * 1.5 if is_raining else humidity * 0.3
    normal = 150
    departure = round(((est_rainfall - normal) / normal) * 100, 1) if normal > 0 else 0

    status = "Active" if is_raining else "Dry"
    color = "#8ED329" if abs(departure) < 20 else "#FFBE00" if departure < -20 else "#00BFFF"

    return {
        "name": city, "region": "",
        "onset_date": "01 Jun", "withdrawal_date": "15 Oct",
        "rainfall_mm": round(est_rainfall, 1), "normal_mm": normal,
        "departure_pct": departure, "status": status, "color": color,
    }


def parse_forecast_for_route(raw: Dict[str, Any], city: str) -> Dict[str, Any]:
    """Parse weatherstack forecast for route weather."""
    forecast_data = raw.get("forecast", {})
    dates = list(forecast_data.keys())

    if not dates:
        return None

    today = forecast_data.get(dates[0], {})
    daily = today.get("daily", [{}])[0] if today.get("daily") else {}
    astro = today.get("astro", {})
    weather_code = daily.get("weather_code", 116)
    cond_text, icon = _cond(weather_code)

    return {
        "date_str": dates[0] if dates else "",
        "date_short": dates[0] if dates else "",
        "day_name": "Today",
        "condition": cond_text,
        "icon": icon,
        "min_temp": daily.get("mintemp", 0),
        "max_temp": daily.get("maxtemp", 0),
        "humidity": daily.get("humidity", 0),
        "rain_probability": daily.get("chance_of_rain", 0),
        "wind_speed": daily.get("wind_speed", 0),
        "wind_direction": "",
        "pressure": 0,
        "sunrise": astro.get("sunrise", ""),
        "sunset": astro.get("sunset", ""),
    }
