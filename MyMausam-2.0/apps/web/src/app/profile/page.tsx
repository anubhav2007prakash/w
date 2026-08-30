"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useWeather } from "@/context/WeatherContext";
import { PersonaType } from "@/types/weather";
import { UserAvatar } from "@/components/UserAvatar";
import { AvatarPickerModal } from "@/components/AvatarPickerModal";
import { AVATAR_PRESETS } from "@/lib/avatars";
import {
  ShieldCheck,
  MapPin,
  Phone,
  Award,
  LogOut,
  LogIn,
  Sprout,
  HeartPulse,
  Navigation,
  Compass,
  Sun,
  Users,
  CheckCircle2,
  Camera,
  Smile,
  Stethoscope,
  FlaskConical,
  Plane,
  Baby,
  Activity,
  CloudRain,
  Bot,
  Star,
  MessageSquare,
} from "lucide-react";

const PROFESSIONS = [
  { id: "farmer", label: "Farmer\nKisan", icon: "🌾", color: "#FFBE00", personas: ["farmer"] },
  { id: "doctor", label: "Doctor\nHealth", icon: "🩺", color: "#00DDE5", personas: ["health"] },
  { id: "scientist", label: "Scientist\nResearcher", icon: "🔬", color: "#00DDE5", personas: ["health"] },
  { id: "pilot", label: "Aircraft\nPilot", icon: "✈️", color: "#00DDE5", personas: ["commuter"] },
  { id: "parent", label: "Parent\nFamily", icon: "👨‍👩‍👧", color: "#00DDE5", personas: ["parent"] },
  { id: "marathoner", label: "Marathoner\nOutdoor", icon: "🏃", color: "#00DDE5", personas: ["runner"] },
  { id: "cyclone", label: "Cyclone\nHunter", icon: "🌀", color: "#00DDE5", personas: ["beach"] },
  { id: "mausam", label: "Mausam\nMitra", icon: "🌤️", color: "#00DDE5", personas: ["health"] },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile, openAuthModal, loginWithDemo } = useAuth();
  const { activePersona, setActivePersona, activeLocation, setLocation } = useWeather();

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarModalTab, setAvatarModalTab] = useState<"presets" | "camera" | "upload">("presets");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleQuickAvatarChange = async (avatarId: string) => {
    if (isAuthenticated) {
      await updateProfile({ avatarId, avatarUrl: undefined });
      showToast("Updated avatar!");
    } else {
      openAuthModal("signin");
    }
  };

  const handleProfessionSelect = async (professionId: string) => {
    const profession = PROFESSIONS.find((p) => p.id === professionId);
    if (profession && profession.personas[0]) {
      setActivePersona(profession.personas[0] as PersonaType);
      if (isAuthenticated) {
        await updateProfile({ persona: profession.personas[0] as PersonaType });
      }
      showToast(`Switched to ${profession.label.replace("\n", " ")} persona`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 select-none">
      <Header showBack={true} title="Citizen Profile" subtitle="Account & Preferences" />

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        initialTab={avatarModalTab}
      />

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#06345C] text-white px-4 py-2 rounded-xl text-xs shadow-xl flex items-center gap-2 border border-white/20 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#8ED329]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="p-4 max-w-[440px] mx-auto space-y-4">
        {/* User Profile Card */}
        {isAuthenticated && user ? (
          <div className="rounded-3xl p-5 border border-white/15 shadow-2xl bg-white/8 backdrop-blur-xl text-center space-y-4">
            {/* Title */}
            <h2 className="text-xl font-black text-white">Citizen Profile</h2>

            {/* Large Avatar with U9 Badge */}
            <div className="relative inline-block">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#00DDE5] to-[#0055A6] flex items-center justify-center shadow-2xl shadow-[#00DDE5]/30 border-4 border-[#00DDE5]/30">
                <span className="text-4xl font-black text-white">
                  {user.name?.charAt(0) || "U"}{user.name?.split(" ")[1]?.charAt(0) || "9"}
                </span>
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#00DDE5]/40 animate-pulse" />
            </div>

            {/* User Name */}
            <div>
              <h3 className="text-lg font-black text-white">{user.name || "User 9538"}</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8ED329]/20 text-[#8ED329] text-[10px] font-bold mt-1">
                <CheckCircle2 className="w-3 h-3" />
                MOBILE VERIFIED
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAvatarModalTab("camera");
                  setShowAvatarModal(true);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white/15 transition"
              >
                📷 Click Photo
              </button>
              <button
                onClick={() => {
                  setAvatarModalTab("presets");
                  setShowAvatarModal(true);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white/15 transition"
              >
                👤 Choose Avatar
              </button>
            </div>
          </div>
        ) : (
          /* Guest State */
          <div className="rounded-3xl p-6 border border-white/15 shadow-2xl bg-white/8 backdrop-blur-xl text-center space-y-4">
            <h2 className="text-xl font-black text-white">Citizen Profile</h2>
            <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto">
              <UserAvatar size="xl" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Guest Citizen Mode</h2>
              <p className="text-xs text-white/60 mt-1">
                Sign in to customize weather personas and receive alerts.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => router.push("/login")}
                className="flex-1 py-2.5 rounded-2xl bg-[#FFBE00] text-[#06345C] font-bold text-xs shadow-md transition hover:bg-[#e6ac00] flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition"
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* Quick Avatar Selector */}
        {isAuthenticated && (
          <div className="rounded-3xl p-4 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-2">
              Quick Avatar Selector
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {AVATAR_PRESETS.slice(0, 6).map((preset) => {
                const isSelected = user?.avatarId === preset.id && !user?.avatarUrl;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleQuickAvatarChange(preset.id)}
                    className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-tr ${preset.bgGradient} flex items-center justify-center text-xl shadow-sm transition border ${
                      isSelected
                        ? "border-[#00DDE5] ring-2 ring-[#00DDE5] scale-110"
                        : "border-white/15 hover:scale-105"
                    }`}
                    title={preset.name}
                  >
                    <span>{preset.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Card */}
        {isAuthenticated && user && (
          <div className="rounded-3xl p-4 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl space-y-2.5">
            <h3 className="text-sm font-black text-white">Info</h3>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#FFBE00]" />
                <span className="text-white/80">Default Station {user.defaultLocation || activeLocation}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-3.5 h-3.5 text-[#00DDE5]" />
                  <span className="text-white/80">Mobile Number •••• {user.phone.slice(-4)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8ED329]" />
                <span className="text-white/80">IMD Status</span>
                <CheckCircle2 className="w-3 h-3 text-[#8ED329]" />
                <span className="text-[#8ED329] font-bold">Active Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* Your Profession Grid - matching Figma */}
        <div className="rounded-3xl p-4 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl">
          <h3 className="text-sm font-black text-white mb-3">Your Profession</h3>
          <div className="grid grid-cols-4 gap-2">
            {PROFESSIONS.map((prof) => {
              const isSelected = activePersona === prof.personas[0];
              return (
                <button
                  key={prof.id}
                  onClick={() => router.push(`/profile/profession/${prof.id}`)}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? "bg-[#FFBE00]/15 border-[#FFBE00] shadow-lg shadow-[#FFBE00]/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-2xl block mb-1">{prof.icon}</span>
                  <span className={`text-[10px] font-bold block leading-tight whitespace-pre-line ${
                    isSelected ? "text-[#FFBE00]" : "text-white/80"
                  }`}>
                    {prof.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FFBE00] mx-auto mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Demo Switcher */}
        <div className="rounded-3xl p-4 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl space-y-3">
          <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Switch Demo Profiles
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={async () => {
                await loginWithDemo("farmer");
                setActivePersona("farmer");
                showToast("Logged in as Ramesh Patel (Farmer)");
              }}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center gap-2"
            >
              <UserAvatar avatarId="farmer_sun" size="sm" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">Ramesh Patel</span>
                <span className="text-[9px] text-white/50 block">Farmer • Meerut</span>
              </div>
            </button>

            <button
              onClick={async () => {
                await loginWithDemo("citizen");
                setActivePersona("health");
                showToast("Logged in as Anubhav Prakash (Citizen)");
              }}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center gap-2"
            >
              <UserAvatar avatarId="health_guard" size="sm" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">Anubhav</span>
                <span className="text-[9px] text-white/50 block">Citizen • Ghaziabad</span>
              </div>
            </button>
          </div>
        </div>

        {/* Feedback & Ratings */}
        <button
          onClick={() => router.push("/feedback")}
          className="w-full py-3 rounded-2xl bg-[#FFBE00]/15 hover:bg-[#FFBE00]/25 border border-[#FFBE00]/20 text-[#FFBE00] font-bold text-xs transition flex items-center justify-center gap-2"
        >
          <Star className="w-4 h-4" />
          Rate & Feedback
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Logout Button */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-300 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
