"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] flex flex-col items-center justify-center px-6 text-center">
      {/* Atmospheric glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#00DDE5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm">
        {/* Cloud icon */}
        <div className="text-7xl" aria-hidden="true">
          ⛅
        </div>

        {/* Error code */}
        <h1 className="text-6xl font-bold tracking-tight text-white/90 font-[var(--font-outfit)]">
          404
        </h1>

        {/* Message */}
        <p className="text-lg text-white/70 leading-relaxed">
          This page wandered off into the clouds.
          <br />
          Let&apos;s get you back to the forecast.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#00DDE5] px-6 py-3 text-sm font-semibold text-[#021a32] shadow-lg shadow-[#00DDE5]/25 transition-all hover:scale-105 hover:shadow-[#00DDE5]/40 active:scale-95"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-[11px] text-white/40 select-none">
        IMD Mausam 2.0 • Ministry of Earth Sciences
      </footer>
    </main>
  );
}
