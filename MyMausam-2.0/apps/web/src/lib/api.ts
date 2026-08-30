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

/**
 * Check if the backend is reachable. Cached for 30s to avoid hammering.
 */
let _backendReachable: boolean | null = null;
let _backendCheckTime = 0;
const BACKEND_CHECK_INTERVAL = 30_000;

async function isBackendReachable(): Promise<boolean> {
  const now = Date.now();
  if (_backendReachable !== null && now - _backendCheckTime < BACKEND_CHECK_INTERVAL) {
    return _backendReachable;
  }
  try {
    const res = await fetch(`${API_BASE.replace(/\/api$/, "")}/docs`, {
      method: "HEAD",
      signal: AbortSignal.timeout(3000),
    });
    _backendReachable = res.ok;
  } catch {
    _backendReachable = false;
  }
  _backendCheckTime = now;
  return _backendReachable;
}

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

/**
 * Try fetchJson, but fall back to mockData if the backend is unreachable.
 */
async function fetchWithFallback<T>(url: string, mockData: T, options?: RequestInit): Promise<T> {
  const reachable = await isBackendReachable();
  if (!reachable) return mockData;
  return fetchJson<T>(url, options);
}

// ── Mock / Fallback Data ─────────────────────────────
// Used when the backend is unreachable (e.g. on Vercel without NEXT_PUBLIC_API_URL set).

const now = new Date();
const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
const updatedAt = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

function mockCurrentWeather(location: string): CurrentWeather {
  return {
    location,
    district: location,
    state: "India",
    date_str: dateStr,
    updated_at: `${updatedAt} (Offline)`,
    temperature: 34.2,
    feels_like: 37.1,
    maximum: 35.8,
    minimum: 25.9,
    humidity: 38,
    wind_speed: 9.4,
    wind_direction: "NW",
    wind_direction_deg: 315,
    condition: "Partly Cloudy",
    icon: "cloud-sun",
    uv_index: 7.2,
    dew_point: 19.4,
    visibility_km: 6.0,
    pressure_hpa: 1004.2,
    sunrise: "05:54 AM",
    sunset: "06:51 PM",
    aqi: {
      aqi: 95,
      status: "Satisfactory",
      color: "#8ED329",
      source: "Estimated (Offline Mode)",
      pm25: 42,
      pm10: 88,
      no2: 24,
      co: 0.8,
      o3: 32,
    },
  };
}

const MOCK_DAILY_FORECAST: DailyForecastItem[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    date_str: d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }),
    date_short: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    day_name: d.toLocaleDateString("en-IN", { weekday: "short" }),
    condition: ["Partly Cloudy", "Sunny", "Light Rain", "Overcast", "Clear", "Hazy", "Thunderstorm"][i],
    icon: ["cloud-sun", "sun", "cloud-rain", "cloud", "sun", "cloud-fog", "cloud-lightning"][i],
    min_temp: 25 + Math.round(Math.random() * 3),
    max_temp: 33 + Math.round(Math.random() * 4),
    humidity: 35 + Math.round(Math.random() * 30),
    rain_probability: [10, 5, 60, 20, 5, 15, 70][i],
    wind_speed: 8 + Math.round(Math.random() * 10),
    wind_direction: "NW",
  };
});

const MOCK_HOURLY_FORECAST: HourlyForecastItem[] = Array.from({ length: 24 }, (_, i) => {
  const d = new Date();
  d.setHours(d.getHours() + i);
  return {
    date_str: d.toLocaleDateString("en-IN"),
    time_str: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    condition: i < 6 ? "Clear" : i < 12 ? "Partly Cloudy" : i < 18 ? "Sunny" : "Clear",
    icon: i < 6 ? "moon" : i < 12 ? "cloud-sun" : i < 18 ? "sun" : "moon",
    temperature: 26 + Math.round(8 * Math.sin(((i - 6) * Math.PI) / 12)),
    humidity: 50 - Math.round(15 * Math.sin(((i - 6) * Math.PI) / 12)),
    rain_probability: Math.max(0, 30 - Math.abs(i - 14) * 4),
    wind_speed: 6 + Math.round(Math.random() * 8),
    wind_direction: "NW",
  };
});

const MOCK_ALERTS: WeatherAlert[] = [];

const MOCK_LOCATIONS: LocationItem[] = [
  { id: 1, name: "Delhi", district: "New Delhi", state: "Delhi", latitude: 28.6139, longitude: 77.209 },
  { id: 2, name: "Mumbai", district: "Mumbai", state: "Maharashtra", latitude: 19.076, longitude: 72.8777 },
  { id: 3, name: "Ghaziabad", district: "Ghaziabad", state: "Uttar Pradesh", latitude: 28.6692, longitude: 77.4538 },
  { id: 4, name: "Bangalore", district: "Bengaluru Urban", state: "Karnataka", latitude: 12.9716, longitude: 77.5946 },
  { id: 5, name: "Chennai", district: "Chennai", state: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707 },
  { id: 6, name: "Kolkata", district: "Kolkata", state: "West Bengal", latitude: 22.5726, longitude: 88.3639 },
  { id: 7, name: "Hyderabad", district: "Hyderabad", state: "Telangana", latitude: 17.385, longitude: 78.4867 },
  { id: 8, name: "Jaipur", district: "Jaipur", state: "Rajasthan", latitude: 26.9124, longitude: 75.7873 },
  { id: 9, name: "Pune", district: "Pune", state: "Maharashtra", latitude: 18.5204, longitude: 73.8567 },
  { id: 10, name: "Lucknow", district: "Lucknow", state: "Uttar Pradesh", latitude: 26.8467, longitude: 80.9462 },
];

function mockAirQuality(location: string): AirQualityStation[] {
  return [
    {
      city: location,
      aqi: 95,
      aqi_category: "Satisfactory",
      aqi_color: "#8ED329",
      pm25: 42,
      pm10: 88,
      no2: 24,
      so2: 8,
      co: 0.8,
      o3: 32,
      primary_pollutant: "PM10",
      health_advisory: "Air quality is satisfactory. Enjoy outdoor activities.",
      source: "Estimated (Offline Mode)",
      last_updated: updatedAt,
    },
  ];
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [];
const MOCK_RADAR: RadarData = {
  station: "Delhi",
  lat: 28.58,
  lon: 77.33,
  timestamp: updatedAt,
  range_km: 250,
  reflectivity_points: [],
  active_warnings: [],
};
const MOCK_RAIN_TIMELINE: RainTimelineData = {
  time_range: "0h – 6h",
  current_step: 0,
  total_steps: 6,
  intervals: ["Now", "+1h", "+2h", "+3h", "+4h", "+5h", "+6h"],
  forecast_points: [],
  legend: [
    { label: "No Rain", color: "#8ED329" },
    { label: "Light", color: "#FFBE00" },
    { label: "Moderate", color: "#FF7400" },
    { label: "Heavy", color: "#FF2020" },
  ],
};
const MOCK_SETTINGS: UserSettings = {
  language: "en",
  temp_unit: "C",
  wind_unit: "kmh",
  rain_unit: "mm",
  push_notifications: true,
  auto_location: true,
};

export const WeatherAPI = {
  getCurrentWeather: async (location?: string) => {
    const loc = location || "Delhi";
    try {
      return await fetchJson<CurrentWeather>(
        `${API_BASE}/weather/current?location=${encodeURIComponent(loc)}`
      );
    } catch {
      return mockCurrentWeather(loc);
    }
  },

  getHourlyForecast: async (location?: string) => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return MOCK_HOURLY_FORECAST;
      return await fetchJson<HourlyForecastItem[]>(
        `${API_BASE}/weather/hourly${location ? `?location=${encodeURIComponent(location)}` : ""}`
      );
    } catch {
      return MOCK_HOURLY_FORECAST;
    }
  },

  getDailyForecast: async (location?: string) => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return MOCK_DAILY_FORECAST;
      return await fetchJson<DailyForecastItem[]>(
        `${API_BASE}/weather/forecast${location ? `?location=${encodeURIComponent(location)}` : ""}`
      );
    } catch {
      return MOCK_DAILY_FORECAST;
    }
  },

  getAlerts: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return MOCK_ALERTS;
      return await fetchJson<WeatherAlert[]>(`${API_BASE}/weather/alerts`);
    } catch {
      return MOCK_ALERTS;
    }
  },

  getLocations: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return MOCK_LOCATIONS;
      return await fetchJson<LocationItem[]>(`${API_BASE}/locations`);
    } catch {
      return MOCK_LOCATIONS;
    }
  },

  searchLocations: async (query: string) => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) {
        const q = query.toLowerCase();
        return MOCK_LOCATIONS.filter(
          (l) => l.name.toLowerCase().includes(q) || l.district.toLowerCase().includes(q)
        );
      }
      return await fetchJson<LocationItem[]>(
        `${API_BASE}/locations/search?q=${encodeURIComponent(query)}`
      );
    } catch {
      const q = query.toLowerCase();
      return MOCK_LOCATIONS.filter(
        (l) => l.name.toLowerCase().includes(q) || l.district.toLowerCase().includes(q)
      );
    }
  },

  getFavourites: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return [] as FavouriteItem[];
      return await fetchJson<FavouriteItem[]>(`${API_BASE}/favourites`);
    } catch {
      return [] as FavouriteItem[];
    }
  },

  addFavourite: (data: Omit<FavouriteItem, "id">) =>
    fetchJson<FavouriteItem>(`${API_BASE}/favourites`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  removeFavourite: (id: number) =>
    fetchJson<{ message: string }>(`${API_BASE}/favourites/${id}`, {
      method: "DELETE",
    }),

  getNotifications: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return MOCK_NOTIFICATIONS;
      return await fetchJson<NotificationItem[]>(`${API_BASE}/notifications`);
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  },

  markNotificationRead: (id: number) =>
    fetchJson<NotificationItem>(`${API_BASE}/notifications/${id}/read`, {
      method: "PATCH",
    }),

  getCrowdReports: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return [] as CrowdReportItem[];
      return await fetchJson<CrowdReportItem[]>(`${API_BASE}/crowdsource`);
    } catch {
      return [] as CrowdReportItem[];
    }
  },

  submitCrowdReport: (data: Omit<CrowdReportItem, "id" | "timestamp">) =>
    fetchJson<CrowdReportItem>(`${API_BASE}/crowdsource`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getRadarData: async (station?: string) => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return MOCK_RADAR;
      return await fetchJson<RadarData>(`${API_BASE}/radar${station ? `?station=${encodeURIComponent(station)}` : ""}`);
    } catch {
      return MOCK_RADAR;
    }
  },

  getRainTimeline: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return MOCK_RAIN_TIMELINE;
      return await fetchJson<RainTimelineData>(`${API_BASE}/rain-alert/timeline`);
    } catch {
      return MOCK_RAIN_TIMELINE;
    }
  },

  getCycloneData: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return null as unknown as CycloneData;
      return await fetchJson<CycloneData>(`${API_BASE}/cyclone`);
    } catch {
      return null as unknown as CycloneData;
    }
  },

  getLightningData: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return null as unknown as LightningData;
      return await fetchJson<LightningData>(`${API_BASE}/lightning`);
    } catch {
      return null as unknown as LightningData;
    }
  },

  getAviationData: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return null as unknown as AviationData;
      return await fetchJson<AviationData>(`${API_BASE}/aviation`);
    } catch {
      return null as unknown as AviationData;
    }
  },

  getAgrometData: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return null as unknown as AgrometData;
      return await fetchJson<AgrometData>(`${API_BASE}/agromet`);
    } catch {
      return null as unknown as AgrometData;
    }
  },

  getRouteNowcast: async (origin?: string, dest?: string) => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return null as unknown as RouteNowcastData;
      return await fetchJson<RouteNowcastData>(
        `${API_BASE}/route-nowcast?origin=${encodeURIComponent(origin || "Delhi")}&destination=${encodeURIComponent(dest || "Jaipur")}`
      );
    } catch {
      return null as unknown as RouteNowcastData;
    }
  },

  getSettings: async () => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return MOCK_SETTINGS;
      return await fetchJson<UserSettings>(`${API_BASE}/settings`);
    } catch {
      return MOCK_SETTINGS;
    }
  },

  updateSettings: (data: Partial<UserSettings>) =>
    fetchJson<UserSettings>(`${API_BASE}/settings`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // ── Heat/Cold Wave ────────────────────────────────
  getHeatColdWaveAlerts: async (location?: string) => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return [] as HeatColdWaveAlert[];
      return await fetchJson<HeatColdWaveAlert[]>(
        `${API_BASE}/heatwave${location ? `?location=${encodeURIComponent(location)}` : ""}`
      );
    } catch {
      return [] as HeatColdWaveAlert[];
    }
  },

  // ── Urban Flood ───────────────────────────────────
  getFloodRisk: async (location?: string) => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return [] as FloodRiskPoint[];
      return await fetchJson<FloodRiskPoint[]>(
        `${API_BASE}/flood-nowcast${location ? `?location=${encodeURIComponent(location)}` : ""}`
      );
    } catch {
      return [] as FloodRiskPoint[];
    }
  },

  // ── Seasonal Outlook ──────────────────────────────
  getSeasonalOutlook: async (region?: string) => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return [] as SeasonalOutlook[];
      return await fetchJson<SeasonalOutlook[]>(
        `${API_BASE}/seasonal-outlook${region ? `?region=${encodeURIComponent(region)}` : ""}`
      );
    } catch {
      return [] as SeasonalOutlook[];
    }
  },

  // ── Monsoon Tracker ───────────────────────────────
  getMonsoonData: async (region?: string) => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return null as unknown as MonsoonData;
      return await fetchJson<MonsoonData>(
        `${API_BASE}/monsoon-tracker${region ? `?region=${encodeURIComponent(region)}` : ""}`
      );
    } catch {
      return null as unknown as MonsoonData;
    }
  },

  // ── Mountain Weather ──────────────────────────────
  getMountainWeather: async (station?: string) => {
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return [] as MountainStation[];
      return await fetchJson<MountainStation[]>(
        `${API_BASE}/mountain-weather${station ? `?station=${encodeURIComponent(station)}` : ""}`
      );
    } catch {
      return [] as MountainStation[];
    }
  },

  // ── Air Quality (SAFAR) ───────────────────────────
  getAirQuality: async (location?: string) => {
    const loc = location || "Delhi";
    try {
      const reachable = await isBackendReachable();
      if (!reachable) return mockAirQuality(loc);
      return await fetchJson<AirQualityStation[]>(
        `${API_BASE}/air-quality?location=${encodeURIComponent(loc)}`
      );
    } catch {
      return mockAirQuality(loc);
    }
  },
};
