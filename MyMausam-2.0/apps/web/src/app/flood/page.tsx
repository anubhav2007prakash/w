"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";
import { FloodRiskPoint } from "@/types/weather";
import {
  CloudRain,
  TrendingUp,
  MapPin,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export default function FloodPage() {
  const { activeLocation } = useWeather();
  const [location, setLocation] = useState(activeLocation || "Delhi");

  const { data: floodData, loading, error, refetch } = useApi<FloodRiskPoint[]>(
    () => WeatherAPI.getFloodRisk(location),
    [location]
  );

  const risk = floodData?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Urban Flood Nowcast" subtitle="IMD City Flood Risk & Waterlogging Alerts" />

      <div className="p-4 space-y-4">
        {/* Location Search */}
        <div className="glass-card rounded-2xl p-3 border border-white/20 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#00DDE5] shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search city..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
          />
          <button onClick={refetch} className="p-1.5 rounded-xl bg-white/10 active:bg-white/20 transition">
            <RefreshCw className="w-3.5 h-3.5 text-[#00DDE5]" />
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !risk ? (
          <EmptyState message="No flood risk data available." />
        ) : (
          <>
            {/* Risk Card */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00DDE5]" />
                    <h2 className="font-extrabold text-lg text-white leading-tight">{risk.city}</h2>
                  </div>
                  {risk.state && <span className="text-xs text-white/70 block mt-0.5 ml-6">{risk.state}</span>}
                </div>
                <span
                  className="text-[10px] font-black px-2.5 py-1 rounded-xl text-black shadow-md shrink-0"
                  style={{ backgroundColor: risk.risk_color }}
                >
                  {risk.risk_level} Risk
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#00DDE5]">
                    <CloudRain className="w-4 h-4" />
                    <span className="font-bold">Est. 24h Rainfall</span>
                  </div>
                  <span className="text-xl font-black text-white block">{risk.rainfall_24h_mm} mm</span>
                  <span className="text-[10px] text-white/60">{risk.rainfall_intensity} Intensity</span>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#FFBE00]">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold">Est. Water Level</span>
                  </div>
                  <span className="text-xl font-black text-white block">{risk.water_level_m} m</span>
                  <span className="text-[10px] text-white/60">Above Normal</span>
                </div>
              </div>

              {risk.affected_areas.length > 0 && (
                <div className="bg-black/20 p-3 rounded-2xl border border-white/5 space-y-2">
                  <span className="text-[9px] font-bold text-[#FFBE00] uppercase tracking-wider block">Likely Waterlogging Zones</span>
                  <div className="flex flex-wrap gap-1.5">
                    {risk.affected_areas.map((area) => (
                      <span key={area} className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] text-white/90 font-bold">{area}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white/90 leading-relaxed">
                <span className="text-[9px] font-bold text-[#8ED329] uppercase tracking-wider block mb-1">Advisory</span>
                {risk.advisory}
              </div>

              <p className="text-[9px] text-white/40 italic">Risk estimated from live weather conditions — not a dedicated flood prediction model.</p>
            </div>

            {/* Safety */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FFBE00]" />
                <span>Flood Safety</span>
              </h3>
              <div className="space-y-2 text-xs text-white/85">
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
                  <span><strong>Never drive through flooded roads</strong> — 6 inches of water can knock you down.</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
                  <span><strong>Emergency:</strong> NDRF 011-24363260 • Disaster Helpline 108 • Police 100</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
