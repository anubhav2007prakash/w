import type { Metadata, Viewport } from "next";
import { Roboto, Outfit } from "next/font/google";
import "./globals.css";
import { WeatherProvider } from "@/context/WeatherContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { HtmlLangWrapper } from "@/i18n/HtmlLangWrapper";
import { SideDrawer } from "@/components/SideDrawer";
import { LocationSearchModal } from "@/components/LocationSearchModal";
import { AuthModal } from "@/components/AuthModal";
import { BottomNav } from "@/components/BottomNav";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { PersonalizationProvider } from "@/context/PersonalizationContext";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0055A6",
};

export const metadata: Metadata = {
  title: "IMD Mausam 2.0 • Ministry of Earth Sciences",
  description: "Official National Weather Portal with AI Personalization, Radar, Agromet & Severe Alerts",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${outfit.variable} antialiased`}>
      <body className="min-h-screen bg-[#021a32] text-white flex justify-center selection:bg-[#00DDE5] selection:text-black">
        {/* Ambient atmospheric backdrop blooms */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0055A6]/25 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#00DDE5]/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-[#FFBE00]/10 rounded-full blur-3xl" />
        </div>

        <ServiceWorkerRegistration />
        <AuthProvider>
          <PersonalizationProvider>
            <LanguageProvider>
              <HtmlLangWrapper />
              <WeatherProvider>
              {/* Main App Container */}
              <div className="relative z-10 w-full max-w-[480px] min-h-screen shadow-2xl bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] flex flex-col">
                <ViewModeToggle />
                <div className="flex-1 pb-16">{children}</div>
                <BottomNav />
                <SideDrawer />
                <LocationSearchModal />
                <AuthModal />
                <OfflineIndicator />
              </div>
              </WeatherProvider>
            </LanguageProvider>
          </PersonalizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
