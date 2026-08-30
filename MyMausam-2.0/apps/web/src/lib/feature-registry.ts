/**
 * Feature Applicability Registry — MyMausam 2.0
 *
 * Centralized feature registry that determines which features are
 * geographically and persona-relevant for a given user.
 *
 * Each feature has:
 * - Supported personas
 * - Geographic requirements
 * - Whether it's conditionally visible or always visible
 */

import { Persona } from "./personalization-engine";
import { GeographicContext, GeographicRequirement, matchesGeographicRequirements } from "./geographic-context";

// ─── Types ──────────────────────────────────────────────────────

export interface FeatureMetadata {
  id: string;
  label: string;
  supportedPersonas: Persona[];
  geographicRequirements: GeographicRequirement;
  /** If true, feature is hidden when geo requirements not met. If false, just deprioritized. */
  geoGating: "visibility" | "priority";
  /** Weather conditions that make this feature more relevant */
  weatherActivation: string[];
}

// ─── Feature Registry ───────────────────────────────────────────

export const FEATURE_REGISTRY: FeatureMetadata[] = [
  // ── Marine / Beach Features ──
  {
    id: "marine_conditions",
    label: "Sea Conditions",
    supportedPersonas: ["beach", "traveler"],
    geographicRequirements: { coastal: true },
    geoGating: "visibility", // Hidden when not coastal
    weatherActivation: [],
  },
  {
    id: "wave_height",
    label: "Wave Height",
    supportedPersonas: ["beach"],
    geographicRequirements: { coastal: true },
    geoGating: "visibility",
    weatherActivation: [],
  },
  {
    id: "tide_timings",
    label: "Tide Timings",
    supportedPersonas: ["beach"],
    geographicRequirements: { coastal: true },
    geoGating: "visibility",
    weatherActivation: [],
  },
  {
    id: "water_temperature",
    label: "Water Temperature",
    supportedPersonas: ["beach"],
    geographicRequirements: { coastal: true },
    geoGating: "visibility",
    weatherActivation: [],
  },

  // ── Snow / Frost Features ──
  {
    id: "snowfall",
    label: "Snowfall",
    supportedPersonas: ["traveler", "family", "commuter"],
    geographicRequirements: { snowProne: true },
    geoGating: "priority", // Deprioritized, not hidden
    weatherActivation: ["snow", "blizzard"],
  },
  {
    id: "frost_risk",
    label: "Frost Risk",
    supportedPersonas: ["farmer", "family"],
    geographicRequirements: { frostProne: true },
    geoGating: "priority",
    weatherActivation: ["frost", "freezing"],
  },

  // ── Cyclone Features ──
  {
    id: "cyclone_tracking",
    label: "Cyclone Tracking",
    supportedPersonas: ["traveler", "family", "farmer"],
    geographicRequirements: { cycloneProne: true },
    geoGating: "priority", // Show when cyclone season + coastal
    weatherActivation: ["cyclone", "storm"],
  },

  // ── Fog / Visibility Features ──
  {
    id: "fog_advisory",
    label: "Fog Advisory",
    supportedPersonas: ["commuter", "family", "traveler"],
    geographicRequirements: { fogProne: true },
    geoGating: "priority",
    weatherActivation: ["fog", "mist", "haze"],
  },

  // ── Heat Features ──
  {
    id: "heat_wave",
    label: "Heat Wave Alert",
    supportedPersonas: ["health", "fitness", "farmer", "commuter", "event_planner"],
    geographicRequirements: { heatProne: true },
    geoGating: "priority",
    weatherActivation: ["heat"],
  },

  // ── Flood Features ──
  {
    id: "flood_risk",
    label: "Flood Risk",
    supportedPersonas: ["commuter", "family", "traveler"],
    geographicRequirements: { floodExposure: true },
    geoGating: "priority",
    weatherActivation: ["heavy_rain", "flood"],
  },

  // ── Mountain Features ──
  {
    id: "mountain_weather",
    label: "Mountain Weather",
    supportedPersonas: ["traveler", "commuter"],
    geographicRequirements: { mountainous: true },
    geoGating: "visibility",
    weatherActivation: ["snow", "avalanche"],
  },
  {
    id: "avalanche_risk",
    label: "Avalanche Risk",
    supportedPersonas: ["traveler"],
    geographicRequirements: { mountainous: true, snowProne: true },
    geoGating: "visibility",
    weatherActivation: ["snow"],
  },

  // ── Agriculture Features (always shown for farmer, geo-modifies content) ──
  {
    id: "agricultural_advisory",
    label: "Agricultural Advisory",
    supportedPersonas: ["farmer"],
    geographicRequirements: {},
    geoGating: "priority",
    weatherActivation: [],
  },

  // ── Universal Features (no geographic gating) ──
  {
    id: "aqi",
    label: "Air Quality",
    supportedPersonas: ["health", "fitness", "commuter"],
    geographicRequirements: {},
    geoGating: "priority",
    weatherActivation: [],
  },
  {
    id: "uv_index",
    label: "UV Index",
    supportedPersonas: ["health", "fitness", "beach", "family", "event_planner"],
    geographicRequirements: {},
    geoGating: "priority",
    weatherActivation: [],
  },
  {
    id: "temperature",
    label: "Temperature",
    supportedPersonas: ["health", "fitness", "traveler", "family", "farmer", "commuter", "beach", "event_planner"],
    geographicRequirements: {},
    geoGating: "priority",
    weatherActivation: [],
  },
  {
    id: "wind",
    label: "Wind",
    supportedPersonas: ["fitness", "beach", "traveler", "family", "farmer", "commuter", "event_planner"],
    geographicRequirements: {},
    geoGating: "priority",
    weatherActivation: [],
  },
  {
    id: "rain_probability",
    label: "Rain Probability",
    supportedPersonas: ["fitness", "traveler", "family", "farmer", "commuter", "beach", "event_planner"],
    geographicRequirements: {},
    geoGating: "priority",
    weatherActivation: [],
  },
  {
    id: "humidity",
    label: "Humidity",
    supportedPersonas: ["health", "fitness", "farmer", "event_planner"],
    geographicRequirements: {},
    geoGating: "priority",
    weatherActivation: [],
  },
  {
    id: "visibility",
    label: "Visibility",
    supportedPersonas: ["traveler", "family", "commuter"],
    geographicRequirements: {},
    geoGating: "priority",
    weatherActivation: [],
  },
  {
    id: "severe_weather",
    label: "Severe Weather",
    supportedPersonas: ["health", "fitness", "traveler", "family", "farmer", "commuter", "beach", "event_planner"],
    geographicRequirements: {},
    geoGating: "priority",
    weatherActivation: [],
  },
];

// ─── Query Functions ────────────────────────────────────────────

/**
 * Check if a specific feature is applicable for the given persona + geography.
 */
export function isFeatureApplicable(
  featureId: string,
  persona: Persona,
  geo: GeographicContext | null
): boolean {
  const feature = FEATURE_REGISTRY.find((f) => f.id === featureId);
  if (!feature) return true; // Unknown features are allowed

  // Check persona support
  if (!feature.supportedPersonas.includes(persona)) return false;

  // Check geographic requirements
  if (Object.keys(feature.geographicRequirements).length === 0) return true;
  if (!geo) return true; // Unknown geography → assume applicable

  return matchesGeographicRequirements(geo, feature.geographicRequirements);
}

/**
 * Get all applicable feature IDs for a persona + geography combination.
 */
export function getApplicableFeatures(
  persona: Persona,
  geo: GeographicContext | null
): string[] {
  return FEATURE_REGISTRY
    .filter((f) => f.supportedPersonas.includes(persona))
    .filter((f) => {
      if (Object.keys(f.geographicRequirements).length === 0) return true;
      if (!geo) return true;
      return matchesGeographicRequirements(geo, f.geographicRequirements);
    })
    .map((f) => f.id);
}

/**
 * Get features that should be hidden (geo-gated visibility) for a persona.
 */
export function getHiddenFeatures(
  persona: Persona,
  geo: GeographicContext | null
): string[] {
  return FEATURE_REGISTRY
    .filter((f) => f.supportedPersonas.includes(persona))
    .filter((f) => f.geoGating === "visibility")
    .filter((f) => {
      if (Object.keys(f.geographicRequirements).length === 0) return false;
      if (!geo) return false;
      return !matchesGeographicRequirements(geo, f.geographicRequirements);
    })
    .map((f) => f.id);
}

/**
 * Get the geographic modifier for a feature's priority score.
 * Returns 1.0 if feature is fully geographically relevant, 0.0 if not.
 */
export function getFeatureGeographicModifier(
  featureId: string,
  geo: GeographicContext | null
): number {
  const feature = FEATURE_REGISTRY.find((f) => f.id === featureId);
  if (!feature) return 1.0;
  if (Object.keys(feature.geographicRequirements).length === 0) return 1.0;
  if (!geo) return 0.5;

  if (matchesGeographicRequirements(geo, feature.geographicRequirements)) return 1.0;
  if (feature.geoGating === "visibility") return 0.0;
  return 0.3; // Deprioritized but not hidden
}

/**
 * Get all features relevant to a specific weather condition.
 * Used for smart alert prioritization.
 */
export function getWeatherActivatedFeatures(condition: string): string[] {
  const lowerCondition = condition.toLowerCase();
  return FEATURE_REGISTRY
    .filter((f) =>
      f.weatherActivation.some((wa) => lowerCondition.includes(wa))
    )
    .map((f) => f.id);
}
