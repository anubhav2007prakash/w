def clean_telemetry_series(data: list[float]) -> list[float]:
    # Remove negative out-of-range physical readings
    return [max(0.0, val) for val in data]
