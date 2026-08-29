"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";
import { RouteNowcastData } from "@/types/weather";
import {
  Car,
  MapPin,
  Navigation,
  Thermometer,
  CloudRain,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function RouteNavigatorPage() {
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("Jaipur");
  const [submitted, setSubmitted] = useState(false);

  const { data: routeData, loading, error, refetch } = useApi<RouteNowcastData>(
    () => WeatherAPI.getRouteNowcast(origin, destination),
    [origin, destination, submitted]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Highway Route Weather" subtitle="NHAI Road Weather & Traffic Intelligence" />

      <div className="p-4 space-y-4">
        {/* Route Input */}
        <div className="glass-card rounded-3xl p-4 border border-white/20 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-[#00DDE5]">
            <Navigation className="w-4 h-4" />
            <span className="font-extrabold text-sm text-white">Route Planning</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <MapPin className="w-4 h-4 text-[#8ED329] shrink-0" />
              <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Starting location" className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none" />
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <MapPin className="w-4 h-4 text-[#FF2020] shrink-0" />
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none" />
            </div>
          </div>
          <button onClick={() => { setSubmitted(true); refetch(); }}
            className="w-full py-3 rounded-2xl bg-[#00DDE5] text-[#06345C] font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition">
            <Car className="w-4 h-4" />
            Get Route Weather
          </button>
        </div>

        {!submitted && !routeData ? (
          <EmptyState message="Enter your route to get weather conditions along the way." icon={<Navigation className="w-10 h-10 mx-auto text-white/30" />} />
        ) : loading ? (
          <LoadingSkeleton count={2} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !routeData ? (
          <EmptyState message="No route data available." />
        ) : (
          <>
            {/* Route Summary */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-extrabold text-sm text-white">{routeData.origin} → {routeData.destination}</h2>
                  <span className="text-[10px] text-white/60 block mt-0.5">{routeData.total_distance_km} km • {routeData.estimated_time}</span>
                </div>
              </div>
              <div className="bg-black/20 p-3 rounded-xl text-xs text-white/90 leading-relaxed border border-white/5">
                <span className="text-[9px] font-bold text-[#FFBE00] uppercase tracking-wider block mb-1">Route Summary</span>
                {routeData.route_condition_summary}
              </div>
            </div>

            {/* Waypoints */}
            <div className="space-y-2">
              {routeData.waypoints.map((wp, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-4 border border-white/15 shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: wp.warning ? "#FF2020" : "#8ED329", color: "#000" }}>{idx + 1}</div>
                      <div>
                        <span className="text-xs font-bold text-white block">{wp.name}</span>
                        <span className="text-[9px] text-white/50">{wp.distance_km} km from start</span>
                      </div>
                    </div>
                    {wp.warning && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#FF2020] text-white">{wp.warning}</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="text-center"><Thermometer className="w-3 h-3 mx-auto text-[#00DDE5] mb-0.5" /><span className="text-white/60 block">Temp</span><strong className="text-white">{wp.temp}°C</strong></div>
                    <div className="text-center"><CloudRain className="w-3 h-3 mx-auto text-[#00BFFF] mb-0.5" /><span className="text-white/60 block">Rain</span><strong className="text-white">{wp.rain_probability}%</strong></div>
                    <div className="text-center"><span className="text-white/60 block">Condition</span><strong className="text-white">{wp.condition}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Driving Tips */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8ED329]" /><span>Route Safety Tips</span>
              </h3>
              <div className="space-y-2 text-xs text-white/85">
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#FFBE00] shrink-0 mt-0.5" />
                  <span>Weather conditions along route are derived from real-time weather data for waypoint locations.</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
                  <span><strong>Emergency:</strong> Highway Helpline 1033 • Ambulance 108 • Police 100</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
