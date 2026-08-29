"use client";

import { PersonalizationSettings } from "@/components/PersonalizationSettings";

export default function PersonalizationPage() {
  return (
    <div className="min-h-screen">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-bold text-white">Personalization Settings</h1>
        <p className="text-xs text-white/50">Customize your weather experience</p>
      </div>
      <PersonalizationSettings />
    </div>
  );
}
