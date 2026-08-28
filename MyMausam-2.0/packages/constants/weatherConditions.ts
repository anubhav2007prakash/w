export const WEATHER_CONDITIONS = {
  SUNNY: { name: "Sunny", icon: "sun", bg: "from-amber-500 to-sky-600" },
  MOSTLY_SUNNY: { name: "Mostly Sunny", icon: "sun", bg: "from-amber-400 to-blue-600" },
  PARTLY_CLOUDY: { name: "Partly Cloudy", icon: "cloud-sun", bg: "from-blue-500 to-indigo-700" },
  CLOUDY: { name: "Cloudy", icon: "cloud", bg: "from-slate-500 to-slate-800" },
  LIGHT_RAIN: { name: "Light Rain", icon: "cloud-rain", bg: "from-sky-700 to-slate-900" },
  HEAVY_RAIN: { name: "Heavy Rain", icon: "cloud-rain", bg: "from-blue-800 to-slate-950" },
  THUNDERSTORM: { name: "Thunderstorm", icon: "cloud-lightning", bg: "from-purple-900 to-slate-950" },
  HAZY: { name: "Hazy Sunshine", icon: "sun", bg: "from-amber-600 to-slate-700" },
  FOG: { name: "Dense Fog", icon: "cloud", bg: "from-zinc-600 to-slate-800" },
} as const;
