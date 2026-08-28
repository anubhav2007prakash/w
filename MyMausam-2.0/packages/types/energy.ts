export interface EnergyGridStatus {
  grid_demand_mw: number;
  solar_generation_mw: number;
  renewable_percentage: number;
  carbon_intensity_gco2_kwh: number;
  optimal_consumption_window: string;
}

export interface ApplianceRecommendation {
  appliance: string;
  recommended_time: string;
  energy_savings_kwh: number;
  co2_reduced_kg: number;
  reason: string;
}

export interface EnergyOptimizationData {
  status: EnergyGridStatus;
  recommendations: ApplianceRecommendation[];
  hourly_demand_forecast: { hour: string; demand_index: number }[];
}
