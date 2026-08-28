from typing import Dict, Any

def parse_metar_raw(metar_text: str) -> Dict[str, Any]:
    parts = metar_text.strip().split()
    return {
        "raw": metar_text,
        "icao": parts[0] if len(parts) > 0 else "VIDP",
        "timestamp_zulu": parts[1] if len(parts) > 1 else "",
    }
