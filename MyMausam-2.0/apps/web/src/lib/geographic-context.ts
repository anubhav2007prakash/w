/**
 * Geographic Context Engine — MyMausam 2.0
 *
 * Determines geographic characteristics from latitude/longitude coordinates.
 * Uses coordinate-based heuristics for India — no city name hardcoding.
 * Extensible architecture for future geographic data sources.
 *
 * All outputs are deterministic, derived from coordinate math.
 */

// ─── Types ──────────────────────────────────────────────────────

export type ClimateZone =
  | "tropical"
  | "subtropical"
  | "arid"
  | "temperate"
  | "alpine"
  | "coastal_moderate"
  | "unknown";

export type TerrainType =
  | "plains"
  | "coastal"
  | "mountain"
  | "desert"
  | "plateau"
  | "delta"
  | "unknown";

export interface GeographicContext {
  latitude: number;
  longitude: number;
  country: string;
  state: string;
  district: string;
  city: string;
  coastal_status: boolean;
  distance_to_coast_km: number;
  climate_zone: ClimateZone;
  terrain_type: TerrainType;
  frost_prone: boolean;
  cyclone_exposure: boolean;
  fog_prone: boolean;
  heat_exposure: boolean;
  flood_exposure: boolean;
  mountain_region: boolean;
  desert_region: boolean;
  snow_prone: boolean;
  urban_indicator: boolean; // heuristic based on population density approximation
  season: "winter" | "pre_monsoon" | "monsoon" | "post_monsoon";
}

// ─── Constants: India coastline approximation ────────────────────
// Simplified coastal boundary points (lat, lon) covering India's coastline
// These are key reference points along the coast
const INDIA_COASTAL_POINTS: [number, number][] = [
  // Gujarat coast
  [23.7, 68.5], [22.3, 69.0], [21.6, 69.5], [20.8, 70.2], [20.0, 72.5],
  // Maharashtra coast
  [19.5, 72.8], [18.9, 72.8], [18.0, 73.2], [17.5, 73.2],
  // Goa coast
  [15.5, 73.8], [15.0, 74.0],
  // Karnataka coast
  [14.5, 74.4], [13.5, 74.7],
  // Kerala coast
  [12.5, 75.0], [11.5, 75.5], [10.5, 76.0], [9.5, 76.2], [8.3, 77.3],
  // Tamil Nadu coast (west to east)
  [8.3, 77.3], [9.5, 78.5], [10.5, 79.5], [11.5, 79.8], [12.5, 80.0],
  [13.0, 80.3], [13.5, 80.3], [14.5, 80.2],
  // Andhra Pradesh coast
  [15.5, 80.0], [16.0, 81.0], [16.5, 81.8], [17.0, 82.3], [17.5, 83.0],
  [18.0, 83.5], [18.5, 84.0], [19.0, 84.5], [19.5, 85.0],
  // Odisha coast
  [19.5, 85.0], [20.0, 86.0], [20.5, 86.8], [21.0, 87.0], [21.5, 87.5],
  // West Bengal coast
  [21.5, 87.5], [22.0, 88.0], [22.5, 88.5], [22.0, 89.0],
  // Bangladesh border / NE
  [22.0, 89.0], [21.5, 89.5],
];

// Known high-risk cyclone zones (approximate bounding boxes)
// Bay of Bengal: Odisha, Andhra, Tamil Nadu, West Bengal
// Arabian Sea: Gujarat, Maharashtra, Karnataka, Kerala
const CYCLONE_ZONES: { lat_min: number; lat_max: number; lon_min: number; lon_max: number }[] = [
  // Bay of Bengal coastal belt
  { lat_min: 8.0, lat_max: 22.5, lon_min: 79.0, lon_max: 92.0 },
  // Arabian Sea coastal belt
  { lat_min: 8.0, lat_max: 24.0, lon_min: 68.0, lon_max: 77.0 },
];

// Known fog-prone regions in India (winter months)
const FOG_ZONES: { lat_min: number; lat_max: number; lon_min: number; lon_max: number }[] = [
  // Indo-Gangetic plain
  { lat_min: 24.0, lat_max: 32.0, lon_min: 74.0, lon_max: 88.0 },
  // Punjab / Haryana / Delhi
  { lat_min: 28.0, lat_max: 32.0, lon_min: 74.0, lon_max: 78.0 },
];

// Desert regions
const DESERT_ZONES: { lat_min: number; lat_max: number; lon_min: number; lon_max: number }[] = [
  // Thar Desert
  { lat_min: 23.0, lat_max: 30.0, lon_min: 68.0, lon_max: 75.0 },
];

// Mountain / Himalayan regions
const MOUNTAIN_ZONES: { lat_min: number; lat_max: number; lon_min: number; lon_max: number }[] = [
  // Western Himalayas (J&K, HP, Uttarakhand)
  { lat_min: 30.0, lat_max: 37.0, lon_min: 73.0, lon_max: 81.0 },
  // Eastern Himalayas (Sikkim, Arunachal)
  { lat_min: 26.0, lat_max: 30.0, lon_min: 88.0, lon_max: 98.0 },
  // Western Ghats
  { lat_min: 8.0, lat_max: 21.0, lon_min: 73.0, lon_max: 77.0 },
  // Eastern Ghats
  { lat_min: 12.0, lat_max: 20.0, lon_min: 78.0, lon_max: 84.0 },
];

// Frost-prone regions (elevation + latitude based)
const FROST_ZONES: { lat_min: number; lat_max: number; lon_min: number; lon_max: number }[] = [
  // Northern plains in winter
  { lat_min: 28.0, lat_max: 35.0, lon_min: 73.0, lon_max: 82.0 },
];

// Flood-prone regions
const FLOOD_ZONES: { lat_min: number; lat_max: number; lon_min: number; lon_max: number }[] = [
  // Bihar / Assam / Bengal flood plains
  { lat_min: 22.0, lat_max: 28.0, lon_min: 84.0, lon_max: 96.0 },
  // Mumbai / Konkan
  { lat_min: 18.0, lat_max: 20.0, lon_min: 72.5, lon_max: 74.5 },
  // Chennai / Coromandel
  { lat_min: 12.0, lat_max: 14.0, lon_min: 79.5, lon_max: 81.0 },
];

// ─── Utility Functions ──────────────────────────────────────────

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine distance between two lat/lon points in km
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find minimum distance from a point to a series of coastal points
 */
function distanceToCoast(lat: number, lon: number): number {
  let minDist = Infinity;
  for (let i = 0; i < INDIA_COASTAL_POINTS.length; i++) {
    const [cLat, cLon] = INDIA_COASTAL_POINTS[i];
    const dist = haversineDistance(lat, lon, cLat, cLon);
    if (dist < minDist) minDist = dist;
  }
  return Math.round(minDist * 10) / 10;
}

/**
 * Check if a point falls within a bounding box
 */
function inZone(
  lat: number,
  lon: number,
  zone: { lat_min: number; lat_max: number; lon_min: number; lon_max: number }
): boolean {
  return lat >= zone.lat_min && lat <= zone.lat_max && lon >= zone.lon_min && lon <= zone.lon_max;
}

function inAnyZone(lat: number, lon: number, zones: { lat_min: number; lat_max: number; lon_min: number; lon_max: number }[]): boolean {
  return zones.some((z) => inZone(lat, lon, z));
}

/**
 * Determine current season for India based on month
 */
function getCurrentSeason(): GeographicContext["season"] {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 6 && month <= 9) return "monsoon";
  if (month >= 10 && month <= 11) return "post_monsoon";
  if (month >= 12 || month <= 2) return "winter";
  return "pre_monsoon"; // March-May
}

/**
 * Determine climate zone from latitude (India-specific)
 */
function getClimateZone(lat: number, elevation_m: number): ClimateZone {
  // High elevation = alpine
  if (elevation_m > 2500) return "alpine";

  // Coastal areas get moderate climate
  // (determined separately by coastal_status)

  // Tropical: < 15°N (Kerala, Tamil Nadu, parts of Karnataka)
  if (lat < 15) return "tropical";

  // Subtropical: 15-28°N (most of central/south India)
  if (lat < 28) return "subtropical";

  // Temperate: 28-35°N (north India, Himalayan foothills)
  if (lat < 35) return "temperate";

  // Alpine: > 35°N (high Himalayas)
  return "alpine";
}

/**
 * Determine terrain type from coordinates
 */
function getTerrainType(
  lat: number,
  lon: number,
  isCoastal: boolean,
  isMountain: boolean,
  isDesert: boolean
): TerrainType {
  if (isCoastal) return "coastal";
  if (isMountain) return "mountain";
  if (isDesert) return "desert";

  // Delta regions (Ganges-Brahmaputra, Krishna, Godavari, etc.)
  const deltaRegions = [
    { lat_min: 21.0, lat_max: 22.5, lon_min: 87.5, lon_max: 90.0 }, // Ganges delta
    { lat_min: 15.5, lat_max: 17.0, lon_min: 80.5, lon_max: 82.0 }, // Krishna delta
    { lat_min: 16.0, lat_max: 17.5, lon_min: 81.5, lon_max: 83.0 }, // Godavari delta
  ];
  if (inAnyZone(lat, lon, deltaRegions)) return "delta";

  // Deccan Plateau
  if (lat >= 10 && lat <= 22 && lon >= 74 && lon <= 82) return "plateau";

  return "plains";
}

// ─── Main Export ─────────────────────────────────────────────────

/**
 * Determine the geographic context for any lat/lon location.
 * Works for India with extensible architecture.
 *
 * @param lat - Latitude
 * @param lon - Longitude
 * @param locationName - Optional city/location name
 * @param district - Optional district name
 * @param state - Optional state name
 */
export function getGeographicContext(
  lat: number,
  lon: number,
  locationName?: string,
  district?: string,
  state?: string
): GeographicContext {
  const distToCoast = distanceToCoast(lat, lon);
  const isCoastal = distToCoast < 50; // Within 50km of coast
  const isMountain = inAnyZone(lat, lon, MOUNTAIN_ZONES);
  const isDesert = inAnyZone(lat, lon, DESERT_ZONES);
  const season = getCurrentSeason();

  // Elevation heuristic from latitude + mountain zones
  // In mountain zones, assume higher elevation
  const elevationEstimate = isMountain ? 1500 : isCoastal ? 50 : 200;

  const climateZone = getClimateZone(lat, elevationEstimate);
  const terrainType = getTerrainType(lat, lon, isCoastal, isMountain, isDesert);

  return {
    latitude: lat,
    longitude: lon,
    country: "India",
    state: state || "",
    district: district || "",
    city: locationName || "",
    coastal_status: isCoastal,
    distance_to_coast_km: distToCoast,
    climate_zone: climateZone,
    terrain_type: terrainType,
    frost_prone: inAnyZone(lat, lon, FROST_ZONES) && season === "winter",
    cyclone_exposure: isCoastal && inAnyZone(lat, lon, CYCLONE_ZONES),
    fog_prone: inAnyZone(lat, lon, FOG_ZONES) && season === "winter",
    heat_exposure: climateZone === "tropical" || climateZone === "arid" || (climateZone === "subtropical" && season === "pre_monsoon"),
    flood_exposure: inAnyZone(lat, lon, FLOOD_ZONES) && season === "monsoon",
    mountain_region: isMountain,
    desert_region: isDesert,
    snow_prone: isMountain && (climateZone === "alpine" || climateZone === "temperate"),
    urban_indicator: false, // Would need population density data; defaults false
    season,
  };
}

/**
 * Check if a geographic context matches a set of requirements.
 * Returns true if all requirements are met (or no requirements specified).
 */
export function matchesGeographicRequirements(
  geo: GeographicContext,
  requirements: GeographicRequirement
): boolean {
  if (requirements.coastal !== undefined && requirements.coastal !== geo.coastal_status) return false;
  if (requirements.mountainous !== undefined && requirements.mountainous !== geo.mountain_region) return false;
  if (requirements.frostProne !== undefined && requirements.frostProne !== geo.frost_prone) return false;
  if (requirements.cycloneProne !== undefined && requirements.cycloneProne !== geo.cyclone_exposure) return false;
  if (requirements.fogProne !== undefined && requirements.fogProne !== geo.fog_prone) return false;
  if (requirements.heatProne !== undefined && requirements.heatProne !== geo.heat_exposure) return false;
  if (requirements.floodExposure !== undefined && requirements.floodExposure !== geo.flood_exposure) return false;
  if (requirements.desertRegion !== undefined && requirements.desertRegion !== geo.desert_region) return false;
  if (requirements.snowProne !== undefined && requirements.snowProne !== geo.snow_prone) return false;
  if (requirements.seasons && !requirements.seasons.includes(geo.season)) return false;
  return true;
}

export interface GeographicRequirement {
  coastal?: boolean;
  mountainous?: boolean;
  frostProne?: boolean;
  cycloneProne?: boolean;
  fogProne?: boolean;
  heatProne?: boolean;
  floodExposure?: boolean;
  desertRegion?: boolean;
  snowProne?: boolean;
  seasons?: GeographicContext["season"][];
}

/**
 * Calculate a geographic relevance modifier (0-1) for a feature.
 * 1 = fully relevant, 0 = not relevant at all.
 */
export function geographicRelevanceModifier(
  geo: GeographicContext | null,
  requirements: GeographicRequirement
): number {
  if (!geo) return 0.5; // Unknown context → neutral

  let matchCount = 0;
  let totalCount = 0;

  if (requirements.coastal !== undefined) {
    totalCount++;
    if (requirements.coastal === geo.coastal_status) matchCount++;
  }
  if (requirements.mountainous !== undefined) {
    totalCount++;
    if (requirements.mountainous === geo.mountain_region) matchCount++;
  }
  if (requirements.frostProne !== undefined) {
    totalCount++;
    if (requirements.frostProne === geo.frost_prone) matchCount++;
  }
  if (requirements.cycloneProne !== undefined) {
    totalCount++;
    if (requirements.cycloneProne === geo.cyclone_exposure) matchCount++;
  }
  if (requirements.fogProne !== undefined) {
    totalCount++;
    if (requirements.fogProne === geo.fog_prone) matchCount++;
  }
  if (requirements.heatProne !== undefined) {
    totalCount++;
    if (requirements.heatProne === geo.heat_exposure) matchCount++;
  }
  if (requirements.floodExposure !== undefined) {
    totalCount++;
    if (requirements.floodExposure === geo.flood_exposure) matchCount++;
  }
  if (requirements.desertRegion !== undefined) {
    totalCount++;
    if (requirements.desertRegion === geo.desert_region) matchCount++;
  }
  if (requirements.snowProne !== undefined) {
    totalCount++;
    if (requirements.snowProne === geo.snow_prone) matchCount++;
  }

  if (totalCount === 0) return 1.0; // No requirements → fully applicable
  return matchCount / totalCount;
}

/**
 * Default/unknown geographic context for when no location is set.
 */
export const UNKNOWN_GEOGRAPHIC_CONTEXT: GeographicContext = {
  latitude: 0,
  longitude: 0,
  country: "India",
  state: "",
  district: "",
  city: "",
  coastal_status: false,
  distance_to_coast_km: Infinity,
  climate_zone: "unknown",
  terrain_type: "unknown",
  frost_prone: false,
  cyclone_exposure: false,
  fog_prone: false,
  heat_exposure: false,
  flood_exposure: false,
  mountain_region: false,
  desert_region: false,
  snow_prone: false,
  urban_indicator: false,
  season: "pre_monsoon",
};
