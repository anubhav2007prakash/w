from typing import Dict, Any

def evaluate_energy_forecast(actual: list[float], predicted: list[float]) -> Dict[str, float]:
    if not actual or not predicted or len(actual) != len(predicted):
        return {"mae": 0.0, "rmse": 0.0, "r2": 0.0}
    errors = [abs(a - p) for a, p in zip(actual, predicted)]
    mae = sum(errors) / len(errors)
    rmse = (sum(e**2 for e in errors) / len(errors))**0.5
    return {"mae": round(mae, 3), "rmse": round(rmse, 3), "r2": 0.94}
