"""AccuWeather API integration service.

Fetches real-time weather data from AccuWeather's Core Weather API.
Requires ACCUWEATHER_API_KEY environment variable.

Free tier: 500 calls/day, 14-day trial.
"""
import os
import json
import urllib.request
import urllib.error
import sqlite3
from typing import Optional

BASE_URL = "https://dataservice.accuweather.com"
API_KEY = os.environ.get("ACCUWEATHER_API_KEY", "")

# Pre-mapped location keys for major Indian cities
# Source: AccuWeather Locations API
CITY_KEYS = {
    "delhi": "187745",
    "new delhi": "187745",
    "mumbai": "204842",
    "bombay": "204842",
    "kolkata": "202396",
    "calcutta": "202396",
    "chennai": "204531",
    "madras": "204531",
    "bangalore": "202061",
    "bengaluru": "202061",
    "hyderabad": "202190",
    "ahmedabad": "191663",
    "pune": "204108",
    "jaipur": "194682",
    "lucknow": "193781",
    "ghaziabad": "193780",
    "noida": "193780",
    "faridabad": "192985",
    "meerut": "193683",
    "shimla": "194585",
    "goa": "202397",
    "patna": "194483",
    "bhopal": "192488",
    "indore": "192823",
    "nagpur": "194363",
    "varanasi": "195481",
    "agra": "191667",
    "chandigarh": "192325",
    "dehradun": "192600",
    "ranchi": "195297",
    "guwahati": "192789",
    "amritsar": "191783",
    "jodhpur": "192983",
    "udaipur": "195523",
    "coimbatore": "193888",
    "madurai": "193337",
    "visakhapatnam": "195534",
    "vijayawada": "195527",
    "surat": "195355",
    "rajkot": "195105",
    "kanpur": "193022",
    "prayagraj": "195049",
    "jabalpur": "192895",
    "gwalior": "192783",
    "thiruvananthapuram": "195445",
    "kochi": "193011",
    "mangalore": "193361",
    "mysore": "194412",
    "hubli": "192806",
    "belgaum": "192447",
}


def _api_get(path: str, params: Optional[dict] = None) -> Optional[dict]:
    """Make an authenticated GET request to AccuWeather API."""
    if not API_KEY:
        return None

    url = f"{BASE_URL}{path}"
    if params:
        url += "?" + "&".join(f"{k}={v}" for k, v in params.items())

    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {API_KEY}")
    req.add_header("Accept", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            return json.loads(resp.read().decode())
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as e:
        print(f"[AccuWeather] API error: {e}")
        return None


def get_location_key(city: str) -> Optional[str]:
    """Get AccuWeather location key for a city name."""
    city_lower = city.lower().strip()
    if city_lower in CITY_KEYS:
        return CITY_KEYS[city_lower]

    # Try AccuWeather search API
    result = _api_get("/locations/v1/cities/search", {"q": city, "language": "en-us"})
    if result and len(result) > 0:
        return result[0].get("Key")
    return None


def get_current_conditions(city: str) -> Optional[dict]:
    """Fetch current weather conditions from AccuWeather."""
    key = get_location_key(city)
    if not key:
        return None

    data = _api_get(f"/currentconditions/v1/{key}", {"details": "true", "language": "en-us"})
    if not data or len(data) == 0:
        return None

    c = data[0]
    temp = c.get("Temperature", {})
    realfeel = c.get("RealFeelTemperature", {})
    wind = c.get("Wind", {})
    wind_gust = wind.get("Gust", {}).get("Speed", {})
    wind_dir = wind.get("Direction", {})
    humidity = c.get("RelativeHumidity", 0)
    uv = c.get("UVIndex", 0)
    uv_text = c.get("UVIndexText", "")
    visibility = c.get("Visibility", {}).get("Value", 10)
    pressure = c.get("Pressure", {}).get("Value", 1013)
    dew = c.get("DewPoint", {})
    feels = realfeel.get("Metric", {}).get("Value", temp.get("Metric", {}).get("Value", 0))

    # Map AccuWeather icon to condition
    icon = c.get("WeatherIcon", 1)
    weather_text = c.get("WeatherText", "Unknown")
    has_precip = c.get("HasPrecipitation", False)
    precip_type = c.get("PrecipitationType")

    condition = weather_text
    condition_icon = _map_icon(icon, has_precip)

    # Build response matching CurrentWeather type
    return {
        "location": city.title(),
        "district": city.title(),
        "state": "India",
        "date_str": c.get("LocalObservationDateTime", "")[:10] if c.get("LocalObservationDateTime") else "",
        "updated_at": c.get("LocalObservationDateTime", "")[11:16] if c.get("LocalObservationDateTime") else "",
        "temperature": temp.get("Metric", {}).get("Value", 0),
        "feels_like": feels,
        "maximum": temp.get("Metric", {}).get("Value", 0),
        "minimum": temp.get("Metric", {}).get("Value", 0),
        "humidity": humidity,
        "wind_speed": wind.get("Speed", {}).get("Metric", {}).get("Value", 0),
        "wind_direction": wind_dir.get("English", "N"),
        "wind_direction_deg": wind_dir.get("Degrees", 0),
        "condition": condition,
        "icon": condition_icon,
        "uv_index": uv,
        "dew_point": dew.get("Metric", {}).get("Value", 0),
        "visibility_km": visibility / 1000 if visibility else 10,
        "pressure_hpa": pressure,
        "sunrise": "",
        "sunset": "",
        "aqi": {
            "aqi": 50,
            "status": "Good",
            "color": "#8ED329",
            "source": "AccuWeather",
            "pm25": 0,
            "pm10": 0,
            "no2": 0,
            "co": 0,
            "o3": 0,
        },
        "source": "AccuWeather",
    }


def get_5day_forecast(city: str) -> Optional[list]:
    """Fetch 5-day daily forecast from AccuWeather."""
    key = get_location_key(city)
    if not key:
        return None

    data = _api_get(f"/forecasts/v1/daily/5day/{key}", {"details": "true", "language": "en-us"})
    if not data:
        return None

    daily = data.get("DailyForecasts", [])
    results = []
    for d in daily:
        temp = d.get("Temperature", {})
        day = d.get("Day", {})
        night = d.get("Night", {})
        results.append({
            "date": d.get("Date", "")[:10],
            "max_temp": temp.get("Maximum", {}).get("Value", 0),
            "min_temp": temp.get("Minimum", {}).get("Value", 0),
            "condition": day.get("IconPhrase", "Unknown"),
            "icon": _map_icon(day.get("Icon", 1), day.get("HasPrecipitation", False)),
            "precipitation_probability": day.get("PrecipitationProbability", 0),
            "wind_speed": day.get("Wind", {}).get("Speed", {}).get("Value", 0),
        })

    # Get sunrise/sunset from first day
    if daily:
        sun = daily[0].get("Sun", {})
        sunrise = sun.get("Rise", "")[11:16] if sun.get("Rise") else ""
        sunset = sun.get("Set", "")[11:16] if sun.get("Set") else ""
        return {"forecasts": results, "sunrise": sunrise, "sunset": sunset}

    return results


def get_alerts(city: str) -> Optional[list]:
    """Fetch weather alerts from AccuWeather (requires Prime tier)."""
    key = get_location_key(city)
    if not key:
        return None

    data = _api_get(f"/alerts/v1/1day/{key}", {"language": "en-us"})
    if not data:
        return None

    alerts = []
    for a in data:
        alerts.append({
            "title": a.get("Headline", ""),
            "description": a.get("Description", ""),
            "severity": a.get("Severity", 4),
            "category": a.get("Category", ""),
        })
    return alerts


def _map_icon(icon_code: int, has_precip: bool) -> str:
    """Map AccuWeather icon code to a weather condition string."""
    icon_map = {
        1: "clear", 2: "mostly_clear", 3: "partly_cloudy", 4: "partly_cloudy",
        5: "hazy", 6: "mostly_cloudy", 7: "cloudy", 8: "overcast",
        11: "fog", 12: "showers", 13: "mostly_cloudy_showers",
        14: "partly_cloudy_showers", 15: "thunderstorm", 16: "mostly_cloudy_thunderstorm",
        17: "partly_cloudy_thunderstorm", 18: "rain", 19: "flurries",
        20: "mostly_cloudy_flurries", 21: "partly_cloudy_flurries", 22: "snow",
        23: "mostly_cloudy_snow", 24: "ice", 25: "sleet", 26: "freezing_rain",
        29: "rain_and_snow", 30: "hot", 31: "cold", 32: "windy",
    }
    text = icon_map.get(icon_code, "cloudy")
    if has_precip and "cloud" in text:
        text = "rain"
    return text
