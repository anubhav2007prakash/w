export const WIDGET_TYPES = [
  "weather_hero",
  "persona_engine",
  "aqi_card",
  "doppler_radar",
  "rain_timeline",
  "cyclone_tracker",
  "lightning_alert",
  "agromet_bulletin",
  "aviation_metar",
  "solar_estimator",
  "hourly_slider",
  "daily_forecast",
  "crowd_reports",
] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];
