"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { WeatherAPI } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";
import { CrowdReportItem } from "@/types/weather";
import {
  Users,
  Camera,
  Cloud,
  Send,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const REPORT_TYPES = ["Cloud Observation", "Rainfall", "Storm", "Fog", "Hail", "Low Visibility", "Unusual Weather"];

export default function CitizenSciencePage() {
  const { data: reports, loading, error, refetch } = useApi<CrowdReportItem[]>(
    () => WeatherAPI.getCrowdReports(),
    []
  );

  const [showSubmit, setShowSubmit] = useState(false);
  const [formType, setFormType] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formSeverity, setFormSeverity] = useState("Moderate");
  const [formDescription, setFormDescription] = useState("");
  const [formName, setFormName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formType || !formLocation || !formDescription || !formName) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await WeatherAPI.submitCrowdReport({
        location_name: formLocation,
        condition: formType,
        severity: formSeverity,
        description: formDescription,
        reporter_name: formName,
      });
      setSubmitSuccess(true);
      setFormType(""); setFormLocation(""); setFormDescription(""); setFormName("");
      refetch();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Citizen Science & Cloud" subtitle="IMD SkyWatcher Cloud Observation Network" />

      <div className="p-4 space-y-4">
        {/* Submit Button */}
        <button onClick={() => setShowSubmit(!showSubmit)}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#8ED329] to-[#00DDE5] text-black font-extrabold text-xs shadow-xl flex items-center justify-between active:scale-[0.98] transition">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 fill-black" />
            <div className="text-left">
              <span className="text-sm font-black block leading-none">Submit Weather Report</span>
              <span className="text-[10px] opacity-80 block mt-0.5">Report what you observe</span>
            </div>
          </div>
          <span className="bg-black/20 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase">{showSubmit ? "Close" : "Open"}</span>
        </button>

        {/* Submit Form */}
        {showSubmit && (
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3 animate-fade-in">
            <h3 className="font-extrabold text-sm text-white">Weather Observation Report</h3>

            {submitSuccess && (
              <div className="bg-[#8ED329]/20 p-3 rounded-xl flex items-center gap-2 text-[#8ED329] text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> Report submitted successfully!
              </div>
            )}
            {submitError && (
              <div className="bg-[#FF2020]/20 p-3 rounded-xl text-[#FF2020] text-xs font-bold">{submitError}</div>
            )}

            {/* Report Type */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-white/60 font-bold uppercase">Observation Type *</span>
              <div className="flex flex-wrap gap-1.5">
                {REPORT_TYPES.map((t) => (
                  <button key={t} onClick={() => setFormType(t)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${formType === t ? "bg-[#00DDE5] text-[#06345C]" : "bg-white/10 text-white/70 hover:bg-white/15"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-white/60 font-bold uppercase">Location *</span>
              <input type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="City or area name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-white/60 font-bold uppercase">Severity</span>
              <div className="flex gap-2">
                {["Low", "Moderate", "High", "Severe"].map((s) => (
                  <button key={s} onClick={() => setFormSeverity(s)}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-all ${formSeverity === s ? "bg-[#FFBE00] text-black" : "bg-white/10 text-white/60"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-white/60 font-bold uppercase">Description *</span>
              <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Describe what you observed..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none h-20 resize-none" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-white/60 font-bold uppercase">Your Name *</span>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none" />
            </div>

            <button onClick={handleSubmit} disabled={submitting || !formType || !formLocation || !formDescription || !formName}
              className="w-full py-3 rounded-2xl bg-[#00DDE5] text-[#06345C] font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-40">
              <Send className="w-4 h-4" />
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        )}

        {/* Recent Reports */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8ED329]" /><span>Recent Reports</span>
            </h3>
            <button onClick={refetch} className="p-1.5 rounded-xl bg-white/10 active:bg-white/20 transition">
              <RefreshCw className="w-3.5 h-3.5 text-[#00DDE5]" />
            </button>
          </div>

          {loading ? <LoadingSkeleton count={3} /> : error ? <ErrorState message={error} onRetry={refetch} /> : !reports || reports.length === 0 ? (
            <EmptyState message="No citizen reports yet. Be the first to submit an observation!" />
          ) : (
            <div className="space-y-2">
              {reports.map((report) => (
                <div key={report.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                  <Cloud className="w-4 h-4 text-[#00DDE5] shrink-0" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{report.condition}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-bold">{report.severity}</span>
                    </div>
                    <span className="text-[10px] text-white/50 block">{report.reporter_name} • {report.location_name} • {report.timestamp}</span>
                    {report.description && <span className="text-[10px] text-white/70 block mt-0.5">{report.description}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
