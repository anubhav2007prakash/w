"use client";

import React, { useState, useEffect } from "react";
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
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

// Rain drops component for the background
function RainOverlay() {
  const [drops, setDrops] = useState<{ left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 40 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${1.5 + Math.random() * 2}s`,
    }));
    setDrops(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {drops.map((drop, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
          }}
        />
      ))}
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { setActivePersona, setLocation } = useWeather();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      desc: "Rainfall, soil moisture & crop advisories",
      icon: <Sprout className="w-5 h-5 text-green-400" />,
      defaultAvatar: "farmer_sun",
    },
    {
      id: "health",
      title: "Health & Allergy",
      desc: "AQI, dust warnings, UV & pollen",
      icon: <HeartPulse className="w-5 h-5 text-pink-400" />,
      defaultAvatar: "health_guard",
    },
    {
      id: "commuter",
      title: "Daily Commuter",
      desc: "Rain nowcast, fog & road weather",
      icon: <Navigation className="w-5 h-5 text-blue-400" />,
      defaultAvatar: "commuter_metro",
    },
    {
      id: "runner",
      title: "Runner & Outdoor",
      desc: "Comfort index, wind, golden hour",
      icon: <Compass className="w-5 h-5 text-yellow-400" />,
      defaultAvatar: "runner_athlete",
    },
    {
      id: "beach",
      title: "Marine & Coastal",
      desc: "Wave heights, tides & sea temp",
      icon: <Sun className="w-5 h-5 text-cyan-400" />,
      defaultAvatar: "ocean_sailor",
    },
    {
      id: "parent",
      title: "Family & Parent",
      desc: "School weather, rain alerts & safety",
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
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 select-none relative">
      <RainOverlay />

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

      <div className="relative z-10 p-4 max-w-[440px] mx-auto space-y-4 pt-6">
        <form onSubmit={handleRegister} className="rounded-3xl p-6 border border-white/15 shadow-2xl space-y-5 bg-white/8 backdrop-blur-xl">
          {/* Shield Logo & Title - matching Figma */}
          <div className="text-center space-y-2 pb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0055A6] to-[#00DDE5] flex items-center justify-center mx-auto shadow-lg shadow-[#0055A6]/30">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">IMD Citizen Weather Account</h2>
              <p className="text-xs text-white/60 mt-1">Create your personalized account</p>
            </div>
          </div>

          {/* Tab Switcher - matching Figma */}
          <div className="flex bg-white/8 p-1 rounded-2xl text-xs font-bold border border-white/10">
            <Link
              href="/login"
              className="flex-1 py-2.5 rounded-xl transition text-white/50 hover:text-white text-center"
            >
              Sign In
            </Link>
            <span className="flex-1 py-2.5 rounded-xl transition bg-[#FFBE00] text-[#06345C] shadow-md text-center">
              Register
            </span>
            <Link
              href="/login"
              className="flex-1 py-2.5 rounded-xl transition text-white/50 hover:text-white text-center"
            >
              OTP Login
            </Link>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields - matching Figma style with white inputs */}
          <div className="space-y-3.5">
            <div>
              <label className="text-[12px] font-bold text-white/90 block mb-1.5">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/95 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBE00]/50 transition"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-white/90 block mb-1.5">Email or Mobile</label>
              <input
                type="text"
                placeholder="Enter email or mobile number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/95 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBE00]/50 transition"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-white/90 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/95 border-0 rounded-xl px-4 py-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBE00]/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-bold text-white/90 block mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/95 border-0 rounded-xl px-4 py-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBE00]/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-white/30 text-[#FFBE00] focus:ring-0"
            />
            <label htmlFor="terms" className="text-[11px] text-white/60 leading-tight">
              I agree to receive localized weather & emergency hazard alerts from the India Meteorological Department.
            </label>
          </div>

          {/* Submit Button - matching Figma yellow style */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#FFBE00] hover:bg-[#e6ac00] font-bold text-sm text-[#06345C] shadow-lg shadow-[#FFBE00]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-50"
          >
            {loading ? "Creating Citizen Profile..." : "Register"}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Existing account link */}
          <div className="pt-1 text-center">
            <p className="text-xs text-white/60">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FFBE00] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>

        {/* Security badge */}
        <div className="text-center">
          <p className="text-[10px] text-white/40 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Secured by IMD • Data encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
