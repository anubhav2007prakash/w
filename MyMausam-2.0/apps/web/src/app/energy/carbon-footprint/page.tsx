"use client";

import React from "react";
import { CarbonFootprintEstimator } from "@/components/CarbonFootprintEstimator";
import { Header } from "@/components/Header";

export default function CarbonFootprintPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Daily Carbon Footprint" subtitle="Track & reduce your daily CO₂ emissions" />
      <div className="px-4 py-3 space-y-4">
        <CarbonFootprintEstimator />
      </div>
    </div>
  );
}
