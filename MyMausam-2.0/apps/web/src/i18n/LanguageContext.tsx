"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

// ── Lazy-load all translation JSONs ──────────────────────────────────────────
const translationModules: Record<string, () => Promise<Record<string, string>>> = {
  en: () => import("./translations/en.json").then((m) => m.default),
  hi: () => import("./translations/hi.json").then((m) => m.default),
  bn: () => import("./translations/bn.json").then((m) => m.default),
  te: () => import("./translations/te.json").then((m) => m.default),
  mr: () => import("./translations/mr.json").then((m) => m.default),
  ta: () => import("./translations/ta.json").then((m) => m.default),
  gu: () => import("./translations/gu.json").then((m) => m.default),
  kn: () => import("./translations/kn.json").then((m) => m.default),
  ml: () => import("./translations/ml.json").then((m) => m.default),
  pa: () => import("./translations/pa.json").then((m) => m.default),
  or: () => import("./translations/or.json").then((m) => m.default),
  ur: () => import("./translations/ur.json").then((m) => m.default),
};

const STORAGE_KEY = "mausam_locale";
const DEFAULT_LOCALE = "en";

// ── Context shape ─────────────────────────────────────────────────────────────
interface LanguageContextType {
  locale: string;
  setLocale: (code: string) => void;
  /** Translate a key, falling back to English string or the key itself */
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (k) => k,
  isLoading: false,
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(DEFAULT_LOCALE);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [enFallback, setEnFallback] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load English fallback once on mount
  useEffect(() => {
    translationModules["en"]().then(setEnFallback);
  }, []);

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const saved = typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY)
      : null;
    if (saved && translationModules[saved]) {
      loadLocale(saved);
    } else {
      loadLocale(DEFAULT_LOCALE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLocale = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      const loader = translationModules[code];
      if (!loader) throw new Error(`No translations for ${code}`);
      const data = await loader();
      setTranslations(data);
      setLocaleState(code);

      // Persist
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, code);
      }

      // Update <html> attributes for accessibility & RTL
      const lang = SUPPORTED_LANGUAGES.find((l: { code: string }) => l.code === code);
      if (typeof document !== "undefined") {
        document.documentElement.lang = code;
        document.documentElement.dir = lang?.dir ?? "ltr";
      }
    } catch (e) {
      console.error("Language load error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLocale = useCallback(
    (code: string) => {
      if (code !== locale) loadLocale(code);
    },
    [locale, loadLocale]
  );

  /** Translate key → current language, fall back to English, fall back to key */
  const t = useCallback(
    (key: string): string =>
      translations[key] ?? enFallback[key] ?? key,
    [translations, enFallback]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
