from typing import Dict, Any

def map_imd_alert_severity(imd_code: str) -> str:
    mapping = {
        "GREEN": "green",
        "YELLOW": "yellow",
        "ORANGE": "orange",
        "RED": "red",
    }
    return mapping.get(imd_code.upper(), "green")
