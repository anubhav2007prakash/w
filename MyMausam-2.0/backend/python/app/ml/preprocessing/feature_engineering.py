import math

def compute_cyclical_time_features(hour: int) -> tuple[float, float]:
    sin_hour = math.sin(2 * math.pi * hour / 24.0)
    cos_hour = math.cos(2 * math.pi * hour / 24.0)
    return round(sin_hour, 4), round(cos_hour, 4)
