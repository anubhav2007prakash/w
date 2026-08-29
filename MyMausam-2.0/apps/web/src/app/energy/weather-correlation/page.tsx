"use client";

import React from "react";
import { WeatherEnergyCorrelation } from "@/components/WeatherEnergyCorrelation";
import { Header } from "@/components/Header";

export default function WeatherEnergyCorrelationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Weather × Energy Correlation" subtitle="How weather patterns drive energy demand" />
      <div className="px-4 py-3 space-y-4">
        <WeatherEnergyCorrelation />
      </div>
    </div>
  );
}
