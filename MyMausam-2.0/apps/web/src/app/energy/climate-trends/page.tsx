"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState } from "@/components/PageStates";
import { CurrentWeather } from "@/types/weather";
import {
  TrendingUp,
  Thermometer,
  Droplets,
  Zap,
  BarChart3,
  RefreshCw,
} from "lucide-react";

interface EnergyTrendPoint {
  label: string;
  temp: number;
  energyDemand: number;
  rainfall: number;
}

function deriveTrends(weather: CurrentWeather | null): EnergyTrendPoint[] {
  if (!weather) return [];
  const baseTemp = weather.temperature;
  const baseHumidity = weather.humidity;
  // Derive hourly energy demand from temperature (cooling/heating curve)
  const hours = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
  return hours.map((h, i) => {
    const hourTemp = baseTemp + Math.sin((i - 2) * 0.9) * 4;
    // Energy demand peaks when temp is far from comfort zone (24°C)
    const coolingLoad = Math.max(0, (hourTemp - 24) * 120);
    const heatingLoad = Math.max(0, (24 - hourTemp) * 80);
    const demand = Math.round(coolingLoad + heatingLoad + 300);
    return {
      label: h,
      temp: Math.round(hourTemp * 10) / 10,
      energyDemand: demand,
      rainfall: Math.round(baseHumidity * 0.3 * (i === 3 ? 2 : 0.8)),
    };
  });
}

export default function ClimateEnergyTrendsPage() {
  const [location, setLocation] = useState("Delhi");
  const { data: weather, loading, error, refetch } = useApi<CurrentWeather>(
    () => WeatherAPI.getCurrentWeather(location),
    [location]
  );

  const trends = deriveTrends(weather);
  const maxDemand = Math.max(...trends.map((t) => t.energyDemand), 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Climate-Energy Trends" subtitle="Temperature, rainfall & energy demand analysis" />

      <div className="p-4 space-y-4">
        {/* Location + Refresh */}
        <div className="glass-card rounded-2xl p-3 border border-white/20 flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-[#FFBE00] shrink-0" />
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Search city..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none" />
          <button onClick={refetch} className="p-1.5 rounded-xl bg-white/10 active:bg-white/20 transition">
            <RefreshCw className="w-3.5 h-3.5 text-[#00DDE5]" />
          </button>
        </div>

        {loading ? <LoadingSkeleton count={2} /> : error ? <ErrorState message={error} onRetry={refetch} /> : !weather ? (
          <ErrorState message="Weather data unavailable." />
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="glass-card rounded-2xl p-3 border border-white/10">
                <Thermometer className="w-4 h-4 mx-auto text-[#FF2020] mb-1" />
                <span className="text-[9px] text-white/60 block">Current Temp</span>
                <strong className="text-white text-sm block">{weather.temperature}°C</strong>
              </div>
              <div className="glass-card rounded-2xl p-3 border border-white/10">
                <Droplets className="w-4 h-4 mx-auto text-[#00DDE5] mb-1" />
                <span className="text-[9px] text-white/60 block">Humidity</span>
                <strong className="text-white text-sm block">{weather.humidity}%</strong>
              </div>
              <div className="glass-card rounded-2xl p-3 border border-white/10">
                <Zap className="w-4 h-4 mx-auto text-[#FFBE00] mb-1" />
                <span className="text-[9px] text-white/60 block">Est. Demand</span>
                <strong className="text-white text-sm block">{trends[2]?.energyDemand ?? 0} MW</strong>
              </div>
            </div>

            {/* Temperature vs Energy Demand Chart */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#FFBE00]" />
                <span>Temperature vs Energy Demand (Today)</span>
              </h3>
              <p className="text-[10px] text-white/50">Derived from current weather — estimated demand based on cooling/heating load model</p>

              <div className="space-y-2">
                {trends.map((t) => (
                  <div key={t.label} className="flex items-center gap-2 text-xs">
                    <span className="w-12 text-[10px] text-white/60 font-bold shrink-0">{t.label}</span>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                        <div className="h-full rounded-full bg-[#FF2020]/80 transition-all" style={{ width: `${(Math.max(0, t.temp - 20) / 20) * 100}%` }} />
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                        <div className="h-full rounded-full bg-[#FFBE00]/80 transition-all" style={{ width: `${(t.energyDemand / maxDemand) * 100}%` }} />
                      </div>
                    </div>
                    <div className="w-20 text-right shrink-0">
                      <span className="text-[9px] text-[#FF2020] block">{t.temp}°C</span>
                      <span className="text-[9px] text-[#FFBE00] block">{t.energyDemand} MW</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 text-[9px] text-white/50">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF2020]/80" /> Temperature</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FFBE00]/80" /> Energy Demand</span>
              </div>
            </div>

            {/* Seasonal Context */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#8ED329]" />
                <span>Climate-Energy Insight</span>
              </h3>
              <div className="text-xs text-white/80 leading-relaxed space-y-2">
                <p>
                  <strong className="text-white">Temperature Impact:</strong>{" "}
                  {weather.temperature > 35
                    ? "High temperatures drive significant cooling demand. Electricity consumption typically increases 2-4% per degree above 25°C."
                    : weather.temperature < 15
                    ? "Cool temperatures increase heating demand. In regions with electric heating, consumption rises significantly."
                    : "Current temperature is near the comfort zone. Minimal heating/cooling demand expected."}
                </p>
                <p>
                  <strong className="text-white">Humidity Factor:</strong>{" "}
                  {weather.humidity > 70
                    ? "High humidity increases perceived temperature, raising air conditioning load beyond what temperature alone would suggest."
                    : "Moderate humidity levels. Comfort conditions are manageable with standard ventilation."}
                </p>
                <p className="text-[10px] text-white/50 italic">
                  Note: Energy demand values are estimates derived from weather data using a simplified cooling/heating load model. Not actual grid measurements.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
