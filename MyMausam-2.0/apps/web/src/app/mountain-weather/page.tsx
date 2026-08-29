"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";
import { MountainStation } from "@/types/weather";
import {
  Mountain,
  Snowflake,
  Wind,
  Thermometer,
  AlertTriangle,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export default function MountainWeatherPage() {
  const { data: stations, loading, error, refetch } = useApi<MountainStation[]>(
    () => WeatherAPI.getMountainWeather(),
    []
  );

  const [selected, setSelected] = useState(0);
  const sel = stations?.[selected];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Mountain & Himalaya Weather" subtitle="High-Altitude Station Monitoring & Avalanche Risk" />

      <div className="p-4 space-y-4">
        <div className="flex justify-end">
          <button onClick={refetch} className="p-2 rounded-xl bg-white/10 active:bg-white/20 transition">
            <RefreshCw className="w-4 h-4 text-[#00DDE5]" />
          </button>
        </div>

        {loading ? <LoadingSkeleton count={2} /> : error ? <ErrorState message={error} onRetry={refetch} /> : !stations || stations.length === 0 ? (
          <EmptyState message="Mountain weather data unavailable." />
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {stations.map((st, idx) => (
                <button key={st.name} onClick={() => setSelected(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${selected === idx ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105" : "glass-button text-white/80 hover:text-white"}`}>
                  {st.name}
                </button>
              ))}
            </div>

            {sel && (
              <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-[#00DDE5]" />
                      <h2 className="font-extrabold text-lg text-white leading-tight">{sel.name}</h2>
                    </div>
                    <span className="text-[10px] text-white/60 block mt-0.5 ml-6">{sel.altitude_m}m • {sel.region}</span>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-xl text-black shrink-0 shadow-md" style={{ backgroundColor: sel.avalanche_color }}>{sel.condition}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#00DDE5]"><Thermometer className="w-4 h-4" /><span className="font-bold">Temperature</span></div>
                    <span className="text-xl font-black text-white block">{sel.temperature}°C</span>
                    <span className="text-[10px] text-white/60">Feels like {sel.feels_like}°C</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#FFBE00]"><Wind className="w-4 h-4" /><span className="font-bold">Wind</span></div>
                    <span className="text-xl font-black text-white block">{sel.wind_speed} km/h</span>
                    <span className="text-[10px] text-white/60">Gusts: {sel.wind_gust} km/h</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                    <Snowflake className="w-4 h-4 mx-auto text-[#00BFFF] mb-1" />
                    <span className="text-[9px] text-white/60 block">24h Snowfall</span>
                    <strong className="text-white text-sm block">{sel.snowfall_24h_cm} cm</strong>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="text-[9px] text-white/60 block">Visibility</span>
                    <strong className="text-white text-sm block">{sel.visibility}</strong>
                  </div>
                </div>

                <div className="bg-black/20 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" style={{ color: sel.avalanche_color }} />
                    <div>
                      <span className="text-xs font-bold text-white block">Avalanche Risk</span>
                      <span className="text-[10px] text-white/60">{sel.avalanche_risk}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-xl text-black shadow-md" style={{ backgroundColor: sel.avalanche_color }}>{sel.avalanche_risk}</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white/90 leading-relaxed">
                  <span className="text-[9px] font-bold text-[#FFBE00] uppercase tracking-wider block mb-1">Advisory</span>
                  {sel.advisory}
                </div>
                <p className="text-[9px] text-white/40 italic">Source: {sel.source} • Updated: {sel.last_updated}</p>
              </div>
            )}

            <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FFBE00]" /><span>Mountain Safety</span>
              </h3>
              <div className="space-y-2 text-xs text-white/85">
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
                  <span><strong>Acclimatize:</strong> Above 3,000m, gain no more than 300-500m/day.</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
                  <span><strong>AMS Watch:</strong> Headache + nausea above 2,500m = descend immediately.</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
