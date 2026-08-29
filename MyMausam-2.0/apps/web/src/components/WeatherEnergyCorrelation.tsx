"use client";

import React, { useMemo, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useWeather } from "@/context/WeatherContext";
import {
  Thermometer,
  Zap,
  TrendingUp,
  Sun,
  Snowflake,
} from "lucide-react";

const GRID_EMISSION_FACTOR = 0.82;
const BASE_ENERGY_KWH = 8.5;

function calcCDD(temp: number): number {
  return Math.max(0, temp - 24);
}

function calcHDD(temp: number): number {
  return Math.max(0, 18 - temp);
}

function estimateEnergyConsumption(temp: number): number {
  const cdd = calcCDD(temp);
  const hdd = calcHDD(temp);
  return BASE_ENERGY_KWH + cdd * 0.6 + hdd * 0.4;
}

function getMonthLabel(m: number, isHi: boolean): string {
  const monthsHi = ["जन", "फ़र", "मार्च", "अप्रैल", "मई", "जून", "जुला", "अग", "सित", "अक्टू", "नव", "दिस"];
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return isHi ? monthsHi[m] : monthsEn[m];
}

const MONTHLY_TEMPS = [18, 22, 28, 34, 38, 36, 33, 32, 31, 28, 23, 19];

export function WeatherEnergyCorrelation() {
  const { currentWeather } = useWeather();
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const monthlyData = useMemo(() =>
    MONTHLY_TEMPS.map((t, i) => ({
      month: i,
      temp: t,
      cdd: calcCDD(t),
      hdd: calcHDD(t),
      energy: estimateEnergyConsumption(t),
      carbon: estimateEnergyConsumption(t) * GRID_EMISSION_FACTOR,
    })), []);

  const maxEnergy = Math.max(...monthlyData.map((d) => d.energy));
  const currentTemp = currentWeather?.temperature || 30;
  const currentEnergy = estimateEnergyConsumption(currentTemp);
  const currentCDD = calcCDD(currentTemp);
  const currentHDD = calcHDD(currentTemp);

  const coolingCost = (currentCDD * 0.6 * GRID_EMISSION_FACTOR * 7).toFixed(1);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#FFBE00]/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-[#FFBE00]" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white">
            {isHi ? "ऊर्जा-मौसम सहसंबंध" : "Weather × Energy"}
          </h3>
          <p className="text-[9px] text-white/50">
            {isHi ? "तापमान से ऊर्जा खपत पूर्वानुमान" : "How temperature drives energy demand"}
          </p>
        </div>
      </div>

      {/* Current Day Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-xl bg-white/5 text-center">
          <Thermometer className="w-3.5 h-3.5 mx-auto text-[#FF7400] mb-0.5" />
          <div className="text-sm font-black text-white">{currentTemp}°</div>
          <div className="text-[8px] text-white/50">{isHi ? "तापमान" : "Temp"}</div>
        </div>
        <div className="p-2 rounded-xl bg-white/5 text-center">
          <Sun className="w-3.5 h-3.5 mx-auto text-[#FFBE00] mb-0.5" />
          <div className="text-sm font-black text-[#FF7400]">{currentCDD.toFixed(0)}</div>
          <div className="text-[8px] text-white/50">CDD</div>
        </div>
        <div className="p-2 rounded-xl bg-white/5 text-center">
          <Snowflake className="w-3.5 h-3.5 mx-auto text-[#38bdf8] mb-0.5" />
          <div className="text-sm font-black text-[#38bdf8]">{currentHDD.toFixed(0)}</div>
          <div className="text-[8px] text-white/50">HDD</div>
        </div>
      </div>

      {/* Energy Estimate */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-white/50">
            {isHi ? "अनुमानित दैनिक खपत" : "Estimated Daily Consumption"}
          </div>
          <div className="text-lg font-black text-[#FFBE00] font-mono">
            {currentEnergy.toFixed(1)} <span className="text-[10px] font-normal text-white/50">kWh</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/50">
            {isHi ? "अनुमानित CO₂" : "Estimated CO₂"}
          </div>
          <div className="text-lg font-black text-[#ff6b6b] font-mono">
            {currentEnergy.toFixed(1)} <span className="text-[10px] font-normal text-white/50">kg</span>
          </div>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-white/70">
            {isHi ? "मासिक ऊर्जा खपत" : "Monthly Energy Demand"}
          </span>
          <div className="flex items-center gap-2 text-[8px] text-white/40">
            <span className="flex items-center gap-0.5">
              <span className="w-2 h-2 rounded-sm bg-[#FFBE00]" /> kWh
            </span>
            <span className="flex items-center gap-0.5">
              <span className="w-2 h-2 rounded-sm bg-[#ff6b6b]" /> CO₂
            </span>
          </div>
        </div>
        <div className="flex items-end gap-[3px] h-24">
          {monthlyData.map((d) => {
            const energyH = (d.energy / maxEnergy) * 100;
            const isSelected = d.month === selectedMonth;
            return (
              <button
                key={d.month}
                onClick={() => setSelectedMonth(d.month)}
                className="flex-1 flex flex-col items-center gap-0.5 group"
              >
                <div className="w-full flex items-end gap-[1px]" style={{ height: "72px" }}>
                  <div
                    className="flex-1 rounded-t transition-all"
                    style={{
                      height: `${energyH}%`,
                      background: isSelected
                        ? "#FFBE00"
                        : "rgba(255,190,0,0.35)",
                      minHeight: "4px",
                    }}
                  />
                  <div
                    className="flex-1 rounded-t transition-all"
                    style={{
                      height: `${(d.carbon / (maxEnergy * GRID_EMISSION_FACTOR)) * 100}%`,
                      background: isSelected ? "#ff6b6b" : "rgba(255,107,107,0.35)",
                      minHeight: "4px",
                    }}
                  />
                </div>
                <span
                  className={`text-[7px] ${isSelected ? "text-white font-bold" : "text-white/40"}`}
                >
                  {getMonthLabel(d.month, isHi)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Month Detail */}
      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
        <div className="flex justify-between text-[10px]">
          <span className="text-white/60">
            {getMonthLabel(selectedMonth, isHi)} {isHi ? "औसत" : "Avg"}: {monthlyData[selectedMonth].temp}°C
          </span>
          <span className="text-[#FFBE00] font-mono">
            {monthlyData[selectedMonth].energy.toFixed(1)} kWh → {monthlyData[selectedMonth].carbon.toFixed(1)} kg CO₂
          </span>
        </div>
      </div>

      {/* Cooling Cost Insight */}
      <div className="p-2.5 rounded-xl bg-[#FF7400]/10 border border-[#FF7400]/20 flex items-start gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-[#FF7400] mt-0.5 shrink-0" />
        <span className="text-[10px] text-white/70 leading-relaxed">
          {isHi
            ? `इस सप्ताह कूलिंग से ~${coolingCost} kg CO₂ उत्सर्जन हो सकता है। AC 24°C पर सेट करके 25% बचाएं।`
            : `Cooling may emit ~${coolingCost} kg CO₂ this week. Set AC to 24°C to save 25%.`}
        </span>
      </div>
    </div>
  );
}
