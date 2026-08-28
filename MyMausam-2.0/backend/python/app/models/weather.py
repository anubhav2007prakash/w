from dataclasses import dataclass

@dataclass
class WeatherObservationModel:
    location: str
    temperature: float
    feels_like: float
    humidity: int
    wind_speed: float
    condition: str
    aqi: int
