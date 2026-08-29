"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";
import { SeasonalOutlook } from "@/types/weather";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  RefreshCw,
} from "lucide-react";

export default function SeasonalOutlookPage() {
  const { activeLocation } = useWeather();
  const [region, setRegion] = useState(activeLocation || "Delhi");

  const { data: outlooks, loading, error, refetch } = useApi<SeasonalOutlook[]>(
    () => WeatherAPI.getSeasonalOutlook(region),
    [region]
  );

  const outlook = outlooks?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Seasonal Climate Outlook" subtitle="IMD Long-Range Forecast & Climate Services" />

      <div className="p-4 space-y-4">
        {/* Location */}
        <div className="glass-card rounded-2xl p-3 border border-white/20 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#00DDE5] shrink-0" />
          <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Search region or city..." className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none" />
          <button onClick={refetch} className="p-1.5 rounded-xl bg-white/10 active:bg-white/20 transition">
            <RefreshCw className="w-3.5 h-3.5 text-[#00DDE5]" />
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !outlook ? (
          <EmptyState message="No seasonal outlook data available." />
        ) : (
          <>
            {/* Season Card */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-extrabold text-lg text-white leading-tight">{outlook.season}</h2>
                  <span className="text-xs text-white/70 block mt-0.5">{outlook.period} • {outlook.region}</span>
                </div>
                <span className="text-[10px] text-white/40 shrink-0">{outlook.confidence} Confidence</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-white/60 block">Temperature Outlook</span>
                  <span className="text-lg font-black text-white block">{outlook.temp_value}</span>
                  <span className={`text-[10px] font-bold flex items-center gap-0.5 ${outlook.temp_departure.includes("Above") ? "text-[#FF2020]" : outlook.temp_departure.includes("Below") ? "text-[#00BFFF]" : "text-[#8ED329]"}`}>
                    {outlook.temp_departure.includes("Above") && <TrendingUp className="w-3 h-3" />}
                    {outlook.temp_departure.includes("Below") && <TrendingDown className="w-3 h-3" />}
                    {outlook.temp_departure}
                  </span>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-white/60 block">Rainfall Outlook</span>
                  <span className="text-lg font-black text-white block">{outlook.rainfall_value}</span>
                  <span className={`text-[10px] font-bold ${outlook.rainfall_departure === "Excess" ? "text-[#00BFFF]" : outlook.rainfall_departure === "Deficient" ? "text-[#FF7400]" : "text-[#8ED329]"}`}>
                    {outlook.rainfall_departure}
                  </span>
                </div>
              </div>

              <div className="bg-black/20 p-3 rounded-xl text-xs text-white/90 leading-relaxed border border-white/5">
                <span className="text-[9px] font-bold text-[#00DDE5] uppercase tracking-wider block mb-1">Analysis</span>
                {outlook.description}
              </div>

              <p className="text-[9px] text-white/40 italic">Source: {outlook.source} • Last updated: {outlook.last_updated}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
