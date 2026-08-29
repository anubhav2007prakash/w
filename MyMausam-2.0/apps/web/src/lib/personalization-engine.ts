/**
 * Personalization Engine — Persona-based dashboard recommendations.
 *
 * Uses existing weather data (CurrentWeather) + user persona to generate
 * ranked dashboard cards, Mausam Moment messages, and priority metrics.
 *
 * This module is a pure function layer — no side effects, no API calls.
 */

import { CurrentWeather } from "@/types/weather";

export type Persona =
  | "farmer"
  | "fitness"
  | "health"
  | "researcher"
  | "traveller"
  | "general";

export interface DashboardCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  priority: number; // higher = shown first
  icon?: string;
}

export interface MausamMoment {
  emoji: string;
  message: string;
  tag: string;
}

// ── Mausam Moment generator ──────────────────────────────────────

export function getMausamMoment(persona: Persona, w: CurrentWeather | null): MausamMoment {
  if (!w) {
    return { emoji: "🌤️", message: "Loading weather data…", tag: "general" };
  }

  const temp = w.temperature;
  const humidity = w.humidity;
  const rain = w.condition?.toLowerCase() || "";
  const wind = w.wind_speed;
  const uv = w.uv_index ?? 5;
  const aqi = w.aqi?.aqi ?? 100;
  const isRainy = rain.includes("rain") || rain.includes("drizzle") || rain.includes("shower");
  const isStormy = rain.includes("storm") || rain.includes("thunder");
  const isHot = temp > 38;
  const isCold = temp < 10;
  const isFoggy = rain.includes("fog") || rain.includes("mist") || (w.visibility_km ?? 10) < 2;
  const isHumid = humidity > 75;
  const isGoodAir = aqi < 100;

  const hour = new Date().getHours();
  const isMorning = hour >= 5 && hour < 12;
  const isAfternoon = hour >= 12 && hour < 17;

  switch (persona) {
    case "farmer": {
      if (isRainy && !isStormy) return { emoji: "🌧️", message: `Rain expected — plan irrigation around natural rainfall. Current humidity is ${humidity}%.`, tag: "agriculture" };
      if (isHot) return { emoji: "🌡️", message: `Heat stress risk at ${temp}°C. Water crops early morning or late evening to reduce evaporation.`, tag: "agriculture" };
      if (isStormy) return { emoji: "⛈️", message: "Storm activity detected — secure loose equipment and avoid fieldwork during lightning.", tag: "agriculture" };
      if (humidity > 80) return { emoji: "💧", message: `High humidity (${humidity}%) increases fungal disease risk. Monitor crops for leaf blight.`, tag: "agriculture" };
      return { emoji: "🌾", message: `Stable conditions at ${temp}°C — good window for spraying, sowing, or harvesting activities.`, tag: "agriculture" };
    }
    case "fitness": {
      if (isMorning && !isRainy && !isHot) return { emoji: "🏃", message: `Great morning for outdoor activity — ${temp}°C with ${wind} km/h wind. Head out now before it gets warmer.`, tag: "fitness" };
      if (isHot && isAfternoon) return { emoji: "🔥", message: `Avoid outdoor exercise until evening — ${temp}°C with UV ${uv}. Risk of heat exhaustion is elevated.`, tag: "fitness" };
      if (isRainy) return { emoji: "🌧️", message: `Rain likely — consider indoor training today. Wind is ${wind} km/h which adds chill in wet conditions.`, tag: "fitness" };
      return { emoji: "🏃", message: `Comfortable ${temp}°C for a run or walk. Wind ${wind} km/h ${w.wind_direction} — ${wind > 20 ? "sheltered routes recommended" : "good conditions"}.`, tag: "fitness" };
    }
    case "health": {
      if (!isGoodAir) return { emoji: "😷", message: `AQI at ${aqi} (${w.aqi?.status || "Poor"}) — limit prolonged outdoor exposure. Sensitive groups should stay indoors.`, tag: "health" };
      if (uv > 7) return { emoji: "☀️", message: `UV Index very high at ${uv} — apply SPF 30+ and wear protective clothing if outdoors 10 AM–4 PM.`, tag: "health" };
      if (isHot && humidity > 60) return { emoji: "💧", message: `Heat index elevated (${temp}°C, ${humidity}% humidity). Stay hydrated — drink water every 30 minutes.`, tag: "health" };
      if (isCold) return { emoji: "❄️", message: `Cold conditions at ${temp}°C — dress in layers. Watch for hypothermia symptoms in elderly family members.`, tag: "health" };
      return { emoji: "❤️", message: `Air quality is ${isGoodAir ? "good" : "moderate"} and UV is ${uv < 5 ? "safe" : "elevated"}. ${isMorning ? "Good time for outdoor activities." : "Stay mindful of conditions."}`, tag: "health" };
    }
    case "researcher": {
      return { emoji: "📊", message: `Atmospheric snapshot: ${temp}°C, ${humidity}% RH, ${w.pressure_hpa} hPa, wind ${wind} km/h ${w.wind_direction}, dew point ${w.dew_point}°C. ${isRainy ? "Precipitation active." : "Dry conditions."}`, tag: "research" };
    }
    case "traveller": {
      if (isFoggy) return { emoji: "🌫️", message: `Low visibility (${w.visibility_km} km) — delays possible at airports and highways. Check road conditions before departing.`, tag: "travel" };
      if (isRainy) return { emoji: "🌧️", message: `Rain expected — carry an umbrella and waterproof gear. ${wind > 20 ? "Strong winds may affect flights." : "Roads may be slippery."}`, tag: "travel" };
      if (isHot) return { emoji: "🧳", message: `Hot at ${temp}°C — carry water, sunscreen, and light clothing. Plan sightseeing for early morning or evening.`, tag: "travel" };
      return { emoji: "🧳", message: `Pleasant ${temp}°C for travel — ${w.condition}. Visibility ${w.visibility_km} km — good conditions for sightseeing.`, tag: "travel" };
    }
    case "general":
    default: {
      if (isStormy) return { emoji: "⛈️", message: `Thunderstorm alert — ${w.condition}. Stay indoors and avoid open areas.`, tag: "alerts" };
      if (isRainy) return { emoji: "🌧️", message: `Rainy at ${temp}°C — ${humidity}% humidity. ${isMorning ? "Carry an umbrella if heading out." : "Stay dry this evening."}`, tag: "general" };
      if (isHot) return { emoji: "🌡️", message: `Hot day at ${temp}°C — stay hydrated and avoid direct sun 12–3 PM.`, tag: "general" };
      if (isCold) return { emoji: "❄️", message: `Chilly at ${temp}°C — ${w.condition}. Layer up if heading out.`, tag: "general" };
      return { emoji: "🌤️", message: `${w.condition} at ${temp}°C — ${humidity}% humidity, wind ${wind} km/h. ${isMorning ? "Good morning!" : "Enjoy your day!"}`, tag: "general" };
    }
  }
}

// ── Dashboard card generator ──────────────────────────────────────

export function getPersonalizedDashboard(persona: Persona, w: CurrentWeather | null): DashboardCard[] {
  if (!w) return [];

  const cards: DashboardCard[] = [];

  // Universal cards (all personas)
  cards.push({
    id: "temp",
    title: "Temperature",
    value: `${w.temperature.toFixed(1)}°C`,
    subtitle: `Feels like ${w.feels_like.toFixed(1)}°C`,
    color: w.temperature > 38 ? "#ff2020" : w.temperature < 10 ? "#00DDE5" : "#FFBE00",
    priority: 90,
  });

  cards.push({
    id: "condition",
    title: "Condition",
    value: w.condition,
    subtitle: `${w.minimum.toFixed(0)}° / ${w.maximum.toFixed(0)}°`,
    color: "#00DDE5",
    priority: 85,
  });

  // Persona-specific cards
  switch (persona) {
    case "farmer":
      cards.push(
        { id: "humidity", title: "Humidity", value: `${w.humidity}%`, subtitle: w.humidity > 70 ? "High — fungal risk" : "Optimal for crops", color: "#00DDE5", priority: 80 },
        { id: "wind", title: "Wind", value: `${w.wind_speed} km/h`, subtitle: `${w.wind_direction} — ${w.wind_speed > 25 ? "Caution for spraying" : "Safe for spraying"}`, color: "#8ED329", priority: 75 },
        { id: "rain-prob", title: "Rain Outlook", value: w.condition.toLowerCase().includes("rain") ? "Active" : "Dry", subtitle: w.condition.toLowerCase().includes("rain") ? "Natural irrigation available" : "Irrigation needed", color: w.condition.toLowerCase().includes("rain") ? "#00DDE5" : "#FFBE00", priority: 78 },
        { id: "uv", title: "UV Index", value: (w.uv_index ?? 5).toFixed(1), subtitle: (w.uv_index ?? 5) > 8 ? "Heat stress risk" : "Moderate", color: "#FFBE00", priority: 55 },
        { id: "dew-point", title: "Dew Point", value: `${w.dew_point ?? 15}°C`, subtitle: (w.dew_point ?? 15) > 20 ? "High — disease risk" : "Low — healthy", color: "#00DDE5", priority: 60 },
      );
      break;

    case "fitness":
      cards.push(
        { id: "uv", title: "UV Index", value: (w.uv_index ?? 5).toFixed(1), subtitle: (w.uv_index ?? 5) > 7 ? "Wear SPF 30+" : (w.uv_index ?? 5) > 4 ? "Moderate" : "Safe", color: "#FFBE00", priority: 82 },
        { id: "wind", title: "Wind", value: `${w.wind_speed} km/h`, subtitle: `${w.wind_direction} — ${w.wind_speed > 20 ? "Resistance training" : "Easy pace"}`, color: "#8ED329", priority: 78 },
        { id: "humidity", title: "Humidity", value: `${w.humidity}%`, subtitle: w.humidity > 70 ? "High — hydrate often" : "Comfortable", color: "#00DDE5", priority: 76 },
        { id: "visibility", title: "Visibility", value: `${(w.visibility_km ?? 6).toFixed(1)} km`, subtitle: (w.visibility_km ?? 6) < 3 ? "Low — indoor preferred" : "Good for outdoor", color: "#8ED329", priority: 70 },
        { id: "heat-alert", title: "Heat Alert", value: w.temperature > 38 ? "Active" : "None", subtitle: w.temperature > 38 ? "Avoid midday exercise" : "Safe to train", color: w.temperature > 38 ? "#ff2020" : "#8ED329", priority: 75 },
      );
      break;

    case "health":
      cards.push(
        { id: "aqi", title: "AQI", value: `${w.aqi?.aqi ?? "—"}`, subtitle: w.aqi?.status || "Unknown", color: w.aqi?.color || "#8ED329", priority: 88 },
        { id: "uv", title: "UV Index", value: (w.uv_index ?? 5).toFixed(1), subtitle: (w.uv_index ?? 5) > 7 ? "Very High — protect skin" : "Moderate", color: "#FFBE00", priority: 82 },
        { id: "humidity", title: "Humidity", value: `${w.humidity}%`, subtitle: w.humidity > 75 ? "Respiratory caution" : "Comfortable", color: "#00DDE5", priority: 78 },
        { id: "pm25", title: "PM2.5", value: `${w.aqi?.pm25?.toFixed(0) ?? "—"} µg`, subtitle: (w.aqi?.pm25 ?? 0) > 60 ? "Limit outdoor exposure" : "Acceptable", color: "#FFBE00", priority: 75 },
        { id: "heat-alert", title: "Heat/Cold Alert", value: w.temperature > 38 ? "Heat Risk" : w.temperature < 5 ? "Cold Risk" : "None", subtitle: w.temperature > 38 ? "Heat stroke risk" : w.temperature < 5 ? "Hypothermia risk" : "Normal", color: w.temperature > 38 ? "#ff2020" : w.temperature < 5 ? "#00DDE5" : "#8ED329", priority: 72 },
      );
      break;

    case "researcher":
      cards.push(
        { id: "pressure", title: "Pressure", value: `${(w.pressure_hpa ?? 1013)} hPa`, subtitle: (w.pressure_hpa ?? 1013) > 1013 ? "High pressure system" : "Low pressure system", color: "#9b59b6", priority: 82 },
        { id: "humidity", title: "Humidity", value: `${w.humidity}%`, subtitle: `Dew point ${w.dew_point}°C`, color: "#00DDE5", priority: 80 },
        { id: "wind", title: "Wind", value: `${w.wind_speed} km/h`, subtitle: `${w.wind_direction} (${w.wind_direction_deg}°)`, color: "#8ED329", priority: 78 },
        { id: "visibility", title: "Visibility", value: `${(w.visibility_km ?? 6)} km`, subtitle: "Atmospheric clarity", color: "#8ED329", priority: 72 },
        { id: "aqi", title: "AQI", value: `${w.aqi?.aqi ?? "—"}`, subtitle: w.aqi?.status || "Unknown", color: w.aqi?.color || "#8ED329", priority: 65 },
      );
      break;

    case "traveller":
      cards.push(
        { id: "visibility", title: "Visibility", value: `${(w.visibility_km ?? 6)} km`, subtitle: (w.visibility_km ?? 6) < 2 ? "Fog — travel delay risk" : "Clear roads", color: (w.visibility_km ?? 6) < 2 ? "#FFBE00" : "#8ED329", priority: 85 },
        { id: "rain-outlook", title: "Rain Outlook", value: w.condition.toLowerCase().includes("rain") ? "Rainy" : "Dry", subtitle: w.condition.toLowerCase().includes("rain") ? "Carry umbrella" : "Good for sightseeing", color: w.condition.toLowerCase().includes("rain") ? "#00DDE5" : "#8ED329", priority: 80 },
        { id: "wind", title: "Wind", value: `${w.wind_speed} km/h`, subtitle: `${w.wind_direction}`, color: "#8ED329", priority: 70 },
        { id: "uv", title: "UV Index", value: (w.uv_index ?? 5).toFixed(1), subtitle: (w.uv_index ?? 5) > 7 ? "Sunscreen essential" : "Moderate", color: "#FFBE00", priority: 68 },
        { id: "sunrise", title: "Sunrise / Sunset", value: w.sunrise ?? "—", subtitle: `Sunset: ${w.sunset ?? "—"}`, color: "#FFBE00", priority: 60 },
      );
      break;

    case "general":
    default:
      cards.push(
        { id: "aqi", title: "AQI", value: `${w.aqi?.aqi ?? "—"}`, subtitle: w.aqi?.status || "Unknown", color: w.aqi?.color || "#8ED329", priority: 72 },
        { id: "humidity", title: "Humidity", value: `${w.humidity}%`, subtitle: w.humidity > 70 ? "Humid" : "Comfortable", color: "#00DDE5", priority: 68 },
        { id: "wind", title: "Wind", value: `${w.wind_speed} km/h`, subtitle: `${w.wind_direction}`, color: "#8ED329", priority: 65 },
        { id: "uv", title: "UV Index", value: (w.uv_index ?? 5).toFixed(1), subtitle: (w.uv_index ?? 5) > 7 ? "Very High" : "Moderate", color: "#FFBE00", priority: 60 },
        { id: "visibility", title: "Visibility", value: `${w.visibility_km} km`, subtitle: "Clear", color: "#8ED329", priority: 55 },
      );
      break;
  }

  return cards.sort((a, b) => b.priority - a.priority);
}

// ── Persona display config ──────────────────────────────────────

export const PERSONA_CONFIG: Record<Persona, { label: string; emoji: string; color: string }> = {
  farmer: { label: "Farmer / Gardener", emoji: "🌾", color: "#8ED329" },
  fitness: { label: "Outdoor Fitness", emoji: "🏃", color: "#FF7400" },
  health: { label: "Health-Conscious", emoji: "❤️", color: "#FF6B8A" },
  researcher: { label: "Researcher", emoji: "🔬", color: "#9b59b6" },
  traveller: { label: "Traveller", emoji: "🧳", color: "#00DDE5" },
  general: { label: "General", emoji: "🌤️", color: "#FFBE00" },
};
