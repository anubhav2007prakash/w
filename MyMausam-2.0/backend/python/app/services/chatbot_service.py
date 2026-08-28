from typing import Dict, Any
from app.services.weather_service import get_current_weather

def process_weather_query(query: str, location: str = "Ghaziabad", language: str = "English", persona: str = "health") -> Dict[str, Any]:
    weather = get_current_weather(location)
    temp = weather["temperature"]
    cond = weather["condition"]
    aqi = weather["aqi"]["aqi"]
    aqi_status = weather["aqi"]["status"]

    q_lower = query.lower()
    if "rain" in q_lower or "umbrella" in q_lower:
        answer = f"In {location}, current condition is {cond} with 28°C. Rain probability is low right now, but check the Rain Alert timeline before heading out."
        voice = f"In {location}, rain is not expected in the immediate hour."
        action = [{"title": "View Rain Timeline", "route": "/rain-alert"}]
    elif "aqi" in q_lower or "air" in q_lower or "pollution" in q_lower:
        answer = f"The Air Quality Index (AQI) in {location} is currently {aqi} ({aqi_status}). PM2.5 is at {weather['aqi'].get('pm25', 58.2)} µg/m³."
        voice = f"The air quality in {location} is {aqi_status} with an AQI of {aqi}."
        action = [{"title": "Health & Allergy Index", "route": "/health-index"}]
    elif "radar" in q_lower or "storm" in q_lower:
        answer = f"Doppler Radar is active. Nearest radar station reports light to moderate precipitation cells 45km away."
        voice = f"Radar indicates light convective activity in your regional sector."
        action = [{"title": "Interactive Radar", "route": "/radar"}]
    elif "solar" in q_lower or "sun" in q_lower or "power" in q_lower:
        answer = f"Today is {cond} with high sunlight irradiance. Peak generation window is 10:30 AM to 03:00 PM."
        voice = f"Today is great for solar generation in {location}."
        action = [{"title": "Solar Estimator", "route": "/solar-estimator"}]
    else:
        answer = f"Current weather in {location} is {cond} at {temp}°C (feels like {weather['feels_like']}°C). Wind is {weather['wind_speed']} km/h from {weather['wind_direction']}."
        voice = f"In {location}, it is {cond} and {temp} degrees Celsius."
        action = [{"title": "Full Forecast", "route": "/forecast"}]

    return {
        "answer": answer,
        "voice_summary": voice,
        "action_links": action,
        "context_used": {
            "location": location,
            "temperature": temp,
            "condition": cond,
        }
    }
