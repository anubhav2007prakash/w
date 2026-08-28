export const ALERT_SEVERITIES = {
  GREEN: { code: "green", label: "No Warning (Normal)", color: "#8ED329" },
  YELLOW: { code: "yellow", label: "Watch (Be Updated)", color: "#FFBE00" },
  ORANGE: { code: "orange", label: "Alert (Be Prepared)", color: "#FF7400" },
  RED: { code: "red", label: "Warning (Take Action)", color: "#FF2020" },
} as const;

export const ALERT_CATEGORIES = [
  "Thunderstorm with Squall",
  "Heavy Rainfall",
  "Heatwave Warning",
  "Coldwave & Frost",
  "Dense Fog Advisory",
  "Cyclone Alert",
  "Lightning Flash Alert",
  "Coastal & Marine Warning",
] as const;
