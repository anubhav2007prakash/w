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
  Mail,
  Phone,
  Calendar,
  Award,
  Sparkles,
  LogOut,
  LogIn,
  Sprout,
  HeartPulse,
  Navigation,
  Compass,
  Sun,
  Users,
  CheckCircle2,
  Bell,
  Radio,
  Edit2,
  Check,
  Camera,
  Smile,
  Upload,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile, openAuthModal, loginWithDemo } = useAuth();
  const { activePersona, setActivePersona, activeLocation, setLocation } = useWeather();

  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState(user?.defaultLocation || activeLocation || "Ghaziabad");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarModalTab, setAvatarModalTab] = useState<"presets" | "camera" | "upload">("presets");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const personas: { id: PersonaType; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: "farmer",
      title: "Farmer / Kisan",
      desc: "Agromet, soil moisture & crop rain calendar",
      icon: <Sprout className="w-4 h-4 text-green-400" />,
    },
    {
      id: "health",
      title: "Health & Allergy",
      desc: "SAFAR air quality, heat stress & UV protection",
      icon: <HeartPulse className="w-4 h-4 text-pink-400" />,
    },
    {
      id: "commuter",
      title: "Daily Commuter",
      desc: "Live rain nowcast & highway route fog warnings",
      icon: <Navigation className="w-4 h-4 text-blue-400" />,
    },
    {
      id: "runner",
      title: "Runner & Outdoor",
      desc: "Thermal index, wind resistance & golden hour",
      icon: <Compass className="w-4 h-4 text-yellow-400" />,
    },
    {
      id: "beach",
      title: "Marine & Coastal",
      desc: "INCOIS wave heights & sea surface temperature",
      icon: <Sun className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: "parent",
      title: "Family & Parent",
      desc: "School morning forecast & safe outdoor periods",
      icon: <Users className="w-4 h-4 text-purple-400" />,
    },
  ];

  const handlePersonaChange = async (personaId: PersonaType) => {
    setActivePersona(personaId);
    if (isAuthenticated) {
      await updateProfile({ persona: personaId });
    }
    showToast(`Switched persona to ${personaId.toUpperCase()}`);
  };

  const handleQuickAvatarChange = async (avatarId: string) => {
    if (isAuthenticated) {
      await updateProfile({ avatarId, avatarUrl: undefined });
      showToast("Updated avatar!");
    } else {
      openAuthModal("signin");
    }
  };

  const handleSaveLocation = async () => {
    if (newLocation.trim()) {
      setLocation(newLocation.trim());
      if (isAuthenticated) {
        await updateProfile({ defaultLocation: newLocation.trim() });
      }
      setIsEditingLocation(false);
      showToast(`Updated default location to ${newLocation.trim()}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Citizen Profile" subtitle="Account & Avatar Preferences" />

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
        {/* User Card */}
        {isAuthenticated && user ? (
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
            <div className="flex items-center gap-4">
              <div
                onClick={() => {
                  setAvatarModalTab("camera");
                  setShowAvatarModal(true);
                }}
                className="cursor-pointer group relative"
                title="Tap to snap photo with camera or choose avatar"
              >
                <UserAvatar
                  user={user}
                  size="2xl"
                  showEditBadge={true}
                  className="group-hover:scale-105 transition"
                  ringColor="ring-[#00DDE5]"
                />
              </div>

              <div className="flex-1 truncate">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-black text-white truncate">{user.name}</h2>
                  <ShieldCheck className="w-4 h-4 text-[#00DDE5] shrink-0" />
                </div>
                <p className="text-[11px] text-white/70 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#8ED329]/20 text-[#8ED329] border border-[#8ED329]/30 text-[9px] font-extrabold uppercase">
                    {user.badge || user.role}
                  </span>
                  <span className="text-[10px] text-white/50">{user.memberSince}</span>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setAvatarModalTab("camera");
                      setShowAvatarModal(true);
                    }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-[#00DDE5] transition flex items-center gap-1 border border-white/15"
                  >
                    <Camera className="w-3 h-3 text-[#00DDE5]" /> Click Photo
                  </button>
                  <button
                    onClick={() => {
                      setAvatarModalTab("presets");
                      setShowAvatarModal(true);
                    }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition flex items-center gap-1 border border-white/10"
                  >
                    <Smile className="w-3 h-3 text-[#FFBE00]" /> Avatars
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Avatar Presets Carousel */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-white/70 uppercase tracking-wider flex items-center gap-1">
                  <Smile className="w-3 h-3 text-[#FFBE00]" />
                  Quick Avatar Selector
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAvatarModalTab("camera");
                      setShowAvatarModal(true);
                    }}
                    className="text-[10px] text-[#00DDE5] font-bold hover:underline flex items-center gap-0.5"
                  >
                    <Camera className="w-2.5 h-2.5" /> Camera
                  </button>
                  <button
                    onClick={() => {
                      setAvatarModalTab("upload");
                      setShowAvatarModal(true);
                    }}
                    className="text-[10px] text-white/70 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <Upload className="w-2.5 h-2.5" /> Upload
                  </button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {AVATAR_PRESETS.slice(0, 8).map((preset) => {
                  const isSelected = user.avatarId === preset.id && !user.avatarUrl;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleQuickAvatarChange(preset.id)}
                      className={`shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-tr ${preset.bgGradient} flex items-center justify-center text-lg shadow-sm transition border ${
                        isSelected
                          ? "border-[#00DDE5] ring-2 ring-[#00DDE5] scale-110"
                          : "border-white/20 hover:scale-105"
                      }`}
                      title={preset.name}
                    >
                      <span>{preset.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Info Rows */}
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-white/60 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFBE00]" />
                  Default Station:
                </span>
                {isEditingLocation ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="bg-white/10 border border-white/30 rounded-lg px-2 py-0.5 text-xs text-white w-28 focus:outline-none"
                    />
                    <button
                      onClick={handleSaveLocation}
                      className="p-1 rounded-lg bg-[#00DDE5] text-[#06345C]"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingLocation(true)}
                    className="font-bold text-white flex items-center gap-1 hover:text-[#00DDE5]"
                  >
                    <span>{user.defaultLocation || activeLocation}</span>
                    <Edit2 className="w-3 h-3 text-white/40" />
                  </button>
                )}
              </div>

              {user.phone && (
                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <span className="text-white/60 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#00DDE5]" />
                    Mobile Number:
                  </span>
                  <span className="font-mono text-white font-semibold">{user.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-1">
                <span className="text-white/60 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#8ED329]" />
                  IMD Citizen Status:
                </span>
                <span className="text-[#8ED329] font-bold">Active & Verified</span>
              </div>
            </div>
          </div>
        ) : (
          /* Guest State Card */
          <div className="glass-card rounded-3xl p-6 border border-white/20 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white/80">
              <UserAvatar size="xl" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Guest Citizen Mode</h2>
              <p className="text-xs text-white/70 mt-1">
                Sign in to customize weather personas, choose your custom avatar, and receive severe weather alerts.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => router.push("/login")}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#0055A6] to-[#00DDE5] text-white font-bold text-xs shadow-md transition hover:brightness-110 flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="flex-1 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition"
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* Persona Switcher Section */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFBE00]" />
              Active Weather Persona
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00DDE5]/20 text-[#00DDE5] font-bold uppercase">
              {activePersona}
            </span>
          </div>
          <p className="text-[11px] text-white/60">
            Tailor weather metrics, indices and advice to your primary activity.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {personas.map((p) => {
              const isSelected = activePersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePersonaChange(p.id)}
                  className={`p-2.5 rounded-2xl border text-left transition flex items-start gap-2 ${
                    isSelected
                      ? "bg-white/20 border-[#00DDE5] shadow-md ring-1 ring-[#00DDE5]"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">{p.icon}</span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-white block truncate">{p.title}</span>
                    <span className="text-[9px] text-white/60 block truncate">{p.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Demo Switcher */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
          <h3 className="font-extrabold text-xs text-white/80 uppercase tracking-wider">
            Switch Demo Persona Profiles
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={async () => {
                await loginWithDemo("farmer");
                setActivePersona("farmer");
                showToast("Logged in as Ramesh Patel (Farmer)");
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2"
            >
              <UserAvatar avatarId="farmer_sun" size="sm" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">Ramesh Patel</span>
                <span className="text-[9px] text-white/60 block">Farmer • Meerut</span>
              </div>
            </button>

            <button
              onClick={async () => {
                await loginWithDemo("citizen");
                setActivePersona("health");
                showToast("Logged in as Anubhav Prakash (Citizen)");
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2"
            >
              <UserAvatar avatarId="health_guard" size="sm" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">Anubhav</span>
                <span className="text-[9px] text-white/60 block">Citizen • Ghaziabad</span>
              </div>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 font-bold text-xs transition flex items-center justify-center gap-2 shadow"
          >
            <LogOut className="w-4 h-4" />
            Sign Out from Mausam 2.0
          </button>
        )}
      </div>
    </div>
  );
}
