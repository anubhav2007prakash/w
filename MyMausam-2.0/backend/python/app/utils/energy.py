def kwh_to_co2_kg(kwh: float, emission_factor: float = 0.82) -> float:
    """Convert electricity kWh to saved kg CO2 equivalent based on Indian thermal grid average."""
    return round(kwh * emission_factor, 2)
