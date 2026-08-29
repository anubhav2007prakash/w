"use client";

import React, { useState, useEffect } from "react";
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
import { WeatherAPI } from "@/lib/api";
import { DailyForecastItem, WeatherAlert } from "@/types/weather";

export default function HomePage() {
  const { currentWeather, isLoading, error, refreshWeather, activeLocation } = useWeather();
  const [dailyItems, setDailyItems] = useState<DailyForecastItem[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadForecastData() {
      try {
        const [daily, alertList] = await Promise.all([
          WeatherAPI.getDailyForecast(),
          WeatherAPI.getAlerts(),
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 flex flex-col justify-between">
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
            {/* Current Weather Hero + 3D Wind Compass */}
            <WeatherHero weather={currentWeather} />

            {/* Lifestyle Indices — Heatstroke, UV, AC Usage */}
            <LifestyleIndex weather={currentWeather} />

            {/* SIH 26076 AI Persona Engine (8 Personas with specialized telemetry widgets) */}
            <PersonaEngine />

            {/* Interactive AQI Status & Pollutant Breakdown */}
            <AQICard aqiData={currentWeather.aqi} />

            {/* Quick Action Matrix */}
            <FeatureButtons />

            {/* Weather Alert Emergency Card (if alerts active) */}
            {alerts.length > 0 && <WeatherAlertCard alert={alerts[0]} />}

            {/* Interactive Doppler Map Button & 7-Day Forecast */}
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
