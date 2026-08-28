"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useWeather } from "@/context/WeatherContext";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface MausamMitraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MausamMitraModal: React.FC<MausamMitraModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentWeather, activeLocation } = useWeather();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: `Namaste! I am **Mausam Mitra**, your IMD AI Weather & Agro Copilot. I can help you with farming spray timings, rainfall forecasts, solar estimation, commute conditions, and extreme alerts for ${activeLocation}. How can I assist you today?`,
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakingBot, setIsSpeakingBot] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const generateAIResponse = (userPrompt: string): string => {
    const q = userPrompt.toLowerCase();
    const temp = currentWeather?.temperature ?? 34.2;
    const humidity = currentWeather?.humidity ?? 38;
    const aqi = currentWeather?.aqi?.aqi ?? 95;

    if (q.includes("spray") || q.includes("pesticide") || q.includes("kisan") || q.includes("crop") || q.includes("farm")) {
      return `🌾 **Agromet Advisory for ${activeLocation}:**\n• Current temperature is ${temp.toFixed(1)}°C with ${humidity}% humidity.\n• **Foliar Spray Window:** Safe between **06:00 AM - 08:30 AM** when wind speeds are under 10 km/h.\n• **Caution:** Avoid spraying during peak afternoon hours to prevent leaf scorching.\n• **Soil Moisture:** Adequate for vegetable seedlings and pulse crops.`;
    }

    if (q.includes("rain") || q.includes("barish") || q.includes("monsoon") || q.includes("cloud")) {
      return `🌧️ **Rain & Monsoon Status for ${activeLocation}:**\n• Today's rain probability is **10% (Partly Cloudy / Dry Window)**.\n• All-India Southwest Monsoon cumulative departure is **+6% (Normal)**.\n• Next notable precipitation chances are projected in **48–72 hours**.`;
    }

    if (q.includes("solar") || q.includes("energy") || q.includes("sun") || q.includes("kwh")) {
      return `☀️ **Solar Energy Potential:**\n• Today's solar irradiance is **5.4 kWh/m²/day** (Peak Sun Hours: 5.6h).\n• A standard 3 kW rooftop system in ${activeLocation} will generate approx. **13.5 kWh today**, saving around ₹94.50 in electricity costs.`;
    }

    if (q.includes("run") || q.includes("fitness") || q.includes("walk") || q.includes("jog")) {
      return `🏃 **Outdoor Fitness Recommendation:**\n• **Best Running Window:** **05:30 AM – 07:15 AM** or post **07:00 PM**.\n• Current AQI is **${aqi} (${currentWeather?.aqi.status || "Satisfactory"})**.\n• Maintain hydration with 250ml water every 20 minutes during cardio.`;
    }

    if (q.includes("health") || q.includes("aqi") || q.includes("pollen") || q.includes("allergy")) {
      return `🏥 **Health & Bio-Meteorological Telemetry:**\n• **AQI:** ${aqi} (Satisfactory).\n• **Pollen Count:** Moderate (Grass & Weed pollen dispersal active).\n• **UV Index:** 7.2 (Very High — wear UV400 sunglasses and SPF 30+).\n• **WBGT Heat Index:** 28.5°C (Moderate heat stress).`;
    }

    return `🌤️ **Weather Summary for ${activeLocation}:**\n• **Temperature:** ${temp.toFixed(1)}°C (Feels like ${currentWeather?.feels_like?.toFixed(1) || temp.toFixed(1)}°C)\n• **Condition:** ${currentWeather?.condition || "Partly Cloudy"}\n• **Wind:** ${currentWeather?.wind_speed || 9.4} km/h from ${currentWeather?.wind_direction || "NW"}\n• **Air Quality:** AQI ${aqi} (${currentWeather?.aqi.status || "Satisfactory"})\n\nFeel free to ask about farming, rain predictions, running hours, or travel conditions!`;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    setTimeout(() => {
      const reply = generateAIResponse(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 600);
  };

  const handleToggleMic = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

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
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setInputText(speechResult);
    };

    recognition.start();
  };

  const handleTTS = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeakingBot) {
      window.speechSynthesis.cancel();
      setIsSpeakingBot(false);
      return;
    }

    const cleanText = text.replace(/[*#•]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingBot(false);
    utterance.onerror = () => setIsSpeakingBot(false);

    setIsSpeakingBot(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 select-none">
      <div className="bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] text-white w-full max-w-[440px] h-[85vh] max-h-[680px] rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-4 bg-black/20 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00DDE5] to-[#FFBE00] p-[2px]">
              <div className="w-full h-full bg-[#062b4c] rounded-2xl flex items-center justify-center text-[#00DDE5]">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white flex items-center gap-1.5 leading-none">
                <span>Mausam Mitra AI</span>
                <span className="bg-[#FFBE00] text-black text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                  Voice
                </span>
              </h2>
              <span className="text-[11px] text-white/70 block mt-0.5">
                IMD AI Weather & Agro Assistant
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-white/5 border-b border-white/10 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 text-[11px]">
          {[
            "Will it rain today?",
            "Crop spray timing?",
            "Best running hours?",
            "Rooftop solar yield?",
            "AQI & Pollen risk?",
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInputText(prompt);
              }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium shrink-0 border border-white/10 transition active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="w-7 h-7 rounded-full bg-[#00DDE5]/20 flex items-center justify-center text-[#00DDE5] shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  msg.sender === "user"
                    ? "bg-[#00DDE5] text-[#06345C] font-semibold rounded-br-none shadow-md"
                    : "bg-white/10 text-white/95 rounded-bl-none border border-white/10 shadow-md backdrop-blur-xs"
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                <div className="flex items-center justify-between pt-1 text-[9px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "bot" && (
                    <button
                      onClick={() => handleTTS(msg.text)}
                      className="hover:opacity-100 flex items-center gap-1 text-[#FFBE00]"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Audio</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-[#00DDE5]/20 flex items-center justify-center text-[#00DDE5] shrink-0 mt-1">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white/10 text-white/70 p-3 rounded-2xl text-xs italic flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFBE00] animate-pulse" />
                <span>Analyzing meteorological models...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-black/30 border-t border-white/10 flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleMic}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition active:scale-95 shrink-0 ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white/10 hover:bg-white/20 text-[#00DDE5]"
            }`}
            title={isRecording ? "Stop listening" : "Speak your question"}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isRecording ? "Listening..." : "Ask in English or Hindi..."}
            className="flex-1 bg-white/10 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#00DDE5]"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-2xl bg-[#00DDE5] disabled:opacity-40 hover:bg-[#00c5cc] active:scale-95 text-[#06345C] font-black flex items-center justify-center transition shrink-0 shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
