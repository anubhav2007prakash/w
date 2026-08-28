export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
  TIMEOUT_MS: 10000,
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    WEATHER: {
      CURRENT: "/weather/current",
      HOURLY: "/weather/hourly",
      FORECAST: "/weather/forecast",
      ALERTS: "/weather/alerts",
    },
    LOCATIONS: {
      LIST: "/locations",
      SEARCH: "/locations/search",
      FAVOURITES: "/favourites",
    },
    MODULES: {
      RADAR: "/radar",
      RAIN_ALERT: "/rain-alert/timeline",
      CYCLONE: "/cyclone",
      LIGHTNING: "/lightning",
      AVIATION: "/aviation",
      AGROMET: "/agromet",
      ROUTE_NOWCAST: "/route-nowcast",
      SOLAR: "/solar",
      ENERGY: "/energy",
      CHATBOT: "/chatbot/query",
    },
    USER: {
      SETTINGS: "/settings",
      NOTIFICATIONS: "/notifications",
      CROWDSOURCE: "/crowdsource",
    },
  },
};
