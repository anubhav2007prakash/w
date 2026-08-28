def estimate_clearsky_ghi(zenith_deg: float) -> float:
    import math
    if zenith_deg >= 90:
        return 0.0
    return max(0.0, round(1050.0 * math.cos(math.radians(zenith_deg))**1.2, 1))
