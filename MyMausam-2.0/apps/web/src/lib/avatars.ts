export interface AvatarPreset {
  id: string;
  name: string;
  category: "weather" | "persona" | "citizen" | "official";
  emoji: string;
  bgGradient: string;
  description: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "farmer_sun",
    name: "Kisan Mitra",
    category: "persona",
    emoji: "🌾",
    bgGradient: "from-emerald-600 to-green-400",
    description: "Farmer, Agromet & Soil advisory",
  },
  {
    id: "health_guard",
    name: "Health Guard",
    category: "persona",
    emoji: "🩺",
    bgGradient: "from-rose-500 to-pink-400",
    description: "Air Quality, AQI & UV wellness",
  },
  {
    id: "meteorologist",
    name: "IMD Scientist",
    category: "official",
    emoji: "🔬",
    bgGradient: "from-blue-700 to-cyan-500",
    description: "Meteorology & Radar specialist",
  },
  {
    id: "aviation_pilot",
    name: "Aviation Captain",
    category: "official",
    emoji: "✈️",
    bgGradient: "from-sky-600 to-indigo-500",
    description: "Airport METAR/TAF flight weather",
  },
  {
    id: "runner_athlete",
    name: "Marathoner",
    category: "persona",
    emoji: "🏃",
    bgGradient: "from-amber-500 to-yellow-300",
    description: "Fitness, Wind & Thermal comfort",
  },
  {
    id: "cyclone_hunter",
    name: "Cyclone Hunter",
    category: "weather",
    emoji: "🌀",
    bgGradient: "from-indigo-700 to-blue-500",
    description: "Tropical cyclone tracking & storm surge",
  },
  {
    id: "mausam_mascot",
    name: "Mausam Mitra",
    category: "weather",
    emoji: "🌦️",
    bgGradient: "from-cyan-600 to-blue-400",
    description: "Official IMD Copilot mascot",
  },
  {
    id: "solar_sun",
    name: "Solar Champion",
    category: "persona",
    emoji: "☀️",
    bgGradient: "from-amber-500 to-orange-400",
    description: "Rooftop solar yield & green energy",
  },
  {
    id: "lightning_ranger",
    name: "Storm Ranger",
    category: "weather",
    emoji: "⚡",
    bgGradient: "from-purple-600 to-yellow-400",
    description: "Damini lightning nowcasting",
  },
  {
    id: "ocean_sailor",
    name: "Marine Sailor",
    category: "persona",
    emoji: "🌊",
    bgGradient: "from-teal-600 to-cyan-400",
    description: "INCOIS coastal ocean & tides",
  },
  {
    id: "eco_citizen",
    name: "Eco Citizen",
    category: "citizen",
    emoji: "🌿",
    bgGradient: "from-emerald-600 to-lime-400",
    description: "Citizen cloud reporting & Mission LiFE",
  },
  {
    id: "himalayan_trekker",
    name: "Mountain Trekker",
    category: "persona",
    emoji: "🏔️",
    bgGradient: "from-slate-600 to-blue-400",
    description: "Himalayan pass snow & visibility",
  },
  {
    id: "family_forecaster",
    name: "Family Parent",
    category: "citizen",
    emoji: "👨‍👩‍👧",
    bgGradient: "from-violet-600 to-fuchsia-400",
    description: "School commute & weekend family weather",
  },
  {
    id: "commuter_metro",
    name: "Daily Commuter",
    category: "persona",
    emoji: "🚆",
    bgGradient: "from-blue-600 to-slate-400",
    description: "Highway rain alerts & fog radar",
  },
];

export const getAvatarById = (id?: string): AvatarPreset | undefined => {
  if (!id) return undefined;
  return AVATAR_PRESETS.find((p) => p.id === id);
};
