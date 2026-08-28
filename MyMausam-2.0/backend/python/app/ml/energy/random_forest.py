def predict_energy_demand_rf(features: dict) -> float:
    temp = features.get("temperature", 28.0)
    hour = features.get("hour", 14)
    peak = 600.0 if (9 <= hour <= 18) else 0.0
    return round(3500.0 + (temp * 45.0) + peak, 1)
