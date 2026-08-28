from typing import Dict, Any

def get_energy_optimization_metrics() -> Dict[str, Any]:
    return {
        "grid_demand_mw": 4820.5,
        "solar_generation_mw": 1450.2,
        "renewable_percentage": 30.1,
        "carbon_intensity_gco2_kwh": 412.0,
        "optimal_consumption_window": "11:30 AM – 03:00 PM (Peak Solar Surplus)",
        "recommendations": [
            {
                "appliance": "Electric Vehicle Charging",
                "recommended_time": "12:00 PM – 02:30 PM",
                "energy_savings_kwh": 14.5,
                "co2_reduced_kg": 5.8,
                "reason": "Align with maximum regional solar PV generation curve."
            },
            {
                "appliance": "Heavy Laundry / Washing Machine",
                "recommended_time": "01:00 PM – 02:30 PM",
                "energy_savings_kwh": 2.2,
                "co2_reduced_kg": 0.9,
                "reason": "Off-peak grid carbon intensity window."
            },
            {
                "appliance": "Water Heating & Pump Operations",
                "recommended_time": "01:30 PM – 03:00 PM",
                "energy_savings_kwh": 3.8,
                "co2_reduced_kg": 1.5,
                "reason": "Optimal utilization of rooftop solar thermal yield."
            }
        ]
    }
