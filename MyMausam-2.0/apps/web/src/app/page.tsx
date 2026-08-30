"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { WeatherHero } from "@/components/WeatherHero";
import { AQICard } from "@/components/AQICard";
import { PersonaEngine } from "@/components/PersonaEngine";
import { FeatureButtons } from "@/components/FeatureButtons";
import { LifestyleIndex } from "@/components/LifestyleIndex";
import { WeatherAlertCard } from "@/components/WeatherAlertCard";
import { DailyForecastList } from "@/components/DailyForecastList";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { useWeather } from "@/context/WeatherContext";
import { usePersonalization } from "@/context/PersonalizationContext";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { PersonalizedGreeting } from "@/components/PersonalizedGreeting";
import { SmartAlerts } from "@/components/SmartAlerts";
import { TodayForYou } from "@/components/TodayForYou";
import { PersonalizedWidgets } from "@/components/PersonalizedWidgets";
import { MausamMoment } from "@/components/MausamMoment";
import { PersonalizedDashboard } from "@/components/PersonalizedDashboard";
import { WeatherAPI } from "@/lib/api";
import { DailyForecastItem, WeatherAlert } from "@/types/weather";

/**
 * Error boundary for persona-specific sections.
 * If a persona module crashes, the rest of the homepage continues working.
 */
class PersonaErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("Persona module error:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

/**
 * Homepage — Personalized Weather Intelligence Platform
 *
 * Section ordering is PERSONA-ADAPTIVE:
 * - Severe weather alerts ALWAYS override normal personalization (top)
 * - Persona engine (intelligence hub) moves up when persona is active
 * - Persona-relevant sections appear earlier
 * - Non-relevant sections appear later
 * - All sections remain present (no removal)
 *
 * The user should feel the SAME homepage has become intelligent.
 */
export default function HomePage() {
  const { currentWeather, isLoading, error, refreshWeather, activeLocation } = useWeather();
  const { hasCompletedOnboarding, activeMode } = usePersonalization();
  const [dailyItems, setDailyItems] = useState<DailyForecastItem[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadForecastData() {
      try {
        const [daily, alertList] = await Promise.all([
          WeatherAPI.getDailyForecast().catch(() => [] as DailyForecastItem[]),
          WeatherAPI.getAlerts().catch(() => [] as WeatherAlert[]),
        ]);
        setDailyItems(daily);
        setAlerts(alertList);
      } catch (err) {
        console.warn("Forecast data load fallback:", err);
      } finally {
        setPageLoading(false);
      }
    }

    loadForecastData();
  }, [activeLocation]);

  // Determine if severe weather is active (PDR §19: severe alerts override normal priority)
  const hasSevereAlerts = alerts.some(
    (a) =>
      a.severity?.toLowerCase() === "severe" ||
      a.severity?.toLowerCase() === "extreme" ||
      a.alert_type?.toLowerCase().includes("severe") ||
      a.alert_type?.toLowerCase().includes("cyclone") ||
      a.alert_type?.toLowerCase().includes("warning")
  );

  // Check if any persona-specific mode is active (not "default")
  const hasActivePersona = activeMode !== "default";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 flex flex-col justify-between">
      {!hasCompletedOnboarding && <OnboardingWizard />}
      <div>
        {/* Top App Header with GPS & Search */}
        <Header />

        {/* Loading / Error / Ready States */}
        {isLoading && !currentWeather ? (
          <div className="py-20">
            <LoadingState message="Fetching live IMD meteorological feeds..." />
          </div>
        ) : error && !currentWeather ? (
          <div className="py-20">
            <ErrorState message={error} onRetry={refreshWeather} />
          </div>
        ) : currentWeather ? (
          <div className="space-y-1.5 animate-fade-in pt-1">
            {/* ═══ PRIORITY 1: SEVERE WEATHER ALERTS (PDR §19) ═══ */}
            {/* Severe alerts ALWAYS override normal personalization — always on top */}
            {hasSevereAlerts && alerts.length > 0 && (
              <div className="mx-4 mt-2">
                <WeatherAlertCard alert={alerts[0]} />
              </div>
            )}

            {/* ═══ PRIORITY 2: PERSONA INTELLIGENCE ENGINE ═══ */}
            {/* The core intelligence hub — always visible, shows persona-specific modules */}
            <PersonaErrorBoundary>
              <PersonaEngine />
            </PersonaErrorBoundary>

            {/* ═══ PRIORITY 3: PERSONALIZED GREETING ═══ */}
            <PersonalizedGreeting />

            {/* ═══ PRIORITY 4: MAUSAM MOMENT ═══ */}
            {/* Persona-aware micro-insight — adapts to selected persona */}
            <MausamMoment />

            {/* ═══ PRIORITY 5: PERSONALIZED DASHBOARD ═══ */}
            {/* Priority-ranked weather cards — reorder based on persona */}
            <PersonalizedDashboard />

            {/* ═══ PRIORITY 6: CURRENT WEATHER HERO ═══ */}
            {/* Current conditions + wind compass — always shown */}
            <WeatherHero weather={currentWeather} />

            {/* ═══ PRIORITY 7: LIFESTYLE INDICES ═══ */}
            {/* Heatstroke, UV, AC usage — always shown */}
            <LifestyleIndex weather={currentWeather} />

            {/* ═══ PRIORITY 8: SMART ALERTS ═══ */}
            {/* Weather alerts — always shown, severity-based */}
            <SmartAlerts />

            {/* ═══ PRIORITY 9: TODAY FOR YOU ═══ */}
            {/* Personalized timeline — adapts to persona */}
            <TodayForYou />

            {/* ═══ PRIORITY 10: PERSONALIZED WIDGETS ═══ */}
            {/* Relevance-ranked weather detail widgets */}
            <PersonalizedWidgets />

            {/* ═══ PRIORITY 11: AQI DETAIL ═══ */}
            {/* AQI breakdown — always shown */}
            <AQICard aqiData={currentWeather.aqi} />

            {/* ═══ PRIORITY 12: FEATURE BUTTONS ═══ */}
            {/* Quick navigation — always shown */}
            <FeatureButtons />

            {/* ═══ PRIORITY 13: NON-SEVERE ALERTS ═══ */}
            {/* Show non-severe alerts below the fold */}
            {!hasSevereAlerts && alerts.length > 0 && (
              <WeatherAlertCard alert={alerts[0]} />
            )}

            {/* ═══ PRIORITY 14: 7-DAY FORECAST ═══ */}
            {/* Extended forecast — always shown */}
            <DailyForecastList forecasts={dailyItems} />
          </div>
        ) : null}
      </div>

      {/* Footer Branding */}
      <footer className="mt-8 px-4 text-center text-xs text-white/60 pb-4 select-none">
        <p className="font-semibold text-white/70">
          © India Meteorological Department (IMD) • Ministry of Earth Sciences
        </p>
        <p className="text-[10px] mt-0.5 text-white/50">
          National Weather Forecasting Centre • Mausam 2.0 AI Personalization
        </p>
      </footer>
    </main>
  );
}
