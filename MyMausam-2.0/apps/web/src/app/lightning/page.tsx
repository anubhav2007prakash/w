"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Zap, ShieldAlert, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LightningPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Damini Lightning Network" subtitle="Real-Time Total Lightning Strike Detection" />

      <div className="p-4 space-y-4">
        {/* Quick link to interactive alarm calculator */}
        <button
          onClick={() => router.push("/lightning-alarm")}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#FFBE00] to-[#FF7400] text-black font-extrabold text-xs shadow-xl flex items-center justify-between active:scale-[0.98] transition"
        >
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 fill-black" />
            <div className="text-left">
              <span className="text-sm font-black block leading-none">Flash-to-Bang Distance Calculator</span>
              <span className="text-[10px] opacity-80 block mt-0.5">Calculate thunderstorm strike distance in seconds</span>
            </div>
          </div>
          <span className="bg-black/20 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase">Open</span>
        </button>

        {/* Real-Time Risk Level Card */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FFBE00]" />
              <span>Sensor Network Status (IITM Pune)</span>
            </h3>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-green-500 text-black">
              LOW RISK (NIL STRIKES)
            </span>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            No cloud-to-ground or intra-cloud lightning strikes recorded within 30 km radius in the past 60 minutes.
          </p>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/60 block">Last 1h Strikes</span>
              <strong className="text-white text-sm block">0</strong>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/60 block">Peak Current</span>
              <strong className="text-white text-sm block">-- kA</strong>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/60 block">30-30 Timer</span>
              <strong className="text-[#8ED329] text-sm block">Safe</strong>
            </div>
          </div>
        </div>

        {/* 30-30 Rule Guidelines */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#00DDE5]" />
            <span>IMD & NDMA 30-30 Lightning Safety Rule</span>
          </h3>

          <div className="space-y-2 text-xs text-white/85">
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Rule 1 (30 Seconds):</strong> If the time between lightning flash and thunder sound is less than 30 seconds, the storm is within 10 km. Seek immediate indoor shelter.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Rule 2 (30 Minutes):</strong> Remain inside sheltered premises for at least 30 minutes after hearing the last thunderclap before resuming outdoor work.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Never:</strong> Take shelter under isolated tall trees, metal poles, or water bodies during lightning activity.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
