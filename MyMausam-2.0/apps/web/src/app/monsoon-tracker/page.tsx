"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";
import { MonsoonData } from "@/types/weather";
import {
  Globe,
  MapPin,
  Calendar,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Droplets,
} from "lucide-react";

export default function MonsoonTrackerPage() {
  const { data: monsoon, loading, error, refetch } = useApi<MonsoonData>(
    () => WeatherAPI.getMonsoonData(),
    []
  );

  const [selectedStation, setSelectedStation] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="All-India Monsoon Tracker" subtitle="IMD Southwest Monsoon Real-Time Dashboard" />

      <div className="p-4 space-y-4">
        <div className="flex justify-end">
          <button onClick={refetch} className="p-2 rounded-xl bg-white/10 active:bg-white/20 transition">
            <RefreshCw className="w-4 h-4 text-[#00DDE5]" />
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !monsoon ? (
          <EmptyState message="Monsoon data unavailable." />
        ) : (
          <>
            {/* National Summary */}
            <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00BFFF] to-[#0055A6] p-[2px]">
                  <div className="w-full h-full bg-[#062b4c] rounded-2xl flex items-center justify-center text-[#00BFFF]">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h2 className="font-extrabold text-white text-base leading-none">Southwest Monsoon</h2>
                  <p className="text-xs text-white/70 mt-1">All-India: {monsoon.all_india_pct_lpa}% of LPA</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#8ED329]/15 p-2.5 rounded-xl border border-[#8ED329]/20">
                  <CheckCircle2 className="w-4 h-4 mx-auto text-[#8ED329] mb-1" />
                  <span className="text-[9px] text-white/60 block">Active</span>
                  <strong className="text-[#8ED329] text-sm block">{monsoon.active_regions}</strong>
                </div>
                <div className="bg-[#FFBE00]/15 p-2.5 rounded-xl border border-[#FFBE00]/20">
                  <AlertTriangle className="w-4 h-4 mx-auto text-[#FFBE00] mb-1" />
                  <span className="text-[9px] text-white/60 block">Deficient</span>
                  <strong className="text-[#FFBE00] text-sm block">{monsoon.deficient_regions}</strong>
                </div>
                <div className="bg-[#00BFFF]/15 p-2.5 rounded-xl border border-[#00BFFF]/20">
                  <TrendingUp className="w-4 h-4 mx-auto text-[#00BFFF] mb-1" />
                  <span className="text-[9px] text-white/60 block">Excess</span>
                  <strong className="text-[#00BFFF] text-sm block">{monsoon.excess_regions}</strong>
                </div>
              </div>
            </div>

            {/* Station Selector */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {monsoon.stations.map((station, idx) => (
                <button key={station.name} onClick={() => setSelectedStation(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${selectedStation === idx ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105" : "glass-button text-white/80 hover:text-white"}`}>
                  {station.name}
                </button>
              ))}
            </div>

            {/* Selected Station */}
            {monsoon.stations[selectedStation] && (
              <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
                {(() => {
                  const sel = monsoon.stations[selectedStation];
                  return (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#00DDE5]" />
                            <h2 className="font-extrabold text-lg text-white leading-tight">{sel.name}</h2>
                          </div>
                          {sel.region && <span className="text-xs text-white/70 block mt-0.5 ml-6">{sel.region}</span>}
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-xl text-black shrink-0 shadow-md" style={{ backgroundColor: sel.color }}>{sel.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                          <span className="text-[10px] text-white/60 block">Est. Rainfall</span>
                          <span className="text-xl font-black text-white block">{sel.rainfall_mm} mm</span>
                          <span className="text-[10px] text-white/60">Normal: {sel.normal_mm} mm</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                          <span className="text-[10px] text-white/60 block">Departure</span>
                          <span className={`text-xl font-black block ${sel.departure_pct >= 0 ? "text-[#8ED329]" : "text-[#FF7400]"}`}>
                            {sel.departure_pct > 0 ? "+" : ""}{sel.departure_pct}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1.5">
                        <div className="flex justify-between text-[10px] text-white/60">
                          <span>Progress</span>
                          <span>{Math.round((sel.rainfall_mm / Math.max(sel.normal_mm, 1)) * 100)}%</span>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((sel.rainfall_mm / Math.max(sel.normal_mm, 1)) * 100, 100)}%`, backgroundColor: sel.color }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                          <Calendar className="w-4 h-4 mx-auto text-[#00DDE5] mb-1" />
                          <span className="text-[9px] text-white/60 block">Onset</span>
                          <strong className="text-white text-sm block">{sel.onset_date}</strong>
                        </div>
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                          <Calendar className="w-4 h-4 mx-auto text-[#FFBE00] mb-1" />
                          <span className="text-[9px] text-white/60 block">Withdrawal</span>
                          <strong className="text-white text-sm block">{sel.withdrawal_date}</strong>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <p className="text-[9px] text-white/40 text-center italic">Rainfall estimated from live weather conditions. LPA = Long Period Average (1971-2020).</p>
          </>
        )}
      </div>
    </div>
  );
}
