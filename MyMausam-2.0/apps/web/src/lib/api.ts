import {
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  WeatherAlert,
  LocationItem,
  FavouriteItem,
  NotificationItem,
  CrowdReportItem,
  UserSettings,
  RadarData,
  RainTimelineData,
  CycloneData,
  LightningData,
  AviationData,
  AgrometData,
  RouteNowcastData,
  HeatColdWaveAlert,
  FloodRiskPoint,
  SeasonalOutlook,
  MonsoonData,
  MountainStation,
  AirQualityStation,
} from "@/types/weather";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000") + "/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const WeatherAPI = {
  getCurrentWeather: (location?: string) =>
    fetchJson<CurrentWeather>(
      `${API_BASE}/weather/current${location ? `?location=${encodeURIComponent(location)}` : ""}`
    ),

  getHourlyForecast: (location?: string) =>
    fetchJson<HourlyForecastItem[]>(
      `${API_BASE}/weather/hourly${location ? `?location=${encodeURIComponent(location)}` : ""}`
    ),

  getDailyForecast: (location?: string) =>
    fetchJson<DailyForecastItem[]>(
      `${API_BASE}/weather/forecast${location ? `?location=${encodeURIComponent(location)}` : ""}`
    ),

  getAlerts: () => fetchJson<WeatherAlert[]>(`${API_BASE}/weather/alerts`),

  getLocations: () => fetchJson<LocationItem[]>(`${API_BASE}/locations`),

  searchLocations: (query: string) =>
    fetchJson<LocationItem[]>(`${API_BASE}/locations/search?q=${encodeURIComponent(query)}`),

  getFavourites: () => fetchJson<FavouriteItem[]>(`${API_BASE}/favourites`),

  addFavourite: (data: Omit<FavouriteItem, "id">) =>
    fetchJson<FavouriteItem>(`${API_BASE}/favourites`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  removeFavourite: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE}/favourites/${id}`, {
      method: "DELETE",
    }),

  getNotifications: () => fetchJson<NotificationItem[]>(`${API_BASE}/notifications`),

  markNotificationRead: (id: number) =>
    fetchJson<NotificationItem>(`${API_BASE}/notifications/${id}/read`, {
      method: "PATCH",
    }),

  getCrowdReports: () => fetchJson<CrowdReportItem[]>(`${API_BASE}/crowdsource`),

  submitCrowdReport: (data: Omit<CrowdReportItem, "id" | "timestamp">) =>
    fetchJson<CrowdReportItem>(`${API_BASE}/crowdsource`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getRadarData: (station?: string) => fetchJson<RadarData>(`${API_BASE}/radar${station ? `?station=${encodeURIComponent(station)}` : ""}`),

  getRainTimeline: () => fetchJson<RainTimelineData>(`${API_BASE}/rain-alert/timeline`),

  getCycloneData: () => fetchJson<CycloneData>(`${API_BASE}/cyclone`),

  getLightningData: () => fetchJson<LightningData>(`${API_BASE}/lightning`),

  getAviationData: () => fetchJson<AviationData>(`${API_BASE}/aviation`),

  getAgrometData: () => fetchJson<AgrometData>(`${API_BASE}/agromet`),

  getRouteNowcast: (origin?: string, dest?: string) =>
    fetchJson<RouteNowcastData>(
      `${API_BASE}/route-nowcast?origin=${encodeURIComponent(origin || "Delhi")}&destination=${encodeURIComponent(
        dest || "Jaipur"
      )}`
    ),

  getSettings: () => fetchJson<UserSettings>(`${API_BASE}/settings`),

  updateSettings: (data: Partial<UserSettings>) =>
    fetchJson<UserSettings>(`${API_BASE}/settings`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // ── Heat/Cold Wave ────────────────────────────────
  getHeatColdWaveAlerts: (location?: string) =>
    fetchJson<HeatColdWaveAlert[]>(
      `${API_BASE}/heatwave${location ? `?location=${encodeURIComponent(location)}` : ""}`
    ),

  // ── Urban Flood ───────────────────────────────────
  getFloodRisk: (location?: string) =>
    fetchJson<FloodRiskPoint[]>(
      `${API_BASE}/flood-nowcast${location ? `?location=${encodeURIComponent(location)}` : ""}`
    ),

  // ── Seasonal Outlook ──────────────────────────────
  getSeasonalOutlook: (region?: string) =>
    fetchJson<SeasonalOutlook[]>(
      `${API_BASE}/seasonal-outlook${region ? `?region=${encodeURIComponent(region)}` : ""}`
    ),

  // ── Monsoon Tracker ───────────────────────────────
  getMonsoonData: (region?: string) =>
    fetchJson<MonsoonData>(
      `${API_BASE}/monsoon-tracker${region ? `?region=${encodeURIComponent(region)}` : ""}`
    ),

  // ── Mountain Weather ──────────────────────────────
  getMountainWeather: (station?: string) =>
    fetchJson<MountainStation[]>(
      `${API_BASE}/mountain-weather${station ? `?station=${encodeURIComponent(station)}` : ""}`
    ),

  // ── Air Quality (SAFAR) ───────────────────────────
  getAirQuality: (location?: string) =>
    fetchJson<AirQualityStation[]>(
      `${API_BASE}/air-quality${location ? `?location=${encodeURIComponent(location)}` : ""}`
    ),
};
