from typing import Dict, Any, List

def detect_temperature_anomaly(current_temp: float, historical_mean: float, std_dev: float = 3.2) -> Dict[str, Any]:
    z_score = (current_temp - historical_mean) / std_dev
    is_anomaly = abs(z_score) > 2.0
    return {
        "z_score": round(z_score, 2),
        "is_anomaly": is_anomaly,
        "type": "Heat Spike" if z_score > 2.0 else ("Cold Drop" if z_score < -2.0 else "Normal"),
    }
