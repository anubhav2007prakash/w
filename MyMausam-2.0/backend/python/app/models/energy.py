from dataclasses import dataclass

@dataclass
class EnergyGridModel:
    grid_demand_mw: float
    solar_generation_mw: float
    renewable_percentage: float
    carbon_intensity: float
    optimal_window: str
