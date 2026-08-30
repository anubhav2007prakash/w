"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Droplets,
  Sun,
  Wind,
  Thermometer,
  ShieldCheck,
} from "lucide-react";

export default function HealthIndexPage() {
  const { currentWeather, activeLocation } = useWeather();

  const aqi = currentWeather?.aqi?.aqi ?? 85;
  const temp = currentWeather?.temperature ?? 31;
  const humidity = currentWeather?.humidity ?? 62;
  const uv = currentWeather?.uv_index ?? 6;
  const wind = currentWeather?.wind_speed ?? 12;
  const feelsLike = currentWeather?.feels_like ?? 33;

  const getAQILabel = (val: number) => {
    if (val <= 50) return { label: "Good", color: "#8ED329" };
    if (val <= 100) return { label: "Moderate", color: "#FFBE00" };
    if (val <= 150) return { label: "Unhealthy for Sensitive", color: "#FF7400" };
    return { label: "Unhealthy", color: "#FF2020" };
  };

  const aqiInfo = getAQILabel(aqi);
  const aqiPercent = Math.min((aqi / 300) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 select-none">
      <Header showBack={true} title="Doctor Health" subtitle="Air Quality" />

      <div className="p-4 space-y-4 max-w-[480px] mx-auto">
        {/* AQI Hero Card */}
        <div className="rounded-3xl p-5 border border-white/15 shadow-2xl bg-white/8 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌫️</span>
              <div>
                <span className="text-4xl font-black text-white">AQI {aqi}</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FFBE00]/20 text-[#FFBE00] text-xs font-bold">
              {aqiInfo.label}
            </span>
          </div>

          {/* AQI Progress Bar */}
          <div className="relative mb-2">
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${aqiPercent}%`,
                  background: `linear-gradient(90deg, #8ED329, #FFBE00, ${aqiInfo.color})`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-white/40">0</span>
              <span className="text-[9px] text-white/40">300</span>
            </div>
          </div>

          <p className="text-[11px] text-white/60 mt-2">
            Moderate – Sensitive groups should reduce outdoor exertion
          </p>

          {/* Updated badge */}
          <div className="absolute top-4 right-4">
            <span className="text-[10px] text-white/40">Updated 2 min ago</span>
          </div>
        </div>

        {/* UV Index & Pollen Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* UV Index */}
          <div className="rounded-3xl p-5 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl text-center">
            <span className="text-3xl block mb-2">☀️</span>
            <span className="text-xs text-white/60 block">UV Index</span>
            <span className="text-4xl font-black text-white block mt-1">{uv}</span>
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-[10px]">⚠️</span>
              <span className="text-[11px] font-bold text-[#FFBE00]">High</span>
            </div>
          </div>

          {/* Pollen */}
          <div className="rounded-3xl p-5 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl text-center">
            <span className="text-3xl block mb-2">🌸</span>
            <span className="text-xs text-white/60 block">Pollen</span>
            <span className="text-3xl font-black text-white block mt-1">High</span>
            <span className="text-[11px] text-white/50 block mt-2">Tree & Grass • High</span>
          </div>
        </div>

        {/* Temperature Card */}
        <div className="rounded-3xl p-5 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl">
          <div className="text-center mb-3">
            <span className="text-xs text-white/60 block">Temperature</span>
            <span className="text-5xl font-black text-white block mt-1">{temp}°C</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/60 pt-3 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-[#00DDE5]" />
              Feels like {feelsLike}°C • Humid
            </span>
            <span className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-white/50" />
              Humidity {humidity}% • Wind {wind} km/h NW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
