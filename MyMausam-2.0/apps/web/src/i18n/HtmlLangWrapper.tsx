"use client";

/**
 * HtmlLangWrapper
 *
 * A thin client component that reads the current locale from LanguageContext
 * and synchronises the <html lang> and <html dir> attributes.
 *
 * Why this exists: layout.tsx is a Server Component so it cannot read client
 * context directly. This wrapper lives inside <LanguageProvider> in the body
 * and handles the DOM mutation side-effect.
 *
 * Renders nothing — purely a side-effect component.
 */

import { useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

export function HtmlLangWrapper() {
  const { locale } = useLanguage();

  useEffect(() => {
    const lang = SUPPORTED_LANGUAGES.find((l: { code: string }) => l.code === locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = lang?.dir ?? "ltr";
  }, [locale]);

  return null;
}
