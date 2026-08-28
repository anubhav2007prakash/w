"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "What is the difference between a Heat Wave and a Severe Heat Wave?",
    a: "IMD defines a Heat Wave when maximum temperature departs from normal by +4.5°C to +6.4°C. A Severe Heat Wave occurs when departure exceeds +6.5°C or actual maximum reaches ≥ 45°C in plains.",
  },
  {
    q: "How does the Flash-to-Bang lightning distance formula work?",
    a: "Light travels instantly, while sound travels at approx. 343 meters per second (~1 km per 3 seconds). Dividing the counted seconds between lightning flash and thunderclap by 3 gives the strike distance in kilometers.",
  },
  {
    q: "How are Doppler Weather Radar (DWR) dBZ values interpreted?",
    a: "Reflectivity (dBZ) measures backscattered energy from precipitation particles: 15–30 dBZ = Light rain; 35–45 dBZ = Moderate/Heavy rain; > 50 dBZ = Severe thunderstorm with possible hail.",
  },
  {
    q: "What is Wet-Bulb Globe Temperature (WBGT)?",
    a: "WBGT measures heat stress in direct sunlight by combining temperature, humidity, wind velocity, and solar radiation. It is used internationally by military, sports, and occupational safety agencies to prevent heatstroke.",
  },
  {
    q: "How often are IMD Agromet GKMS bulletins updated?",
    a: "District Agromet bulletins are issued twice weekly (every Tuesday and Friday) by State Agricultural Universities and IMD Regional Agromet Units.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Meteorological FAQ" subtitle="Science Behind IMD Weather Forecasts" />

      <div className="p-4 space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-card rounded-3xl p-4 border border-white/15 shadow-md space-y-2"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-2"
              >
                <h3 className="font-extrabold text-white text-xs leading-snug">{faq.q}</h3>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#00DDE5] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white/50 shrink-0" />
                )}
              </button>

              {isOpen && (
                <p className="text-xs text-white/80 leading-relaxed pt-2 border-t border-white/10 animate-fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
