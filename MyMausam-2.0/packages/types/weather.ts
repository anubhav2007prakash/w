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
