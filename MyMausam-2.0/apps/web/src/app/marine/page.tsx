"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Waves, Compass, AlertTriangle, ShieldCheck, Fish, Wind } from "lucide-react";

interface CoastalPort {
  name: string;
  state: string;
  waveHeightM: number;
  swellPeriodS: number;
  waterTempC: number;
  signalNumber: number;
  status: string;
  flagColor: string;
  pfzDistanceKm: number;
}

const PORTS: CoastalPort[] = [
  { name: "Mumbai Port Trust", state: "Maharashtra", waveHeightM: 1.4, swellPeriodS: 8.2, waterTempC: 28.5, signalNumber: 1, status: "Normal Operations", flagColor: "#8ED329", pfzDistanceKm: 18 },
  { name: "Kandla (Deendayal)", state: "Gujarat", waveHeightM: 1.8, swellPeriodS: 7.5, waterTempC: 29.1, signalNumber: 2, status: "Cautionary Signal", flagColor: "#FFBE00", pfzDistanceKm: 24 },
  { name: "Chennai Port Trust", state: "Tamil Nadu", waveHeightM: 1.2, swellPeriodS: 9.0, waterTempC: 29.8, signalNumber: 1, status: "Normal Operations", flagColor: "#8ED329", pfzDistanceKm: 14 },
  { name: "Visakhapatnam Port", state: "Andhra Pradesh", waveHeightM: 1.6, swellPeriodS: 8.8, waterTempC: 29.2, signalNumber: 1, status: "Normal Operations", flagColor: "#8ED329", pfzDistanceKm: 22 },
  { name: "Kochi Port", state: "Kerala", waveHeightM: 2.1, swellPeriodS: 10.2, waterTempC: 28.0, signalNumber: 3, status: "Rough Sea Advisory", flagColor: "#FF7400", pfzDistanceKm: 30 },
];

export default function MarinePage() {
  const [selectedPort, setSelectedPort] = useState<CoastalPort>(PORTS[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Marine & Coastal (INCOIS)" subtitle="Ocean Wave Telemetry & Fishermen Advisories" />

      <div className="p-4 space-y-4">
        {/* Port Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {PORTS.map((port) => (
            <button
              key={port.name}
              onClick={() => setSelectedPort(port)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedPort.name === port.name
                  ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {port.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Selected Port Card */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-lg text-white leading-tight">{selectedPort.name}</h2>
              <span className="text-xs text-white/70 block mt-0.5">{selectedPort.state} • Arabian Sea / Bay of Bengal</span>
            </div>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-xl text-black shadow-md shrink-0"
              style={{ backgroundColor: selectedPort.flagColor }}
            >
              Signal {selectedPort.signalNumber} • {selectedPort.status}
            </span>
          </div>

          {/* 4-Grid Ocean Telemetry */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-white/60 block">Wave Height (Hs)</span>
              <span className="text-xl font-black text-white">{selectedPort.waveHeightM} m</span>
              <span className="text-[10px] text-[#00DDE5]">Swell: {selectedPort.swellPeriodS}s</span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-white/60 block">Sea Surface Temp</span>
              <span className="text-xl font-black text-white">{selectedPort.waterTempC}°C</span>
              <span className="text-[10px] text-[#8ED329]">Pleasant for Transit</span>
            </div>
          </div>

          {/* Potential Fishing Zone (PFZ) Advisory */}
          <div className="bg-black/25 p-3.5 rounded-2xl space-y-1 text-xs text-white/90">
            <div className="flex items-center gap-2 text-[#00DDE5] font-bold">
              <Fish className="w-4 h-4" />
              <span>INCOIS Potential Fishing Zone (PFZ)</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              Thermal front detected at <strong>{selectedPort.pfzDistanceKm} km offshore</strong> (Bearing 245° SW). Favorable chlorophyll concentration for pelagic species.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
