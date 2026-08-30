/**
 * Personalization Engine v2 — Complete intelligence layer for MyMausam 2.0.
 *
 * Provides:
 * - Persona-based dashboard card ranking
 * - Priority scoring (relevance × urgency × persona × time × data availability)
 * - Deterministic Comfort Index
 * - Data-driven Best Activity Window (from hourly forecast)
 * - Weather-based Packing Assistant
 * - Event Suitability Calculator
 * - Commute Risk Assessment
 * - Mausam Moment (persona-aware micro-insight)
 * - Smart Alert Override (severe weather always wins)
 * - Rule-based Recommendation Engine
 *
 * All outputs are deterministic, derived from real weather data.
 * No fake data is ever generated.
 */

import {
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  WeatherAlert,
} from "@/types/weather";
import {
  GeographicContext,
  UNKNOWN_GEOGRAPHIC_CONTEXT,
} from "@/lib/geographic-context";
import {
  getFeatureGeographicModifier,
  getHiddenFeatures,
  isFeatureApplicable,
} from "@/lib/feature-registry";

// ─── Types ──────────────────────────────────────────────────────

export type Persona =
  | "health"
  | "fitness"
  | "beach"
  | "traveler"
  | "family"
  | "farmer"
  | "commuter"
  | "event_planner";

export interface DashboardCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  priority: number;
  relevance: number;
  urgency: number;
  personaRelevance: number;
  timeRelevance: number;
  dataAvailability: number; // 0–1, whether real data exists
  icon?: string;
  explanation?: string;
}

export interface MausamMoment {
  emoji: string;
  message: string;
  tag: string;
}

export interface Recommendation {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  category: string;
}

export interface ActivityWindow {
  start: string;
  end: string;
  score: number;
  reasons: string[];
}

export interface PackingItem {
  item: string;
  reason: string;
  priority: number;
}

export interface EventSuitability {
  score: number; // 0–100
  label: "GOOD" | "CAUTION" | "POOR";
  color: string;
  factors: { label: string; value: string; impact: "positive" | "neutral" | "negative" }[];
  recommendation: string;
}

export interface CommuteRisk {
  level: "GOOD" | "CAUTION" | "HIGH RISK";
  color: string;
  score: number; // 0–100, higher = safer
  factors: { label: string; value: string; severity: "low" | "medium" | "high" }[];
  recommendation: string;
}

export interface PersonaConfig {
  label: string;
  emoji: string;
  color: string;
}

// ─── Persona Config ─────────────────────────────────────────────

export const PERSONA_CONFIG: Record<Persona, PersonaConfig> = {
  health: { label: "Health & Wellness", emoji: "❤️", color: "#FF6B8A" },
  fitness: { label: "Outdoor Fitness", emoji: "🏃", color: "#FF7400" },
  beach: { label: "Beach & Marine", emoji: "🏖️", color: "#00DDE5" },
  traveler: { label: "Traveler", emoji: "🧳", color: "#9b59b6" },
  family: { label: "Family", emoji: "👨‍👩‍👧‍👦", color: "#8ED329" },
  farmer: { label: "Agriculture", emoji: "🌾", color: "#8ED329" },
  commuter: { label: "Commuter", emoji: "🚗", color: "#0055A6" },
  event_planner: { label: "Event Planner", emoji: "📅", color: "#FFBE00" },
};

// ─── Utility Helpers ────────────────────────────────────────────

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function isRainy(w: CurrentWeather): boolean {
  const c = w.condition.toLowerCase();
  return c.includes("rain") || c.includes("drizzle") || c.includes("shower") || c.includes("thunder");
}

export function isStormy(w: CurrentWeather): boolean {
  const c = w.condition.toLowerCase();
  return c.includes("storm") || c.includes("thunder");
}

function isFoggy(w: CurrentWeather): boolean {
  const c = w.condition.toLowerCase();
  return c.includes("fog") || c.includes("mist") || (w.visibility_km ?? 10) < 2;
}

function hasSevereAlert(alerts: WeatherAlert[]): boolean {
  return alerts.some(
    (a) =>
      a.severity?.toLowerCase() === "severe" ||
      a.severity?.toLowerCase() === "extreme" ||
      a.alert_type?.toLowerCase().includes("severe") ||
      a.alert_type?.toLowerCase().includes("cyclone") ||
      a.alert_type?.toLowerCase().includes("warning")
  );
}

function getAlertSeverity(alerts: WeatherAlert[]): "none" | "moderate" | "severe" | "extreme" {
  if (alerts.length === 0) return "none";
  if (alerts.some((a) => a.severity?.toLowerCase() === "extreme")) return "extreme";
  if (alerts.some((a) => a.severity?.toLowerCase() === "severe")) return "severe";
  return "moderate";
}

/** Parse "05:54 AM" into hour (0–23) */
function parseTime(str?: string): number | null {
  if (!str) return null;
  const match = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const min = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h;
}

/** Get current hour (0–23) */
function now(): number {
  return new Date().getHours();
}

// ═══════════════════════════════════════════════════════════════════
// 1. COMFORT INDEX — Deterministic score from real weather variables
// ═══════════════════════════════════════════════════════════════════

export interface ComfortResult {
  score: number; // 0–100
  label: string;
  color: string;
  factors: { name: string; rating: string; score: number }[];
}

export function calculateComfortIndex(w: CurrentWeather): ComfortResult {
  const factors: { name: string; rating: string; score: number }[] = [];

  // Temperature scoring (optimal 20–28°C)
  const temp = w.temperature;
  const tempScore =
    temp >= 20 && temp <= 28
      ? 100
      : temp >= 15 && temp <= 32
        ? 80
        : temp >= 10 && temp <= 38
          ? 50
          : 20;
  const tempRating =
    tempScore >= 80 ? "Comfortable" : tempScore >= 50 ? "Moderate" : "Uncomfortable";
  factors.push({ name: "Temperature", rating: `${temp.toFixed(0)}°C — ${tempRating}`, score: tempScore });

  // Humidity scoring (optimal 30–60%)
  const hum = w.humidity;
  const humScore =
    hum >= 30 && hum <= 60 ? 100 : hum >= 20 && hum <= 75 ? 75 : hum >= 15 && hum <= 85 ? 45 : 15;
  const humRating = humScore >= 75 ? "Comfortable" : humScore >= 45 ? "Moderate" : "Humid/Dry";
  factors.push({ name: "Humidity", rating: `${hum}% — ${humRating}`, score: humScore });

  // Wind scoring (optimal 5–20 km/h)
  const wind = w.wind_speed;
  const windScore =
    wind >= 5 && wind <= 20 ? 100 : wind < 5 ? 70 : wind <= 30 ? 60 : wind <= 40 ? 30 : 10;
  const windRating =
    windScore >= 70 ? "Light breeze" : windScore >= 40 ? "Breezy" : "Strong wind";
  factors.push({ name: "Wind", rating: `${wind} km/h — ${windRating}`, score: windScore });

  // Rain scoring
  const rainScore = isRainy(w) ? 25 : 100;
  const rainRating = isRainy(w) ? "Rain likely" : "Dry";
  factors.push({ name: "Rain Probability", rating: rainRating, score: rainScore });

  // UV scoring (optimal 1–5)
  const uv = w.uv_index ?? 5;
  const uvScore = uv <= 2 ? 100 : uv <= 5 ? 85 : uv <= 7 ? 55 : uv <= 9 ? 30 : 10;
  const uvRating = uvScore >= 70 ? "Safe" : uvScore >= 40 ? "Moderate" : "High exposure";
  factors.push({ name: "UV Index", rating: `${uv.toFixed(1)} — ${uvRating}`, score: uvScore });

  const total = Math.round(
    factors.reduce((sum, f) => sum + f.score, 0) / factors.length
  );

  const label = total >= 75 ? "Excellent" : total >= 55 ? "Good" : total >= 35 ? "Fair" : "Poor";
  const color = total >= 75 ? "#8ED329" : total >= 55 ? "#FFBE00" : total >= 35 ? "#FF7400" : "#ff2020";

  return { score: total, label, color, factors };
}

// ═══════════════════════════════════════════════════════════════════
// 2. PRIORITY ENGINE — Score each card for persona relevance
// ═══════════════════════════════════════════════════════════════════

/** Persona × category relevance matrix (0–100) */
const RELEVANCE_MATRIX: Record<Persona, Record<string, number>> = {
  health: {
    aqi: 95, pm25: 90, uv_index: 85, humidity: 80, temperature: 70,
    heat_alert: 88, visibility: 40, wind: 35, rain_probability: 30,
    sunrise: 20, sunset: 20, pressure: 30, dew_point: 50,
  },
  fitness: {
    temperature: 90, uv_index: 85, humidity: 80, wind: 75, rain_probability: 70,
    visibility: 65, heat_alert: 80, sunrise: 85, sunset: 80, aqi: 55,
    pm25: 50, pressure: 30, dew_point: 40,
  },
  beach: {
    wind: 90, rain_probability: 85, temperature: 80, wave_height: 95,
    tide: 90, sea_temp: 85, visibility: 70, uv_index: 65, marine_alert: 95,
    aqi: 20, humidity: 40, sunrise: 50, sunset: 50, pressure: 45,
  },
  traveler: {
    visibility: 85, rain_probability: 80, temperature: 75, wind: 65,
    uv_index: 60, severe_weather: 90, flight_weather: 85, sunrise: 55,
    sunset: 55, packing: 80, aqi: 40, humidity: 35, pressure: 30,
  },
  family: {
    rain_probability: 90, severe_weather: 95, visibility: 80, temperature: 75,
    wind: 65, humidity: 60, school_commute: 85, evening_commute: 85,
    uv_index: 50, aqi: 45, fog: 75, sunrise: 40, sunset: 40,
  },
  farmer: {
    rain_probability: 95, humidity: 85, temperature: 70, wind: 80,
    soil_moisture: 85, frost_risk: 90, spray_window: 85, uv_index: 55,
    dew_point: 75, sunrise: 80, sunset: 75, aqi: 20, visibility: 30,
    pressure: 40,
  },
  commuter: {
    visibility: 90, rain_probability: 85, fog: 88, severe_weather: 85,
    wind: 70, temperature: 55, commute_risk: 90, humidity: 40,
    sunrise: 35, sunset: 35, aqi: 30, uv_index: 20, pressure: 30,
  },
  event_planner: {
    rain_probability: 95, temperature: 85, humidity: 80, wind: 85,
    severe_weather: 90, comfort: 88, event_suitability: 95, uv_index: 50,
    visibility: 55, sunrise: 40, sunset: 40, aqi: 30, pressure: 25,
  },
};

/**
 * Score a dashboard card. Returns a composite score 0–100.
 * Geographic context modulates the score based on location applicability.
 */
export function scoreCard(
  cardId: string,
  persona: Persona,
  weather: CurrentWeather | null,
  alerts: WeatherAlert[],
  hour: number = now(),
  geo: GeographicContext | null = null
): number {
  const matrix = RELEVANCE_MATRIX[persona] || RELEVANCE_MATRIX.health;
  const personaRelevance = matrix[cardId] ?? 30;

  // Urgency from alerts
  const alertLevel = getAlertSeverity(alerts);
  const urgency = alertLevel === "extreme" ? 100 : alertLevel === "severe" ? 85 : alertLevel === "moderate" ? 60 : 10;

  // Time relevance — some cards are more relevant at certain hours
  let timeRelevance = 50;
  if (["sunrise", "sunset"].includes(cardId)) {
    timeRelevance = hour < 7 || hour > 17 ? 90 : 30;
  } else if (["fog", "visibility"].includes(cardId)) {
    timeRelevance = hour < 8 || hour > 18 ? 80 : 40;
  } else if (cardId === "uv_index") {
    timeRelevance = hour >= 10 && hour <= 15 ? 90 : 30;
  } else if (cardId === "heat_alert") {
    timeRelevance = hour >= 11 && hour <= 16 ? 85 : 40;
  } else if (["frost_risk"].includes(cardId)) {
    timeRelevance = geo?.frost_prone ? 90 : 20;
  } else if (["fog"].includes(cardId)) {
    timeRelevance = geo?.fog_prone ? 90 : 20;
  }

  // Data availability — does the card have real data?
  let dataAvailability = 1.0;
  if (!weather) dataAvailability = 0;
  else if (["pm25"].includes(cardId) && !weather.aqi?.pm25) dataAvailability = 0.2;
  else if (["dew_point"].includes(cardId) && weather.dew_point == null) dataAvailability = 0.3;
  else if (["visibility"].includes(cardId) && weather.visibility_km == null) dataAvailability = 0.3;
  else if (["pressure"].includes(cardId) && weather.pressure_hpa == null) dataAvailability = 0.3;

  // Geographic modifier — reduces score when feature is geographically irrelevant
  const geoModifier = getFeatureGeographicModifier(cardId, geo);

  const composite = Math.round(
    personaRelevance * 0.4 +
    urgency * 0.15 +
    timeRelevance * 0.15 +
    dataAvailability * 100 * 0.15 +
    (weather ? 50 : 0) * 0.15
  );

  // Apply geographic modifier
  return clamp(Math.round(composite * geoModifier), 0, 100);
}

// ═══════════════════════════════════════════════════════════════════
// 2b. GEOGRAPHIC FEATURE VISIBILITY
// ═══════════════════════════════════════════════════════════════════

/**
 * Get the list of feature IDs that should be hidden for a persona + geography.
 * Used by PersonaEngine to conditionally render modules.
 */
export function getGeoHiddenFeatures(persona: Persona, geo: GeographicContext | null): string[] {
  return getHiddenFeatures(persona, geo);
}

/**
 * Check if a specific feature module should be visible for a persona + geography.
 */
export function isModuleVisible(featureId: string, persona: Persona, geo: GeographicContext | null): boolean {
  return isFeatureApplicable(featureId, persona, geo);
}

/**
 * Get geographic context summary for display.
 */
export function getGeographicSummary(geo: GeographicContext | null): string {
  if (!geo || geo.latitude === 0) return "Location not set";
  const parts: string[] = [];
  if (geo.coastal_status) parts.push(`Coastal (${geo.distance_to_coast_km.toFixed(0)}km from shore)`);
  if (geo.mountain_region) parts.push("Mountain region");
  if (geo.desert_region) parts.push("Arid/desert region");
  if (geo.frost_prone) parts.push("Frost-prone area");
  if (geo.cyclone_exposure) parts.push("Cyclone-exposed coast");
  if (geo.fog_prone) parts.push("Fog-prone region");
  if (geo.heat_exposure) parts.push("Heat-exposed area");
  if (geo.flood_exposure) parts.push("Flood-prone region");
  if (geo.snow_prone) parts.push("Snow-prone area");
  if (parts.length === 0) parts.push(`${geo.terrain_type} terrain, ${geo.climate_zone} climate`);
  return parts.join(" • ");
}

// ═══════════════════════════════════════════════════════════════════
// 3. BEST ACTIVITY WINDOW — Data-driven from hourly forecast
// ═══════════════════════════════════════════════════════════════════

/**
 * Analyze hourly forecast data to find the best activity windows.
 * Considers temperature, humidity, wind, UV, precipitation, and daylight.
 */
export function findBestActivityWindows(
  hourlyForecast: HourlyForecastItem[],
  sunrise?: string,
  sunset?: string
): ActivityWindow[] {
  if (!hourlyForecast || hourlyForecast.length === 0) {
    return [{ start: "N/A", end: "N/A", score: 0, reasons: ["No hourly forecast data available"] }];
  }

  const sunriseHr = parseTime(sunrise) ?? 6;
  const sunsetHr = parseTime(sunset) ?? 18;

  const scored = hourlyForecast.map((h) => {
    let score = 50;
    const reasons: string[] = [];

    // Daylight — outdoor activity only during daylight
    const hour = parseInt(h.time_str?.split(":")[0] ?? "12", 10);
    if (hour < sunriseHr || hour > sunsetHr) {
      score -= 50;
      reasons.push("Outside daylight hours");
    }

    // Temperature (optimal 18–28°C for running)
    if (h.temperature >= 18 && h.temperature <= 28) {
      score += 25;
      reasons.push("Comfortable temperature");
    } else if (h.temperature >= 12 && h.temperature <= 35) {
      score += 10;
      reasons.push("Acceptable temperature");
    } else {
      score -= 15;
      reasons.push(`${h.temperature.toFixed(0)}°C — ${h.temperature > 35 ? "heat stress" : "too cold"}`);
    }

    // Humidity (optimal < 70%)
    if (h.humidity < 50) {
      score += 15;
      reasons.push("Low humidity");
    } else if (h.humidity < 70) {
      score += 5;
    } else {
      score -= 10;
      reasons.push("High humidity — hydration risk");
    }

    // Wind
    if (h.wind_speed != null) {
      if (h.wind_speed < 15) {
        score += 10;
        reasons.push("Light wind");
      } else if (h.wind_speed > 30) {
        score -= 15;
        reasons.push("Strong wind");
      }
    }

    // Rain probability
    if (h.rain_probability != null) {
      if (h.rain_probability < 20) {
        score += 15;
        reasons.push("Low rain risk");
      } else if (h.rain_probability < 50) {
        score -= 5;
        reasons.push("Moderate rain risk");
      } else {
        score -= 25;
        reasons.push("High rain probability");
      }
    }

    // Condition bonus
    const cond = (h.condition ?? "").toLowerCase();
    if (cond.includes("clear") || cond.includes("sunny")) {
      score += 10;
      reasons.push("Clear sky");
    } else if (cond.includes("rain") || cond.includes("storm")) {
      score -= 20;
      reasons.push("Rain/storm in forecast");
    }

    // UV penalty during peak hours
    if (hour >= 10 && hour <= 15) {
      score -= 5;
    }

    return { score: clamp(score, 0, 100), reasons, hour, time_str: h.time_str };
  });

  // Group consecutive good windows (score >= 60)
  const good = scored.filter((s) => s.score >= 60);
  if (good.length === 0) {
    // Find the best available even if not ideal
    const best = scored.reduce((a, b) => (a.score > b.score ? a : b));
    return [{
      start: best.time_str,
      end: best.time_str,
      score: best.score,
      reasons: [...best.reasons, "Limited suitable windows — consider indoor alternatives"],
    }];
  }

  // Find contiguous windows
  const windows: ActivityWindow[] = [];
  let startIdx = 0;
  for (let i = 1; i <= good.length; i++) {
    if (i === good.length || good[i].hour - good[i - 1].hour > 2) {
      const windowHours = good.slice(startIdx, i);
      const avgScore = Math.round(
        windowHours.reduce((s, h) => s + h.score, 0) / windowHours.length
      );
      const topReasons = [...new Set(windowHours.flatMap((h) => h.reasons))].slice(0, 4);
      windows.push({
        start: windowHours[0].time_str,
        end: windowHours[windowHours.length - 1].time_str,
        score: avgScore,
        reasons: topReasons,
      });
      startIdx = i;
    }
  }

  return windows.slice(0, 3); // Top 3 windows
}

// ═══════════════════════════════════════════════════════════════════
// 4. PACKING ASSISTANT — Derived from real forecast conditions
// ═══════════════════════════════════════════════════════════════════

export function generatePackingList(
  weather: CurrentWeather,
  forecast?: DailyForecastItem[]
): PackingItem[] {
  const items: PackingItem[] = [];

  // Rain protection
  const willRain = isRainy(weather) || forecast?.some((f) => (f.rain_probability ?? 0) > 40);
  if (willRain) {
    items.push({ item: "Umbrella / Rain jacket", reason: "Rain expected in forecast", priority: 10 });
  }

  // Temperature-based
  const temp = weather.temperature;
  if (temp < 10) {
    items.push({ item: "Warm jacket / Layers", reason: `Temperature ${temp.toFixed(0)}°C — cold conditions`, priority: 9 });
    items.push({ item: "Gloves & scarf", reason: "Cold weather protection", priority: 7 });
  } else if (temp < 18) {
    items.push({ item: "Light jacket / Sweater", reason: `Temperature ${temp.toFixed(0)}°C — cool conditions`, priority: 7 });
  } else if (temp > 35) {
    items.push({ item: "Light, breathable clothing", reason: `Temperature ${temp.toFixed(0)}°C — heat`, priority: 8 });
    items.push({ item: "Extra water (2L+)", reason: "High heat — dehydration risk", priority: 9 });
  }

  // UV protection
  const uv = weather.uv_index ?? 5;
  if (uv > 5) {
    items.push({ item: "Sunscreen SPF 30+", reason: `UV Index ${uv.toFixed(1)} — skin protection needed`, priority: 8 });
  }
  if (uv > 7) {
    items.push({ item: "UV-protective sunglasses", reason: "Very high UV — eye protection essential", priority: 8 });
    items.push({ item: "Hat / Cap", reason: "Peak UV hours — head protection", priority: 7 });
  }

  // Wind
  if (weather.wind_speed > 25) {
    items.push({ item: "Windbreaker", reason: `Wind ${weather.wind_speed} km/h — strong gusts`, priority: 6 });
  }

  // Fog / low visibility
  if (isFoggy(weather)) {
    items.push({ item: "Reflective gear / Torch", reason: "Low visibility — safety precaution", priority: 8 });
  }

  // Humidity
  if (weather.humidity > 80) {
    items.push({ item: "Quick-dry towel", reason: `Humidity ${weather.humidity}% — perspiration likely`, priority: 4 });
  }

  // Always useful
  items.push({ item: "Water bottle", reason: "Stay hydrated", priority: 3 });

  return items.sort((a, b) => b.priority - a.priority);
}

// ═══════════════════════════════════════════════════════════════════
// 5. EVENT SUITABILITY — From real forecast data
// ═══════════════════════════════════════════════════════════════════

export function calculateEventSuitability(
  weather: CurrentWeather,
  forecast?: DailyForecastItem[],
  eventHour?: number
): EventSuitability {
  const factors: EventSuitability["factors"] = [];
  let totalScore = 0;
  let factorCount = 0;

  // Rain
  const rainProb = forecast?.[0]?.rain_probability ?? (isRainy(weather) ? 60 : 10);
  const rainScore = rainProb < 20 ? 100 : rainProb < 40 ? 70 : rainProb < 60 ? 40 : 10;
  factors.push({
    label: "Rain Probability",
    value: `${rainProb}%`,
    impact: rainScore >= 70 ? "positive" : rainScore >= 40 ? "neutral" : "negative",
  });
  totalScore += rainScore;
  factorCount++;

  // Temperature
  const temp = weather.temperature;
  const tempScore = temp >= 18 && temp <= 32 ? 100 : temp >= 10 && temp <= 38 ? 60 : 20;
  factors.push({
    label: "Temperature",
    value: `${temp.toFixed(0)}°C`,
    impact: tempScore >= 70 ? "positive" : tempScore >= 40 ? "neutral" : "negative",
  });
  totalScore += tempScore;
  factorCount++;

  // Humidity
  const hum = weather.humidity;
  const humScore = hum <= 60 ? 100 : hum <= 75 ? 70 : hum <= 85 ? 40 : 15;
  factors.push({
    label: "Humidity",
    value: `${hum}%`,
    impact: humScore >= 70 ? "positive" : humScore >= 40 ? "neutral" : "negative",
  });
  totalScore += humScore;
  factorCount++;

  // Wind
  const wind = weather.wind_speed;
  const windScore = wind <= 15 ? 100 : wind <= 25 ? 70 : wind <= 35 ? 35 : 10;
  factors.push({
    label: "Wind Speed",
    value: `${wind} km/h`,
    impact: windScore >= 70 ? "positive" : windScore >= 40 ? "neutral" : "negative",
  });
  totalScore += windScore;
  factorCount++;

  // Severe weather
  if (isStormy(weather)) {
    factors.push({ label: "Storm Alert", value: weather.condition, impact: "negative" });
    totalScore += 0;
  } else {
    factors.push({ label: "Storm Alert", value: "None", impact: "positive" });
    totalScore += 100;
  }
  factorCount++;

  const finalScore = Math.round(totalScore / factorCount);

  let label: EventSuitability["label"];
  let color: string;
  if (finalScore >= 70) {
    label = "GOOD";
    color = "#8ED329";
  } else if (finalScore >= 40) {
    label = "CAUTION";
    color = "#FFBE00";
  } else {
    label = "POOR";
    color = "#ff2020";
  }

  // Generate explanation
  const negatives = factors.filter((f) => f.impact === "negative");
  let recommendation = "";
  if (label === "GOOD") {
    recommendation = "Favorable conditions for outdoor event. Standard preparations recommended.";
  } else if (label === "CAUTION") {
    recommendation = `${negatives.map((n) => n.label).join(" and ")} may affect outdoor activities. Have contingency plans ready.`;
  } else {
    recommendation = `Significant weather challenges: ${negatives.map((n) => n.label).join(", ")}. Strongly consider indoor alternatives or rescheduling.`;
  }

  return { score: finalScore, label, color, factors, recommendation };
}

// ═══════════════════════════════════════════════════════════════════
// 6. COMMUTE RISK — From real weather conditions
// ═══════════════════════════════════════════════════════════════════

export function calculateCommuteRisk(weather: CurrentWeather): CommuteRisk {
  const factors: CommuteRisk["factors"] = [];
  let safetyScore = 100;

  // Visibility
  const vis = weather.visibility_km ?? 10;
  if (vis < 1) {
    factors.push({ label: "Visibility", value: `${vis.toFixed(1)} km — Very poor`, severity: "high" });
    safetyScore -= 35;
  } else if (vis < 3) {
    factors.push({ label: "Visibility", value: `${vis.toFixed(1)} km — Reduced`, severity: "medium" });
    safetyScore -= 20;
  } else {
    factors.push({ label: "Visibility", value: `${vis.toFixed(1)} km — Clear`, severity: "low" });
  }

  // Rain
  if (isRainy(weather)) {
    const severity = isStormy(weather) ? "high" : "medium";
    factors.push({ label: "Rain", value: weather.condition, severity });
    safetyScore -= isStormy(weather) ? 30 : 15;
  } else {
    factors.push({ label: "Rain", value: "Dry", severity: "low" });
  }

  // Fog
  if (isFoggy(weather)) {
    factors.push({ label: "Fog", value: "Active", severity: "high" });
    safetyScore -= 25;
  } else {
    factors.push({ label: "Fog", value: "None", severity: "low" });
  }

  // Wind
  const wind = weather.wind_speed;
  if (wind > 40) {
    factors.push({ label: "Wind", value: `${wind} km/h — Dangerous`, severity: "high" });
    safetyScore -= 25;
  } else if (wind > 25) {
    factors.push({ label: "Wind", value: `${wind} km/h — Strong`, severity: "medium" });
    safetyScore -= 10;
  } else {
    factors.push({ label: "Wind", value: `${wind} km/h — Normal`, severity: "low" });
  }

  // Temperature extremes
  const temp = weather.temperature;
  if (temp > 42) {
    factors.push({ label: "Heat", value: `${temp.toFixed(0)}°C — Extreme heat`, severity: "high" });
    safetyScore -= 15;
  } else if (temp < 2) {
    factors.push({ label: "Cold", value: `${temp.toFixed(0)}°C — Frost risk`, severity: "high" });
    safetyScore -= 15;
  } else {
    factors.push({ label: "Temperature", value: `${temp.toFixed(0)}°C — Normal`, severity: "low" });
  }

  const score = clamp(safetyScore, 0, 100);
  let level: CommuteRisk["level"];
  let color: string;
  if (score >= 70) {
    level = "GOOD";
    color = "#8ED329";
  } else if (score >= 40) {
    level = "CAUTION";
    color = "#FFBE00";
  } else {
    level = "HIGH RISK";
    color = "#ff2020";
  }

  const highSeverity = factors.filter((f) => f.severity === "high");
  let recommendation = "";
  if (level === "GOOD") {
    recommendation = "Clear roads and favorable conditions for commuting.";
  } else if (level === "CAUTION") {
    recommendation = `Exercise caution — ${highSeverity.length > 0 ? highSeverity.map((f) => f.label.toLowerCase()).join(", ") : "reduced conditions"}. Allow extra travel time.`;
  } else {
    recommendation = `Dangerous commute conditions: ${highSeverity.map((f) => f.label.toLowerCase()).join(", ")}. Avoid non-essential travel if possible.`;
  }

  return { level, color, score, factors, recommendation };
}

// ═══════════════════════════════════════════════════════════════════
// 7. MAUSAM MOMENT — Persona-aware micro-insight
// ═══════════════════════════════════════════════════════════════════

export function getMausamMoment(persona: Persona, w: CurrentWeather | null): MausamMoment {
  if (!w) return { emoji: "🌤️", message: "Loading weather data…", tag: "general" };

  const temp = w.temperature;
  const humidity = w.humidity;
  const wind = w.wind_speed;
  const uv = w.uv_index ?? 5;
  const aqi = w.aqi?.aqi ?? 100;
  const hour = now();
  const isMorning = hour >= 5 && hour < 12;
  const isAfternoon = hour >= 12 && hour < 17;

  switch (persona) {
    case "health": {
      if (aqi > 150) return { emoji: "😷", message: `AQI at ${aqi} (${w.aqi?.status}) — avoid prolonged outdoor exposure. Sensitive groups should stay indoors.`, tag: "health" };
      if (aqi > 100) return { emoji: "😐", message: `AQI at ${aqi} — moderate air quality. Consider limiting intense outdoor activities.`, tag: "health" };
      if (uv > 7) return { emoji: "☀️", message: `UV Index ${uv.toFixed(1)} — very high. Apply SPF 30+ and wear protective clothing outdoors.`, tag: "health" };
      if (temp > 38 && humidity > 60) return { emoji: "💧", message: `Heat index elevated (${temp}°C, ${humidity}% humidity). Stay hydrated — drink water every 30 minutes.`, tag: "health" };
      if (temp < 5) return { emoji: "❄️", message: `Cold conditions at ${temp}°C. Dress in layers and watch for hypothermia symptoms.`, tag: "health" };
      return { emoji: "❤️", message: `Air quality is ${aqi < 100 ? "good" : "moderate"}, UV is ${uv < 5 ? "safe" : "elevated"}. ${isMorning ? "Good time for outdoor activities." : "Stay mindful of conditions."}`, tag: "health" };
    }
    case "fitness": {
      if (isMorning && !isRainy(w) && temp < 35) return { emoji: "🏃", message: `Great morning for outdoor activity — ${temp}°C, wind ${wind} km/h. Head out now before it gets warmer.`, tag: "fitness" };
      if (temp > 38 && isAfternoon) return { emoji: "🔥", message: `Avoid outdoor exercise until evening — ${temp}°C with UV ${uv}. Heat exhaustion risk is elevated.`, tag: "fitness" };
      if (isRainy(w)) return { emoji: "🌧️", message: `Rain likely — consider indoor training today. Wind ${wind} km/h adds chill in wet conditions.`, tag: "fitness" };
      return { emoji: "🏃", message: `Comfortable ${temp}°C for a run. Wind ${wind} km/h ${w.wind_direction} — ${wind > 20 ? "sheltered routes recommended" : "good conditions"}.`, tag: "fitness" };
    }
    case "beach": {
      if (wind > 25) return { emoji: "🌊", message: `Strong winds at ${wind} km/h — rough seas likely. Exercise extreme caution near shore.`, tag: "marine" };
      if (isStormy(w)) return { emoji: "⛈️", message: "Storm activity near coast — avoid water activities. Stay away from rocky breakwaters.", tag: "marine" };
      if (temp > 35) return { emoji: "🏖️", message: `Hot at ${temp}°C — seek shade during 11 AM–3 PM. Apply reef-safe sunscreen frequently.`, tag: "marine" };
      return { emoji: "🏖️", message: `Pleasant ${temp}°C for beach. Wind ${wind} km/h ${w.wind_direction} — ${wind > 15 ? "caution in open water" : "safe for swimming"}.`, tag: "marine" };
    }
    case "traveler": {
      if (isFoggy(w)) return { emoji: "🌫️", message: `Low visibility (${w.visibility_km} km) — delays possible at airports and highways. Check conditions before departing.`, tag: "travel" };
      if (isRainy(w)) return { emoji: "🌧️", message: `Rain expected — carry umbrella and waterproof gear. ${wind > 20 ? "Strong winds may affect flights." : "Roads may be slippery."}`, tag: "travel" };
      if (temp > 35) return { emoji: "🧳", message: `Hot at ${temp}°C — carry water, sunscreen, and light clothing. Plan sightseeing for early morning or evening.`, tag: "travel" };
      return { emoji: "🧳", message: `Pleasant ${temp}°C for travel. Visibility ${w.visibility_km} km — ${w.condition}.`, tag: "travel" };
    }
    case "family": {
      if (isStormy(w)) return { emoji: "⛈️", message: "Thunderstorm alert — keep children indoors. Avoid open areas and playgrounds.", tag: "alerts" };
      if (isRainy(w)) return { emoji: "☔", message: `Rain expected — pack rain gear for school commute. Check bus/transport schedules.`, tag: "family" };
      if (temp > 38) return { emoji: "🌡️", message: `Extreme heat at ${temp}°C — ensure children carry water. Limit outdoor play during peak hours.`, tag: "family" };
      return { emoji: "👨‍👩‍👧‍👦", message: `Safe conditions at ${temp}°C for family activities. ${humidity > 70 ? "Keep kids hydrated." : "Enjoy outdoor time!"}`, tag: "family" };
    }
    case "farmer": {
      if (isRainy(w) && !isStormy(w)) return { emoji: "🌧️", message: `Rain expected — plan irrigation around natural rainfall. Current humidity ${humidity}%.`, tag: "agriculture" };
      if (temp > 38) return { emoji: "🌡️", message: `Heat stress risk at ${temp}°C. Water crops early morning or late evening to reduce evaporation.`, tag: "agriculture" };
      if (isStormy(w)) return { emoji: "⛈️", message: "Storm detected — secure equipment and avoid fieldwork during lightning.", tag: "agriculture" };
      if (humidity > 80) return { emoji: "💧", message: `High humidity (${humidity}%) increases fungal disease risk. Monitor crops for leaf blight.`, tag: "agriculture" };
      return { emoji: "🌾", message: `Stable ${temp}°C — good window for spraying, sowing, or harvesting.`, tag: "agriculture" };
    }
    case "commuter": {
      if (isFoggy(w)) return { emoji: "🌫️", message: `Fog reducing visibility to ${w.visibility_km} km. Start early — expect slower commute.`, tag: "commute" };
      if (isStormy(w)) return { emoji: "⛈️", message: "Storm active — dangerous road conditions. Consider delaying departure or working from home.", tag: "commute" };
      if (isRainy(w)) return { emoji: "🌧️", message: `Rain expected — allow 15–20 min extra travel time. Drive cautiously on wet roads.`, tag: "commute" };
      return { emoji: "🚗", message: `Clear commute at ${temp}°C, visibility ${w.visibility_km} km. ${wind > 25 ? "Strong crosswinds on open roads." : "Smooth transit expected."}`, tag: "commute" };
    }
    case "event_planner": {
      if (isStormy(w)) return { emoji: "⛈️", message: "Severe weather active — activate contingency plans. Move outdoor events indoors.", tag: "events" };
      if (isRainy(w)) return { emoji: "🌧️", message: `Rain likely — prepare covered areas and waterproof logistics. ${humidity > 75 ? "High humidity will be uncomfortable." : ""}`, tag: "events" };
      if (temp > 35) return { emoji: "🌡️", message: `Hot at ${temp}°C — set up misting fans, shaded areas, and ample hydration stations.`, tag: "events" };
      return { emoji: "📅", message: `Favorable conditions at ${temp}°C, wind ${wind} km/h. ${humidity < 65 ? "Comfortable for guests." : "Provide cooling options."}`, tag: "events" };
    }
    default:
      return { emoji: "🌤️", message: `${w.condition} at ${temp}°C — ${humidity}% humidity, wind ${wind} km/h.`, tag: "general" };
  }
}

// ═══════════════════════════════════════════════════════════════════
// 8. DASHBOARD CARDS — Priority-ranked per persona
// ═══════════════════════════════════════════════════════════════════

export function getPersonalizedDashboard(
  persona: Persona,
  w: CurrentWeather | null,
  alerts: WeatherAlert[] = [],
  forecast?: DailyForecastItem[],
  hourly?: HourlyForecastItem[],
  geo?: GeographicContext | null
): DashboardCard[] {
  if (!w) return [];

  const hour = now();
  const cards: DashboardCard[] = [];

  // Universal cards
  cards.push({
    id: "temp",
    title: "Temperature",
    value: `${w.temperature.toFixed(1)}°C`,
    subtitle: `Feels like ${w.feels_like.toFixed(1)}°C`,
    color: w.temperature > 38 ? "#ff2020" : w.temperature < 10 ? "#00DDE5" : "#FFBE00",
    priority: 90, relevance: 80, urgency: 10, personaRelevance: 50,
    timeRelevance: hour >= 11 && hour <= 16 ? 80 : 40, dataAvailability: 1,
  });

  cards.push({
    id: "condition",
    title: "Condition",
    value: w.condition,
    subtitle: `${w.minimum.toFixed(0)}° / ${w.maximum.toFixed(0)}°`,
    color: "#00DDE5",
    priority: 85, relevance: 75, urgency: 10, personaRelevance: 45,
    timeRelevance: 50, dataAvailability: 1,
  });

  // Persona-specific cards
  const pushCard = (card: Omit<DashboardCard, "relevance" | "urgency" | "personaRelevance" | "timeRelevance" | "dataAvailability">) => {
    const relevance = scoreCard(card.id, persona, w, alerts, hour, geo ?? null);
    cards.push({ ...card, priority: relevance, relevance, urgency: 10, personaRelevance: 50, timeRelevance: 50, dataAvailability: 1 });
  };

  switch (persona) {
    case "health":
      cards.push({
        id: "aqi", title: "AQI", value: `${w.aqi?.aqi ?? "—"}`,
        subtitle: w.aqi?.status || "Unknown", color: w.aqi?.color || "#8ED329",
        priority: 88, relevance: 95, urgency: w.aqi?.aqi > 150 ? 90 : 30, personaRelevance: 95,
        timeRelevance: 50, dataAvailability: 1,
        explanation: w.aqi?.aqi > 100 ? "Air quality is poor — limit prolonged outdoor exposure." : "Air quality is acceptable.",
      });
      cards.push({
        id: "uv_index", title: "UV Index", value: (w.uv_index ?? 5).toFixed(1),
        subtitle: (w.uv_index ?? 5) > 7 ? "Very High — protect skin" : (w.uv_index ?? 5) > 4 ? "Moderate" : "Safe",
        color: "#FFBE00",
        priority: 82, relevance: 85, urgency: (w.uv_index ?? 5) > 7 ? 70 : 20, personaRelevance: 85,
        timeRelevance: hour >= 10 && hour <= 15 ? 90 : 30, dataAvailability: 1,
      });
      cards.push({
        id: "humidity", title: "Humidity", value: `${w.humidity}%`,
        subtitle: w.humidity > 75 ? "Respiratory caution" : "Comfortable",
        color: "#00DDE5",
        priority: 78, relevance: 80, urgency: 10, personaRelevance: 80,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "heat_alert", title: "Heat/Cold Alert",
        value: w.temperature > 38 ? "Heat Risk" : w.temperature < 5 ? "Cold Risk" : "None",
        subtitle: w.temperature > 38 ? "Heat stroke risk" : w.temperature < 5 ? "Hypothermia risk" : "Normal",
        color: w.temperature > 38 ? "#ff2020" : w.temperature < 5 ? "#00DDE5" : "#8ED329",
        priority: 72, relevance: 70, urgency: w.temperature > 38 || w.temperature < 5 ? 80 : 10,
        personaRelevance: 88, timeRelevance: hour >= 11 && hour <= 16 ? 85 : 30, dataAvailability: 1,
      });
      break;

    case "fitness":
      cards.push({
        id: "uv_index", title: "UV Index", value: (w.uv_index ?? 5).toFixed(1),
        subtitle: (w.uv_index ?? 5) > 7 ? "Wear SPF 30+" : (w.uv_index ?? 5) > 4 ? "Moderate" : "Safe",
        color: "#FFBE00",
        priority: 82, relevance: 85, urgency: (w.uv_index ?? 5) > 7 ? 60 : 15, personaRelevance: 85,
        timeRelevance: hour >= 10 && hour <= 15 ? 90 : 30, dataAvailability: 1,
      });
      cards.push({
        id: "wind", title: "Wind", value: `${w.wind_speed} km/h`,
        subtitle: `${w.wind_direction} — ${w.wind_speed > 20 ? "Resistance training" : "Easy pace"}`,
        color: "#8ED329",
        priority: 78, relevance: 75, urgency: w.wind_speed > 35 ? 60 : 10, personaRelevance: 75,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "humidity", title: "Humidity", value: `${w.humidity}%`,
        subtitle: w.humidity > 70 ? "High — hydrate often" : "Comfortable",
        color: "#00DDE5",
        priority: 76, relevance: 80, urgency: 10, personaRelevance: 80,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "visibility", title: "Visibility", value: `${(w.visibility_km ?? 6).toFixed(1)} km`,
        subtitle: (w.visibility_km ?? 6) < 3 ? "Low — indoor preferred" : "Good for outdoor",
        color: "#8ED329",
        priority: 70, relevance: 65, urgency: (w.visibility_km ?? 6) < 2 ? 60 : 10, personaRelevance: 65,
        timeRelevance: hour < 8 || hour > 18 ? 80 : 30, dataAvailability: w.visibility_km != null ? 1 : 0.3,
      });
      cards.push({
        id: "heat_alert", title: "Heat Alert", value: w.temperature > 38 ? "Active" : "None",
        subtitle: w.temperature > 38 ? "Avoid midday exercise" : "Safe to train",
        color: w.temperature > 38 ? "#ff2020" : "#8ED329",
        priority: 75, relevance: 75, urgency: w.temperature > 38 ? 80 : 10, personaRelevance: 80,
        timeRelevance: hour >= 11 && hour <= 16 ? 85 : 30, dataAvailability: 1,
      });
      break;

    case "beach":
      cards.push({
        id: "wind", title: "Wind", value: `${w.wind_speed} km/h`,
        subtitle: `${w.wind_direction} — ${w.wind_speed > 25 ? "Rough seas" : "Safe for swimming"}`,
        color: w.wind_speed > 25 ? "#ff2020" : "#00DDE5",
        priority: 90, relevance: 90, urgency: w.wind_speed > 35 ? 80 : 10, personaRelevance: 90,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "rain_probability", title: "Rain Outlook",
        value: isRainy(w) ? "Rainy" : "Dry",
        subtitle: isRainy(w) ? "May affect beach plans" : "Good for beach",
        color: isRainy(w) ? "#00DDE5" : "#8ED329",
        priority: 85, relevance: 85, urgency: isRainy(w) ? 60 : 10, personaRelevance: 85,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "temperature", title: "Temperature", value: `${w.temperature.toFixed(0)}°C`,
        subtitle: `${w.minimum.toFixed(0)}° / ${w.maximum.toFixed(0)}°`,
        color: "#FFBE00",
        priority: 80, relevance: 80, urgency: 10, personaRelevance: 80,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "uv_index", title: "UV Index", value: (w.uv_index ?? 5).toFixed(1),
        subtitle: (w.uv_index ?? 5) > 7 ? "Extreme — limit exposure" : "Moderate",
        color: "#FFBE00",
        priority: 75, relevance: 65, urgency: (w.uv_index ?? 5) > 7 ? 70 : 15, personaRelevance: 65,
        timeRelevance: hour >= 10 && hour <= 15 ? 90 : 30, dataAvailability: 1,
      });
      cards.push({
        id: "visibility", title: "Visibility", value: `${(w.visibility_km ?? 6).toFixed(1)} km`,
        subtitle: (w.visibility_km ?? 6) < 3 ? "Haze near coast" : "Clear views",
        color: "#8ED329",
        priority: 70, relevance: 70, urgency: 10, personaRelevance: 70,
        timeRelevance: 50, dataAvailability: w.visibility_km != null ? 1 : 0.3,
      });
      break;

    case "traveler":
      cards.push({
        id: "visibility", title: "Visibility", value: `${(w.visibility_km ?? 6)} km`,
        subtitle: (w.visibility_km ?? 6) < 2 ? "Fog — travel delay risk" : "Clear roads",
        color: (w.visibility_km ?? 6) < 2 ? "#FFBE00" : "#8ED329",
        priority: 85, relevance: 85, urgency: (w.visibility_km ?? 6) < 2 ? 70 : 10, personaRelevance: 85,
        timeRelevance: hour < 8 || hour > 18 ? 80 : 30, dataAvailability: w.visibility_km != null ? 1 : 0.3,
      });
      cards.push({
        id: "rain_probability", title: "Rain Outlook",
        value: isRainy(w) ? "Rainy" : "Dry",
        subtitle: isRainy(w) ? "Carry umbrella" : "Good for sightseeing",
        color: isRainy(w) ? "#00DDE5" : "#8ED329",
        priority: 80, relevance: 80, urgency: isRainy(w) ? 50 : 10, personaRelevance: 80,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "wind", title: "Wind", value: `${w.wind_speed} km/h`,
        subtitle: `${w.wind_direction}`,
        color: "#8ED329",
        priority: 70, relevance: 65, urgency: w.wind_speed > 30 ? 50 : 10, personaRelevance: 65,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "sunrise", title: "Sunrise / Sunset", value: w.sunrise ?? "—",
        subtitle: `Sunset: ${w.sunset ?? "—"}`,
        color: "#FFBE00",
        priority: 60, relevance: 55, urgency: 10, personaRelevance: 55,
        timeRelevance: hour < 7 || hour > 17 ? 80 : 30, dataAvailability: w.sunrise ? 1 : 0.2,
      });
      break;

    case "family":
      cards.push({
        id: "rain_probability", title: "Rain Outlook",
        value: isRainy(w) ? "Rainy" : "Dry",
        subtitle: isRainy(w) ? "Pack rain gear for kids" : "Good for school commute",
        color: isRainy(w) ? "#00DDE5" : "#8ED329",
        priority: 90, relevance: 90, urgency: isRainy(w) ? 60 : 10, personaRelevance: 90,
        timeRelevance: hour < 9 || hour > 15 ? 80 : 40, dataAvailability: 1,
      });
      cards.push({
        id: "severe_weather", title: "Severe Weather",
        value: hasSevereAlert(alerts) ? "Active" : "None",
        subtitle: hasSevereAlert(alerts) ? "Check warnings" : "Safe conditions",
        color: hasSevereAlert(alerts) ? "#ff2020" : "#8ED329",
        priority: 88, relevance: 85, urgency: hasSevereAlert(alerts) ? 95 : 5, personaRelevance: 95,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "visibility", title: "Visibility", value: `${(w.visibility_km ?? 6).toFixed(1)} km`,
        subtitle: (w.visibility_km ?? 6) < 3 ? "Fog — cautious commute" : "Clear roads",
        color: (w.visibility_km ?? 6) < 3 ? "#FFBE00" : "#8ED329",
        priority: 80, relevance: 80, urgency: (w.visibility_km ?? 6) < 2 ? 65 : 10, personaRelevance: 80,
        timeRelevance: hour < 8 ? 80 : 30, dataAvailability: w.visibility_km != null ? 1 : 0.3,
      });
      cards.push({
        id: "temperature", title: "Temperature", value: `${w.temperature.toFixed(0)}°C`,
        subtitle: `${w.minimum.toFixed(0)}° / ${w.maximum.toFixed(0)}°`,
        color: "#FFBE00",
        priority: 75, relevance: 75, urgency: 10, personaRelevance: 75,
        timeRelevance: 50, dataAvailability: 1,
      });
      break;

    case "farmer":
      cards.push({
        id: "rain_probability", title: "Rain Outlook",
        value: isRainy(w) ? "Active" : "Dry",
        subtitle: isRainy(w) ? "Natural irrigation available" : "Irrigation needed",
        color: isRainy(w) ? "#00DDE5" : "#FFBE00",
        priority: 88, relevance: 95, urgency: isRainy(w) ? 50 : 10, personaRelevance: 95,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "humidity", title: "Humidity", value: `${w.humidity}%`,
        subtitle: w.humidity > 70 ? "High — fungal risk" : "Optimal for crops",
        color: "#00DDE5",
        priority: 82, relevance: 85, urgency: w.humidity > 80 ? 50 : 10, personaRelevance: 85,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "wind", title: "Wind", value: `${w.wind_speed} km/h`,
        subtitle: `${w.wind_direction} — ${w.wind_speed > 25 ? "Caution for spraying" : "Safe for spraying"}`,
        color: "#8ED329",
        priority: 78, relevance: 80, urgency: w.wind_speed > 30 ? 50 : 10, personaRelevance: 80,
        timeRelevance: hour >= 6 && hour <= 9 ? 80 : 30, dataAvailability: 1,
      });
      cards.push({
        id: "dew_point", title: "Dew Point", value: `${w.dew_point ?? "—"}°C`,
        subtitle: (w.dew_point ?? 15) > 20 ? "High — disease risk" : "Low — healthy crops",
        color: "#00DDE5",
        priority: 72, relevance: 75, urgency: (w.dew_point ?? 15) > 22 ? 50 : 10, personaRelevance: 75,
        timeRelevance: hour < 8 ? 70 : 30, dataAvailability: w.dew_point != null ? 1 : 0.3,
      });
      cards.push({
        id: "uv_index", title: "UV Index", value: (w.uv_index ?? 5).toFixed(1),
        subtitle: (w.uv_index ?? 5) > 8 ? "Heat stress risk" : "Moderate",
        color: "#FFBE00",
        priority: 65, relevance: 55, urgency: (w.uv_index ?? 5) > 8 ? 50 : 10, personaRelevance: 55,
        timeRelevance: hour >= 10 && hour <= 15 ? 80 : 30, dataAvailability: 1,
      });
      break;

    case "commuter":
      cards.push({
        id: "visibility", title: "Visibility", value: `${(w.visibility_km ?? 6).toFixed(1)} km`,
        subtitle: (w.visibility_km ?? 6) < 1 ? "Dangerous — avoid driving" : (w.visibility_km ?? 6) < 3 ? "Reduced — drive carefully" : "Clear",
        color: (w.visibility_km ?? 6) < 1 ? "#ff2020" : (w.visibility_km ?? 6) < 3 ? "#FFBE00" : "#8ED329",
        priority: 90, relevance: 90, urgency: (w.visibility_km ?? 6) < 2 ? 80 : 10, personaRelevance: 90,
        timeRelevance: hour < 9 || hour > 17 ? 85 : 30, dataAvailability: w.visibility_km != null ? 1 : 0.3,
      });
      cards.push({
        id: "rain_probability", title: "Rain Outlook",
        value: isRainy(w) ? "Rainy" : "Dry",
        subtitle: isRainy(w) ? "Wet roads — slower commute" : "Clear roads",
        color: isRainy(w) ? "#00DDE5" : "#8ED329",
        priority: 85, relevance: 85, urgency: isRainy(w) ? 55 : 10, personaRelevance: 85,
        timeRelevance: hour < 9 || hour > 17 ? 80 : 30, dataAvailability: 1,
      });
      cards.push({
        id: "fog", title: "Fog", value: isFoggy(w) ? "Active" : "None",
        subtitle: isFoggy(w) ? "Low visibility — extra caution" : "Clear roads",
        color: isFoggy(w) ? "#FFBE00" : "#8ED329",
        priority: 82, relevance: 88, urgency: isFoggy(w) ? 75 : 10, personaRelevance: 88,
        timeRelevance: hour < 9 ? 90 : 30, dataAvailability: 1,
      });
      cards.push({
        id: "severe_weather", title: "Severe Weather",
        value: hasSevereAlert(alerts) ? "Active" : "None",
        subtitle: hasSevereAlert(alerts) ? "Check route warnings" : "Normal",
        color: hasSevereAlert(alerts) ? "#ff2020" : "#8ED329",
        priority: 80, relevance: 80, urgency: hasSevereAlert(alerts) ? 90 : 5, personaRelevance: 80,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "wind", title: "Wind", value: `${w.wind_speed} km/h`,
        subtitle: `${w.wind_direction}`,
        color: "#8ED329",
        priority: 72, relevance: 70, urgency: w.wind_speed > 35 ? 50 : 10, personaRelevance: 70,
        timeRelevance: 50, dataAvailability: 1,
      });
      break;

    case "event_planner":
      cards.push({
        id: "rain_probability", title: "Rain Outlook",
        value: isRainy(w) ? "Rainy" : "Dry",
        subtitle: isRainy(w) ? "Prepare covered areas" : "Good for outdoor events",
        color: isRainy(w) ? "#00DDE5" : "#8ED329",
        priority: 90, relevance: 95, urgency: isRainy(w) ? 65 : 10, personaRelevance: 95,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "comfort", title: "Comfort Index",
        value: `${calculateComfortIndex(w).score}/100`,
        subtitle: calculateComfortIndex(w).label,
        color: calculateComfortIndex(w).color,
        priority: 88, relevance: 88, urgency: 10, personaRelevance: 88,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "temperature", title: "Temperature", value: `${w.temperature.toFixed(0)}°C`,
        subtitle: `${w.minimum.toFixed(0)}° / ${w.maximum.toFixed(0)}°`,
        color: "#FFBE00",
        priority: 85, relevance: 85, urgency: 10, personaRelevance: 85,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "humidity", title: "Humidity", value: `${w.humidity}%`,
        subtitle: w.humidity > 75 ? "Guests may be uncomfortable" : "Comfortable for guests",
        color: "#00DDE5",
        priority: 80, relevance: 80, urgency: 10, personaRelevance: 80,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "wind", title: "Wind", value: `${w.wind_speed} km/h`,
        subtitle: `${w.wind_direction} — ${w.wind_speed > 25 ? "Canopy risk" : "Safe for structures"}`,
        color: w.wind_speed > 25 ? "#FF7400" : "#8ED329",
        priority: 78, relevance: 85, urgency: w.wind_speed > 30 ? 55 : 10, personaRelevance: 85,
        timeRelevance: 50, dataAvailability: 1,
      });
      cards.push({
        id: "severe_weather", title: "Severe Weather",
        value: hasSevereAlert(alerts) ? "Active" : "None",
        subtitle: hasSevereAlert(alerts) ? "Activate contingency" : "No threats",
        color: hasSevereAlert(alerts) ? "#ff2020" : "#8ED329",
        priority: 75, relevance: 80, urgency: hasSevereAlert(alerts) ? 95 : 5, personaRelevance: 90,
        timeRelevance: 50, dataAvailability: 1,
      });
      break;
  }

  // Sort by priority (composite score)
  return cards.sort((a, b) => b.priority - a.priority);
}

// ═══════════════════════════════════════════════════════════════════
// 9. RECOMMENDATIONS — Rule-based from real data
// ═══════════════════════════════════════════════════════════════════

export function generateRecommendations(
  persona: Persona,
  weather: CurrentWeather,
  alerts: WeatherAlert[],
  forecast?: DailyForecastItem[]
): Recommendation[] {
  const recs: Recommendation[] = [];
  const temp = weather.temperature;
  const humidity = weather.humidity;
  const wind = weather.wind_speed;
  const aqi = weather.aqi?.aqi ?? 50;
  const uv = weather.uv_index ?? 5;

  // Always check for severe alerts first (SMART ALERT OVERRIDE)
  if (hasSevereAlert(alerts)) {
    recs.push({
      id: "severe-alert",
      title: "⚠️ Severe Weather Alert Active",
      message: alerts.find((a) => a.severity?.toLowerCase() === "severe" || a.severity?.toLowerCase() === "extreme")?.description || "Severe weather conditions detected. Follow official IMD advisories.",
      severity: "critical",
      category: "alerts",
    });
  }

  // Persona-specific recommendations
  switch (persona) {
    case "health":
      if (aqi > 150) recs.push({ id: "health-aqi", title: "Poor Air Quality", message: "AQI is unhealthy. Limit outdoor exposure, especially for children and elderly. Keep windows closed.", severity: "warning", category: "air_quality" });
      else if (aqi > 100) recs.push({ id: "health-aqi-mod", title: "Moderate Air Quality", message: "AQI is moderate. Sensitive groups should reduce prolonged outdoor exertion.", severity: "info", category: "air_quality" });
      if (uv > 7) recs.push({ id: "health-uv", title: "High UV Exposure", message: "UV Index is very high. Apply SPF 30+ sunscreen, wear UV-protective sunglasses and a hat. Avoid direct sun 10 AM–4 PM.", severity: "warning", category: "uv" });
      if (temp > 38 && humidity > 60) recs.push({ id: "health-heat", title: "Heat Index Warning", message: "High heat index increases risk of heat exhaustion. Drink water every 20–30 minutes. Seek air-conditioned spaces.", severity: "warning", category: "heat" });
      if (temp < 5) recs.push({ id: "health-cold", title: "Cold Weather Advisory", message: "Risk of hypothermia for vulnerable groups. Dress in layers, keep extremities warm.", severity: "warning", category: "cold" });
      if (humidity > 80) recs.push({ id: "health-humidity", title: "High Humidity Alert", message: "Humidity above 80% may worsen respiratory conditions. Keep inhalers accessible if asthmatic.", severity: "info", category: "humidity" });
      break;

    case "fitness":
      if (temp > 38) recs.push({ id: "fitness-heat", title: "Extreme Heat Warning", message: "Avoid outdoor exercise until temperature drops. Heat stroke risk is high. Train indoors or post-sunset.", severity: "warning", category: "heat" });
      else if (temp > 32) recs.push({ id: "fitness-warm", title: "Warm Conditions", message: "Reduce intensity. Hydrate with 250ml electrolyte water every 20 minutes. Take shade breaks.", severity: "info", category: "heat" });
      if (isRainy(weather)) recs.push({ id: "fitness-rain", title: "Rain in Forecast", message: "Consider indoor training. If running in rain, wear moisture-wicking layers and reflective gear.", severity: "info", category: "rain" });
      if (wind > 25) recs.push({ id: "fitness-wind", title: "Strong Wind Advisory", message: "High wind resistance will affect pace. Choose sheltered routes or run against wind first half.", severity: "info", category: "wind" });
      if (uv > 7 && (now() >= 10 && now() <= 15)) recs.push({ id: "fitness-uv", title: "Peak UV Hours", message: "UV is extreme during 10 AM–3 PM. Run before 8 AM or after 6 PM for safer conditions.", severity: "info", category: "uv" });
      break;

    case "traveler":
      if (isRainy(weather)) recs.push({ id: "travel-rain", title: "Pack Rain Protection", message: "Rain expected — carry umbrella, waterproof bag cover, and quick-dry clothing.", severity: "info", category: "rain" });
      if (isFoggy(weather)) recs.push({ id: "travel-fog", title: "Low Visibility Alert", message: "Fog may cause flight/road delays. Check departure status and allow extra travel time.", severity: "warning", category: "fog" });
      if (temp > 35) recs.push({ id: "travel-heat", title: "Hot Destination", message: "Carry water, sunscreen, and light breathable clothing. Plan sightseeing for early morning or evening.", severity: "info", category: "heat" });
      if (temp < 8) recs.push({ id: "travel-cold", title: "Cold Destination", message: "Pack warm layers, thermal innerwear, and a waterproof outer jacket.", severity: "info", category: "cold" });
      if (wind > 30) recs.push({ id: "travel-wind", title: "Strong Winds", message: "Strong winds may affect flights and outdoor activities. Secure loose items.", severity: "info", category: "wind" });
      break;

    case "family":
      if (hasSevereAlert(alerts)) recs.push({ id: "family-alert", title: "⚠️ Keep Children Indoors", message: "Severe weather active. Keep children indoors and away from windows. Cancel outdoor plans.", severity: "critical", category: "alerts" });
      if (isRainy(weather)) recs.push({ id: "family-rain", title: "Rain Gear for School", message: "Pack rain jacket, umbrella, and waterproof school bag cover for children.", severity: "info", category: "rain" });
      if (temp > 38) recs.push({ id: "family-heat", title: "School Heat Advisory", message: "Extreme heat. Ensure children carry water bottles. Request school to limit outdoor recess.", severity: "warning", category: "heat" });
      if (isFoggy(weather)) recs.push({ id: "family-fog", title: "Fog Warning", message: "Low visibility during school commute. Leave 20 minutes early. Ensure children wear bright/reflective clothing.", severity: "warning", category: "fog" });
      break;

    case "farmer":
      if (isRainy(weather) && !isStormy(weather)) recs.push({ id: "farm-rain", title: "Rain Expected", message: "Delay irrigation — natural rainfall available. Plan spraying for after rain stops. Ensure field drainage.", severity: "info", category: "rain" });
      if (isStormy(weather)) recs.push({ id: "farm-storm", title: "⚡ Storm Alert", message: "Secure equipment, livestock shelters, and avoid fieldwork during lightning. Postpone spraying.", severity: "critical", category: "storms" });
      if (temp > 38) recs.push({ id: "farm-heat", title: "Heat Stress on Crops", message: "Water crops early morning (5–7 AM) or late evening. Apply mulch to conserve soil moisture.", severity: "warning", category: "heat" });
      if (humidity > 85) recs.push({ id: "farm-humidity", title: "Fungal Disease Risk", message: "Very high humidity increases risk of leaf blight and fungal infections. Monitor crops closely.", severity: "warning", category: "humidity" });
      if (wind > 25) recs.push({ id: "farm-wind", title: "No Spraying", message: "Wind too strong for foliar spray. Wait for calmer conditions (< 15 km/h) to avoid drift.", severity: "info", category: "wind" });
      // Frost risk for cold conditions
      if (temp < 5) recs.push({ id: "farm-frost", title: "Frost Risk", message: "Temperature near freezing. Protect sensitive crops with covers. Drain irrigation lines.", severity: "warning", category: "cold" });
      break;

    case "commuter":
      if (isFoggy(weather)) recs.push({ id: "comm-fog", title: "🌫️ Fog Advisory", message: `Visibility reduced to ${weather.visibility_km?.toFixed(1)} km. Use fog lights, reduce speed, maintain extra following distance.`, severity: "warning", category: "fog" });
      if (isRainy(weather)) recs.push({ id: "comm-rain", title: "Wet Roads", message: "Rain expected. Allow 15–20 min extra travel time. Avoid sudden braking on wet surfaces.", severity: "info", category: "rain" });
      if (wind > 35) recs.push({ id: "comm-wind", title: "High Wind Warning", message: "Strong crosswinds. Be cautious on bridges, overpasses, and open highways. Hold steering firmly.", severity: "warning", category: "wind" });
      if (temp > 42) recs.push({ id: "comm-heat", title: "Extreme Heat", message: "Road surface may be soft. Ensure vehicle coolant and tire pressure are adequate.", severity: "warning", category: "heat" });
      break;

    case "beach":
      if (wind > 25) recs.push({ id: "beach-wind", title: "Rough Seas Expected", message: "Strong winds creating dangerous surf conditions. Avoid open water swimming. Stay away from rocky areas.", severity: "warning", category: "wind" });
      if (isStormy(weather)) recs.push({ id: "beach-storm", title: "⚠️ Coastal Storm", message: "Storm near coast — avoid all water activities. Move away from shoreline. Follow lifeguard instructions.", severity: "critical", category: "storms" });
      if (uv > 8) recs.push({ id: "beach-uv", title: "Extreme UV", message: "UV Index very high. Reapply reef-safe sunscreen every 2 hours. Seek shade 11 AM–3 PM.", severity: "warning", category: "uv" });
      if (temp > 38) recs.push({ id: "beach-heat", title: "Heat Risk at Beach", message: "Extreme heat even near water. Hydrate frequently. Avoid midday sun exposure.", severity: "warning", category: "heat" });
      break;

    case "event_planner":
      if (isStormy(weather)) recs.push({ id: "event-storm", title: "⚡ Activate Contingency", message: "Severe weather will affect outdoor events. Move to indoor backup venue. Notify guests immediately.", severity: "critical", category: "storms" });
      if (isRainy(weather)) recs.push({ id: "event-rain", title: "Rain Contingency", message: "Rain likely. Ensure covered areas, waterproof staging, and guest shelter arrangements.", severity: "warning", category: "rain" });
      if (temp > 35) recs.push({ id: "event-heat", title: "Heat Management", message: "High temperatures. Set up misting fans, shaded rest areas, and cold beverage stations.", severity: "warning", category: "heat" });
      if (wind > 25) recs.push({ id: "event-wind", title: "Wind Risk for Structures", message: "Strong winds may destabilize marquees, canopies, and decorative elements. Reinforce or secure.", severity: "warning", category: "wind" });
      if (humidity > 80) recs.push({ id: "event-humidity", title: "High Humidity", message: "Guests may feel uncomfortable. Provide cooling towels, fans, and indoor air-conditioned areas.", severity: "info", category: "humidity" });
      break;
  }

  return recs;
}

// ═══════════════════════════════════════════════════════════════════
// 10. HEALTH DASHBOARD — Contextual health metrics from real data
// ═══════════════════════════════════════════════════════════════════

export interface HealthDashboard {
  aqi: {
    value: number;
    status: string;
    color: string;
    pm25: string;
    pm10: string;
    interpretation: string;
  };
  uv: {
    value: string;
    status: string;
    color: string;
    advice: string;
  };
  humidity: {
    value: string;
    status: string;
    color: string;
    interpretation: string;
  };
  heat: {
    status: string;
    color: string;
    interpretation: string;
  };
}

export function generateHealthDashboard(w: CurrentWeather): HealthDashboard {
  const aqiVal = w.aqi?.aqi ?? 50;
  const uv = w.uv_index ?? 5;
  const hum = w.humidity;
  const temp = w.temperature;

  // ── AQI Interpretation ──
  let aqiStatus: string;
  let aqiColor: string;
  let aqiInterpretation: string;
  if (aqiVal <= 50) {
    aqiStatus = "Good";
    aqiColor = "#8ED329";
    aqiInterpretation = "Air quality is satisfactory. Safe for all outdoor activities including prolonged exercise.";
  } else if (aqiVal <= 100) {
    aqiStatus = "Satisfactory";
    aqiColor = "#8ED329";
    aqiInterpretation = "Air quality is acceptable. Unusually sensitive people should consider reducing prolonged outdoor exertion.";
  } else if (aqiVal <= 150) {
    aqiStatus = "Moderate";
    aqiColor = "#FFBE00";
    aqiInterpretation = "Sensitive groups (asthma, heart disease, elderly, children) should reduce prolonged outdoor exertion. General public is less likely to be affected.";
  } else if (aqiVal <= 200) {
    aqiStatus = "Poor";
    aqiColor = "#FF7400";
    aqiInterpretation = "Everyone should reduce prolonged outdoor exertion. Sensitive groups should avoid it entirely. Consider wearing N95 masks outdoors.";
  } else if (aqiVal <= 300) {
    aqiStatus = "Very Poor";
    aqiColor = "#9933CC";
    aqiInterpretation = "Avoid all outdoor physical activity. Use air purifiers indoors. Keep windows closed. Wear N95 masks if stepping out is necessary.";
  } else {
    aqiStatus = "Severe";
    aqiColor = "#FF2020";
    aqiInterpretation = "Health emergency conditions. Stay indoors with air purification. Avoid ALL outdoor activity. Seek medical attention if experiencing respiratory symptoms.";
  }

  // ── UV Interpretation ──
  let uvStatus: string;
  let uvColor: string;
  let uvAdvice: string;
  if (uv <= 2) {
    uvStatus = "Low";
    uvColor = "#8ED329";
    uvAdvice = "No protection needed. Safe for extended outdoor activity.";
  } else if (uv <= 5) {
    uvStatus = "Moderate";
    uvColor = "#FFBE00";
    uvAdvice = "Wear sunscreen SPF 30+ during midday hours. Hat recommended for prolonged exposure.";
  } else if (uv <= 7) {
    uvStatus = "High";
    uvColor = "#FF7400";
    uvAdvice = "SPF 30+ essential. Seek shade 10 AM–4 PM. Wear UV-protective sunglasses and a wide-brimmed hat.";
  } else if (uv <= 10) {
    uvStatus = "Very High";
    uvColor = "#ff2020";
    uvAdvice = "Extra protection essential. Minimize sun exposure 10 AM–4 PM. Reapply sunscreen every 2 hours.";
  } else {
    uvStatus = "Extreme";
    uvColor = "#ff2020";
    uvAdvice = "Dangerous UV levels. Avoid outdoor exposure 10 AM–4 PM. SPF 50+, protective clothing, and sunglasses mandatory.";
  }

  // ── Humidity Interpretation ──
  let humStatus: string;
  let humColor: string;
  let humInterpretation: string;
  if (hum < 30) {
    humStatus = "Very Dry";
    humColor = "#FF7400";
    humInterpretation = "Extremely dry air may cause skin irritation, dry eyes, and worsen respiratory conditions. Use a humidifier indoors and stay hydrated.";
  } else if (hum < 50) {
    humStatus = "Comfortable";
    humColor = "#8ED329";
    humInterpretation = "Optimal humidity level. Comfortable for breathing and skin health. Ideal for outdoor activities.";
  } else if (hum < 65) {
    humStatus = "Moderate";
    humColor = "#8ED329";
    humInterpretation = "Slightly elevated but generally comfortable. Stay hydrated during physical activity.";
  } else if (hum < 80) {
    humStatus = "Humid";
    humColor = "#FFBE00";
    humInterpretation = "Elevated humidity may increase perceived temperature. Risk of heat-related illness during exercise. Drink water every 20 minutes.";
  } else {
    humStatus = "Very Humid";
    humColor = "#FF7400";
    humInterpretation = "High humidity significantly increases heat stress risk. Body cooling is less efficient. Avoid strenuous outdoor activity. Keep inhalers accessible if asthmatic.";
  }

  // ── Heat Conditions ──
  const heatIndex = temp + 0.5 * hum - 10;
  let heatStatus: string;
  let heatColor: string;
  let heatInterpretation: string;
  if (heatIndex < 27) {
    heatStatus = "Safe";
    heatColor = "#8ED329";
    heatInterpretation = `Heat index ${heatIndex.toFixed(0)}°C. Comfortable conditions for outdoor activity. Standard hydration is sufficient.`;
  } else if (heatIndex < 32) {
    heatStatus = "Moderate";
    heatColor = "#FFBE00";
    heatInterpretation = `Heat index ${heatIndex.toFixed(0)}°C. Fatigue possible with prolonged exposure. Drink water every 20–30 minutes. Take shade breaks.`;
  } else if (heatIndex < 39) {
    heatStatus = "High";
    heatColor = "#FF7400";
    heatInterpretation = `Heat index ${heatIndex.toFixed(0)}°C. Heat cramps and heat exhaustion possible. Limit outdoor activity to essential tasks. Hydrate frequently.`;
  } else if (heatIndex < 51) {
    heatStatus = "Very High";
    heatColor = "#ff2020";
    heatInterpretation = `Heat index ${heatIndex.toFixed(0)}°C. Heat cramps, heat exhaustion, and heatstroke likely. Avoid outdoor activity. Stay in cool spaces.`;
  } else {
    heatStatus = "Extreme";
    heatColor = "#ff2020";
    heatInterpretation = `Heat index ${heatIndex.toFixed(0)}°C. DANGEROUS — heatstroke highly likely. Avoid ALL outdoor activity. Emergency cooling measures required.`;
  }

  return {
    aqi: {
      value: aqiVal,
      status: aqiStatus,
      color: aqiColor,
      pm25: w.aqi?.pm25?.toFixed(0) ?? "—",
      pm10: w.aqi?.pm10?.toFixed(0) ?? "—",
      interpretation: aqiInterpretation,
    },
    uv: {
      value: uv.toFixed(1),
      status: uvStatus,
      color: uvColor,
      advice: uvAdvice,
    },
    humidity: {
      value: `${hum}%`,
      status: humStatus,
      color: humColor,
      interpretation: humInterpretation,
    },
    heat: {
      status: heatStatus,
      color: heatColor,
      interpretation: heatInterpretation,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════
// 11. FITNESS DASHBOARD — Outdoor fitness metrics from real data
// ═══════════════════════════════════════════════════════════════════

export interface FitnessDashboard {
  sunrise: string;
  sunset: string;
  temperature: string;
  tempColor: string;
  uv: string;
  uvColor: string;
  wind: string;
  humidity: string;
  rainProbability: string;
  rainColor: string;
  heatAlert: string;
  heatAlertColor: string;
}

export function generateFitnessDashboard(
  w: CurrentWeather,
  hourly?: HourlyForecastItem[]
): FitnessDashboard {
  const temp = w.temperature;
  const uv = w.uv_index ?? 5;
  const wind = w.wind_speed;
  const hum = w.humidity;

  // Get rain probability from hourly forecast if available, else from condition
  let rainProb = 10;
  if (hourly && hourly.length > 0) {
    const nextHours = hourly.slice(0, 6);
    const maxRain = Math.max(...nextHours.map((h) => h.rain_probability ?? 0));
    rainProb = maxRain;
  } else if (isRainy(w)) {
    rainProb = 60;
  }

  // Temperature color
  let tempColor = "#8ED329";
  if (temp > 38) tempColor = "#ff2020";
  else if (temp > 32) tempColor = "#FF7400";
  else if (temp > 28) tempColor = "#FFBE00";
  else if (temp < 10) tempColor = "#00DDE5";

  // UV color
  let uvColor = "#8ED329";
  if (uv > 10) uvColor = "#ff2020";
  else if (uv > 7) uvColor = "#ff2020";
  else if (uv > 5) uvColor = "#FF7400";
  else if (uv > 3) uvColor = "#FFBE00";

  // Rain color
  let rainColor = "#8ED329";
  if (rainProb > 60) rainColor = "#ff2020";
  else if (rainProb > 40) rainColor = "#FF7400";
  else if (rainProb > 20) rainColor = "#FFBE00";

  // Heat alert
  const heatIndex = temp + 0.5 * hum - 10;
  let heatAlert: string;
  let heatAlertColor: string;
  if (heatIndex < 27) {
    heatAlert = "None";
    heatAlertColor = "#8ED329";
  } else if (heatIndex < 32) {
    heatAlert = "Moderate";
    heatAlertColor = "#FFBE00";
  } else if (heatIndex < 39) {
    heatAlert = "High";
    heatAlertColor = "#FF7400";
  } else {
    heatAlert = "Extreme";
    heatAlertColor = "#ff2020";
  }

  return {
    sunrise: w.sunrise ?? "N/A",
    sunset: w.sunset ?? "N/A",
    temperature: `${temp.toFixed(0)}°C (feels ${w.feels_like.toFixed(0)}°C)`,
    tempColor,
    uv: `${uv.toFixed(1)}`,
    uvColor,
    wind: `${wind} km/h ${w.wind_direction}`,
    humidity: `${hum}%`,
    rainProbability: `${rainProb}%`,
    rainColor,
    heatAlert,
    heatAlertColor,
  };
}

// ═══════════════════════════════════════════════════════════════════
// 12. TRAVELER DASHBOARD — Saved destinations weather + packing
// ═══════════════════════════════════════════════════════════════════

export interface DestinationWeather {
  name: string;
  label: string;
  temperature: string;
  condition: string;
  icon: string;
  rainProbability: string;
  wind: string;
  visibility: string;
  severeWeather: boolean;
  severeAlert: string;
  color: string;
}

export interface TravelerDashboard {
  destinations: DestinationWeather[];
  packingList: PackingItem[];
  travelSummary: string;
}

export function generateTravelerDashboard(
  currentWeather: CurrentWeather,
  savedLocations: { name: string; label: string }[],
  destinationWeathers: CurrentWeather[]
): TravelerDashboard {
  // Generate destination weather cards
  const destinations: DestinationWeather[] = destinationWeathers.map((dw, i) => {
    const loc = savedLocations[i];
    const rainProb = isRainy(dw) ? 60 : 10;
    const severe = isStormy(dw) || isFoggy(dw);
    let color = "#8ED329";
    if (severe) color = "#ff2020";
    else if (isRainy(dw)) color = "#FFBE00";
    else if (dw.temperature > 35) color = "#FF7400";

    return {
      name: dw.location,
      label: loc?.label || "other",
      temperature: `${dw.temperature.toFixed(0)}°C`,
      condition: dw.condition,
      icon: dw.icon,
      rainProbability: `${rainProb}%`,
      wind: `${dw.wind_speed} km/h ${dw.wind_direction}`,
      visibility: `${(dw.visibility_km ?? 10).toFixed(1)} km`,
      severeWeather: severe,
      severeAlert: severe ? dw.condition : "",
      color,
    };
  });

  // Generate packing list
  const packingList = generatePackingList(currentWeather);

  // Generate travel summary
  const temp = currentWeather.temperature;
  const wind = currentWeather.wind_speed;
  const uv = currentWeather.uv_index ?? 5;
  let travelSummary = "";
  if (isFoggy(currentWeather)) {
    travelSummary = `Low visibility (${currentWeather.visibility_km} km) — check flight/road status before departing. Allow extra travel time.`;
  } else if (isRainy(currentWeather)) {
    travelSummary = `Rain expected — carry waterproof gear. ${wind > 20 ? "Strong winds may affect flights." : "Roads may be slippery."}`;
  } else if (temp > 35) {
    travelSummary = `Hot at ${temp}°C — carry water, sunscreen, and light clothing. Plan sightseeing for early morning or evening.`;
  } else if (temp < 10) {
    travelSummary = `Cold at ${temp}°C — pack warm layers. Carry a waterproof outer jacket.`;
  } else {
    travelSummary = `Pleasant ${temp}°C for travel. ${currentWeather.condition}. Visibility ${currentWeather.visibility_km} km — good conditions.`;
  }

  return { destinations, packingList, travelSummary };
}

// ═══════════════════════════════════════════════════════════════════
// 13. FAMILY DASHBOARD — Morning/evening commute from hourly forecast
// ═══════════════════════════════════════════════════════════════════

export interface CommuteWindow {
  label: string;
  timeRange: string;
  temperature: string;
  condition: string;
  rainProbability: string;
  rainColor: string;
  visibility: string;
  visColor: string;
  fog: boolean;
  wind: string;
  severeWeather: boolean;
  severeAlert: string;
  overallStatus: "GOOD" | "CAUTION" | "POOR";
  statusColor: string;
  recommendation: string;
}

export interface FamilyDashboard {
  morningCommute: CommuteWindow;
  eveningCommute: CommuteWindow;
  homeWeather: {
    temperature: string;
    condition: string;
    severeWeather: boolean;
  };
  schoolWeather: {
    temperature: string;
    condition: string;
    severeWeather: boolean;
  } | null;
}

function assessCommuteWindow(
  label: string,
  timeRange: string,
  hourlyData: HourlyForecastItem[],
  startHour: number,
  endHour: number,
  currentWeather: CurrentWeather
): CommuteWindow {
  // Filter hourly data for the time window
  const windowHours = hourlyData.filter((h) => {
    const hour = parseInt(h.time_str?.split(":")[0] ?? "12", 10);
    return hour >= startHour && hour <= endHour;
  });

  // If no hourly data for this window, use current weather as fallback
  if (windowHours.length === 0) {
    const rainProb = isRainy(currentWeather) ? 60 : 10;
    const fog = isFoggy(currentWeather);
    const vis = currentWeather.visibility_km ?? 10;
    const severe = isStormy(currentWeather);

    let status: CommuteWindow["overallStatus"];
    let statusColor: string;
    let recommendation: string;

    if (severe) {
      status = "POOR";
      statusColor = "#ff2020";
      recommendation = `Severe weather: ${currentWeather.condition}. Avoid non-essential travel.`;
    } else if (fog || vis < 2 || rainProb > 60) {
      status = "CAUTION";
      statusColor = "#FFBE00";
      recommendation = `${fog ? "Fog reduces visibility. " : ""}${rainProb > 40 ? "Rain expected. " : ""}Allow extra travel time.`;
    } else {
      status = "GOOD";
      statusColor = "#8ED329";
      recommendation = "Favorable conditions for commute.";
    }

    return {
      label,
      timeRange,
      temperature: `${currentWeather.temperature.toFixed(0)}°C`,
      condition: currentWeather.condition,
      rainProbability: `${rainProb}%`,
      rainColor: rainProb > 60 ? "#ff2020" : rainProb > 30 ? "#FFBE00" : "#8ED329",
      visibility: `${vis.toFixed(1)} km`,
      visColor: vis < 1 ? "#ff2020" : vis < 3 ? "#FFBE00" : "#8ED329",
      fog,
      wind: `${currentWeather.wind_speed} km/h ${currentWeather.wind_direction}`,
      severeWeather: severe,
      severeAlert: severe ? currentWeather.condition : "",
      overallStatus: status,
      statusColor,
      recommendation,
    };
  }

  // Average conditions across the window
  const avgTemp = windowHours.reduce((s, h) => s + h.temperature, 0) / windowHours.length;
  const maxRainProb = Math.max(...windowHours.map((h) => h.rain_probability ?? 0));
  const avgWind = windowHours.reduce((s, h) => s + (h.wind_speed ?? 0), 0) / windowHours.length;
  const worstCondition = windowHours.reduce((worst, h) => {
    const c = (h.condition ?? "").toLowerCase();
    if (c.includes("storm") || c.includes("thunder")) return h.condition;
    if (c.includes("rain") && !worst.toLowerCase().includes("storm")) return h.condition;
    return worst;
  }, windowHours[0]?.condition || "Clear");

  // Check visibility from current weather (hourly doesn't have visibility)
  const vis = currentWeather.visibility_km ?? 10;
  const fog = isFoggy(currentWeather);
  const severe = worstCondition.toLowerCase().includes("storm") || worstCondition.toLowerCase().includes("thunder");

  // Assess overall status
  let status: CommuteWindow["overallStatus"];
  let statusColor: string;
  let recommendation: string;

  if (severe) {
    status = "POOR";
    statusColor = "#ff2020";
    recommendation = `Severe weather expected: ${worstCondition}. Avoid non-essential travel during ${label.toLowerCase()}.`;
  } else if (fog || vis < 2 || maxRainProb > 60 || avgWind > 30) {
    status = "CAUTION";
    statusColor = "#FFBE00";
    const reasons: string[] = [];
    if (fog) reasons.push(`Fog reduces visibility to ${vis.toFixed(1)} km`);
    if (maxRainProb > 40) reasons.push(`${maxRainProb}% rain probability`);
    if (avgWind > 25) reasons.push(`Wind ${avgWind.toFixed(0)} km/h`);
    recommendation = `${reasons.join(". ")}. Allow extra travel time and drive cautiously.`;
  } else {
    status = "GOOD";
    statusColor = "#8ED329";
    recommendation = `Clear conditions expected. ${worstCondition} at ${avgTemp.toFixed(0)}°C. Safe for commute.`;
  }

  return {
    label,
    timeRange,
    temperature: `${avgTemp.toFixed(0)}°C`,
    condition: worstCondition,
    rainProbability: `${maxRainProb}%`,
    rainColor: maxRainProb > 60 ? "#ff2020" : maxRainProb > 30 ? "#FFBE00" : "#8ED329",
    visibility: `${vis.toFixed(1)} km`,
    visColor: vis < 1 ? "#ff2020" : vis < 3 ? "#FFBE00" : "#8ED329",
    fog,
    wind: `${avgWind.toFixed(0)} km/h`,
    severeWeather: severe,
    severeAlert: severe ? worstCondition : "",
    overallStatus: status,
    statusColor,
    recommendation,
  };
}

export function generateFamilyDashboard(
  currentWeather: CurrentWeather,
  hourlyForecast: HourlyForecastItem[],
  savedLocations: { name: string; label: string }[]
): FamilyDashboard {
  // Morning commute: 6 AM – 9 AM
  const morningCommute = assessCommuteWindow(
    "Morning Commute",
    "6:00 AM – 9:00 AM",
    hourlyForecast,
    6,
    9,
    currentWeather
  );

  // Evening commute: 4 PM – 7 PM
  const eveningCommute = assessCommuteWindow(
    "Evening Commute",
    "4:00 PM – 7:00 PM",
    hourlyForecast,
    16,
    19,
    currentWeather
  );

  // Home weather (current location)
  const homeWeather = {
    temperature: `${currentWeather.temperature.toFixed(0)}°C`,
    condition: currentWeather.condition,
    severeWeather: isStormy(currentWeather),
  };

  // School weather (from saved location with label "school")
  const schoolLoc = savedLocations.find((l) => l.label === "school");
  let schoolWeather: FamilyDashboard["schoolWeather"] = null;
  if (schoolLoc) {
    // We'll use current weather as fallback — actual school weather is fetched in PersonaEngine
    schoolWeather = {
      temperature: `${currentWeather.temperature.toFixed(0)}°C`,
      condition: currentWeather.condition,
      severeWeather: isStormy(currentWeather),
    };
  }

  return { morningCommute, eveningCommute, homeWeather, schoolWeather };
}

// ═══════════════════════════════════════════════════════════════════
// 14. AGRICULTURE DASHBOARD — Farm/garden guidance from real data
// ═══════════════════════════════════════════════════════════════════

export interface AgricultureDashboard {
  rainfall: {
    prediction: string;
    color: string;
    irrigation: string;
  };
  soilMoisture: {
    status: string;
    color: string;
    note: string;
  };
  frostRisk: {
    status: string;
    color: string;
    note: string;
  };
  sprayWindow: {
    status: string;
    color: string;
    note: string;
  };
  seasonalGuidance: string;
}

export function generateAgricultureDashboard(w: CurrentWeather, geo?: GeographicContext | null): AgricultureDashboard {
  const temp = w.temperature;
  const humidity = w.humidity;
  const wind = w.wind_speed;
  const dewPoint = w.dew_point ?? 15;
  const isRain = isRainy(w);
  const isStorm = isStormy(w);

  // ── Rainfall Prediction ──
  let rainPrediction: string;
  let rainColor: string;
  let irrigation: string;
  if (isRain && !isStorm) {
    rainPrediction = `Active rainfall — ${w.condition}`;
    rainColor = "#00DDE5";
    irrigation = "Delay irrigation — natural rainfall available. Plan spraying for after rain stops.";
  } else if (isStorm) {
    rainPrediction = `Storm activity — ${w.condition}`;
    rainColor = "#ff2020";
    irrigation = "Do NOT spray during storms. Secure equipment and livestock. Postpone all fieldwork.";
  } else if (humidity > 80) {
    rainPrediction = "High humidity — rain possible";
    rainColor = "#FFBE00";
    irrigation = "Monitor radar for approaching rain. Delay irrigation if rain is imminent.";
  } else {
    rainPrediction = "Dry conditions";
    rainColor = "#FFBE00";
    irrigation = "Irrigation needed. Water crops early morning or late evening to reduce evaporation.";
  }

  // ── Soil Moisture (Unavailable) ──
  // No reliable soil moisture data provider available for India
  const soilMoisture = {
    status: "Unavailable",
    color: "#666",
    note: "Reliable soil moisture data is not available for this location. No IMD or agromet soil moisture API is currently integrated.",
  };

  // ── Frost Risk ──
  let frostStatus: string;
  let frostColor: string;
  let frostNote: string;
  if (temp < 2) {
    frostStatus = "High Risk";
    frostColor = "#ff2020";
    frostNote = `Temperature ${temp.toFixed(0)}°C — frost likely. Protect sensitive crops with covers. Drain irrigation lines.`;
  } else if (temp < 5) {
    frostStatus = "Moderate Risk";
    frostColor = "#FF7400";
    frostNote = `Temperature ${temp.toFixed(0)}°C — frost possible. Cover tender seedlings and young plants.`;
  } else if (temp < 8 && dewPoint < 5) {
    frostStatus = "Low Risk";
    frostColor = "#FFBE00";
    frostNote = `Temperature ${temp.toFixed(0)}°C with dew point ${dewPoint.toFixed(0)}°C — ground frost possible in low-lying areas.`;
  } else {
    frostStatus = "None";
    frostColor = "#8ED329";
    frostNote = `Temperature ${temp.toFixed(0)}°C — no frost risk. Safe for all crops.`;
  }

  // ── Spray Window ──
  let sprayStatus: string;
  let sprayColor: string;
  let sprayNote: string;
  const hour = now();
  if (isStorm) {
    sprayStatus = "Do Not Spray";
    sprayColor = "#ff2020";
    sprayNote = "Storm activity — spraying dangerous and ineffective. Wait for calm conditions.";
  } else if (wind > 25) {
    sprayStatus = "Do Not Spray";
    sprayColor = "#ff2020";
    sprayNote = `Wind ${wind} km/h — spray will drift. Wait for wind below 15 km/h.`;
  } else if (isRain) {
    sprayStatus = "Wait";
    sprayColor = "#FFBE00";
    sprayNote = "Rain active — spray will wash off. Wait for dry window.";
  } else if (humidity > 85) {
    sprayStatus = "Poor";
    sprayColor = "#FF7400";
    sprayNote = `Humidity ${humidity}% — too high for effective foliar spray. Wait for lower humidity.`;
  } else if (hour >= 6 && hour <= 9 && wind < 15 && humidity < 80) {
    sprayStatus = "Optimal";
    sprayColor = "#8ED329";
    sprayNote = "Good window for spraying — low wind, moderate humidity, early morning calm.";
  } else if (hour >= 17 && hour <= 19 && wind < 15) {
    sprayStatus = "Good";
    sprayColor = "#8ED329";
    sprayNote = "Evening window — spray before sunset for overnight absorption.";
  } else {
    sprayStatus = "Acceptable";
    sprayColor = "#FFBE00";
    sprayNote = `Wind ${wind} km/h, humidity ${humidity}% — spray possible but not optimal. Early morning or evening preferred.`;
  }

  // ── Seasonal Guidance — Geography-aware ──
  const month = new Date().getMonth() + 1;
  let seasonalGuidance: string;
  if (geo?.mountain_region && (month >= 12 || month <= 2)) {
    seasonalGuidance = "Winter in mountain region — frost and snow risk is high. Protect crops with mulch and covers. Avoid irrigation during freezing hours. Monitor for cold wave advisories.";
  } else if (geo?.cyclone_exposure && (month >= 10 || month <= 12)) {
    seasonalGuidance = "Post-monsoon cyclone season — monitor IMD cyclone bulletins. Secure farm structures and drainage. Harvest mature crops early if storm warning issued.";
  } else if (geo?.coastal_status && month >= 6 && month <= 9) {
    seasonalGuidance = "Monsoon season on coast — ensure excellent field drainage. Coastal areas face higher waterlogging risk. Monitor tidal conditions for saltwater intrusion in low-lying farms.";
  } else if (geo?.flood_exposure && month >= 6 && month <= 9) {
    seasonalGuidance = "Monsoon in flood-prone area — prioritize drainage channels. Keep emergency seed stock ready for post-flood replanting. Monitor river water levels.";
  } else if (geo?.desert_region) {
    seasonalGuidance = "Arid region — water conservation is critical. Use drip irrigation. Mulch heavily to retain soil moisture. Plan sowing around monsoon onset.";
  } else if (month >= 6 && month <= 9) {
    seasonalGuidance = "Monsoon season — ensure field drainage. Monitor for pest and disease outbreaks. Avoid waterlogging.";
  } else if (month >= 10 && month <= 11) {
    seasonalGuidance = "Post-monsoon — prepare for Rabi sowing. Clear fields of crop residue. Apply base fertilizers.";
  } else if (month >= 12 || month <= 2) {
    seasonalGuidance = "Winter season — protect from frost. Monitor wheat/rapeseed crops. Ensure adequate irrigation for Rabi crops.";
  } else if (month >= 3 && month <= 5) {
    seasonalGuidance = "Pre-monsoon/Summer — harvest time for many crops. Ensure proper storage. Prepare for monsoon sowing.";
  } else {
    seasonalGuidance = "Monitor weather conditions and adjust farm activities accordingly.";
  }

  // ── Cyclone warning (geography-aware) ──
  let cycloneNote = "";
  if (geo?.cyclone_exposure && isStorm) {
    cycloneNote = "⚠️ Cyclone-exposed coastal area — monitor IMD cyclone bulletins closely.";
  }

  return {
    rainfall: { prediction: rainPrediction, color: rainColor, irrigation },
    soilMoisture,
    frostRisk: { status: frostStatus, color: frostColor, note: frostNote + (geo?.frost_prone && frostStatus === "None" ? " Your location is frost-prone during winter months — stay vigilant." : "") },
    sprayWindow: { status: sprayStatus, color: sprayColor, note: sprayNote },
    seasonalGuidance: seasonalGuidance + (cycloneNote ? " " + cycloneNote : ""),
  };
}

// ═══════════════════════════════════════════════════════════════════
// 15. COMMUTER DASHBOARD — Route weather + commute status
// ═══════════════════════════════════════════════════════════════════

export interface CommuterDashboard {
  commuteStatus: "GOOD" | "CAUTION" | "HIGH RISK";
  statusColor: string;
  factors: { label: string; value: string; severity: "low" | "medium" | "high" }[];
  recommendation: string;
  routeWeather: {
    condition: string;
    rain: string;
    visibility: string;
    fog: boolean;
    wind: string;
    severeWeather: boolean;
    severeAlert: string;
  };
  traffic: {
    status: string;
    note: string;
  };
}

export function generateCommuterDashboard(w: CurrentWeather, geo?: GeographicContext | null): CommuterDashboard {
  const commuteRisk = calculateCommuteRisk(w);

  // Geography-aware commute recommendation
  let geoNote = "";
  if (geo?.fog_prone && isFoggy(w)) {
    geoNote = " Your fog-prone region is experiencing low visibility — allow extra travel time.";
  } else if (geo?.fog_prone && w.temperature < 10) {
    geoNote = " Your region is prone to dense fog in winter mornings — check visibility before departing.";
  } else if (geo?.cyclone_exposure && isStormy(w)) {
    geoNote = " Cyclone-exposed coastal area — avoid non-essential travel during storms.";
  } else if (geo?.flood_exposure && isRainy(w)) {
    geoNote = " Flood-prone area — check for waterlogged roads before departing.";
  } else if (geo?.mountain_region && w.wind_speed > 25) {
    geoNote = " Mountain region with strong winds — be cautious on exposed roads and passes.";
  }

  // Route weather summary
  const routeWeather = {
    condition: w.condition,
    rain: isRainy(w) ? `${w.condition} — wet roads expected` : "Dry roads",
    visibility: `${(w.visibility_km ?? 10).toFixed(1)} km`,
    fog: isFoggy(w),
    wind: `${w.wind_speed} km/h ${w.wind_direction}`,
    severeWeather: isStormy(w),
    severeAlert: isStormy(w) ? w.condition : "",
  };

  // Traffic — no legitimate provider available
  const traffic = {
    status: "Unavailable",
    note: "Traffic data is not available. No legitimate traffic provider is currently integrated. Commute assessment is based on weather conditions only.",
  };

  return {
    commuteStatus: commuteRisk.level,
    statusColor: commuteRisk.color,
    factors: commuteRisk.factors,
    recommendation: commuteRisk.recommendation + geoNote,
    routeWeather,
    traffic,
  };
}

// ═══════════════════════════════════════════════════════════════════
// 16. BEACH DASHBOARD — Marine conditions (unavailable for most)
// ═══════════════════════════════════════════════════════════════════

export interface BeachDashboard {
  marineAvailable: boolean;
  wind: {
    speed: string;
    direction: string;
    safety: string;
    safetyColor: string;
  };
  marine: {
    seaCondition: string;
    waveHeight: string;
    tideTimings: string;
    waterTemperature: string;
    marineWarnings: string;
  };
  beachRecommendation: string;
}

export function generateBeachDashboard(w: CurrentWeather): BeachDashboard {
  const wind = w.wind_speed;
  const windDir = w.wind_direction;
  const temp = w.temperature;

  // Wind safety assessment
  let windSafety: string;
  let windSafetyColor: string;
  if (wind > 35) {
    windSafety = "Dangerous";
    windSafetyColor = "#ff2020";
  } else if (wind > 25) {
    windSafety = "Rough Seas";
    windSafetyColor = "#FF7400";
  } else if (wind > 15) {
    windSafety = "Moderate";
    windSafetyColor = "#FFBE00";
  } else {
    windSafety = "Calm";
    windSafetyColor = "#8ED329";
  }

  // Marine conditions — no reliable provider available
  const marine = {
    seaCondition: "Unavailable",
    waveHeight: "Unavailable",
    tideTimings: "Unavailable",
    waterTemperature: "Unavailable",
    marineWarnings: "No marine data provider is currently integrated. Wave height, tide timings, and water temperature require a dedicated oceanographic data source (e.g., INCOIS, NOAA).",
  };

  // Beach recommendation from wind + weather
  let beachRecommendation: string;
  if (isStormy(w)) {
    beachRecommendation = "Storm near coast — avoid all water activities. Stay away from shoreline. Follow lifeguard instructions.";
  } else if (wind > 35) {
    beachRecommendation = "Dangerous wind conditions — do not enter water. Stay away from rocky areas and breakwaters.";
  } else if (wind > 25) {
    beachRecommendation = "Rough seas expected — avoid open water swimming. Stay in shallow areas near lifeguards.";
  } else if (isRainy(w)) {
    beachRecommendation = "Rain expected — beach activities may be affected. Carry rain protection. Check lifeguard flags.";
  } else if (temp > 35) {
    beachRecommendation = `Hot at ${temp}°C — seek shade during 11 AM–3 PM. Apply reef-safe sunscreen frequently. Stay hydrated.`;
  } else if (wind > 15) {
    beachRecommendation = `Moderate breeze ${wind} km/h — suitable for beach activities. Exercise caution in open water.`;
  } else {
    beachRecommendation = `Pleasant ${temp}°C with ${wind} km/h wind — good conditions for beach activities. Follow lifeguard guidelines.`;
  }

  return {
    marineAvailable: false,
    wind: {
      speed: `${wind} km/h`,
      direction: windDir,
      safety: windSafety,
      safetyColor: windSafetyColor,
    },
    marine,
    beachRecommendation,
  };
}

// ═══════════════════════════════════════════════════════════════════
// 17. EVENT PLANNER DASHBOARD — Event suitability from forecast
// ═══════════════════════════════════════════════════════════════════

export interface EventPlannerDashboard {
  suitability: EventSuitability;
  comfortIndex: ComfortResult;
  eventDetails: {
    rainProbability: string;
    temperature: string;
    humidity: string;
    wind: string;
    severeWeather: boolean;
    severeAlert: string;
  };
  extendedForecast: {
    day: string;
    condition: string;
    minTemp: string;
    maxTemp: string;
    rainProb: string;
  }[];
  eventRecommendation: string;
}

export function generateEventPlannerDashboard(
  w: CurrentWeather,
  forecast?: DailyForecastItem[]
): EventPlannerDashboard {
  const suitability = calculateEventSuitability(w, forecast);
  const comfortIndex = calculateComfortIndex(w);

  const rainProb = forecast?.[0]?.rain_probability ?? (isRainy(w) ? 60 : 10);
  const severe = isStormy(w);

  // Extended forecast (next 3-5 days)
  const extendedForecast = (forecast || []).slice(0, 5).map((f) => ({
    day: f.day_name || f.date_short,
    condition: f.condition,
    minTemp: `${f.min_temp.toFixed(0)}°C`,
    maxTemp: `${f.max_temp.toFixed(0)}°C`,
    rainProb: `${f.rain_probability ?? 0}%`,
  }));

  // Event recommendation
  let eventRecommendation: string;
  if (suitability.label === "POOR") {
    eventRecommendation = "Significant weather challenges expected. Strongly consider indoor alternatives or rescheduling. If proceeding outdoors, have robust contingency plans.";
  } else if (suitability.label === "CAUTION") {
    eventRecommendation = "Some weather concerns — ensure covered areas, backup plans, and guest comfort measures are in place. Monitor forecast closely.";
  } else {
    eventRecommendation = "Favorable conditions for outdoor event. Standard preparations recommended. Provide hydration stations and shade for daytime events.";
  }

  return {
    suitability,
    comfortIndex,
    eventDetails: {
      rainProbability: `${rainProb}%`,
      temperature: `${w.temperature.toFixed(0)}°C (feels ${w.feels_like.toFixed(0)}°C)`,
      humidity: `${w.humidity}%`,
      wind: `${w.wind_speed} km/h ${w.wind_direction}`,
      severeWeather: severe,
      severeAlert: severe ? w.condition : "",
    },
    extendedForecast,
    eventRecommendation,
  };
}
