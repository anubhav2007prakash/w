"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useWeather } from "@/context/WeatherContext";
import {
  Droplets,
  Zap,
  TrendingUp,
  Activity,
  Shield,
} from "lucide-react";

const FLOOD_RISK_LEVELS = [
  { level: 0, label: "Normal", labelHi: "सामान्य", color: "#22c55e", multiplier: 1.0 },
  { level: 1, label: "Low Risk", labelHi: "कम जोखिम", color: "#FFBE00", multiplier: 1.05 },
  { level: 2, label: "Moderate", labelHi: "मध्यम", color: "#FF7400", multiplier: 1.12 },
  { level: 3, label: "High Risk", labelHi: "उच्च जोखिम", color: "#ef4444", multiplier: 1.2 },
  { level: 4, label: "Extreme", labelHi: "चरम", color: "#dc2626", multiplier: 1.35 },
];

const RECOVERY_DAYS = 7;
const PRE_FLOOD_DAYS = 2;

interface SimulationDay {
  day: number;
  label: string;
  normalDemand: number;
  simulatedDemand: number;
  phase: "normal" | "pre-flood" | "flood" | "recovery";
}

function simulateFloodDemand(
  baseDailyDemand: number,
  riskLevel: number,
  precipMM: number
): SimulationDay[] {
  const risk = FLOOD_RISK_LEVELS[riskLevel];
  const days: SimulationDay[] = [];

  for (let i = -PRE_FLOOD_DAYS; i <= RECOVERY_DAYS + 3; i++) {
    let phase: SimulationDay["phase"];
    let multiplier = 1.0;

    if (i < 0) {
      phase = "pre-flood";
      multiplier = 1 + (0.03 * riskLevel);
    } else if (i === 0) {
      phase = "flood";
      multiplier = risk.multiplier;
    } else if (i <= RECOVERY_DAYS) {
      phase = "recovery";
      const recovery = i / RECOVERY_DAYS;
      multiplier = risk.multiplier - (risk.multiplier - 1.0) * recovery;
    } else {
      phase = "normal";
      multiplier = 1.0;
    }

    if (precipMM > 100 && phase === "flood") {
      multiplier *= 1 + (precipMM - 100) / 500;
    }

    const normalDemand = baseDailyDemand;
    const simulatedDemand = baseDailyDemand * multiplier;

    days.push({
      day: i,
      label: i < 0 ? `D${i}` : i === 0 ? "D0" : `D+${i}`,
      normalDemand,
      simulatedDemand,
      phase,
    });
  }
  return days;
}

export function FloodImpactSimulator() {
  const { currentWeather } = useWeather();
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [riskLevel, setRiskLevel] = useState(0);
  const precipMM = 25;

  const baseDemand = 12.5;
  const simulation = useMemo(
    () => simulateFloodDemand(baseDemand, riskLevel, precipMM),
    [riskLevel, precipMM]
  );

  const maxDemand = Math.max(...simulation.map((d) => d.simulatedDemand));
  const peakDemand = maxDemand;
  const demandIncrease = ((peakDemand - baseDemand) / baseDemand * 100).toFixed(0);
  const recoveryKgCO2 = ((peakDemand - baseDemand) * 0.82 * RECOVERY_DAYS).toFixed(1);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/20 flex items-center justify-center">
          <Droplets className="w-4 h-4 text-[#38bdf8]" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white">
            {isHi ? "बाढ़ ऊर्जा प्रभाव" : "Flood Energy Impact"}
          </h3>
          <p className="text-[9px] text-white/50">
            {isHi ? "चरम मौसम में ऊर्जा माँग अनुकरण" : "Energy demand during extreme weather events"}
          </p>
        </div>
      </div>

      {/* Risk Level Selector */}
      <div className="flex gap-1">
        {FLOOD_RISK_LEVELS.map((risk) => (
          <button
            key={risk.level}
            onClick={() => setRiskLevel(risk.level)}
            className={`flex-1 py-1.5 rounded-xl text-[9px] font-bold transition-all ${
              riskLevel === risk.level
                ? "text-white shadow-lg"
                : "text-white/50 bg-white/5"
            }`}
            style={
              riskLevel === risk.level
                ? { background: `${risk.color}33`, border: `1px solid ${risk.color}55` }
                : {}
            }
          >
            <div
              className="w-2 h-2 rounded-full mx-auto mb-0.5"
              style={{ background: risk.color }}
            />
            {isHi ? risk.labelHi : risk.label}
          </button>
        ))}
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-xl bg-white/5 text-center">
          <TrendingUp className="w-3.5 h-3.5 mx-auto text-[#ff6b6b] mb-0.5" />
          <div className="text-sm font-black text-[#ff6b6b]">+{demandIncrease}%</div>
          <div className="text-[8px] text-white/50">{isHi ? "चोटी माँग" : "Peak"}</div>
        </div>
        <div className="p-2 rounded-xl bg-white/5 text-center">
          <Zap className="w-3.5 h-3.5 mx-auto text-[#FFBE00] mb-0.5" />
          <div className="text-sm font-black text-white font-mono">
            {peakDemand.toFixed(1)}
          </div>
          <div className="text-[8px] text-white/50">kWh</div>
        </div>
        <div className="p-2 rounded-xl bg-white/5 text-center">
          <Activity className="w-3.5 h-3.5 mx-auto text-[#a78bfa] mb-0.5" />
          <div className="text-sm font-black text-[#a78bfa] font-mono">
            {recoveryKgCO2}
          </div>
          <div className="text-[8px] text-white/50">kg CO₂</div>
        </div>
      </div>

      {/* Simulation Timeline */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-white/70">
          {isHi ? "ऊर्जा माँग अनुकरण" : "Demand Simulation Timeline"}
        </span>
        <div className="flex items-end gap-[2px] h-20">
          {simulation.map((d, i) => {
            const height = (d.simulatedDemand / maxDemand) * 100;
            const normalHeight = (d.normalDemand / maxDemand) * 100;
            let barColor: string;
            switch (d.phase) {
              case "pre-flood":
                barColor = "#FFBE00";
                break;
              case "flood":
                barColor = "#ef4444";
                break;
              case "recovery":
                barColor = "#a78bfa";
                break;
              default:
                barColor = "#22c55e";
            }
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-[1px]">
                <div className="w-full relative" style={{ height: "64px" }}>
                  {/* Normal baseline */}
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t opacity-20"
                    style={{
                      height: `${normalHeight}%`,
                      background: "#22c55e",
                    }}
                  />
                  {/* Actual bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t transition-all"
                    style={{
                      height: `${height}%`,
                      background: barColor,
                      minHeight: "2px",
                    }}
                  />
                </div>
                {i % 2 === 0 && (
                  <span className="text-[6px] text-white/40">{d.label}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 justify-center text-[8px] text-white/50">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-[#22c55e]" /> {isHi ? "सामान्य" : "Normal"}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-[#FFBE00]" /> {isHi ? "पूर्व-बाढ़" : "Pre-flood"}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-[#ef4444]" /> {isHi ? "बाढ़" : "Flood"}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-[#a78bfa]" /> {isHi ? "रिकवरी" : "Recovery"}
          </span>
        </div>
      </div>

      {/* Grid Resilience Advisory */}
      <div className="p-2.5 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-start gap-2">
        <Shield className="w-3.5 h-3.5 text-[#38bdf8] mt-0.5 shrink-0" />
        <div className="text-[10px] text-white/70 leading-relaxed">
          {riskLevel >= 3 ? (
            <>
              ⚠️ {isHi
                ? "गंभीर बाढ़ जोखिम — बैकअप पावर तैयार रखें, गैर-ज़रूरी उपकरण बंद करें, और IMD चेतावनी पर नज़र रखें।"
                : "SEVERE flood risk — prepare backup power, switch off non-essential devices, and monitor IMD warnings."}
            </>
          ) : (
            <>
              📊 {isHi
                ? "ऊर्जा लचीलापन: बाढ़ के दौरान बिजली की माँग बढ़ सकती है। ऊर्जा बचत उपाय अपनाएं।"
                : "Energy resilience: demand can spike during floods. Adopt energy-saving measures."}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
