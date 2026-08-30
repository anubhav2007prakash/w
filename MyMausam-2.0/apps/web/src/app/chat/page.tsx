"use client";

import React, { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Bot,
  User,
  Sparkles,
  Activity,
  CloudSun,
  Calendar,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useWeather } from "@/context/WeatherContext";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const SUGGESTED_FOLLOWUPS = [
  { icon: "🏃", text: "Should I go for a run?" },
  { icon: "🌤️", text: "Best time to go out?" },
  { icon: "💨", text: "Air quality today?" },
  { icon: "📅", text: "7-day outlook" },
];

export default function ChatPage() {
  const { currentWeather, activeLocation } = useWeather();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "user",
      text: "Will it rain heavily tomorrow?",
      timestamp: "3:30 PM",
    },
    {
      id: "2",
      sender: "bot",
      text: "Yes, heavy storm expected 3:30-4:30PM in Ghaziabad, AQI 156 moderate, carry umbrella and avoid outdoor at that time",
      timestamp: "3:31 PM",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateAIResponse = (userPrompt: string): string => {
    const q = userPrompt.toLowerCase();
    const temp = currentWeather?.temperature ?? 34.2;
    const humidity = currentWeather?.humidity ?? 38;
    const aqi = currentWeather?.aqi?.aqi ?? 95;

    if (q.includes("rain") || q.includes("barish") || q.includes("monsoon")) {
      return `🌧️ Rain forecast for ${activeLocation}: Today's rain probability is 90% with heavy showers expected 3:30-4:30 PM. Cumulative rainfall likely 15-25mm. Next 48 hours show decreasing trend. SW Monsoon active over North India.`;
    }
    if (q.includes("run") || q.includes("fitness") || q.includes("walk")) {
      return `🏃 Best running window: 05:30 AM – 07:15 AM or post 07:00 PM. Current AQI ${aqi} (${currentWeather?.aqi?.status || "Moderate"}). UV Index 7.2 (Very High). Stay hydrated with 250ml water every 20 min.`;
    }
    if (q.includes("air") || q.includes("aqi") || q.includes("pollution")) {
      return `💨 Air Quality for ${activeLocation}: AQI ${aqi} (${currentWeather?.aqi?.status || "Moderate"}). PM2.5: 78 µg/m³, PM10: 102 µg/m³. Sensitive groups should reduce prolonged outdoor exertion.`;
    }
    if (q.includes("out") || q.includes("best time") || q.includes("go outside")) {
      return `🌤️ Best outdoor windows today: 6:00 AM – 8:00 AM (before heat builds) and 6:30 PM – 7:30 PM (after storm passes). Avoid 3:30-4:30 PM due to heavy storm. Current temp ${temp}°C, feels like ${currentWeather?.feels_like?.toFixed(0) || "36"}°C.`;
    }
    if (q.includes("7-day") || q.includes("week") || q.includes("outlook")) {
      return `📅 7-Day Outlook for ${activeLocation}: Today (Heavy Rain, 28°C), Mon (Cloudy, 31°C), Tue (Sunny, 33°C), Wed (Partly cloudy, 32°C), Thu (Light rain, 29°C), Fri (Sunny, 34°C), Sat (Cloudy, 30°C). Monsoon active through Thursday.`;
    }
    return `🌤️ Weather Summary for ${activeLocation}: ${currentWeather?.condition || "Heavy rain"} at ${temp}°C (feels like ${currentWeather?.feels_like?.toFixed(0) || "36"}°C). Wind ${currentWeather?.wind_speed || 18} km/h NW. AQI ${aqi}. Humidity ${humidity}%. Ask about farming, rain, running, or travel conditions!`;
  };

  const handleSend = (text?: string) => {
    const msg = text || inputText.trim();
    if (!msg) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: generateAIResponse(msg),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 800);
  };

  const handleToggleMic = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      setInputText(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 flex flex-col select-none">
      {/* Header matching Figma */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between bg-[#0055A6]/70 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0055A6] to-[#00DDE5] flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-tight">Stormy Sunday</h1>
            <p className="text-[10px] text-white/60 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" />
              {activeLocation}, India
            </p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="w-10 h-10 rounded-full bg-[#FFBE00]/20 flex items-center justify-center shrink-0 mt-1">
                <span className="text-lg">✨</span>
              </div>
            )}

            <div
              className={`max-w-[80%] p-4 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-white/15 border border-white/20 text-white rounded-3xl rounded-br-lg backdrop-blur-xl"
                  : "bg-white/10 border border-white/15 text-white/95 rounded-3xl rounded-bl-lg backdrop-blur-xl"
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-10 h-10 rounded-full bg-[#FFBE00]/20 flex items-center justify-center shrink-0">
              <span className="text-lg">✨</span>
            </div>
            <div className="bg-white/10 border border-white/15 p-4 rounded-3xl rounded-bl-lg text-sm text-white/60 italic flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFBE00] animate-pulse" />
              <span>Analyzing IMD meteorological models...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* AQI & Time badges */}
      <div className="px-4 pb-2 flex gap-2">
        <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-white/80 flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-[#FFBE00]/20 text-[#FFBE00] text-[9px] font-black">AQI</span>
          AQI 156 • Moderate
        </span>
        <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-white/80 flex items-center gap-1.5">
          <span className="text-[#FFBE00]">🕐</span>
          Today • 3:30-4:30PM
        </span>
      </div>

      {/* Suggested Follow-ups Grid */}
      <div className="px-4 pb-3">
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2">
          Suggested Follow-ups
        </span>
        <div className="grid grid-cols-2 gap-2">
          {SUGGESTED_FOLLOWUPS.map((item) => (
            <button
              key={item.text}
              onClick={() => handleSend(item.text)}
              className="p-3 rounded-2xl bg-white/8 border border-white/12 text-left transition hover:bg-white/15 active:scale-[0.98] flex items-center gap-2.5"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-bold text-white/90">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input container */}
      <div className="p-3 bg-white/8 border-t border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about weather..."
            className="flex-1 bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FFBE00]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-full bg-[#FFBE00] disabled:opacity-40 active:scale-95 text-[#06345C] font-black flex items-center justify-center transition shadow-lg shadow-[#FFBE00]/20 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
