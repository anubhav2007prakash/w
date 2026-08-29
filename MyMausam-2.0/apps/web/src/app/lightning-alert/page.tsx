"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Zap,
  ShieldAlert,
  AlertTriangle,
  Clock,
  MapPin,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface LightningStrike {
  distanceKm: number;
  direction: string;
  peakCurrentKA: number;
  time: string;
  type: "CG" | "IC";
}

const STRIKES: LightningStrike[] = [
  { distanceKm: 3.2, direction: "NE", peakCurrentKA: 45.2, time: "2 min ago", type: "CG" },
  { distanceKm: 5.8, direction: "N", peakCurrentKA: 38.7, time: "5 min ago", type: "CG" },
  { distanceKm: 8.1, direction: "NW", peakCurrentKA: 52.1, time: "8 min ago", type: "IC" },
  { distanceKm: 12.4, direction: "W", peakCurrentKA: 31.5, time: "12 min ago", type: "CG" },
  { distanceKm: 18.7, direction: "SW", peakCurrentKA: 28.9, time: "18 min ago", type: "IC" },
  { distanceKm: 25.3, direction: "S", peakCurrentKA: 41.0, time: "22 min ago", type: "CG" },
  { distanceKm: 32.1, direction: "SE", peakCurrentKA: 22.4, time: "30 min ago", type: "CG" },
];

export default function LightningAlertPage() {
  const { activeLocation } = useWeather();
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const nearestStrike = STRIKES[0];
  const flashToBang = nearestStrike.distanceKm;
  const seconds = Math.round(flashToBang / 0.343);

  const riskLevel =
    flashToBang < 5 ? "EXTREME" : flashToBang < 10 ? "HIGH" : flashToBang < 20 ? "MODERATE" : "LOW";
  const riskColor =
    flashToBang < 5 ? "#FF2020" : flashToBang < 10 ? "#FF7400" : flashToBang < 20 ? "#FFBE00" : "#8ED329";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Lightning Proximity Alert" subtitle="Damini Lightning Detection Network" />

      <div className="p-4 space-y-4">
        {/* Risk Banner */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FFBE00]" />
              <span>Nearest Strike Detected</span>
            </h3>
            <span
              className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-black"
              style={{ backgroundColor: riskColor }}
            >
              {riskLevel} RISK
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] text-white/60 block">Distance</span>
              <span className="text-3xl font-black text-white block">{flashToBang}</span>
              <span className="text-[10px] text-white/60 block">kilometers {nearestStrike.direction}</span>
            </div>
            <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] text-white/60 block">Peak Current</span>
              <span className="text-3xl font-black text-[#FFBE00] block">{nearestStrike.peakCurrentKA}</span>
              <span className="text-[10px] text-white/60 block">kA ({nearestStrike.type})</span>
            </div>
          </div>

          {flashToBang < 10 && (
            <div className="bg-[#FF2020]/20 p-3 rounded-2xl border border-[#FF2020]/30 text-center">
              <p className="text-xs font-black text-[#FF2020] animate-pulse">
                ⚠️ SEEK SHELTER IMMEDIATELY — Storm within 10 km!
              </p>
            </div>
          )}
        </div>

        {/* Flash-to-Bang Timer */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00DDE5]" />
            <span>Flash-to-Bang Timer</span>
          </h3>
          <p className="text-xs text-white/80">
            Start counting when you see lightning. Stop when you hear thunder. Every 3 seconds = ~1 km distance.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTimerActive(!timerActive);
                if (!timerActive) setTimer(0);
              }}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm transition-all ${
                timerActive
                  ? "bg-[#FF2020] text-white shadow-lg shadow-[#FF2020]/30"
                  : "bg-[#00DDE5] text-[#06345C] shadow-lg shadow-[#00DDE5]/30"
              }`}
            >
              {timerActive ? "Stop" : "Start Counting"}
            </button>
            <div className="flex-1 text-center">
              <span className="text-4xl font-black text-white">{timer}</span>
              <span className="text-xs text-white/60 block">seconds</span>
            </div>
            {timer > 0 && !timerActive && (
              <div className="text-right">
                <span className="text-lg font-black text-[#FFBE00] block">
                  ~{(timer * 0.343).toFixed(1)} km
                </span>
                <span className="text-[10px] text-white/60">estimated</span>
              </div>
            )}
          </div>
        </div>

        {/* Strike Log */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FFBE00]" />
            <span>Recent Strike Log ({activeLocation})</span>
          </h3>

          <div className="space-y-2">
            {STRIKES.map((strike, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: strike.distanceKm < 10 ? "#FF202030" : "#FFBE0030" }}
                >
                  <Zap className="w-4 h-4" style={{ color: strike.distanceKm < 10 ? "#FF2020" : "#FFBE00" }} />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white">{strike.distanceKm} km {strike.direction}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-bold">
                      {strike.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50">{strike.time} • {strike.peakCurrentKA} kA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-30 Rule */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#00DDE5]" />
            <span>30-30 Safety Protocol</span>
          </h3>
          <div className="space-y-2 text-xs text-white/85">
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>First 30:</strong> If flash-to-bang is under 30 seconds, storm is within 10 km. Take shelter immediately.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Second 30:</strong> Wait at least 30 minutes after last thunder before going outside.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
