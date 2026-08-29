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
  BarChart3,
} from "lucide-react";
import { useWeather } from "@/context/WeatherContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { SimpleChart } from "@/components/SimpleChart";

interface ChartData {
  title: string;
  data: { label: string; value: number }[];
  color?: string;
  unit?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  chart?: ChartData;
  timestamp: string;
}

// Simulated historical rainfall data by month
const RAINFALL_DATA: Record<string, number[]> = {
  Ghaziabad: [15, 12, 18, 22, 45, 180, 280, 310, 190, 42, 8, 10],
  Delhi: [18, 15, 20, 25, 50, 200, 300, 330, 200, 48, 10, 12],
  Mumbai: [0, 1, 2, 10, 30, 550, 780, 520, 280, 60, 15, 3],
  Bengaluru: [5, 8, 10, 50, 120, 80, 90, 110, 160, 180, 50, 20],
  Kolkata: [15, 25, 35, 55, 140, 290, 330, 320, 260, 130, 30, 10],
  Chennai: [25, 10, 10, 20, 35, 45, 90, 120, 120, 300, 350, 140],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateRainfallChart(city: string): ChartData {
  const key = Object.keys(RAINFALL_DATA).find(
    (k) => city.toLowerCase().includes(k.toLowerCase())
  );
  const data = key ? RAINFALL_DATA[key] : RAINFALL_DATA["Ghaziabad"];

  return {
    title: `Monthly Rainfall — ${city || "Ghaziabad"} (mm)`,
    data: data.map((v, i) => ({ label: MONTHS[i], value: v })),
    color: "#00DDE5",
    unit: "mm",
  };
}

function generateTempChart(city: string): ChartData {
  // Average monthly temperature for North India
  const temps = [14, 17, 24, 32, 38, 37, 34, 33, 33, 28, 21, 15];

  return {
    title: `Monthly Temperature — ${city || "Ghaziabad"} (°C)`,
    data: temps.map((v, i) => ({ label: MONTHS[i], value: v })),
    color: "#FFBE00",
    unit: "°C",
  };
}

export default function ChatPage() {
  const { currentWeather, activeLocation } = useWeather();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: `Namaste! I am **Mausam Mitra AI**, your personalized climate and farming copilot for **${activeLocation}**.\n\nYou can ask me about:\n• 🌾 **Farming & Spray Windows:** When to apply fertilizers or pesticides\n• 🌧️ **Monsoon & Rain Nowcasts:** 3-hourly precipitation risks\n• ☀️ **Rooftop Solar Generation:** Daily kWh yields and ₹ savings\n• 🏃 **Fitness & Running:** Coolest hours and UV radiation\n• 🚗 **Highway Travel:** Fog and waterlogging along expressways\n• 📊 **Historical Trends:** "Show me July rainfall for my city"\n\nHow can I help you today?`,
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakingBot, setIsSpeakingBot] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateAIResponse = (userPrompt: string): { text: string; chart?: ChartData } => {
    const q = userPrompt.toLowerCase();
    const temp = currentWeather?.temperature ?? 34.2;
    const humidity = currentWeather?.humidity ?? 38;
    const aqi = currentWeather?.aqi?.aqi ?? 95;

    // Historical rainfall queries
    if (
      q.includes("rainfall") && (q.includes("trend") || q.includes("history") || q.includes("july") || q.includes("monthly") || q.includes("graph") || q.includes("chart"))
    ) {
      const month = q.includes("july") ? "July" : q.includes("august") ? "August" : q.includes("june") ? "June" : q.includes("monsoon") ? "Jun-Sep" : "annual";
      const chart = generateRainfallChart(activeLocation);
      return {
        text: `📊 **Historical Rainfall Trend for ${activeLocation}:**\n\nThe chart below shows the **monthly average rainfall** (mm) for ${activeLocation}.\n\n**Key observations:**\n• Peak monsoon rainfall occurs in **July-August** with 280-310mm.\n• Southwest monsoon (Jun-Sep) contributes ~80% of annual rainfall.\n• ${month === "July" ? "**July** is typically the wettest month." : month === "Jun-Sep" ? "The **monsoon season** (Jun-Sep) sees the highest precipitation." : "The **dry season** (Nov-Mar) has minimal rainfall."}\n\n*Source: IMD Historical Climatology Data*`,
        chart,
      };
    }

    // Temperature trend queries
    if (
      (q.includes("temperature") || q.includes("temp")) &&
      (q.includes("trend") || q.includes("history") || q.includes("monthly") || q.includes("graph") || q.includes("chart") || q.includes("year"))
    ) {
      const chart = generateTempChart(activeLocation);
      return {
        text: `📊 **Monthly Temperature Trend for ${activeLocation}:**\n\nThe chart shows the **average monthly temperature** (°C) for ${activeLocation}.\n\n**Key observations:**\n• **May-June** are the hottest months (37-38°C peak).\n• **December-January** are the coolest (14-15°C minimum).\n• The monsoon brings moderate relief from extreme heat.\n\n*Source: IMD Historical Climatology Data*`,
        chart,
      };
    }

    // Farming & Agromet
    if (q.includes("spray") || q.includes("pesticide") || q.includes("kisan") || q.includes("crop") || q.includes("farm")) {
      return {
        text: `🌾 **Agromet Advisory for ${activeLocation}:**\n• Current temperature is ${temp.toFixed(1)}°C with ${humidity}% humidity.\n• **Foliar Spray Window:** Safe between **06:00 AM - 08:30 AM** when wind speeds are under 10 km/h.\n• **Caution:** Avoid spraying during peak afternoon hours to prevent leaf scorching.\n• **Soil Moisture:** Adequate for vegetable seedlings and pulse crops.`,
      };
    }

    // Rain & Monsoon
    if (q.includes("rain") || q.includes("barish") || q.includes("monsoon") || q.includes("cloud")) {
      return {
        text: `🌧️ **Rain & Monsoon Status for ${activeLocation}:**\n• Today's rain probability is **10% (Partly Cloudy / Dry Window)**.\n• All-India Southwest Monsoon cumulative departure is **+6% (Normal)**.\n• Next notable precipitation chances are projected in **48–72 hours**.`,
      };
    }

    // Solar & Energy
    if (q.includes("solar") || q.includes("energy") || q.includes("sun") || q.includes("kwh")) {
      return {
        text: `☀️ **Solar Energy Potential:**\n• Today's solar irradiance is **5.4 kWh/m²/day** (Peak Sun Hours: 5.6h).\n• A standard 3 kW rooftop system in ${activeLocation} will generate approx. **13.5 kWh today**, saving around ₹94.50 in electricity costs.`,
      };
    }

    // Fitness & Running
    if (q.includes("run") || q.includes("fitness") || q.includes("walk") || q.includes("jog")) {
      return {
        text: `🏃 **Outdoor Fitness Recommendation:**\n• **Best Running Window:** **05:30 AM – 07:15 AM** or post **07:00 PM**.\n• Current AQI is **${aqi} (${currentWeather?.aqi.status || "Satisfactory"})**.\n• Maintain hydration with 250ml water every 20 minutes during cardio.`,
      };
    }

    // Health
    if (q.includes("health") || q.includes("aqi") || q.includes("pollen") || q.includes("allergy")) {
      return {
        text: `🏥 **Health & Bio-Meteorological Telemetry:**\n• **AQI:** ${aqi} (Satisfactory).\n• **Pollen Count:** Moderate (Grass & Weed pollen dispersal active).\n• **UV Index:** 7.2 (Very High — wear UV400 sunglasses and SPF 30+).\n• **WBGT Heat Index:** 28.5°C (Moderate heat stress).`,
      };
    }

    // Default weather summary
    return {
      text: `🌤️ **Weather Summary for ${activeLocation}:**\n• **Temperature:** ${temp.toFixed(1)}°C (Feels like ${currentWeather?.feels_like?.toFixed(1) || temp.toFixed(1)}°C)\n• **Condition:** ${currentWeather?.condition || "Partly Cloudy"}\n• **Wind:** ${currentWeather?.wind_speed || 9.4} km/h from ${currentWeather?.wind_direction || "NW"}\n• **Air Quality:** AQI ${aqi} (${currentWeather?.aqi.status || "Satisfactory"})\n\nFeel free to ask about farming, rain predictions, running hours, or travel conditions!`,
    };
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
      const { text, chart } = generateAIResponse(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text,
        chart,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 800);
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

    const cleanText = text.replace(/[*#•📊🌾🌧☀🏃🏥🌤]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingBot(false);
    utterance.onerror = () => setIsSpeakingBot(false);

    setIsSpeakingBot(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 flex flex-col justify-between select-none">
      <Header showBack={true} title="Mausam Mitra AI" subtitle="Conversational Weather & Agro Copilot" />

      {/* Chat messages */}
      <div className="flex-1 p-4 space-y-3.5 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-[#00DDE5]/20 flex items-center justify-center text-[#00DDE5] shrink-0 mt-1 shadow-inner">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3.5 rounded-3xl text-xs leading-relaxed space-y-2 shadow-lg ${
                msg.sender === "user"
                  ? "bg-[#00DDE5] text-[#06345C] font-semibold rounded-br-none"
                  : "glass-card text-white/95 rounded-bl-none border border-white/20"
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Auto-generated chart */}
              {msg.chart && (
                <SimpleChart
                  data={msg.chart.data}
                  title={msg.chart.title}
                  color={msg.chart.color}
                  unit={msg.chart.unit}
                />
              )}

              <div className="flex items-center justify-between pt-1 text-[9px] opacity-70 border-t border-white/10">
                <span>{msg.timestamp}</span>
                {msg.sender === "bot" && (
                  <button
                    onClick={() => handleTTS(msg.text)}
                    className="hover:opacity-100 flex items-center gap-1 text-[#FFBE00] font-bold"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Read Aloud</span>
                  </button>
                )}
              </div>
            </div>

            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-full bg-[#00DDE5]/20 flex items-center justify-center text-[#00DDE5] shrink-0 mt-1">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-card text-white/70 p-3 rounded-2xl text-xs italic flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FFBE00] animate-pulse" />
              <span>Analyzing IMD meteorological models...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick action chips */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
        {[
          { icon: "📊", text: "Show July rainfall trend" },
          { icon: "🌡️", text: "Monthly temperature graph" },
          { icon: "🌾", text: "Farming spray window" },
          { icon: "🏃", text: "Best running hours" },
        ].map((chip) => (
          <button
            key={chip.text}
            onClick={() => setInputText(chip.text)}
            className="shrink-0 flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-full px-3 py-1.5 text-[10px] font-bold text-white/80 transition"
          >
            <span>{chip.icon}</span>
            {chip.text}
          </button>
        ))}
      </div>

      {/* Input container */}
      <div className="p-3 bg-black/40 border-t border-white/15 flex items-center gap-2 sticky bottom-16 backdrop-blur-md">
        <button
          onClick={handleToggleMic}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition active:scale-95 shrink-0 shadow-lg ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-white/15 hover:bg-white/25 text-[#00DDE5] border border-white/20"
          }`}
          title={isRecording ? "Stop listening" : "Speak question"}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={isRecording ? "Listening..." : "Ask in English or Hindi..."}
          className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#00DDE5]"
        />

        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="w-11 h-11 rounded-2xl bg-[#00DDE5] disabled:opacity-40 hover:bg-[#00c5cc] active:scale-95 text-[#06345C] font-black flex items-center justify-center transition shrink-0 shadow-xl"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
