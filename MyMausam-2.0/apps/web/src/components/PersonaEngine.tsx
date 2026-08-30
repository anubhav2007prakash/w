"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useWeather } from "@/context/WeatherContext";
import {
  HeartPulse,
  Activity,
  Waves,
  Plane,
  HeartHandshake,
  Sprout,
  Car,
  CalendarCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Shirt,
  Wind,
  CloudRain,
  ThermometerSun,
  Droplets,
  Sun,
  Eye,
  ShieldAlert,
  Flower2,
  MapPin,
} from "lucide-react";
import {
  Persona,
  PERSONA_CONFIG,
  calculateComfortIndex,
  findBestActivityWindows,
  generatePackingList,
  calculateEventSuitability,
  calculateCommuteRisk,
  generateRecommendations,
  generateHealthDashboard,
  generateFitnessDashboard,
  generateTravelerDashboard,
  generateFamilyDashboard,
  generateAgricultureDashboard,
  generateCommuterDashboard,
  generateBeachDashboard,
  generateEventPlannerDashboard,
  isStormy,
  getGeoHiddenFeatures,
  isModuleVisible,
  getGeographicSummary,
} from "@/lib/personalization-engine";
import { WeatherAPI } from "@/lib/api";
import { HourlyForecastItem, CurrentWeather } from "@/types/weather";
import { usePersonalization } from "@/context/PersonalizationContext";
import { getGeographicContext, GeographicContext } from "@/lib/geographic-context";

const PERSONA_TABS: { key: Persona; label: string; icon: React.ElementType }[] = [
  { key: "health", label: "Health", icon: HeartPulse },
  { key: "fitness", label: "Fitness", icon: Activity },
  { key: "farmer", label: "Agriculture", icon: Sprout },
  { key: "commuter", label: "Commuter", icon: Car },
  { key: "traveler", label: "Traveler", icon: Plane },
  { key: "family", label: "Family", icon: HeartHandshake },
  { key: "beach", label: "Marine", icon: Waves },
  { key: "event_planner", label: "Events", icon: CalendarCheck },
];

export function PersonaEngine() {
  const { activePersona, setActivePersona, currentWeather, activeLocation, activeLat, activeLon, personaInsights } = useWeather();
  const { savedLocations, addSavedLocation, removeSavedLocation, userLocation } = usePersonalization();

  const persona = activePersona as Persona;
  const config = PERSONA_CONFIG[persona] || PERSONA_CONFIG.health;

  // Calculate geographic context from user location coordinates
  const geoContext: GeographicContext | null = useMemo(() => {
    const lat = userLocation?.lat ?? activeLat;
    const lon = userLocation?.lon ?? activeLon;
    if (lat == null || lon == null) return null;
    try {
      return getGeographicContext(
        lat, lon,
        userLocation?.name ?? activeLocation,
        userLocation?.district,
        userLocation?.state
      );
    } catch (e) {
      console.warn("PersonaEngine: geographic context error:", e);
      return null;
    }
  }, [userLocation?.lat, userLocation?.lon, activeLat, activeLon, userLocation?.name, activeLocation]);

  // Get hidden features based on geography
  const hiddenFeatures = useMemo(() => {
    return getGeoHiddenFeatures(persona, geoContext);
  }, [persona, geoContext]);

  // Use personaInsights for the current persona's score/status
  const currentInsight =
    personaInsights.find((p) => p.persona === activePersona) || personaInsights[0];

  // ── Fetch hourly forecast data (for fitness + family) ──
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>([]);
  const [hourlyLoading, setHourlyLoading] = useState(false);

  useEffect(() => {
    if ((persona === "fitness" || persona === "family") && activeLocation) {
      setHourlyLoading(true);
      WeatherAPI.getHourlyForecast(activeLocation)
        .then((data) => setHourlyForecast(data || []))
        .catch(() => setHourlyForecast([]))
        .finally(() => setHourlyLoading(false));
    }
  }, [persona, activeLocation]);

  // ── Fetch weather for saved destinations (traveler) ──
  const [destinationWeathers, setDestinationWeathers] = useState<CurrentWeather[]>([]);
  const [destLoading, setDestLoading] = useState(false);

  useEffect(() => {
    if (persona === "traveler" && savedLocations.length > 0) {
      setDestLoading(true);
      Promise.all(
        savedLocations.map((loc) =>
          WeatherAPI.getCurrentWeather(loc.name).catch(() => null)
        )
      )
        .then((results) => setDestinationWeathers(results.filter(Boolean) as CurrentWeather[]))
        .catch(() => setDestinationWeathers([]))
        .finally(() => setDestLoading(false));
    }
  }, [persona, savedLocations]);

  // ── Fetch school weather (family) ──
  const [schoolWeather, setSchoolWeather] = useState<CurrentWeather | null>(null);
  useEffect(() => {
    if (persona === "family") {
      const schoolLoc = savedLocations.find((l) => l.label === "school");
      if (schoolLoc) {
        WeatherAPI.getCurrentWeather(schoolLoc.name)
          .then(setSchoolWeather)
          .catch(() => setSchoolWeather(null));
      }
    }
  }, [persona, savedLocations]);

  // ── Location save state ──
  const [newLocName, setNewLocName] = useState("");
  const [newLocLabel, setNewLocLabel] = useState<"home" | "work" | "school" | "other">("other");

  const handleAddLocation = () => {
    if (!newLocName.trim()) return;
    addSavedLocation({
      id: Date.now().toString(),
      name: newLocName.trim(),
      label: newLocLabel,
    });
    setNewLocName("");
  };

  // ── Event planner state ──
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  // ── Daily forecast for event planner ──
  const [dailyForecast, setDailyForecast] = useState<any[]>([]);
  useEffect(() => {
    if (persona === "event_planner" && activeLocation) {
      WeatherAPI.getDailyForecast(activeLocation)
        .then((data) => setDailyForecast(data || []))
        .catch(() => setDailyForecast([]));
    }
  }, [persona, activeLocation]);

  // Calculate persona-specific modules — wrapped in try-catch for robustness
  const modules = useMemo(() => {
    if (!currentWeather) return null;

    // Core modules — always computed
    let comfort = null;
    let recs: any[] = [];
    try {
      comfort = calculateComfortIndex(currentWeather);
      recs = generateRecommendations(persona, currentWeather, []);
    } catch (e) {
      console.warn("PersonaEngine: core module error:", e);
    }

    // Persona-specific modules — each wrapped independently
    let activityWindows = null;
    let packing = null;
    let eventSuitability = null;
    let commuteRisk = null;
    let healthDashboard = null;
    let fitnessDashboard = null;
    let travelerDashboard = null;
    let familyDashboard = null;
    let agricultureDashboard = null;
    let commuterDashboard = null;
    let beachDashboard = null;
    let eventPlannerDashboard = null;

    try {
      if (persona === "fitness") {
        activityWindows = findBestActivityWindows(hourlyForecast, currentWeather.sunrise, currentWeather.sunset);
        fitnessDashboard = generateFitnessDashboard(currentWeather, hourlyForecast);
      }
      if (persona === "health") {
        healthDashboard = generateHealthDashboard(currentWeather);
      }
      if (persona === "traveler") {
        packing = generatePackingList(currentWeather);
        travelerDashboard = generateTravelerDashboard(currentWeather, savedLocations, destinationWeathers);
      }
      if (persona === "event_planner") {
        eventSuitability = calculateEventSuitability(currentWeather);
        eventPlannerDashboard = generateEventPlannerDashboard(currentWeather, dailyForecast);
      }
      if (persona === "commuter") {
        commuteRisk = calculateCommuteRisk(currentWeather);
        commuterDashboard = generateCommuterDashboard(currentWeather, geoContext);
      }
      if (persona === "family") {
        commuteRisk = calculateCommuteRisk(currentWeather);
        familyDashboard = generateFamilyDashboard(currentWeather, hourlyForecast, savedLocations);
        // Override school weather if we fetched real data
        if (familyDashboard && schoolWeather) {
          familyDashboard.schoolWeather = {
            temperature: `${schoolWeather.temperature.toFixed(0)}°C`,
            condition: schoolWeather.condition,
            severeWeather: isStormy(schoolWeather),
          };
        }
      }
      if (persona === "farmer") {
        agricultureDashboard = generateAgricultureDashboard(currentWeather, geoContext);
      }
      if (persona === "beach") {
        beachDashboard = generateBeachDashboard(currentWeather);
      }
    } catch (e) {
      console.warn("PersonaEngine: persona module error:", e);
    }

    return { comfort, recs, activityWindows, packing, eventSuitability, commuteRisk, healthDashboard, fitnessDashboard, travelerDashboard, familyDashboard, agricultureDashboard, commuterDashboard, beachDashboard, eventPlannerDashboard };
  }, [currentWeather, persona, hourlyForecast, destinationWeathers, savedLocations, schoolWeather, dailyForecast, geoContext]);

  // Geographic context summary
  const geoSummary = getGeographicSummary(geoContext);
  const hasGeoContext = geoContext && geoContext.latitude !== 0;

  return (
    <div className="mx-4 my-3 glass-panel rounded-2xl p-4 border border-white/15 bg-white/10 backdrop-blur-md shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
              AI Personalized Telemetry
            </h2>
            <p className="text-sm font-bold text-white">IMD Smart Life Insights</p>
          </div>
        </div>
        {currentInsight && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/90">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentInsight.statusColor || "#8ED329" }}
            />
            Score: {currentInsight.score}/100
          </div>
        )}
      </div>

      {/* Geographic Context Bar */}
      {hasGeoContext && (
        <div className="mb-2 px-2 py-1.5 rounded-lg bg-blue-500/10 border border-blue-400/20">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-blue-300" />
            <span className="text-[10px] text-blue-200/80 font-medium">
              📍 {geoSummary}
            </span>
          </div>
          {hiddenFeatures.length > 0 && (
            <p className="text-[9px] text-white/30 mt-0.5">
              Some modules adapted for your location
            </p>
          )}
        </div>
      )}

      {/* Persona Horizontal Scroll Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PERSONA_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePersona === tab.key;
          const tabConfig = PERSONA_CONFIG[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => setActivePersona(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "text-slate-900 font-bold shadow-md scale-105"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              }`}
              style={isActive ? { backgroundColor: tabConfig.color } : undefined}
            >
              <Icon
                className={`w-3.5 h-3.5 ${isActive ? "text-slate-900" : "text-white/70"}`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Insight Card */}
      {currentInsight && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                {currentInsight.title}
              </h3>
              <p
                className="text-xs font-medium mt-0.5"
                style={{ color: currentInsight.statusColor || "#8ED329" }}
              >
                {currentInsight.status}
              </p>
            </div>
            <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/15 text-white/80 uppercase tracking-wider">
              {currentInsight.persona}
            </div>
          </div>

          <p className="text-xs text-white/80 mt-2 leading-relaxed">
            {currentInsight.description}
          </p>

          {/* Metrics Grid */}
          {currentInsight.metrics && currentInsight.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {currentInsight.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-black/20 rounded-lg p-2 flex flex-col justify-between border border-white/5"
                >
                  <span className="text-[10px] text-white/60 font-medium">{m.label}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-white">{m.value}</span>
                    {m.badge && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded font-semibold text-slate-950"
                        style={{
                          backgroundColor: m.badgeColor || "#FFBE00",
                        }}
                      >
                        {m.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Advice List */}
          {currentInsight.advice && currentInsight.advice.length > 0 && (
            <div className="mt-3 space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                Actionable Recommendations
              </span>
              {currentInsight.advice.map((adv, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-white/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="leading-snug">{adv}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {currentInsight.tags && currentInsight.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-white/10">
              {currentInsight.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/70 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ PERSONA-SPECIFIC MODULES ═══ */}

      {/* ═══ HEALTH DASHBOARD — Health persona ═══ */}
      {persona === "health" && modules?.healthDashboard && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <HeartPulse className="w-4 h-4 text-pink-400" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Health & Wellness Dashboard
            </h3>
          </div>

          {/* AQI Section */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-pink-300" />
                <span className="text-[11px] font-bold text-white/80">Air Quality Index</span>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${modules.healthDashboard.aqi.color}30`, color: modules.healthDashboard.aqi.color }}
              >
                {modules.healthDashboard.aqi.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <span className="text-[9px] text-white/50">AQI</span>
                <span className="text-sm font-bold block" style={{ color: modules.healthDashboard.aqi.color }}>
                  {modules.healthDashboard.aqi.value}
                </span>
              </div>
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <span className="text-[9px] text-white/50">PM2.5</span>
                <span className="text-sm font-bold text-white block">
                  {modules.healthDashboard.aqi.pm25}
                </span>
              </div>
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <span className="text-[9px] text-white/50">PM10</span>
                <span className="text-sm font-bold text-white block">
                  {modules.healthDashboard.aqi.pm10}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-white/60 mt-1.5 leading-relaxed">
              {modules.healthDashboard.aqi.interpretation}
            </p>
          </div>

          {/* UV Index Section */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-bold text-white/80">UV Radiation</span>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${modules.healthDashboard.uv.color}30`, color: modules.healthDashboard.uv.color }}
              >
                {modules.healthDashboard.uv.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black" style={{ color: modules.healthDashboard.uv.color }}>
                {modules.healthDashboard.uv.value}
              </span>
              <span className="text-[10px] text-white/60">{modules.healthDashboard.uv.advice}</span>
            </div>
          </div>

          {/* Humidity Section */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-300" />
                <span className="text-[11px] font-bold text-white/80">Humidity</span>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${modules.healthDashboard.humidity.color}30`, color: modules.healthDashboard.humidity.color }}
              >
                {modules.healthDashboard.humidity.status}
              </span>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed">
              {modules.healthDashboard.humidity.interpretation}
            </p>
          </div>

          {/* Heat Conditions Section */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <ThermometerSun className="w-3.5 h-3.5 text-orange-300" />
                <span className="text-[11px] font-bold text-white/80">Heat Conditions</span>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${modules.healthDashboard.heat.color}30`, color: modules.healthDashboard.heat.color }}
              >
                {modules.healthDashboard.heat.status}
              </span>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed">
              {modules.healthDashboard.heat.interpretation}
            </p>
          </div>

          {/* Pollen — Unavailable State */}
          <div className="mb-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Flower2 className="w-3.5 h-3.5 text-green-300" />
                <span className="text-[11px] font-bold text-white/80">Pollen Count</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-white/40">
                Unavailable
              </span>
            </div>
            <p className="text-[10px] text-white/40 italic">
              Pollen data unavailable for this location. No reliable pollen data provider is currently integrated.
            </p>
          </div>
        </div>
      )}

      {/* ═══ FITNESS DASHBOARD — Fitness persona ═══ */}
      {persona === "fitness" && modules?.fitnessDashboard && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Outdoor Fitness Dashboard
            </h3>
          </div>

          {/* Sunrise/Sunset */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Sunrise</span>
              <span className="text-sm font-bold text-amber-300 block">
                {modules.fitnessDashboard.sunrise}
              </span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Sunset</span>
              <span className="text-sm font-bold text-orange-300 block">
                {modules.fitnessDashboard.sunset}
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Temperature</span>
              <span className="text-sm font-bold" style={{ color: modules.fitnessDashboard.tempColor }}>
                {modules.fitnessDashboard.temperature}
              </span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">UV Index</span>
              <span className="text-sm font-bold" style={{ color: modules.fitnessDashboard.uvColor }}>
                {modules.fitnessDashboard.uv}
              </span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Wind</span>
              <span className="text-sm font-bold text-white">
                {modules.fitnessDashboard.wind}
              </span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Humidity</span>
              <span className="text-sm font-bold text-white">
                {modules.fitnessDashboard.humidity}
              </span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Rain Probability</span>
              <span className="text-sm font-bold" style={{ color: modules.fitnessDashboard.rainColor }}>
                {modules.fitnessDashboard.rainProbability}
              </span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Heat Alert</span>
              <span className="text-sm font-bold" style={{ color: modules.fitnessDashboard.heatAlertColor }}>
                {modules.fitnessDashboard.heatAlert}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TRAVELER DASHBOARD — Traveler persona ═══ */}
      {persona === "traveler" && modules?.travelerDashboard && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Plane className="w-4 h-4 text-purple-300" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Travel Weather Dashboard
            </h3>
          </div>

          {/* Travel Summary */}
          <div className="bg-black/20 rounded-lg p-2.5 border border-white/5 mb-3">
            <span className="text-[9px] text-white/50 uppercase tracking-wider">Travel Summary</span>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              {modules.travelerDashboard.travelSummary}
            </p>
          </div>

          {/* Saved Destinations */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Saved Destinations</span>
              {destLoading && <span className="text-[9px] text-white/40">Loading...</span>}
            </div>
            {modules.travelerDashboard.destinations.length > 0 ? (
              <div className="space-y-2">
                {modules.travelerDashboard.destinations.map((dest, i) => (
                  <div key={i} className="bg-black/20 rounded-lg p-2.5 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-purple-300" />
                        <span className="text-xs font-bold text-white">{dest.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">{dest.label}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: dest.color }}>
                        {dest.temperature}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-white/60">
                      <span>{dest.condition}</span>
                      <span>Rain: {dest.rainProbability}</span>
                      <span>Wind: {dest.wind}</span>
                    </div>
                    {dest.severeWeather && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Severe: {dest.severeAlert}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-white/40 italic">
                No saved destinations yet. Add destinations below to see their weather.
              </p>
            )}
          </div>

          {/* Save Destination */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add destination city"
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={handleAddLocation}
              className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-[11px] font-bold hover:bg-purple-500/30 transition"
            >
              + Add
            </button>
          </div>
        </div>
      )}

      {/* ═══ FAMILY DASHBOARD — Family persona ═══ */}
      {persona === "family" && modules?.familyDashboard && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <HeartHandshake className="w-4 h-4 text-green-300" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Family Commute Safety
            </h3>
          </div>

          {/* Morning Commute */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-bold text-white/80">Morning Commute</span>
                <span className="text-[9px] text-white/40">{modules.familyDashboard.morningCommute.timeRange}</span>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${modules.familyDashboard.morningCommute.statusColor}30`, color: modules.familyDashboard.morningCommute.statusColor }}
              >
                {modules.familyDashboard.morningCommute.overallStatus}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mb-1.5">
              <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                <span className="text-[9px] text-white/50">Temp</span>
                <span className="text-xs font-bold text-white block">{modules.familyDashboard.morningCommute.temperature}</span>
              </div>
              <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                <span className="text-[9px] text-white/50">Rain</span>
                <span className="text-xs font-bold block" style={{ color: modules.familyDashboard.morningCommute.rainColor }}>
                  {modules.familyDashboard.morningCommute.rainProbability}
                </span>
              </div>
              <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                <span className="text-[9px] text-white/50">Visibility</span>
                <span className="text-xs font-bold block" style={{ color: modules.familyDashboard.morningCommute.visColor }}>
                  {modules.familyDashboard.morningCommute.visibility}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-white/60 mb-1">
              {modules.familyDashboard.morningCommute.fog && <span className="text-amber-300">🌫️ Fog</span>}
              <span>Wind: {modules.familyDashboard.morningCommute.wind}</span>
              {modules.familyDashboard.morningCommute.severeWeather && (
                <span className="text-red-400">⚠️ {modules.familyDashboard.morningCommute.severeAlert}</span>
              )}
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              {modules.familyDashboard.morningCommute.recommendation}
            </p>
          </div>

          {/* Evening Commute */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-300" />
                <span className="text-[11px] font-bold text-white/80">Evening Commute</span>
                <span className="text-[9px] text-white/40">{modules.familyDashboard.eveningCommute.timeRange}</span>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${modules.familyDashboard.eveningCommute.statusColor}30`, color: modules.familyDashboard.eveningCommute.statusColor }}
              >
                {modules.familyDashboard.eveningCommute.overallStatus}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mb-1.5">
              <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                <span className="text-[9px] text-white/50">Temp</span>
                <span className="text-xs font-bold text-white block">{modules.familyDashboard.eveningCommute.temperature}</span>
              </div>
              <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                <span className="text-[9px] text-white/50">Rain</span>
                <span className="text-xs font-bold block" style={{ color: modules.familyDashboard.eveningCommute.rainColor }}>
                  {modules.familyDashboard.eveningCommute.rainProbability}
                </span>
              </div>
              <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                <span className="text-[9px] text-white/50">Visibility</span>
                <span className="text-xs font-bold block" style={{ color: modules.familyDashboard.eveningCommute.visColor }}>
                  {modules.familyDashboard.eveningCommute.visibility}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-white/60 mb-1">
              {modules.familyDashboard.eveningCommute.fog && <span className="text-amber-300">🌫️ Fog</span>}
              <span>Wind: {modules.familyDashboard.eveningCommute.wind}</span>
              {modules.familyDashboard.eveningCommute.severeWeather && (
                <span className="text-red-400">⚠️ {modules.familyDashboard.eveningCommute.severeAlert}</span>
              )}
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              {modules.familyDashboard.eveningCommute.recommendation}
            </p>
          </div>

          {/* School Weather (if saved) */}
          {modules.familyDashboard.schoolWeather && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-green-300" />
                <span className="text-[11px] font-bold text-white/80">School Weather</span>
              </div>
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/80">{modules.familyDashboard.schoolWeather.condition}</span>
                  <span className="text-sm font-bold text-white">{modules.familyDashboard.schoolWeather.temperature}</span>
                </div>
                {modules.familyDashboard.schoolWeather.severeWeather && (
                  <span className="text-[10px] text-red-400 mt-1 block">⚠️ Severe weather at school location</span>
                )}
              </div>
            </div>
          )}

          {/* Save Home/School Location */}
          <div className="border-t border-white/10 pt-2.5">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-2">Save Locations</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Location name (e.g., School name)"
                value={newLocName}
                onChange={(e) => setNewLocName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:border-green-400"
              />
              <select
                value={newLocLabel}
                onChange={(e) => setNewLocLabel(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-[11px] text-white"
              >
                <option value="home" className="bg-[#021a32]">Home</option>
                <option value="school" className="bg-[#021a32]">School</option>
                <option value="work" className="bg-[#021a32]">Work</option>
                <option value="other" className="bg-[#021a32]">Other</option>
              </select>
              <button
                onClick={handleAddLocation}
                className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 text-[11px] font-bold hover:bg-green-500/30 transition"
              >
                + Add
              </button>
            </div>
            {/* Show saved locations */}
            {savedLocations.length > 0 && (
              <div className="mt-2 space-y-1">
                {savedLocations.map((loc) => (
                  <div key={loc.id} className="flex items-center justify-between py-1 px-1.5 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-white/40" />
                      <span className="text-[11px] text-white/80">{loc.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 capitalize">{loc.label}</span>
                    </div>
                    <button
                      onClick={() => removeSavedLocation(loc.id)}
                      className="text-[10px] text-red-400/60 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ AGRICULTURE DASHBOARD — Farmer persona ═══ */}
      {persona === "farmer" && modules?.agricultureDashboard && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Sprout className="w-4 h-4 text-green-300" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Agriculture Guidance
            </h3>
          </div>

          {/* Geographic context for agriculture */}
          {geoContext && (
            <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-green-500/10 border border-green-400/20">
              <span className="text-[10px] text-green-200/70">
                📍 {geoContext.coastal_status ? `Coastal farm — cyclone and tidal monitoring active` :
                    geoContext.frost_prone ? `Frost-prone region — winter crop protection critical` :
                    geoContext.cyclone_exposure ? `Cyclone-exposed coast — monitor IMD storm bulletins` :
                    geoContext.flood_exposure ? `Flood-prone area — prioritize drainage management` :
                    geoContext.desert_region ? `Arid region — water conservation essential` :
                    geoContext.mountain_region ? `Mountain farming — altitude-specific crop management` :
                    `${geoContext.terrain_type} terrain, ${geoContext.climate_zone} climate`}
              </span>
            </div>
          )}

          {/* Rainfall */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white/80">Rainfall Prediction</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${modules.agricultureDashboard.rainfall.color}30`, color: modules.agricultureDashboard.rainfall.color }}
              >
                {modules.agricultureDashboard.rainfall.prediction}
              </span>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed">
              {modules.agricultureDashboard.rainfall.irrigation}
            </p>
          </div>

          {/* Soil Moisture — Unavailable */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white/80">Soil Moisture</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-white/40">
                {modules.agricultureDashboard.soilMoisture.status}
              </span>
            </div>
            <p className="text-[10px] text-white/40 italic">
              {modules.agricultureDashboard.soilMoisture.note}
            </p>
          </div>

          {/* Frost Risk */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white/80">Frost Risk</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${modules.agricultureDashboard.frostRisk.color}30`, color: modules.agricultureDashboard.frostRisk.color }}
              >
                {modules.agricultureDashboard.frostRisk.status}
              </span>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed">
              {modules.agricultureDashboard.frostRisk.note}
            </p>
          </div>

          {/* Spray Window */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white/80">Spray Window</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${modules.agricultureDashboard.sprayWindow.color}30`, color: modules.agricultureDashboard.sprayWindow.color }}
              >
                {modules.agricultureDashboard.sprayWindow.status}
              </span>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed">
              {modules.agricultureDashboard.sprayWindow.note}
            </p>
          </div>

          {/* Seasonal Guidance */}
          <div>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">Seasonal Guidance</span>
            <p className="text-[10px] text-white/60 leading-relaxed">
              {modules.agricultureDashboard.seasonalGuidance}
            </p>
          </div>
        </div>
      )}

      {/* ═══ COMMUTER DASHBOARD — Commuter persona ═══ */}
      {persona === "commuter" && modules?.commuterDashboard && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-300" />
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Commute Status
              </h3>
            </div>

            {/* Geographic context for commuter */}
            {geoContext && (
              <div className="w-full mb-2 px-2 py-1 rounded bg-blue-500/10 border border-blue-400/15">
                <span className="text-[9px] text-blue-200/60">
                  {geoContext.fog_prone ? "🌫️ Fog-prone region — check morning visibility" :
                   geoContext.cyclone_exposure ? "🌀 Cyclone coast — monitor storm alerts" :
                   geoContext.flood_exposure ? "🌊 Flood-prone area — check road conditions" :
                   geoContext.mountain_region ? "⛰️ Mountain roads — watch for weather changes" :
                   "📍 " + geoContext.terrain_type + " terrain"}
                </span>
              </div>
            )}
            <span
              className="text-xs font-black px-2 py-0.5 rounded"
              style={{ backgroundColor: `${modules.commuterDashboard.statusColor}30`, color: modules.commuterDashboard.statusColor }}
            >
              {modules.commuterDashboard.commuteStatus}
            </span>
          </div>

          {/* Route Weather */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Condition</span>
              <span className="text-xs font-bold text-white block">{modules.commuterDashboard.routeWeather.condition}</span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Rain</span>
              <span className="text-xs font-bold text-white block">{modules.commuterDashboard.routeWeather.rain}</span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Visibility</span>
              <span className="text-xs font-bold text-white block">{modules.commuterDashboard.routeWeather.visibility}</span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Wind</span>
              <span className="text-xs font-bold text-white block">{modules.commuterDashboard.routeWeather.wind}</span>
            </div>
          </div>

          {/* Fog / Severe */}
          <div className="flex items-center gap-3 text-[10px] text-white/60 mb-2">
            {modules.commuterDashboard.routeWeather.fog && <span className="text-amber-300">🌫️ Fog Active</span>}
            {modules.commuterDashboard.routeWeather.severeWeather && (
              <span className="text-red-400">⚠️ {modules.commuterDashboard.routeWeather.severeAlert}</span>
            )}
          </div>

          {/* Factors */}
          <div className="space-y-1 mb-2">
            {modules.commuterDashboard.factors.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-[10px]">
                <span className="text-white/50">{f.label}</span>
                <span className={`font-medium ${
                  f.severity === "high" ? "text-red-400" : f.severity === "medium" ? "text-amber-300" : "text-white/80"
                }`}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-white/70 leading-relaxed mb-2">
            {modules.commuterDashboard.recommendation}
          </p>

          {/* Traffic — Unavailable */}
          <div className="border-t border-white/10 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/60">Traffic Data</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/40">Unavailable</span>
            </div>
            <p className="text-[9px] text-white/40 italic mt-0.5">
              {modules.commuterDashboard.traffic.note}
            </p>
          </div>
        </div>
      )}

      {/* ═══ BEACH DASHBOARD — Beach persona ═══ */}
      {persona === "beach" && modules?.beachDashboard && !hiddenFeatures.includes("marine_conditions") && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Waves className="w-4 h-4 text-cyan-300" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Beach & Marine Conditions
            </h3>
          </div>

          {/* Wind */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white/80">Wind</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${modules.beachDashboard.wind.safetyColor}30`, color: modules.beachDashboard.wind.safetyColor }}
              >
                {modules.beachDashboard.wind.safety}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <span className="text-[9px] text-white/50">Speed</span>
                <span className="text-xs font-bold text-white block">{modules.beachDashboard.wind.speed}</span>
              </div>
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <span className="text-[9px] text-white/50">Direction</span>
                <span className="text-xs font-bold text-white block">{modules.beachDashboard.wind.direction}</span>
              </div>
            </div>
          </div>

          {/* Marine Conditions — Unavailable */}
          <div className="mb-3">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-2">Marine Data</span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <span className="text-[9px] text-white/50">Sea Condition</span>
                <span className="text-xs font-bold text-white/40 block">{modules.beachDashboard.marine.seaCondition}</span>
              </div>
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <span className="text-[9px] text-white/50">Wave Height</span>
                <span className="text-xs font-bold text-white/40 block">{modules.beachDashboard.marine.waveHeight}</span>
              </div>
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <span className="text-[9px] text-white/50">Tide Timings</span>
                <span className="text-xs font-bold text-white/40 block">{modules.beachDashboard.marine.tideTimings}</span>
              </div>
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <span className="text-[9px] text-white/50">Water Temp</span>
                <span className="text-xs font-bold text-white/40 block">{modules.beachDashboard.marine.waterTemperature}</span>
              </div>
            </div>
            <p className="text-[9px] text-white/40 italic mt-1.5">
              {modules.beachDashboard.marine.marineWarnings}
            </p>
          </div>

          {/* Beach Recommendation */}
          <div>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">Recommendation</span>
            <p className="text-[10px] text-white/70 leading-relaxed">
              {modules.beachDashboard.beachRecommendation}
            </p>
          </div>
        </div>
      )}

      {/* Beach location notice */}
      {persona === "beach" && hiddenFeatures.includes("marine_conditions") && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Waves className="w-4 h-4 text-cyan-300" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Beach & Marine
            </h3>
          </div>
          <p className="text-[10px] text-white/40 italic">
            Marine features are not available for your current inland location. Beach and marine data requires a coastal location.
          </p>
          {geoContext && (
            <p className="text-[9px] text-white/30 mt-1">
              Your location: {geoContext.city || "Unknown"} ({geoContext.distance_to_coast_km.toFixed(0)}km from coast)
            </p>
          )}
        </div>
      )}

      {/* ═══ EVENT PLANNER DASHBOARD — Event Planner persona ═══ */}
      {persona === "event_planner" && modules?.eventPlannerDashboard && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck className="w-4 h-4 text-amber-300" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Event Planning Dashboard
            </h3>
          </div>

          {/* Event Details Input */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            <input
              type="text"
              placeholder="Event location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-[10px] text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
            />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-amber-400"
            />
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Suitability Status */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-white/80">Event Suitability</span>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-black px-2 py-0.5 rounded"
                style={{ backgroundColor: `${modules.eventPlannerDashboard.suitability.color}30`, color: modules.eventPlannerDashboard.suitability.color }}
              >
                {modules.eventPlannerDashboard.suitability.label}
              </span>
              <span className="text-sm font-bold text-white">{modules.eventPlannerDashboard.suitability.score}/100</span>
            </div>
          </div>

          {/* Event Weather Factors */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Rain Probability</span>
              <span className="text-xs font-bold text-white block">{modules.eventPlannerDashboard.eventDetails.rainProbability}</span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Temperature</span>
              <span className="text-xs font-bold text-white block">{modules.eventPlannerDashboard.eventDetails.temperature}</span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Humidity</span>
              <span className="text-xs font-bold text-white block">{modules.eventPlannerDashboard.eventDetails.humidity}</span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
              <span className="text-[9px] text-white/50">Wind</span>
              <span className="text-xs font-bold text-white block">{modules.eventPlannerDashboard.eventDetails.wind}</span>
            </div>
          </div>

          {modules.eventPlannerDashboard.eventDetails.severeWeather && (
            <div className="mb-3 flex items-center gap-1.5 text-[10px] text-red-400 bg-red-500/10 rounded-lg p-2 border border-red-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Severe weather: {modules.eventPlannerDashboard.eventDetails.severeAlert}</span>
            </div>
          )}

          {/* Comfort Index */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white/80">MyMausam Comfort Index</span>
              <span className="text-sm font-bold" style={{ color: modules.eventPlannerDashboard.comfortIndex.color }}>
                {modules.eventPlannerDashboard.comfortIndex.score}/100
              </span>
            </div>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold inline-block"
              style={{ backgroundColor: `${modules.eventPlannerDashboard.comfortIndex.color}30`, color: modules.eventPlannerDashboard.comfortIndex.color }}
            >
              {modules.eventPlannerDashboard.comfortIndex.label} — MyMausam derived indicator
            </span>
          </div>

          {/* Extended Forecast */}
          {modules.eventPlannerDashboard.extendedForecast.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1.5">Extended Forecast</span>
              <div className="space-y-1">
                {modules.eventPlannerDashboard.extendedForecast.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] bg-black/20 rounded-lg px-2 py-1.5 border border-white/5">
                    <span className="text-white/60 w-16">{f.day}</span>
                    <span className="text-white/80 flex-1 text-center">{f.condition}</span>
                    <span className="text-white/60 w-14 text-right">{f.minTemp}–{f.maxTemp}</span>
                    <span className="text-white/60 w-10 text-right">{f.rainProb}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Recommendation */}
          <div>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">Recommendation</span>
            <p className="text-[10px] text-white/70 leading-relaxed">
              {modules.eventPlannerDashboard.eventRecommendation}
            </p>
          </div>
        </div>
      )}

      {/* Comfort Index — shown for all personas */}
      {modules?.comfort && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ThermometerSun className="w-4 h-4 text-amber-300" />
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                MyMausam Comfort Index
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black" style={{ color: modules.comfort.color }}>
                {modules.comfort.score}
              </span>
              <span className="text-[10px] text-white/50">/100</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: `${modules.comfort.color}30`, color: modules.comfort.color }}
            >
              {modules.comfort.label}
            </span>
          </div>
          <div className="space-y-1">
            {modules.comfort.factors.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-[10px]">
                <span className="text-white/50">{f.name}</span>
                <span className="text-white/80">{f.rating}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Activity Window — Fitness persona */}
      {persona === "fitness" && modules?.activityWindows && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Best Activity Windows
            </h3>
          </div>
          {modules.activityWindows.map((w, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {w.start} – {w.end}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: w.score >= 70 ? "#8ED32930" : "#FFBE0030",
                      color: w.score >= 70 ? "#8ED329" : "#FFBE00",
                    }}
                  >
                    {w.score}/100
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {w.reasons.map((r, j) => (
                  <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Packing Assistant — Traveler persona */}
      {persona === "traveler" && modules?.packing && modules.packing.length > 0 && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Shirt className="w-4 h-4 text-purple-300" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Packing Suggestions
            </h3>
          </div>
          <div className="space-y-1.5">
            {modules.packing.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-300 mt-0.5 shrink-0" />
                <div>
                  <span className="text-white/90 font-medium">{item.item}</span>
                  <span className="text-white/50 ml-1">— {item.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Suitability — Event Planner persona */}
      {persona === "event_planner" && modules?.eventSuitability && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-amber-300" />
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Event Suitability
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-xs font-black px-2 py-0.5 rounded"
                style={{ backgroundColor: `${modules.eventSuitability.color}30`, color: modules.eventSuitability.color }}
              >
                {modules.eventSuitability.label}
              </span>
              <span className="text-sm font-bold text-white">{modules.eventSuitability.score}/100</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            {modules.eventSuitability.factors.map((f, i) => (
              <div key={i} className="bg-black/20 rounded-lg p-2 border border-white/5">
                <span className="text-[10px] text-white/50">{f.label}</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-bold text-white">{f.value}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: f.impact === "positive" ? "#8ED329" : f.impact === "negative" ? "#ff2020" : "#FFBE00",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/70 leading-relaxed">{modules.eventSuitability.recommendation}</p>
        </div>
      )}

      {/* Commute Risk — Commuter & Family personas */}
      {modules?.commuteRisk && (persona === "commuter" || persona === "family") && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {persona === "commuter" ? (
                <Car className="w-4 h-4 text-blue-300" />
              ) : (
                <HeartHandshake className="w-4 h-4 text-green-300" />
              )}
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                {persona === "commuter" ? "Commute Status" : "School/Commute Safety"}
              </h3>
            </div>
            <span
              className="text-xs font-black px-2 py-0.5 rounded"
              style={{ backgroundColor: `${modules.commuteRisk.color}30`, color: modules.commuteRisk.color }}
            >
              {modules.commuteRisk.level}
            </span>
          </div>
          <div className="space-y-1 mb-2">
            {modules.commuteRisk.factors.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-[10px]">
                <span className="text-white/50">{f.label}</span>
                <span className={`font-medium ${
                  f.severity === "high" ? "text-red-400" : f.severity === "medium" ? "text-amber-300" : "text-white/80"
                }`}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/70 leading-relaxed">{modules.commuteRisk.recommendation}</p>
        </div>
      )}

      {/* Smart Recommendations — shown for all personas */}
      {modules?.recs && modules.recs.length > 0 && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-[#00DDE5]" />
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
              {hasCriticalRecs(modules.recs) ? "⚠️ Critical Alerts" : "Smart Recommendations"}
            </h3>
          </div>
          <div className="space-y-2">
            {modules.recs.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                className={`flex items-start gap-2 p-2 rounded-lg border ${
                  rec.severity === "critical"
                    ? "bg-red-500/10 border-red-500/30"
                    : rec.severity === "warning"
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-white/5 border-white/10"
                }`}
              >
                {rec.severity === "critical" ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                ) : rec.severity === "warning" ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00DDE5] mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-bold text-white">{rec.title}</span>
                  <p className="text-[10px] text-white/60 mt-0.5 leading-relaxed">{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function hasCriticalRecs(recs: { severity: string }[]): boolean {
  return recs.some((r) => r.severity === "critical");
}
