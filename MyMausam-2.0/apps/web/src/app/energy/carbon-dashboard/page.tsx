"use client";

import React from "react";
import { CarbonDashboard } from "@/components/CarbonDashboard";
import { Header } from "@/components/Header";

export default function CarbonDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Carbon Dashboard & Leaderboard" subtitle="Sustainability scores & community rankings" />
      <div className="px-4 py-3 space-y-4">
        <CarbonDashboard />
      </div>
    </div>
  );
}
