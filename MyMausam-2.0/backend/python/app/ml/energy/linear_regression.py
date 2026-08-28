def predict_energy_demand_lr(temp: float, humidity: float, is_weekend: bool) -> float:
    base = 3200.0
    temp_factor = max(0, (temp - 24.0) * 120.0)
    hum_factor = (humidity / 100.0) * 350.0
    weekend_factor = -400.0 if is_weekend else 0.0
    return round(base + temp_factor + hum_factor + weekend_factor, 1)
