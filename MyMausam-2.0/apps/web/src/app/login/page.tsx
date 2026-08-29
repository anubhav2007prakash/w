"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { CountryCodePicker } from "@/components/CountryCodePicker";
import { useLanguage } from "@/i18n/LanguageContext";

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
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title={t("auth.sign_in")} subtitle="IMD National Weather Services" />

      <div className="p-4 max-w-[420px] mx-auto space-y-4">
        {/* If already logged in */}
        {isAuthenticated && user ? (
          <div className="glass-card rounded-3xl p-6 border border-white/20 shadow-xl text-center space-y-4">
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
                className="flex-1 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition border border-white/20"
              >
                {t("auth.view_profile")}
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-2.5 rounded-2xl bg-[#00DDE5] text-[#06345C] font-bold text-xs transition shadow-md"
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
            {/* Main Login Card */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#00DDE5]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">{t("auth.sign_in_to_account")}</h2>
                  <p className="text-[11px] text-white/70">{t("auth.access_forecasts")}</p>
                </div>
              </div>

              {/* Toggle Email vs OTP */}
              <div className="flex bg-white/10 p-1 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setMode("password"); setError(null); }}
                  className={`flex-1 py-2 rounded-xl transition ${
                    mode === "password" ? "bg-[#0055A6] text-white shadow" : "text-white/70 hover:text-white"
                  }`}
                >
                  {t("auth.email_password")}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("otp"); setError(null); }}
                  className={`flex-1 py-2 rounded-xl transition ${
                    mode === "otp" ? "bg-[#0055A6] text-white shadow" : "text-white/70 hover:text-white"
                  }`}
                >
                  {t("auth.mobile_otp")}
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
                <form onSubmit={handlePasswordLogin} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-white/80 block mb-1">{t("auth.email_id")}</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="anubhav@mausam.gov.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/80 block mb-1">{t("auth.password")}</label>
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
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0055A6] to-[#00DDE5] font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition disabled:opacity-50"
                  >
                    {loading ? t("auth.verifying") : t("auth.sign_in_btn")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Form 2: Mobile OTP */}
              {mode === "otp" && (
                <div className="space-y-3">
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
                      className="w-full py-2.5 rounded-2xl bg-[#0055A6] hover:bg-[#004586] text-white font-bold text-xs shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sendingOtp ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>                      {t("auth.send_otp")}</>
                      )}
                    </button>
                  ) : (
                    <form onSubmit={handleOtpLogin} className="space-y-3 animate-fade-in">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] font-bold text-white/80">{t("auth.enter_otp")}</label>
                          <span className="text-[10px] text-[#8ED329]">Sent to {fullPhone}</span>
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
                        ) : (                            <>{t("auth.verify_sign_in")}</>
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
                            className="text-[10px] text-[#00DDE5] hover:underline font-bold"
                          >
                            {sendingOtp ? t("auth.sending_otp") : t("auth.resend_otp")}
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}

              <div id="recaptcha-container" />

              {/* Registration Link */}
              <div className="pt-2 text-center">
                <p className="text-xs text-white/70">
                  {t("auth.dont_have_account")}{" "}
                  <Link href="/signup" className="text-[#00DDE5] font-bold hover:underline">
                    {t("auth.sign_up_register")}
                  </Link>
                </p>
              </div>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3">
              <h3 className="font-extrabold text-xs text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFBE00]" />
                1-Click Quick Demo Sign In
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemo("citizen")}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition flex items-center gap-2.5"
                >
                  <span className="w-7 h-7 rounded-xl bg-blue-500/30 flex items-center justify-center text-sm">👤</span>
                  <div className="truncate">
                    <span className="text-[12px] font-bold text-white block truncate">Anubhav</span>
                    <span className="text-[10px] text-white/60 block truncate">Citizen (Health)</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemo("farmer")}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition flex items-center gap-2.5"
                >
                  <span className="w-7 h-7 rounded-xl bg-green-500/30 flex items-center justify-center text-sm">🌾</span>
                  <div className="truncate">
                    <span className="text-[12px] font-bold text-white block truncate">Ramesh Patel</span>
                    <span className="text-[10px] text-white/60 block truncate">Farmer (Agromet)</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemo("official")}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition flex items-center gap-2.5"
                >
                  <span className="w-7 h-7 rounded-xl bg-purple-500/30 flex items-center justify-center text-sm">🔬</span>
                  <div className="truncate">
                    <span className="text-[12px] font-bold text-white block truncate">Dr. Priya Nair</span>
                    <span className="text-[10px] text-white/60 block truncate">IMD Scientist</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemo("aviation")}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition flex items-center gap-2.5"
                >
                  <span className="w-7 h-7 rounded-xl bg-cyan-500/30 flex items-center justify-center text-sm">✈️</span>
                  <div className="truncate">
                    <span className="text-[12px] font-bold text-white block truncate">Capt. Vikram</span>
                    <span className="text-[10px] text-white/60 block truncate">Aviation Pilot</span>
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
