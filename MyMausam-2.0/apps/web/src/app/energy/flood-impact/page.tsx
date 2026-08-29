"use client";

import React from "react";
import { FloodImpactSimulator } from "@/components/FloodImpactSimulator";
import { Header } from "@/components/Header";

export default function FloodImpactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Flood Impact on Energy Grid" subtitle="Weather-based grid risk assessment" />
      <div className="px-4 py-3 space-y-4">
        <FloodImpactSimulator />
      </div>
    </div>
  );
}
