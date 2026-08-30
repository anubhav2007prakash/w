"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { CountryCodePicker } from "@/components/CountryCodePicker";
import { useLanguage } from "@/i18n/LanguageContext";

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

export default function LoginPage() {
  const router = useRouter();
  const { login, sendPhoneOtp, loginWithPhone, loginWithDemo, isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryDial, setCountryDial] = useState("+91");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Resend countdown timer
  React.useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        router.push("/");
      } else {
        setError(res.error || "Invalid login credentials.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const fullPhone = phone ? `${countryDial}${phone.replace(/\D/g, "")}` : "";

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithPhone(fullPhone, otp);
      if (res.success) {
        router.push("/");
      } else {
        setError(res.error || "Invalid OTP code.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (key: "citizen" | "farmer" | "official" | "aviation") => {
    setLoading(true);
    await loginWithDemo(key);
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 select-none relative">
      <RainOverlay />

      <div className="relative z-10 p-4 max-w-[420px] mx-auto space-y-4 pt-8">
        {/* If already logged in */}
        {isAuthenticated && user ? (
          <div className="rounded-3xl p-6 border border-white/15 shadow-xl text-center space-y-4 bg-white/5 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-3xl bg-[#00DDE5]/20 border border-[#00DDE5]/40 flex items-center justify-center mx-auto text-[#00DDE5]">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t("auth.already_signed_in")}</h2>
              <p className="text-xs text-white/70 mt-1">
                {t("auth.you_are_logged_in")} <span className="font-bold text-[#00DDE5]">{user.name}</span> ({user.role})
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => router.push("/profile")}
                className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/15"
              >
                {t("auth.view_profile")}
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-2.5 rounded-2xl bg-[#FFBE00] text-[#06345C] font-bold text-xs transition shadow-md"
              >
                {t("auth.go_to_home")}
              </button>
            </div>
            <button
              onClick={logout}
              className="text-xs text-red-300 hover:text-red-200 underline pt-2 block mx-auto"
            >
              {t("auth.sign_out_device")}
            </button>
          </div>
        ) : (
          <>
            {/* Main Login Card - matching Figma */}
            <div className="rounded-3xl p-6 border border-white/15 shadow-2xl space-y-5 bg-white/8 backdrop-blur-xl">
              {/* Shield Icon & Title */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0055A6] to-[#00DDE5] flex items-center justify-center mx-auto shadow-lg shadow-[#0055A6]/30">
                  <ShieldCheck className="w-9 h-9 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white leading-tight">IMD Citizen Weather Account</h2>
                  <p className="text-xs text-white/60 mt-1">Sign in for personalized alerts • agromet & radar</p>
                </div>
              </div>

              {/* Mode Switcher Tabs - matching Figma style */}
              <div className="flex bg-white/8 p-1 rounded-2xl text-xs font-bold border border-white/10">
                <button
                  type="button"
                  onClick={() => { setMode("password"); setError(null); }}
                  className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    mode === "password" ? "bg-[#FFBE00] text-[#06345C] shadow-md" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("otp"); setError(null); }}
                  className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    mode === "otp" ? "bg-[#FFBE00] text-[#06345C] shadow-md" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  OTP Login
                </button>
              </div>

              {/* Error banner */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/40 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form 1: Password */}
              {mode === "password" && (
                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-white/80 block mb-1.5">Email or Mobile</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. anubhav@mausam.gov.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#FFBE00] focus:bg-white/12 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-bold text-white/80">Password</label>
                      <button
                        type="button"
                        onClick={() => alert("Password reset link sent to demo registered email.")}
                        className="text-[10px] text-[#FFBE00] hover:underline font-bold"
                      >
                        {t("auth.forgot_password")}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#FFBE00] focus:bg-white/12 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#FFBE00] hover:bg-[#e6ac00] font-bold text-sm text-[#06345C] shadow-lg shadow-[#FFBE00]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-50 mt-2"
                  >
                    {loading ? t("auth.verifying") : "Sign In to Account"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Form 2: Mobile OTP */}
              {mode === "otp" && (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-white/80 block mb-1.5">Mobile Number</label>
                    <div className="flex">
                      <CountryCodePicker
                        value={countryDial}
                        onChange={(dial) => setCountryDial(dial)}
                        disabled={otpSent}
                      />
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="Enter mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        disabled={otpSent}
                        maxLength={15}
                        className="flex-1 bg-white/10 border border-l-0 border-white/15 rounded-r-xl px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#FFBE00] disabled:opacity-50 font-mono transition"
                      />
                    </div>
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={async () => {
                        setError(null);
                        if (phone.replace(/\D/g, "").length < 10) {
                          setError("Please enter a valid 10-digit mobile number.");
                          return;
                        }
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
                      }}
                      disabled={sendingOtp}
                      className="w-full py-3 rounded-2xl bg-[#FFBE00] hover:bg-[#e6ac00] text-[#06345C] font-bold text-sm shadow-lg shadow-[#FFBE00]/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sendingOtp ? (
                        <>
                          <span className="w-4 h-4 border-2 border-[#06345C]/30 border-t-[#06345C] rounded-full animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  ) : (
                    <form onSubmit={handleOtpLogin} className="space-y-3.5 animate-fade-in">
                      <div>
                        <label className="text-[11px] font-bold text-white/80 block mb-2">OTP</label>
                        {/* 6 separate OTP boxes matching Figma */}
                        <div className="flex gap-2 justify-center">
                          {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <input
                              key={idx}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={otp[idx] || ""}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                const newOtp = otp.split("");
                                newOtp[idx] = val;
                                setOtp(newOtp.join("").slice(0, 6));
                                // Auto-focus next input
                                if (val && idx < 5) {
                                  const next = e.currentTarget.parentElement?.children[idx + 1] as HTMLInputElement;
                                  next?.focus();
                                }
                              }}
                              className="w-12 h-14 bg-white/10 border border-white/20 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-[#FFBE00] focus:bg-white/15 transition"
                              autoFocus={idx === 0}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Resend OTP */}
                      <div className="text-left">
                        {resendTimer > 0 ? (
                          <p className="text-[11px] text-white/50">
                            Resend OTP in <span className="font-bold text-[#FFBE00]">{resendTimer}s</span>
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
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
                            }}
                            disabled={sendingOtp}
                            className="text-[11px] text-[#FFBE00] hover:underline font-bold"
                          >
                            {sendingOtp ? t("auth.sending_otp") : "Resend OTP"}
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full py-3.5 rounded-2xl bg-[#FFBE00] hover:bg-[#e6ac00] font-bold text-sm text-[#06345C] shadow-lg shadow-[#FFBE00]/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-[#06345C]/30 border-t-[#06345C] rounded-full animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify OTP"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtp(""); setResendTimer(0); }}
                        className="w-full text-center text-[11px] text-white/50 hover:text-white/80 transition"
                      >
                        < ArrowLeft className="w-3 h-3 inline mr-1" />
                        Back to Sign In
                      </button>
                    </form>
                  )}
                </div>
              )}

              <div id="recaptcha-container" />

              {/* Registration Link */}
              <div className="pt-2 text-center">
                <p className="text-xs text-white/60">
                  Already have an account?{" "}
                  <Link href="/signup" className="text-[#FFBE00] font-bold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="rounded-3xl p-5 border border-white/10 shadow-xl space-y-3 bg-white/5 backdrop-blur-xl">
              <h3 className="font-extrabold text-[11px] text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-[#FFBE00]">✦</span>
                Quick 1-Click Demo Sign In
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemo("citizen")}
                  className="p-3 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2.5"
                >
                  <span className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-base">👤</span>
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-white block truncate">Anubhav</span>
                    <span className="text-[9px] text-white/50 block truncate">Citizen (Health)</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemo("farmer")}
                  className="p-3 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2.5"
                >
                  <span className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center text-base">🌾</span>
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-white block truncate">Ramesh Patel</span>
                    <span className="text-[9px] text-white/50 block truncate">Farmer (Agromet)</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemo("official")}
                  className="p-3 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2.5"
                >
                  <span className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-base">🔬</span>
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-white block truncate">Dr. Priya Nair</span>
                    <span className="text-[9px] text-white/50 block truncate">IMD Scientist</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemo("aviation")}
                  className="p-3 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2.5"
                >
                  <span className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-base">✈️</span>
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-white block truncate">Capt. Vikram</span>
                    <span className="text-[9px] text-white/50 block truncate">Aviation Pilot</span>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Simple ArrowLeft component (inline for this file only)
function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
