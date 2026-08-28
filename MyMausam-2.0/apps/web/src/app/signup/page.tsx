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
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Sprout,
  HeartPulse,
  Navigation,
  Compass,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users,
  Camera,
  Smile,
} from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { setActivePersona, setLocation } = useWeather();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("Ghaziabad");
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>("health");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("health_guard");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | undefined>(undefined);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const personas: { id: PersonaType; title: string; desc: string; icon: React.ReactNode; defaultAvatar: string }[] = [
    {
      id: "farmer",
      title: "Farmer / Kisan",
      desc: "Rainfall probabilities, soil moisture, crop advisories",
      icon: <Sprout className="w-5 h-5 text-green-400" />,
      defaultAvatar: "farmer_sun",
    },
    {
      id: "health",
      title: "Health & Allergy",
      desc: "SAFAR AQI, dust warnings, UV index & pollen metrics",
      icon: <HeartPulse className="w-5 h-5 text-pink-400" />,
      defaultAvatar: "health_guard",
    },
    {
      id: "commuter",
      title: "Daily Commuter",
      desc: "Live rain nowcasts, highway fog & road weather",
      icon: <Navigation className="w-5 h-5 text-blue-400" />,
      defaultAvatar: "commuter_metro",
    },
    {
      id: "runner",
      title: "Runner & Outdoor",
      desc: "Thermal comfort index, wind resistance, golden hour",
      icon: <Compass className="w-5 h-5 text-yellow-400" />,
      defaultAvatar: "runner_athlete",
    },
    {
      id: "beach",
      title: "Marine & Coastal",
      desc: "INCOIS wave heights, ocean tides & sea surface temp",
      icon: <Sun className="w-5 h-5 text-cyan-400" />,
      defaultAvatar: "ocean_sailor",
    },
    {
      id: "parent",
      title: "Family & Parent",
      desc: "School morning weather, rain alerts & safe outdoor times",
      icon: <Users className="w-5 h-5 text-purple-400" />,
      defaultAvatar: "family_forecaster",
    },
  ];

  const handlePersonaSelect = (p: typeof personas[0]) => {
    setSelectedPersona(p.id);
    if (!selectedAvatarUrl) {
      setSelectedAvatarId(p.defaultAvatar);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!agreeTerms) {
      setError("Please accept the IMD Citizen Service terms to proceed.");
      return;
    }

    setLoading(true);
    try {
      const res = await signup({
        name,
        email,
        phone,
        password,
        persona: selectedPersona,
        defaultLocation: city || "Ghaziabad",
        avatarId: selectedAvatarId,
        avatarUrl: selectedAvatarUrl,
      });

      if (res.success) {
        setActivePersona(selectedPersona);
        if (city) setLocation(city);
        router.push("/");
      } else {
        setError(res.error || "Failed to create account.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected registration error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Citizen Registration" subtitle="Create Your Profile & Avatar" />

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        currentAvatarId={selectedAvatarId}
        currentAvatarUrl={selectedAvatarUrl}
        onSave={({ avatarId, avatarUrl }) => {
          setSelectedAvatarId(avatarId || "farmer_sun");
          setSelectedAvatarUrl(avatarUrl);
        }}
      />

      <div className="p-4 max-w-[440px] mx-auto space-y-4">
        <form onSubmit={handleRegister} className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
          {/* Header Card with interactive Avatar */}
          <div className="flex items-center gap-3.5 pb-2 border-b border-white/10">
            <div
              onClick={() => setShowAvatarPicker(true)}
              className="cursor-pointer group relative"
              title="Click to choose avatar or upload photo"
            >
              <UserAvatar
                avatarId={selectedAvatarId}
                avatarUrl={selectedAvatarUrl}
                name={name || "Citizen"}
                size="xl"
                showEditBadge={true}
                className="group-hover:scale-105 transition"
                ringColor="ring-[#00DDE5]"
              />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Join IMD Mausam 2.0</h2>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(true)}
                className="text-[11px] font-bold text-[#00DDE5] hover:underline flex items-center gap-1 mt-0.5"
              >
                <Camera className="w-3 h-3" /> Pick Avatar / Upload Photo
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Personal Info */}
          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-white/80 block mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-2 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/80 block mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-2 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-white/80 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-2 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/80 block mb-1">Home Station</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Ghaziabad, Meerut..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-2 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Avatar Strip */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-white/80 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-[#FFBE00]" />
                Select Avatar
              </label>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(true)}
                className="text-[10px] font-bold text-[#00DDE5] hover:underline"
              >
                View all ({AVATAR_PRESETS.length}) ›
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {AVATAR_PRESETS.slice(0, 6).map((preset) => {
                const isSelected = selectedAvatarId === preset.id && !selectedAvatarUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatarId(preset.id);
                      setSelectedAvatarUrl(undefined);
                    }}
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

          {/* Persona Selection */}
          <div>
            <label className="text-[11px] font-bold text-white/90 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFBE00]" />
              Choose Your Primary Weather Persona
            </label>
            <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
              {personas.map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePersonaSelect(p)}
                    className={`w-full p-2.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-white/20 border-[#00DDE5] shadow-md"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-xl bg-white/10 shrink-0">{p.icon}</div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{p.title}</span>
                        <span className="text-[10px] text-white/60 block truncate">{p.desc}</span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#00DDE5] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-white/30 text-[#0055A6] focus:ring-0"
            />
            <label htmlFor="terms" className="text-[10px] text-white/70 leading-tight">
              I agree to receive localized weather & emergency hazard alerts from the India Meteorological Department.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#8ED329] to-[#00DDE5] hover:brightness-110 font-bold text-xs text-[#06345C] shadow-lg flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-50"
          >
            {loading ? "Creating Citizen Profile..." : "Complete Registration & Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Existing account link */}
          <div className="pt-2 text-center">
            <p className="text-xs text-white/70">
              Already registered?{" "}
              <Link href="/login" className="text-[#00DDE5] font-bold hover:underline">
                Sign In / Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
