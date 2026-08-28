"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, ChevronRight } from "lucide-react";
import { WeatherAlert } from "@/types/weather";
import { useRouter } from "next/navigation";

interface WeatherAlertCardProps {
  alert: WeatherAlert;
}

export const WeatherAlertCard: React.FC<WeatherAlertCardProps> = ({ alert }) => {
  const router = useRouter();

  return (
    <section className="px-4 py-2 select-none">
      <div
        onClick={() => router.push("/notifications")}
        className="rounded-3xl p-4.5 border border-red-500/30 bg-red-500/10 shadow-xl space-y-3 cursor-pointer hover:border-red-500/50 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <h3 className="font-extrabold text-sm text-white">{alert.alert_type}</h3>
          </div>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-red-500 text-white shadow-md">
            {alert.severity}
          </span>
        </div>

        <p className="text-xs text-white/85 leading-relaxed">{alert.description}</p>

        <div className="flex items-center justify-between text-[10px] text-white/60 pt-1 border-t border-white/10">
          <span>Valid until: {alert.valid_upto}</span>
          <span className="text-[#00DDE5] font-bold flex items-center gap-0.5">
            <span>Safety Checklist</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </section>
  );
};
