from typing import Dict, Any

def build_weather_context(weather: Dict[str, Any], persona: str) -> str:
    return (
        f"Location: {weather.get('location')}\n"
        f"Current Temp: {weather.get('temperature')}°C (Feels like: {weather.get('feels_like')}°C)\n"
        f"Condition: {weather.get('condition')}\n"
        f"AQI: {weather.get('aqi', {}).get('aqi')} ({weather.get('aqi', {}).get('status')})\n"
        f"User Persona: {persona}\n"
    )
