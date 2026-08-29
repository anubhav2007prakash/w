"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";
import { CurrentWeather } from "@/types/weather";
import {
  CloudFog,
  Eye,
  MapPin,
  Clock,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export default function WinterFogPage() {
  const { activeLocation } = useWeather();
  const [location, setLocation] = useState(activeLocation || "Delhi");

  const { data: weather, loading, error, refetch } = useApi<CurrentWeather>(
    () => WeatherAPI.getCurrentWeather(location),
    [location]
  );

  const visibility = weather?.visibility_km ?? null;
  const temp = weather?.temperature ?? null;
  const humidity = weather?.humidity ?? null;
  const dewPoint = weather?.dew_point ?? null;
  const condition = weather?.condition ?? "";

  const isFog = condition.toLowerCase().includes("fog");
  const isLowVisibility = visibility !== null && visibility < 1;
  const fogSeverity = isLowVisibility ? "Dense" : isFog ? "Moderate" : visibility !== null && visibility < 4 ? "Mist" : "Clear";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Winter Fog & Visibility" subtitle="IMD Dense Fog Advisory & Visibility Status" />

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
        ) : !weather ? (
          <EmptyState message="Weather data unavailable for this location." />
        ) : (
          <>
            {/* Fog Status */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <CloudFog className="w-4 h-4 text-white/80" />
                    <h2 className="font-extrabold text-lg text-white leading-tight">{location}</h2>
                  </div>
                  <span className="text-xs text-white/70 block mt-0.5 ml-6">{weather.district}, {weather.state}</span>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl text-black shrink-0 shadow-md`}
                  style={{ backgroundColor: isFog ? "#FF7400" : isLowVisibility ? "#FFBE00" : "#8ED329" }}>
                  {fogSeverity} {isFog ? "Fog" : "Visibility"}
                </span>
              </div>

              {/* Visibility Meter */}
              <div className="bg-black/20 p-4 rounded-2xl border border-white/10 text-center space-y-2">
                <Eye className="w-8 h-8 mx-auto text-white/60" />
                {visibility !== null ? (
                  <>
                    <span className="text-4xl font-black text-white block">{visibility} km</span>
                    <span className="text-xs text-white/60">Current Visibility</span>
                  </>
                ) : (
                  <span className="text-xl font-black text-white/40 block">Data not available</span>
                )}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(((visibility ?? 10) / 10) * 100, 100)}%`, backgroundColor: isLowVisibility ? "#FF2020" : "#8ED329" }} />
                </div>
              </div>

              {/* Conditions */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-white/60 block">Temperature</span>
                  <strong className="text-white text-sm block">{temp}°C</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-white/60 block">Humidity</span>
                  <strong className="text-white text-sm block">{humidity}%</strong>
                </div>
                {dewPoint !== null && dewPoint !== undefined && (
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="text-[9px] text-white/60 block">Dew Point</span>
                    <strong className="text-white text-sm block">{dewPoint}°C</strong>
                  </div>
                )}
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-white/60 block">Condition</span>
                  <strong className="text-white text-sm block">{condition}</strong>
                </div>
              </div>

              {/* Advisory */}
              <div className="bg-black/20 p-3 rounded-xl text-xs text-white/90 leading-relaxed border border-white/5">
                <span className="text-[9px] font-bold text-[#00DDE5] uppercase tracking-wider block mb-1">Advisory</span>
                {isFog ? "Dense fog detected. Use fog lights. Avoid overtaking. Follow road markings." : isLowVisibility ? "Low visibility conditions. Reduce speed. Use hazard lights on highways." : "Visibility is adequate. Normal driving conditions."}
              </div>
            </div>

            {/* Driving Tips */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FFBE00]" />
                <span>Dense Fog Driving Protocol</span>
              </h3>
              <div className="space-y-2 text-xs text-white/85">
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
                  <span><strong>Low beam only</strong> — High beams reflect off fog droplets.</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
                  <span><strong>Speed:</strong> Dense fog (&lt;100m) — Max 30 km/h. Moderate (&lt;500m) — Max 50 km/h.</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
