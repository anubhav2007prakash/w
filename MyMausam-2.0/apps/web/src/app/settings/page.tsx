"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { FeedbackRatingModal } from "@/components/FeedbackRatingModal";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import { Globe, Languages, Star } from "lucide-react";

export default function SettingsPage() {
  const { tempUnit, toggleTempUnit } = useWeather();
  const { locale } = useLanguage();
  const [pushAlerts, setPushAlerts] = useState(true);
  const [showLangSwitcher, setShowLangSwitcher] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l: { code: string }) => l.code === locale);

  return (
    <>
      <LanguageSwitcher isOpen={showLangSwitcher} onClose={() => setShowLangSwitcher(false)} />
      <FeedbackRatingModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmitted={() => {
          setToastMessage("Thank you for your feedback!");
          setTimeout(() => setToastMessage(null), 2500);
        }}
      />

      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#06345C] text-white px-4 py-2 rounded-xl text-sm shadow-xl border border-white/20">
          {toastMessage}
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
        <Header showBack={true} title="App Settings & Preferences" subtitle="Custom Units & Notifications" />

        <div className="p-4 space-y-4">
          {/* Unit Settings */}
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
            <h3 className="font-extrabold text-sm text-white">Measurement Units</h3>

            <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs">
              <span className="text-white/80">Temperature Unit</span>
              <button
                onClick={toggleTempUnit}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold transition border border-white/20"
              >
                {tempUnit === "C" ? "Celsius (°C)" : "Fahrenheit (°F)"}
              </button>
            </div>

            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-white/80">Wind Speed Unit</span>
              <span className="font-bold text-[#00DDE5]">Kilometers / hour (km/h)</span>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
            <h3 className="font-extrabold text-sm text-white">Alert Notifications</h3>

            <div className="flex items-center justify-between py-2 text-xs">
              <div>
                <span className="font-bold text-white block">Severe Weather Push Alerts</span>
                <span className="text-[10px] text-white/60">Thunderstorm, Heat Wave & Cyclone Alerts</span>
              </div>
              <button
                onClick={() => setPushAlerts(!pushAlerts)}
                className={`w-12 h-6 rounded-full transition p-0.5 ${pushAlerts ? "bg-[#8ED329]" : "bg-white/20"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    pushAlerts ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00DDE5]" />
              Language / भाषा
            </h3>

            <button
              onClick={() => setShowLangSwitcher(true)}
              className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 transition rounded-2xl px-4 py-3 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-[#00DDE5]" />
                <div className="text-left">
                  <span className="text-white font-bold text-[14px] block">
                    {currentLang?.nativeName ?? "English"}
                  </span>
                  <span className="text-white/60 text-[11px]">
                    {currentLang?.name ?? "English"} — tap to change
                  </span>
                </div>
              </div>
              <span className="text-white/40 text-lg">›</span>
            </button>

            {/* Quick language chips for most popular */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {SUPPORTED_LANGUAGES.slice(0, 6).map((lang: { code: string; nativeName: string }) => (
                <button
                  key={lang.code}
                  onClick={() => setShowLangSwitcher(true)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold truncate transition border ${
                    locale === lang.code
                      ? "bg-white text-[#0055A6] border-white shadow"
                      : "bg-white/10 text-white/70 border-white/10 hover:bg-white/20"
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/40 text-center">
              +{SUPPORTED_LANGUAGES.length - 6} more languages available
            </p>
          </div>

          {/* Feedback & ratings */}
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-[#FFBE00]" />
              Rate & Feedback
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Tell IMD Mausam what is working and what to improve. Your stars and comments stay on this device.
            </p>
            <button
              onClick={() => setShowFeedback(true)}
              className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 transition rounded-2xl px-4 py-3 border border-white/20"
            >
              <span className="text-white font-bold text-[14px]">Rate this app</span>
              <span className="text-[#FFBE00] text-sm font-semibold">1–5 stars ›</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
