"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Radar,
  CalendarDays,
  Bell,
  Bot,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const navItems = [
    { label: t("nav.home"), href: "/", icon: Home },
    { label: t("nav.radar"), href: "/radar", icon: Radar },
    { label: t("nav.ai_copilot"), href: "/chat", icon: Bot, isCenter: true },
    { label: t("nav.forecast"), href: "/forecast", icon: CalendarDays },
    { label: t("nav.alerts"), href: "/notifications", icon: Bell },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[420px] select-none">
      <div className="bg-[#052440] rounded-full px-3 py-1.5 flex items-center justify-around shadow-[0_12px_36px_rgba(0,0,0,0.8)] border border-white/20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isCenter) {
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="relative -top-3 flex flex-col items-center justify-center transition-all duration-200 active:scale-95 group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                    isActive
                      ? "bg-[#00DDE5] text-[#06345C] ring-4 ring-[#00DDE5]/30 scale-105"
                      : "bg-gradient-to-tr from-[#0055A6] to-[#00DDE5] text-white hover:brightness-110"
                  }`}
                >
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-bold text-white mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-[#00DDE5] font-bold scale-110"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 stroke-[2] ${isActive ? "drop-shadow-md" : ""}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
