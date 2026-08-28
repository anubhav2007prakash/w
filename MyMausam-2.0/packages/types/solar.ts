export interface SolarEstimateRequest {
  rooftop_area_sqft: number;
  location: string;
  panel_efficiency?: number;
  tilt_angle_deg?: number;
}

export interface SolarHourlyIrradiance {
  time: string;
  dni_w_m2: number;
  ghi_w_m2: number;
  generation_kwh: number;
}

export interface SolarEstimateResponse {
  location: string;
  daily_generation_kwh: number;
  monthly_savings_inr: number;
  co2_offset_kg_year: number;
  sunlight_hours: number;
  peak_sun_window: string;
  hourly_irradiance: SolarHourlyIrradiance[];
}
