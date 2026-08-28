"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation, MapPin, Clock, CloudRain, Car } from "lucide-react";
import { useWeather } from "@/context/WeatherContext";

export default function RouteNowcastPage() {
  const { formatTemp } = useWeather();
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("Jaipur");

  const WAYPOINTS = [
    { name: "Delhi Dhaula Kuan", distKm: 0, temp: 34.2, cond: "Clear", rain: 5 },
    { name: "Gurugram IFFCO Chowk", distKm: 35, temp: 34.8, cond: "Partly Cloudy", rain: 10 },
    { name: "Rewari Junction", distKm: 90, temp: 35.5, cond: "Clear", rain: 5 },
    { name: "Kotputli Toll", distKm: 165, temp: 36.2, cond: "Sunny", rain: 15 },
    { name: "Shahpura", distKm: 220, temp: 35.8, cond: "Sunny", rain: 5 },
    { name: "Jaipur Amer", distKm: 275, temp: 35.5, cond: "Clear", rain: 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Corridor Route Nowcast" subtitle="Highway Waypoint Weather Profiler" />

      <div className="p-4 space-y-4">
        {/* Route selector banner */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Car className="w-5 h-5 text-[#00DDE5]" />
            <h3 className="font-extrabold text-sm">{origin} ➔ {destination} (NH-48)</h3>
          </div>
          <p className="text-xs text-white/70">
            Total distance: 275 km • Est. transit: 4h 15m • Road conditions dry and clear.
          </p>
        </div>

        {/* Waypoints list */}
        <div className="space-y-2">
          {WAYPOINTS.map((wp, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-3.5 border border-white/15 shadow-md flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-black text-[#00DDE5] text-xs">
                  {wp.distKm}k
                </span>
                <div>
                  <span className="font-bold text-white block">{wp.name}</span>
                  <span className="text-[10px] text-white/60">{wp.cond}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-white text-sm block">{formatTemp(wp.temp)}</span>
                <span className="text-[10px] text-[#00DDE5] font-semibold flex items-center gap-0.5 justify-end">
                  <CloudRain className="w-3 h-3" />
                  <span>{wp.rain}%</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
