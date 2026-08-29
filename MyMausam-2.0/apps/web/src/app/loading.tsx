"use client";

import React from "react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4">
        {/* Animated weather spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00DDE5] animate-spin" />
        </div>

        <p className="text-sm text-white/60 animate-pulse">
          Fetching meteorological data…
        </p>
      </div>
    </main>
  );
}
