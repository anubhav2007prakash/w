"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";
import { LightningData } from "@/types/weather";
import {
  Zap,
  ShieldAlert,
  Clock,
  Activity,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function LightningAlarmPage() {
  const { data: lightning, loading, error, refetch } = useApi<LightningData>(
    () => WeatherAPI.getLightningData(),
    []
  );

  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const strikes = lightning?.strikes ?? [];
  const nearestStrike = strikes[0];
  const flashToBang = nearestStrike ? Math.round((nearestStrike.lat + nearestStrike.lon) % 30 + 2) : null;
  const riskLevel = lightning?.risk_level ?? "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Lightning Proximity Alert" subtitle="Damini Lightning Detection Network" />

      <div className="p-4 space-y-4">
        {/* Refresh */}
        <div className="flex justify-end">
          <button onClick={refetch} className="p-2 rounded-xl bg-white/10 active:bg-white/20 transition">
            <RefreshCw className="w-4 h-4 text-[#00DDE5]" />
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !lightning ? (
          <EmptyState message="Lightning data unavailable. The Damini sensor network may be offline." />
        ) : (
          <>
            {/* Risk Banner */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FFBE00]" />
                  <span>{lightning.station_area}</span>
                </h3>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-black"
                  style={{ backgroundColor: riskLevel === "High" ? "#FF2020" : riskLevel === "Elevated" ? "#FFBE00" : "#8ED329" }}>
                  {riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-white/60 block">Strikes (1h)</span>
                  <strong className="text-white text-sm block">{lightning.total_strikes_last_hour}</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-white/60 block">Nearest</span>
                  <strong className="text-white text-sm block">{nearestStrike ? `${nearestStrike.time}` : "None"}</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-white/60 block">30-30 Timer</span>
                  <strong className={`text-sm block ${riskLevel === "High" || riskLevel === "Elevated" ? "text-[#FF2020]" : "text-[#8ED329]"}`}>
                    {riskLevel === "High" || riskLevel === "Elevated" ? "Active" : "Safe"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Flash-to-Bang Timer */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00DDE5]" />
                <span>Flash-to-Bang Timer</span>
              </h3>
              <p className="text-xs text-white/80">Count seconds between lightning flash and thunder. Every 3 seconds ≈ 1 km.</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setTimerActive(!timerActive); if (!timerActive) setTimer(0); }}
                  className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm transition-all ${timerActive ? "bg-[#FF2020] text-white" : "bg-[#00DDE5] text-[#06345C]"}`}
                >
                  {timerActive ? "Stop" : "Start"}
                </button>
                <div className="flex-1 text-center">
                  <span className="text-4xl font-black text-white">{timer}</span>
                  <span className="text-xs text-white/60 block">seconds</span>
                </div>
                {timer > 0 && !timerActive && (
                  <div className="text-right">
                    <span className="text-lg font-black text-[#FFBE00] block">~{(timer * 0.343).toFixed(1)} km</span>
                  </div>
                )}
              </div>
            </div>

            {/* Strike Log */}
            {strikes.length > 0 && (
              <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FFBE00]" />
                  <span>Recent Strikes</span>
                </h3>
                <div className="space-y-2">
                  {strikes.map((strike) => (
                    <div key={strike.id} className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <Zap className="w-4 h-4 text-[#FFBE00] shrink-0" />
                      <div className="flex-1 text-xs">
                        <span className="font-black text-white">{strike.time}</span>
                        <span className="text-[9px] text-white/50 ml-2">{strike.strike_type} • {Math.abs(strike.peak_current_ka)} kA</span>
                      </div>
                      <span className="text-[9px] text-white/40">{strike.lat.toFixed(2)}, {strike.lon.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#00DDE5]" />
                <span>30-30 Safety Protocol</span>
              </h3>
              <div className="space-y-2 text-xs text-white/85">
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
                  <span><strong>First 30:</strong> If flash-to-bang is under 30 seconds, storm is within 10 km. Take shelter.</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
                  <span><strong>Second 30:</strong> Wait at least 30 minutes after last thunder before going outside.</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
