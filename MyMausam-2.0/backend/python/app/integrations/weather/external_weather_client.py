from typing import Dict, Any

class ExternalWeatherClient:
    async def fetch_open_meteo(self, lat: float, lon: float) -> Dict[str, Any]:
        return {"latitude": lat, "longitude": lon, "status": "ok"}

external_weather_client = ExternalWeatherClient()
