from typing import List, Dict, Any

PERSONA_WEIGHTS = {
    "health": {"aqi": 0.4, "uv": 0.3, "pollen": 0.2, "temp": 0.1},
    "runner": {"temp": 0.4, "wind": 0.25, "aqi": 0.2, "rain": 0.15},
    "farmer": {"rain": 0.4, "soil": 0.3, "dew": 0.2, "temp": 0.1},
    "commuter": {"visibility": 0.4, "rain": 0.3, "fog": 0.2, "wind": 0.1},
    "traveler": {"rain": 0.35, "temp": 0.3, "flight": 0.25, "uv": 0.1},
    "parent": {"alerts": 0.4, "uv": 0.3, "aqi": 0.2, "temp": 0.1},
    "beach": {"waves": 0.4, "tides": 0.3, "wind": 0.2, "temp": 0.1},
    "event_planner": {"rain": 0.45, "wind": 0.3, "temp": 0.15, "humidity": 0.1},
}

def calculate_persona_score(persona: str, metrics: Dict[str, float]) -> int:
    weights = PERSONA_WEIGHTS.get(persona, PERSONA_WEIGHTS["health"])
    score = 85.0
    if persona == "health" and metrics.get("aqi", 100) > 150:
        score -= 25
    if persona == "runner" and metrics.get("temp", 28) > 35:
        score -= 20
    return max(30, min(100, int(score)))
