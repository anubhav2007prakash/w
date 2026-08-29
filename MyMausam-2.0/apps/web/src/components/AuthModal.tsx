"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  Phone,
  User,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  ShieldCheck,
  Sprout,
  HeartPulse,
  Navigation,
  Compass,
  ArrowRight,
  Smile,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWeather } from "@/context/WeatherContext";
import { PersonaType } from "@/types/weather";
import { UserAvatar } from "@/components/UserAvatar";
import { AVATAR_PRESETS } from "@/lib/avatars";
import { CountryCodePicker } from "@/components/CountryCodePicker";
import { useLanguage } from "@/i18n/LanguageContext";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    signup,
    sendPhoneOtp,
    loginWithPhone,
    loginWithDemo,
  } = useAuth();
  const { setActivePersona, setLocation } = useWeather();
  const { t } = useLanguage();

  const [tab, setTab] = useState<"signin" | "signup" | "otp">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryDial, setCountryDial] = useState("+91");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>("health");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("health_guard");
  const [city, setCity] = useState("Ghaziabad");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync modal mode from context
  React.useEffect(() => {
    if (authModalMode === "signup") {
      setTab("signup");
    } else {
      setTab("signin");
    }
    setError(null);
  }, [authModalMode, isAuthModalOpen]);

  // Resend countdown timer
  React.useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (!res.success) {
        setError(res.error || "Login failed. Check your credentials.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Please enter your full name.");
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
        defaultLocation: city,
        avatarId: selectedAvatarId,
      });
      if (res.success) {
        setActivePersona(selectedPersona);
        if (city) setLocation(city);
      } else {
        setError(res.error || "Registration failed.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fullPhone = phone ? `${countryDial}${phone.replace(/\D/g, "")}` : "";

  const handleSendOtp = async () => {
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    setSendingOtp(true);
    const result = await sendPhoneOtp(fullPhone);
    if (result.success) {
      setOtpSent(true);
      setResendTimer(60);
      setOtp("");
    } else {
      setError(result.error || "Failed to send OTP.");
    }
    setSendingOtp(false);
  };

  const handleResendOtp = async () => {
    setError(null);
    setSendingOtp(true);
    const result = await sendPhoneOtp(fullPhone);
    if (result.success) {
      setResendTimer(60);
      setOtp("");
    } else {
      setError(result.error || "Failed to resend OTP.");
    }
    setSendingOtp(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithPhone(fullPhone, otp);
      if (!res.success) {
        setError(res.error || "Invalid OTP code.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (demoKey: "citizen" | "farmer" | "official" | "aviation") => {
    setError(null);
    setLoading(true);
    await loginWithDemo(demoKey);
    setLoading(false);
  };

  const personaChoices: { id: PersonaType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "farmer", label: "Farmer / Kisan", icon: <Sprout className="w-4 h-4 text-green-400" />, desc: "Agromet, Soil, Rain advisories" },
    { id: "health", label: "Health & Allergy", icon: <HeartPulse className="w-4 h-4 text-pink-400" />, desc: "Air quality, UV, Heat stress" },
    { id: "commuter", label: "Daily Commuter", icon: <Navigation className="w-4 h-4 text-blue-400" />, desc: "Rain nowcast, Route fog alerts" },
    { id: "runner", label: "Runner & Fitness", icon: <Compass className="w-4 h-4 text-yellow-400" />, desc: "Comfort index, Wind, Best hours" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="bg-[#032442] border border-white/20 text-white w-full max-w-[420px] rounded-3xl p-5 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-scale-up">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-2 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0055A6] to-[#00DDE5] flex items-center justify-center mx-auto shadow-lg mb-2">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-lg font-black text-white">{t("auth.imd_citizen_account")}</h2>
          <p className="text-xs text-white/70">{t("auth.sign_in_for_alerts")}</p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-white/10 p-1 rounded-2xl mb-4 text-xs font-bold">
          <button
            onClick={() => { setTab("signin"); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === "signin" ? "bg-[#0055A6] text-white shadow-md" : "text-white/70 hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            {t("auth.sign_in")}
          </button>
          <button
            onClick={() => { setTab("signup"); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === "signup" ? "bg-[#0055A6] text-white shadow-md" : "text-white/70 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            {t("auth.register")}
          </button>
          <button
            onClick={() => { setTab("otp"); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === "otp" ? "bg-[#0055A6] text-white shadow-md" : "text-white/70 hover:text-white"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            {t("auth.otp_login")}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/40 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1">{t("auth.email_or_mobile")}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. anubhav@mausam.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-white/80">Password</label>
                <button
                  type="button"
                  onClick={() => alert("Password reset link sent to demo registered email.")}
                  className="text-[10px] text-[#00DDE5] hover:underline"
                >
                  {t("auth.forgot_password")}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-[#0055A6] to-[#00DDE5] hover:brightness-110 font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-50"
            >
              {loading ? t("auth.verifying") : t("auth.sign_in_to_account")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: SIGN UP */}
        {tab === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1">{t("auth.full_name")}</label>
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
                <input
                  type="email"
                  placeholder="user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-white/80 block mb-1">Mobile</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1">{t("auth.home_city")}</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ghaziabad, Meerut, Delhi..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                />
              </div>
            </div>

            {/* Avatar Selector Strip */}
            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1.5 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-[#FFBE00]" />
                {t("auth.select_avatar")}
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {AVATAR_PRESETS.slice(0, 7).map((preset) => {
                  const isSelected = selectedAvatarId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(preset.id)}
                      className={`shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-tr ${preset.bgGradient} flex items-center justify-center text-base shadow-sm transition border ${
                        isSelected
                          ? "border-[#00DDE5] ring-2 ring-[#00DDE5] scale-105"
                          : "border-white/10 hover:border-white/30"
                      }`}
                      title={preset.name}
                    >
                      <span>{preset.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persona Selector */}
            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1.5">
                {t("auth.select_persona")}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {personaChoices.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPersona(p.id);
                      if (p.id === "farmer") setSelectedAvatarId("farmer_sun");
                      else if (p.id === "health") setSelectedAvatarId("health_guard");
                      else if (p.id === "commuter") setSelectedAvatarId("commuter_metro");
                      else if (p.id === "runner") setSelectedAvatarId("runner_athlete");
                    }}
                    className={`p-2 rounded-xl border text-left transition flex items-start gap-2 ${
                      selectedPersona === p.id
                        ? "bg-white/20 border-[#00DDE5] text-white"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <span className="mt-0.5">{p.icon}</span>
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-bold block truncate">{p.label}</span>
                      <span className="text-[9px] text-white/60 block truncate">{p.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-[#8ED329] to-[#00DDE5] hover:brightness-110 font-bold text-xs text-[#06345C] shadow-lg flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-50"
            >
              {loading ? t("auth.creating_profile") : t("auth.create_account")}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 3: PHONE OTP */}
        {tab === "otp" && (
          <div className="space-y-3">
            {/* Demo OTP hint */}
            <div className="bg-[#FFBE00]/15 border border-[#FFBE00]/30 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-[#FFBE00]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Demo mode: Enter any number, use OTP <strong>123456</strong> to sign in.</span>
            </div>
            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1">{t("auth.mobile_number")}</label>
              <div className="flex">
                <CountryCodePicker
                  value={countryDial}
                  onChange={(dial) => setCountryDial(dial)}
                  disabled={otpSent}
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
                  disabled={otpSent}
                  maxLength={15}
                  className="flex-1 bg-white/10 border border-l-0 border-white/20 rounded-r-xl px-3 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5] disabled:opacity-60 font-mono"
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full py-2.5 rounded-2xl bg-[#0055A6] hover:bg-[#004586] text-white font-bold text-xs shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sendingOtp ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>{t("auth.send_otp")}</>
                )}
              </button>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3 animate-fade-in">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-white/80">{t("auth.enter_otp")}</label>
                    <span className="text-[10px] text-[#8ED329]">Code sent to {fullPhone}</span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-[0.4em] font-mono text-lg bg-white/10 border border-[#00DDE5] rounded-xl py-2 text-white focus:outline-none"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#0055A6] to-[#00DDE5] font-bold text-xs text-white shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>{t("auth.verify_sign_in")}</>
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-[10px] text-white/50">
                      Resend OTP in <span className="font-bold text-[#00DDE5]">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={sendingOtp}
                      className="text-[10px] text-[#00DDE5] hover:underline font-bold"
                    >
                      {sendingOtp ? t("auth.sending_otp") : t("auth.resend_otp")}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(""); setResendTimer(0); }}
                  className="w-full text-center text-[10px] text-white/60 hover:text-white underline"
                >
                  {t("auth.change_phone")}
                </button>
              </form>
            )}
          </div>
        )}

        <div id="recaptcha-container" />

        {/* QUICK 1-CLICK DEMO ACCOUNTS */}
        <div className="mt-5 pt-3 border-t border-white/15">
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FFBE00]" />
            Quick 1-Click Demo Profiles
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSelect("citizen")}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2"
            >
              <UserAvatar avatarId="health_guard" size="xs" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">Anubhav Prakash</span>
                <span className="text-[9px] text-white/60 block">Citizen • Ghaziabad</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect("farmer")}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2"
            >
              <UserAvatar avatarId="farmer_sun" size="xs" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">Ramesh Patel</span>
                <span className="text-[9px] text-white/60 block">Farmer • Meerut</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect("official")}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2"
            >
              <UserAvatar avatarId="meteorologist" size="xs" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">Dr. Priya Nair</span>
                <span className="text-[9px] text-white/60 block">IMD Official • Delhi</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect("aviation")}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2"
            >
              <UserAvatar avatarId="aviation_pilot" size="xs" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">Capt. Vikram</span>
                <span className="text-[9px] text-white/60 block">Aviation • BLR</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
