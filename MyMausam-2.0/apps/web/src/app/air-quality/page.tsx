"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";
import { AirQualityStation } from "@/types/weather";
import {
  Wind,
  Eye,
  MapPin,
  Activity,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function AirQualityPage() {
  const { activeLocation } = useWeather();
  const [location, setLocation] = useState(activeLocation || "Delhi");

  const { data: stations, loading, error, refetch } = useApi<AirQualityStation[]>(
    () => WeatherAPI.getAirQuality(location),
    [location]
  );

  const station = stations?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="SAFAR — Air Quality" subtitle="System of Air Quality & Weather Forecasting Research" />

      <div className="p-4 space-y-4">
        {/* Location */}
        <div className="glass-card rounded-2xl p-3 border border-white/20 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#00DDE5] shrink-0" />
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Search city..." className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none" />
          <button onClick={refetch} className="p-1.5 rounded-xl bg-white/10 active:bg-white/20 transition">
            <RefreshCw className="w-3.5 h-3.5 text-[#00DDE5]" />
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !station ? (
          <EmptyState message="Air quality data unavailable for this location." />
        ) : (
          <>
            {/* AQI Hero */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00DDE5]" />
                    <h2 className="font-extrabold text-lg text-white leading-tight">{station.city}</h2>
                  </div>
                  <span className="text-[10px] text-white/60 block mt-0.5 ml-6">Primary: {station.primary_pollutant} • Source: {station.source}</span>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-xl text-white shrink-0 shadow-md" style={{ backgroundColor: station.aqi_color }}>{station.aqi_category}</span>
              </div>

              <div className="text-center py-4">
                <span className="text-6xl font-black text-white block">{station.aqi}</span>
                <span className="text-xs text-white/60 block mt-1">Air Quality Index (NAQI)</span>
              </div>

              <div className="space-y-1.5">
                <div className="w-full h-4 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#8ED329] flex-1" />
                  <div className="h-full bg-[#FFBE00] flex-1" />
                  <div className="h-full bg-[#FF7400] flex-1" />
                  <div className="h-full bg-[#9933CC] flex-1" />
                  <div className="h-full bg-[#FF2020] flex-1" />
                </div>
                <div className="relative h-1">
                  <div className="absolute w-3 h-3 bg-white rounded-full border-2 shadow-lg -top-1 transition-all" style={{ left: `calc(${Math.min((station.aqi / 500) * 100, 100)}% - 6px)`, borderColor: station.aqi_color }} />
                </div>
              </div>
            </div>

            {/* Pollutants */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00DDE5]" /><span>Pollutant Levels</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { name: "PM2.5", value: station.pm25, unit: "µg/m³", limit: 60 },
                  { name: "PM10", value: station.pm10, unit: "µg/m³", limit: 100 },
                  { name: "NO₂", value: station.no2, unit: "µg/m³", limit: 80 },
                  { name: "SO₂", value: station.so2, unit: "µg/m³", limit: 80 },
                  { name: "CO", value: station.co, unit: "mg/m³", limit: 4 },
                  { name: "O₃", value: station.o3, unit: "µg/m³", limit: 100 },
                ].map((p) => (
                  <div key={p.name} className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/60 block">{p.name}</span>
                    <span className={`text-sm font-black block ${p.value > p.limit ? "text-[#FF2020]" : "text-white"}`}>{p.value}</span>
                    <span className="text-[8px] text-white/40">{p.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Advisory */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FFBE00]" /><span>Health Advisory</span>
              </h3>
              <div className="bg-black/20 p-3 rounded-xl text-xs text-white/90 leading-relaxed border border-white/5">{station.health_advisory}</div>
              <p className="text-[9px] text-white/40 italic">Source: {station.source} • Updated: {station.last_updated}</p>
            </div>

            {/* AQI Guide */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#00DDE5]" /><span>AQI Categories</span>
              </h3>
              <div className="space-y-2 text-xs text-white/85">
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
                  <span><strong>0-50 Good:</strong> No health risk. Enjoy outdoor activities.</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#FFBE00] shrink-0 mt-0.5" />
                  <span><strong>101-200 Moderate:</strong> Sensitive groups reduce outdoor exertion.</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#FF2020] shrink-0 mt-0.5" />
                  <span><strong>301+ Severe:</strong> Stay indoors. Use air purifier. Avoid all outdoor activity.</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
