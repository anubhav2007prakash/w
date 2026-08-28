def calculate_pv_yield(ghi: float, area_m2: float, efficiency: float = 0.18, pr: float = 0.75) -> float:
    # Energy (kWh) = Area (m2) * Irradiance (kW/m2) * Panel Efficiency * Performance Ratio
    return round(area_m2 * (ghi / 1000.0) * efficiency * pr, 3)
