export interface AQIInfo {
  aqi: number;
  status: string;
  color: string;
  source: string;
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
}

export interface CurrentWeather {
  location: string;
  district: string;
  state: string;
  date_str: string;
  updated_at: string;
  temperature: number;
  feels_like: number;
  maximum: number;
  minimum: number;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  wind_direction_deg: number;
  condition: string;
  icon: string;
  aqi: AQIInfo;
  uv_index?: number;
  dew_point?: number;
  visibility_km?: number;
  pressure_hpa?: number;
  sunrise?: string;
  sunset?: string;
}

export interface HourlyForecastItem {
  id?: string;
  date_str: string;
  time_str: string;
  condition: string;
  icon: string;
  temperature: number;
  humidity: number;
  rain_probability?: number;
  wind_speed?: number;
  wind_direction?: string;
}

export interface DailyForecastItem {
  date_str: string;
  date_short: string;
  day_name: string;
  condition: string;
  icon: string;
  min_temp: number;
  max_temp: number;
  humidity?: number;
  rain_probability?: number;
  wind_speed?: number;
  wind_direction?: string;
  pressure?: number;
  sunrise?: string;
  sunset?: string;
  hourly_breakdown?: HourlyForecastItem[];
}

export interface WeatherAlert {
  id: number;
  location_name: string;
  alert_type: string;
  severity: string;
  description: string;
  date_of_issue: string;
  valid_upto: string;
  status_text: string;
  color?: string;
}

export interface LocationItem {
  id: number;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  is_default?: boolean;
}

export interface FavouriteItem {
  id: number;
  location_name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  current_temp: number;
  min_temp: number;
  max_temp: number;
  condition: string;
  created_at?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  category: string;
  severity: string;
  area: string;
  timestamp: string;
  is_read: boolean;
}

export interface CrowdReportItem {
  id: number;
  location_name: string;
  condition: string;
  severity: string;
  description: string;
  image_url?: string | null;
  reporter_name: string;
  timestamp: string;
}

export interface UserSettings {
  language: string;
  temp_unit: string;
  wind_unit: string;
  rain_unit: string;
  push_notifications: boolean;
  auto_location: boolean;
}

export interface RadarPoint {
  lat: number;
  lon: number;
  intensity: number;
  level: string;
}

export interface RadarData {
  station: string;
  lat: number;
  lon: number;
  timestamp: string;
  range_km: number;
  reflectivity_points: RadarPoint[];
  active_warnings: string[];
}

export interface RainForecastPoint {
  step: number;
  time: string;
  lat: number;
  lon: number;
  intensity: string;
  color: string;
  radius: number;
}

export interface RainTimelineData {
  time_range: string;
  current_step: number;
  total_steps: number;
  intervals: string[];
  forecast_points: RainForecastPoint[];
  legend: { label: string; color: string }[];
}

export interface CycloneTrackPoint {
  time: string;
  lat: number;
  lon: number;
  intensity_knots: number;
  category: string;
  pressure_hpa: number;
}

export interface CycloneData {
  name: string;
  status: string;
  basin: string;
  current_lat: number;
  current_lon: number;
  max_wind_speed: string;
  estimated_landfall: string;
  warning_level: string;
  track: CycloneTrackPoint[];
  bulletin_text: string;
}

export interface LightningStrike {
  id: string;
  lat: number;
  lon: number;
  time: string;
  peak_current_ka: number;
  strike_type: string;
}

export interface LightningData {
  station_area: string;
  total_strikes_last_hour: number;
  risk_level: string;
  strikes: LightningStrike[];
  safety_advisory: string;
}

export interface AirportWeather {
  icao: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  temp: number;
  dew_point: number;
  visibility_m: number;
  wind_direction_deg: number;
  wind_speed_kt: number;
  flight_rules: string;
  qnh: number;
  metar: string;
  taf: string;
}

export interface AviationData {
  airports: AirportWeather[];
  fir: string;
  sigmet?: string;
}

export interface CropAdvisory {
  crop: string;
  stage: string;
  advisory: string;
}

export interface DistrictAgrometBulletin {
  district: string;
  state: string;
  bulletin_date: string;
  rainfall_forecast: string;
  temp_forecast: string;
  humidity_forecast: string;
  general_advisory: string;
  crop_advisories: CropAdvisory[];
}

export interface AgrometData {
  active_district: string;
  state: string;
  bulletins: DistrictAgrometBulletin[];
}

export interface RoutePointWeather {
  name: string;
  distance_km: number;
  lat: number;
  lon: number;
  temp: number;
  condition: string;
  rain_probability: number;
  warning?: string;
}

export interface RouteNowcastData {
  origin: string;
  destination: string;
  total_distance_km: number;
  estimated_time: string;
  route_condition_summary: string;
  waypoints: RoutePointWeather[];
}

export type PersonaType =
  | "health"
  | "runner"
  | "beach"
  | "traveler"
  | "parent"
  | "farmer"
  | "commuter"
  | "event_planner";

export interface PersonaInsight {
  id: string;
  persona: PersonaType;
  title: string;
  score: number;
  status: string;
  statusColor: string;
  description: string;
  advice: string[];
  iconName: string;
  metrics: { label: string; value: string; badge?: string; badgeColor?: string }[];
  tags?: string[];
  specialSection?: {
    type: "tides" | "running_hours" | "packing_list" | "destinations" | "gardening" | "commute" | "event_contingency" | "pollen_bar";
    data: any;
  };
}
