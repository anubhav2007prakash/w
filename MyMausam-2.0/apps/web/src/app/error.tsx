"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] flex flex-col items-center justify-center px-6 text-center">
      {/* Atmospheric glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#FFBE00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm">
        {/* Storm icon */}
        <div className="text-7xl" aria-hidden="true">
          ⛈️
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-white/90 font-[var(--font-outfit)]">
          Weather Disruption
        </h1>

        {/* Message */}
        <p className="text-base text-white/70 leading-relaxed">
          Something went wrong while loading the forecast.
          <br />
          Our meteorologists are on it.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="text-xs text-white/30 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        {/* Retry button */}
        <button
          onClick={() => reset()}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#FFBE00] px-6 py-3 text-sm font-semibold text-[#021a32] shadow-lg shadow-[#FFBE00]/25 transition-all hover:scale-105 hover:shadow-[#FFBE00]/40 active:scale-95"
        >
          🔄 Try Again
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-[11px] text-white/40 select-none">
        IMD Mausam 2.0 • Ministry of Earth Sciences
      </footer>
    </main>
  );
}
