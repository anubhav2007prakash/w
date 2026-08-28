import os
from typing import Dict, Any

class IMDClient:
    def __init__(self):
        self.api_key = os.getenv("IMD_API_KEY")
        self.base_url = "https://mausam.imd.gov.in/api"

    async def fetch_station_observation(self, station_id: str) -> Dict[str, Any]:
        return {"station_id": station_id, "status": "active", "source": "IMD Real-time Telemetry"}

imd_client = IMDClient()
