from typing import Dict, Any

class MapMyIndiaClient:
    async def geocode_query(self, query: str) -> Dict[str, Any]:
        return {"query": query, "status": "ok"}

mapmyindia_client = MapMyIndiaClient()
