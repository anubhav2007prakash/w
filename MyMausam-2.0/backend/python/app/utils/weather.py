def celsius_to_fahrenheit(c: float) -> float:
    return round((c * 9/5) + 32, 1)

def fahrenheit_to_celsius(f: float) -> float:
    return round((f - 32) * 5/9, 1)

def aqi_to_color_and_status(aqi: int) -> tuple[str, str]:
    if aqi <= 50:
        return "#8ED329", "Good"
    elif aqi <= 100:
        return "#A3D900", "Satisfactory"
    elif aqi <= 200:
        return "#FFBE00", "Moderate"
    elif aqi <= 300:
        return "#FF7400", "Poor"
    elif aqi <= 400:
        return "#FF2020", "Very Poor"
    else:
        return "#7E0023", "Severe"
