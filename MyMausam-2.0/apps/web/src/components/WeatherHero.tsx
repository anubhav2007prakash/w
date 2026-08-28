"use client";

import React from "react";
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Cloud,
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  Eye,
  Thermometer,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { CurrentWeather } from "@/types/weather";
import { useWeather } from "@/context/WeatherContext";
import { WindCompass } from "@/components/WindCompass";

interface WeatherHeroProps {
  weather: CurrentWeather;
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather }) => {
  const { tempUnit, toggleTempUnit, formatTemp, isSpeaking, speakWeatherForecast } = useWeather();

  const getWeatherIcon = (iconName: string, condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("rain") || c.includes("drizzle")) {
      return <CloudRain className="w-20 h-20 text-[#00DDE5] animate-float drop-shadow-[0_8px_16px_rgba(0,221,229,0.3)]" />;
    }
    if (c.includes("thunder") || c.includes("lightning")) {
      return <CloudLightning className="w-20 h-20 text-[#FFBE00] animate-pulse drop-shadow-[0_8px_16px_rgba(255,190,0,0.4)]" />;
    }
    if (c.includes("cloud") || c.includes("overcast")) {
      return <CloudSun className="w-20 h-20 text-[#FFBE00] animate-float drop-shadow-[0_8px_16px_rgba(255,190,0,0.3)]" />;
    }
    return <Sun className="w-20 h-20 text-[#FFBE00] animate-spin-slow drop-shadow-[0_8px_20px_rgba(255,190,0,0.5)]" />;
  };

  return (
    <section className="px-4 py-2 select-none">
      <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-2xl relative overflow-hidden space-y-4">
        {/* Top Unit Converter & Audio trigger */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#8ED329] animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              Live Observation
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Unit Switcher Button (°C ⇋ °F) */}
            <button
              onClick={toggleTempUnit}
              className="px-3 py-1 rounded-full text-xs font-black bg-white/15 hover:bg-white/25 active:scale-95 text-white border border-white/20 transition-all flex items-center gap-1"
              title="Toggle Celsius / Fahrenheit"
            >
              <span className={tempUnit === "C" ? "text-[#00DDE5]" : "text-white/60"}>°C</span>
              <span className="text-white/40">/</span>
              <span className={tempUnit === "F" ? "text-[#00DDE5]" : "text-white/60"}>°F</span>
            </button>
          </div>
        </div>

        {/* Hero Temp & Weather Icon */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="space-y-1">
            <div className="flex items-baseline">
              <span className="text-6xl font-black text-white tracking-tight drop-shadow-md">
                {weather.temperature.toFixed(1)}
              </span>
              <span className="text-2xl font-bold text-[#00DDE5] ml-1">°{tempUnit}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/80">
              <span>Feels like {formatTemp(weather.feels_like)}</span>
              <span>•</span>
              <span className="text-[#8ED329] font-bold">Max {formatTemp(weather.maximum)}</span>
              <span>/</span>
              <span className="text-white/70">Min {formatTemp(weather.minimum)}</span>
            </div>

            <div className="pt-1">
              <span className="text-lg font-black text-white block leading-tight">
                {weather.condition}
              </span>
              <span className="text-[11px] text-white/60 block mt-0.5">
                Updated: {weather.updated_at}
              </span>
            </div>
          </div>

          {/* Big Animated Icon */}
          <div className="shrink-0 pr-1">
            {getWeatherIcon(weather.icon, weather.condition)}
          </div>
        </div>

        {/* 3D Wind Compass Widget */}
        <WindCompass
          speedKmh={weather.wind_speed}
          direction={weather.wind_direction}
          degrees={weather.wind_direction_deg}
        />

        {/* 4-Grid Atmospheric Telemetry */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white/5 p-2 rounded-2xl border border-white/5">
            <Droplets className="w-4 h-4 mx-auto text-[#00DDE5] mb-1" />
            <span className="text-[9px] text-white/60 block">Humidity</span>
            <strong className="text-white text-xs block">{weather.humidity}%</strong>
          </div>

          <div className="bg-white/5 p-2 rounded-2xl border border-white/5">
            <Sun className="w-4 h-4 mx-auto text-[#FFBE00] mb-1" />
            <span className="text-[9px] text-white/60 block">UV Index</span>
            <strong className="text-white text-xs block">{weather.uv_index?.toFixed(1) || "7.2"}</strong>
          </div>

          <div className="bg-white/5 p-2 rounded-2xl border border-white/5">
            <Eye className="w-4 h-4 mx-auto text-blue-200 mb-1" />
            <span className="text-[9px] text-white/60 block">Visibility</span>
            <strong className="text-white text-xs block">{weather.visibility_km?.toFixed(1) || "6.0"} km</strong>
          </div>

          <div className="bg-white/5 p-2 rounded-2xl border border-white/5">
            <Gauge className="w-4 h-4 mx-auto text-[#8ED329] mb-1" />
            <span className="text-[9px] text-white/60 block">Pressure</span>
            <strong className="text-white text-xs block">{weather.pressure_hpa?.toFixed(0) || "1004"} hPa</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
