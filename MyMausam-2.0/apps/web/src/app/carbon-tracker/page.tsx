"use client";

import React from "react";
import { CarbonFootprintEstimator } from "@/components/CarbonFootprintEstimator";
import { CarbonDashboard } from "@/components/CarbonDashboard";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CarbonTrackerPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24">
      <div className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3 bg-[#0055A6]/80 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => router.back()} className="p-1.5 rounded-xl bg-white/10">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div>
          <h1 className="text-sm font-black text-white">Carbon Tracker</h1>
          <p className="text-[9px] text-white/50">Track, reduce & offset your carbon footprint</p>
        </div>
      </div>
      <div className="px-4 py-3 space-y-4">
        <CarbonFootprintEstimator />
        <CarbonDashboard />
      </div>
    </main>
  );
}
