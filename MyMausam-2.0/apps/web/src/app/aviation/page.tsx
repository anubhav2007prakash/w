"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Plane, Wind, Eye, Gauge, FileText } from "lucide-react";

interface AirportMETAR {
  icao: string;
  name: string;
  city: string;
  temp: number;
  dewPoint: number;
  visibilityM: number;
  windSpeedKt: number;
  windDirDeg: number;
  flightRules: "VFR" | "MVFR" | "IFR";
  qnh: number;
  metarRaw: string;
}

const AIRPORTS: AirportMETAR[] = [
  {
    icao: "VIDP",
    name: "Indira Gandhi International Airport",
    city: "New Delhi",
    temp: 34.0,
    dewPoint: 19.0,
    visibilityM: 6000,
    windSpeedKt: 6,
    windDirDeg: 310,
    flightRules: "VFR",
    qnh: 1004,
    metarRaw: "VIDP 271500Z 31006KT 6000 SCT030 34/19 Q1004 NOSIG",
  },
  {
    icao: "VABB",
    name: "Chhatrapati Shivaji Maharaj Intl",
    city: "Mumbai",
    temp: 31.0,
    dewPoint: 24.0,
    visibilityM: 5000,
    windSpeedKt: 9,
    windDirDeg: 250,
    flightRules: "VFR",
    qnh: 1006,
    metarRaw: "VABB 271500Z 25009KT 5000 FEW025 31/24 Q1006 NOSIG",
  },
  {
    icao: "VOBL",
    name: "Kempegowda International Airport",
    city: "Bengaluru",
    temp: 26.0,
    dewPoint: 18.0,
    visibilityM: 8000,
    windSpeedKt: 11,
    windDirDeg: 270,
    flightRules: "VFR",
    qnh: 1012,
    metarRaw: "VOBL 271500Z 27011KT 8000 SCT030 26/18 Q1012 NOSIG",
  },
];

export default function AviationPage() {
  const [selectedIcao, setSelectedIcao] = useState<string>("VIDP");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Aviation Weather Briefing" subtitle="METAR & TAF Flight Conditions" />

      <div className="p-4 space-y-4">
        {/* Airport Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {AIRPORTS.map((apt) => (
            <button
              key={apt.icao}
              onClick={() => setSelectedIcao(apt.icao)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedIcao === apt.icao
                  ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {apt.icao} ({apt.city})
            </button>
          ))}
        </div>

        {/* Selected Airport Card */}
        {AIRPORTS.filter((a) => a.icao === selectedIcao).map((apt) => (
          <div key={apt.icao} className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-2xl font-black text-white block leading-none">{apt.icao}</span>
                <span className="text-xs font-bold text-white/80 block mt-1">{apt.name}</span>
                <span className="text-[10px] text-white/60 block">{apt.city} FIR</span>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-green-500 text-black shadow-md">
                {apt.flightRules} (Clear)
              </span>
            </div>

            {/* Flight Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <Wind className="w-4 h-4 mx-auto text-[#00DDE5] mb-1" />
                <span className="text-[9px] text-white/60 block">Wind</span>
                <strong className="text-white text-xs">{apt.windSpeedKt} KT @ {apt.windDirDeg}°</strong>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <Eye className="w-4 h-4 mx-auto text-blue-200 mb-1" />
                <span className="text-[9px] text-white/60 block">Visibility</span>
                <strong className="text-white text-xs">{apt.visibilityM} M</strong>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <Gauge className="w-4 h-4 mx-auto text-[#8ED329] mb-1" />
                <span className="text-[9px] text-white/60 block">QNH Alt</span>
                <strong className="text-white text-xs">{apt.qnh} hPa</strong>
              </div>
            </div>

            {/* Raw METAR */}
            <div className="bg-black/30 p-3 rounded-2xl border border-white/10 space-y-1 font-mono text-xs">
              <span className="text-[9px] text-white/50 uppercase font-sans font-bold block">
                Raw Decoded METAR Feed:
              </span>
              <p className="text-[#00DDE5] leading-relaxed break-all">{apt.metarRaw}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
