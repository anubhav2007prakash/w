"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Compass, AlertTriangle, Wind, ShieldAlert, Radio, Activity } from "lucide-react";

export default function CyclonePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Cyclone Tracker & Warning" subtitle="Regional Specialised Meteorological Centre" />

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Compass className="w-5 h-5 text-[#00DDE5] animate-spin-slow" />
              <h3 className="font-extrabold text-sm">North Indian Ocean Basin Bulletin</h3>
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-green-500 text-black">
              NO ACTIVE CYCLONE
            </span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            No cyclonic storm over Bay of Bengal or Arabian Sea as of current synoptic charts. Seasonal low pressure trough active along monsoon axis.
          </p>
        </div>

        {/* Cyclone Warning Signals Reference */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FFBE00]" />
            <span>IMD 4-Stage Cyclone Early Warning Protocol</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
              <strong className="text-yellow-400 block">Stage 1: Cyclone Watch (72 hrs ahead)</strong>
              <span className="text-white/70">Early warning on cyclonic disturbance development and projected track.</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
              <strong className="text-orange-400 block">Stage 2: Cyclone Alert (48 hrs ahead)</strong>
              <span className="text-white/70">Specific coastal district warnings on expected adverse weather.</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
              <strong className="text-red-400 block">Stage 3: Cyclone Warning (24 hrs ahead)</strong>
              <span className="text-white/70">Precise landfall location, peak wind speed, and storm surge height.</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
              <strong className="text-purple-400 block">Stage 4: Post-Landfall Outlook (12 hrs ahead)</strong>
              <span className="text-white/70">Inland gale and heavy downpour warnings after eye crosses coast.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
