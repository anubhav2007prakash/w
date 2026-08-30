"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  CheckCircle2,
  Shield,
  Smartphone,
  Bug,
  Lightbulb,
  Heart,
} from "lucide-react";

const FEEDBACK_CATEGORIES = [
  { id: "accuracy", label: "Weather Accuracy", icon: <Shield className="w-4 h-4" /> },
  { id: "ui", label: "App Design & UI", icon: <Smartphone className="w-4 h-4" /> },
  { id: "bug", label: "Bug Report", icon: <Bug className="w-4 h-4" /> },
  { id: "feature", label: "Feature Request", icon: <Lightbulb className="w-4 h-4" /> },
];

const QUICK_RATINGS = [
  { label: "Forecast Accuracy", emoji: "🌡️" },
  { label: "Alert Timeliness", emoji: "⚡" },
  { label: "Radar Quality", emoji: "📡" },
  { label: "AI Copilot", emoji: "🤖" },
  { label: "Overall Experience", emoji: "⭐" },
];

export default function FeedbackPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [overallSentiment, setOverallSentiment] = useState<"positive" | "negative" | null>(null);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] flex items-center justify-center px-4">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-[#8ED329]/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-[#8ED329]" />
          </div>
          <h2 className="text-2xl font-black text-white">Thank You!</h2>
          <p className="text-sm text-white/60 max-w-[280px]">
            Your feedback helps us improve MyMausam for millions of citizens.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 select-none">
      {/* Header */}
      <div className="relative px-4 pt-14 pb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-12 w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl font-black text-white ml-14">
          Rate & Feedback
        </h1>
        <p className="text-sm text-white/60 ml-14 mt-1">
          Help us improve MyMausam
        </p>
      </div>

      <div className="px-4 space-y-4 max-w-[440px] mx-auto">
        {/* Overall Sentiment */}
        <div className="rounded-3xl p-4 border border-white/15 bg-white/8 backdrop-blur-xl">
          <h3 className="text-sm font-black text-white mb-3">
            How was your experience today?
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setOverallSentiment("positive")}
              className={`flex-1 py-3 rounded-2xl border text-center transition-all ${
                overallSentiment === "positive"
                  ? "bg-[#8ED329]/15 border-[#8ED329] shadow-lg shadow-[#8ED329]/10"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <ThumbsUp
                className={`w-6 h-6 mx-auto mb-1 ${
                  overallSentiment === "positive" ? "text-[#8ED329]" : "text-white/60"
                }`}
              />
              <span
                className={`text-xs font-bold ${
                  overallSentiment === "positive" ? "text-[#8ED329]" : "text-white/60"
                }`}
              >
                Good
              </span>
            </button>
            <button
              onClick={() => setOverallSentiment("negative")}
              className={`flex-1 py-3 rounded-2xl border text-center transition-all ${
                overallSentiment === "negative"
                  ? "bg-red-500/15 border-red-500 shadow-lg shadow-red-500/10"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <ThumbsDown
                className={`w-6 h-6 mx-auto mb-1 ${
                  overallSentiment === "negative" ? "text-red-400" : "text-white/60"
                }`}
              />
              <span
                className={`text-xs font-bold ${
                  overallSentiment === "negative" ? "text-red-400" : "text-white/60"
                }`}
              >
                Needs Work
              </span>
            </button>
          </div>
        </div>

        {/* Category Selection */}
        <div className="rounded-3xl p-4 border border-white/15 bg-white/8 backdrop-blur-xl">
          <h3 className="text-sm font-black text-white mb-3">
            Feedback Category
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {FEEDBACK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#FFBE00]/15 border-[#FFBE00] shadow-lg shadow-[#FFBE00]/10"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div
                  className={`mb-1 ${
                    selectedCategory === cat.id ? "text-[#FFBE00]" : "text-white/60"
                  }`}
                >
                  {cat.icon}
                </div>
                <span
                  className={`text-[10px] font-bold block ${
                    selectedCategory === cat.id ? "text-[#FFBE00]" : "text-white/70"
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Ratings */}
        <div className="rounded-3xl p-4 border border-white/15 bg-white/8 backdrop-blur-xl">
          <h3 className="text-sm font-black text-white mb-3">
            Rate Each Feature
          </h3>
          <div className="space-y-3">
            {QUICK_RATINGS.map((qr) => (
              <div key={qr.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{qr.emoji}</span>
                  <span className="text-xs font-bold text-white/80">{qr.label}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setRatings((prev) => ({
                          ...prev,
                          [qr.label]: star,
                        }))
                      }
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          (ratings[qr.label] || 0) >= star
                            ? "text-[#FFBE00] fill-[#FFBE00]"
                            : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Written Feedback */}
        <div className="rounded-3xl p-4 border border-white/15 bg-white/8 backdrop-blur-xl">
          <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Your Feedback
          </h3>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Tell us what you think about MyMausam... What can we improve?"
            className="w-full h-28 bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-[#FFBE00]/50 transition"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCategory}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 ${
            selectedCategory
              ? "bg-[#FFBE00] text-[#06345C] shadow-lg shadow-[#FFBE00]/20 hover:bg-[#e6ac00]"
              : "bg-white/10 text-white/40 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
          Submit Feedback
        </button>

        {/* Heart badge */}
        <div className="text-center pb-4">
          <span className="inline-flex items-center gap-1 text-[10px] text-white/30">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for Indian Citizens
          </span>
        </div>
      </div>
    </div>
  );
}
