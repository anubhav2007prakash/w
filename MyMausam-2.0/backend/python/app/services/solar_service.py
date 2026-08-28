from typing import Dict, Any

def estimate_rooftop_solar(area_sqft: float, location: str = "Delhi", efficiency: float = 0.18, tilt: float = 28.0) -> Dict[str, Any]:
    # 100 sqft approx 1 kWp system generating ~4.2 kWh/day in North/Central India
    system_kw = (area_sqft / 100.0)
    daily_kwh = round(system_kw * 4.25, 2)
    monthly_savings = round(daily_kwh * 30 * 7.5, 2)  # Average 7.5 INR per unit grid tariff
    co2_offset = round(daily_kwh * 365 * 0.82, 2)     # ~0.82 kg CO2 per kWh thermal displacement

    hourly = [
        {"time": "06:00 AM", "dni_w_m2": 45.0, "ghi_w_m2": 80.0, "generation_kwh": round(daily_kwh * 0.02, 2)},
        {"time": "08:00 AM", "dni_w_m2": 320.0, "ghi_w_m2": 290.0, "generation_kwh": round(daily_kwh * 0.10, 2)},
        {"time": "10:00 AM", "dni_w_m2": 680.0, "ghi_w_m2": 580.0, "generation_kwh": round(daily_kwh * 0.22, 2)},
        {"time": "12:00 PM", "dni_w_m2": 890.0, "ghi_w_m2": 760.0, "generation_kwh": round(daily_kwh * 0.30, 2)},
        {"time": "02:00 PM", "dni_w_m2": 740.0, "ghi_w_m2": 620.0, "generation_kwh": round(daily_kwh * 0.22, 2)},
        {"time": "04:00 PM", "dni_w_m2": 380.0, "ghi_w_m2": 310.0, "generation_kwh": round(daily_kwh * 0.11, 2)},
        {"time": "06:00 PM", "dni_w_m2": 60.0, "ghi_w_m2": 70.0, "generation_kwh": round(daily_kwh * 0.03, 2)},
    ]

    return {
        "location": location,
        "daily_generation_kwh": daily_kwh,
        "monthly_savings_inr": monthly_savings,
        "co2_offset_kg_year": co2_offset,
        "sunlight_hours": 8.5,
        "peak_sun_window": "10:30 AM – 03:00 PM",
        "hourly_irradiance": hourly
    }
