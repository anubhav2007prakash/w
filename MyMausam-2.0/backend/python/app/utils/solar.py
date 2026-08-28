def calculate_tilt_factor(latitude: float, tilt_deg: float) -> float:
    diff = abs(latitude - tilt_deg)
    return max(0.85, 1.0 - (diff * 0.005))
