"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";
import { HeatColdWaveAlert } from "@/types/weather";
import {
  Thermometer,
  Flame,
  Snowflake,
  Clock,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function HeatWavePage() {
  const { activeLocation } = useWeather();
  const [location, setLocation] = useState(activeLocation || "Delhi");

  const { data: alerts, loading, error, refetch } = useApi<HeatColdWaveAlert[]>(
    () => WeatherAPI.getHeatColdWaveAlerts(location),
    [location]
  );

  const heatAlerts = alerts?.filter((a) => a.alert_type.includes("Heat")) ?? [];
  const coldAlerts = alerts?.filter((a) => a.alert_type.includes("Cold")) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Heat & Cold Wave Alerts" subtitle="IMD Extreme Temperature Monitoring" />

      <div className="p-4 space-y-4">
        {/* Location Search */}
        <div className="glass-card rounded-2xl p-3 border border-white/20 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#00DDE5] shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search district or city..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
          />
          <button onClick={refetch} className="p-1.5 rounded-xl bg-white/10 active:bg-white/20 transition">
            <RefreshCw className="w-3.5 h-3.5 text-[#00DDE5]" />
          </button>
        </div>

        {/* Summary Banner */}
        <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF2020] to-[#FFBE00] p-[2px]">
              <div className="w-full h-full bg-[#062b4c] rounded-2xl flex items-center justify-center text-[#FF2020]">
                <Thermometer className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-none">Temperature Alerts</h2>
              <p className="text-xs text-white/70 mt-1">Based on live weather data for {location}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-[#FF2020]/15 p-3 rounded-2xl border border-[#FF2020]/20">
              <Flame className="w-5 h-5 mx-auto text-[#FF2020] mb-1" />
              <span className="text-[10px] text-white/70 block">Heat Wave Alerts</span>
              <span className="text-2xl font-black text-[#FF2020] block">{heatAlerts.length}</span>
            </div>
            <div className="bg-[#00BFFF]/15 p-3 rounded-2xl border border-[#00BFFF]/20">
              <Snowflake className="w-5 h-5 mx-auto text-[#00BFFF] mb-1" />
              <span className="text-[10px] text-white/70 block">Cold Wave Alerts</span>
              <span className="text-2xl font-black text-[#00BFFF] block">{coldAlerts.length}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton count={2} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !alerts || alerts.length === 0 ? (
          <EmptyState message={`No active heat or cold wave alerts for ${location}. Temperature conditions are within normal range.`} />
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="glass-card rounded-3xl p-4.5 border border-white/15 shadow-md space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#00DDE5]" />
                      <h3 className="font-extrabold text-white text-sm">{alert.district}</h3>
                    </div>
                    {alert.state && <span className="text-[10px] text-white/60 block mt-0.5 ml-5">{alert.state}</span>}
                  </div>
                  <span
                    className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-black shrink-0"
                    style={{ backgroundColor: alert.color }}
                  >
                    {alert.alert_type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/60 block">Max Temperature</span>
                    <span className="text-lg font-black text-white block">{alert.max_temp}°C</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/60 block">Feels Like</span>
                    <span className="text-lg font-black text-white block">{alert.heat_index}°C</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                  <Clock className="w-3 h-3" />
                  <span>Issued: {alert.issued_date} • Valid until: {alert.valid_upto}</span>
                </div>

                <div className="bg-black/20 p-2.5 rounded-xl text-[11px] text-white/90 leading-relaxed border border-white/5">
                  <span className="text-[9px] font-bold text-[#FFBE00] uppercase tracking-wider block mb-1">Advisory</span>
                  {alert.advisory}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Safety Guidelines */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FFBE00]" />
            <span>IMD & NDMA Heat Stroke First Aid</span>
          </h3>
          <div className="space-y-2 text-xs text-white/85">
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Cool the person:</strong> Move to shade. Apply cold wet cloths to neck, armpits, groin.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Hydrate:</strong> Sip cool water or ORS every 15 minutes. Do NOT give alcohol or caffeine.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Emergency:</strong> If confusion, seizures, or temp above 40°C — call 108 immediately.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
