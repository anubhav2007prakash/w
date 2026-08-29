"use client";

import { usePersonalization } from "@/context/PersonalizationContext";
import { useWeather } from "@/context/WeatherContext";
import { Wifi, WifiOff, Clock, Database } from "lucide-react";

export function PersonalizedGreeting() {
  const { getGreeting, getDailySummary, activeMode } = usePersonalization();
  const { currentWeather } = useWeather();

  const modeLabel: Record<string, string> = {
    fitness: "🏃 Fitness",
    commuter: "🚗 Commuter",
    travel: "✈️ Travel",
    family: "👨‍👩‍👧 Family",
    agriculture: "🌾 Agriculture",
    gardening: "🌿 Gardening",
    beach: "🏖️ Beach",
    event_planner: "📅 Event Planner",
  };

  return (
    <div className="px-4 pt-4 pb-2 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">{getGreeting()}</h1>
          <p className="text-xs text-white/50">{getDailySummary()}</p>
        </div>
        {activeMode !== "default" && (
          <span className="text-xs bg-[#00DDE5]/20 text-[#00DDE5] px-2 py-1 rounded-full font-medium">
            {modeLabel[activeMode] || activeMode}
          </span>
        )}
      </div>
      <DataIndicators weather={currentWeather} />
    </div>
  );
}

function DataIndicators({ weather }: { weather: any }) {
  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

  return (
    <div className="flex items-center gap-3 text-[10px] text-white/30">
      <span className="flex items-center gap-1">
        {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
        {isOnline ? "Online" : "Offline"}
      </span>
      {weather?.updated_at && (
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {weather.updated_at}
        </span>
      )}
      <span className="flex items-center gap-1">
        <Database size={10} />
        IMD
      </span>
    </div>
  );
}
