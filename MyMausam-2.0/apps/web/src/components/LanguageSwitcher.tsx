"use client";

import React, { useState, useMemo } from "react";
import { X, Check, Search, Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import { useLanguage } from "@/i18n/LanguageContext";

interface LanguageSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isOpen,
  onClose,
}) => {
  const { locale, setLocale } = useLanguage();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      SUPPORTED_LANGUAGES.filter(
        (l: { name: string; nativeName: string }) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.nativeName.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const handleSelect = (code: string) => {
    setLocale(code);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Select Language"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[70] w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[80vh] animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0055A6]/10 text-[#0055A6]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">Select Language</h2>
              <p className="text-[11px] text-gray-500">भाषा चुनें • ভাষা • மொழி</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close language switcher"
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search language..."
              className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 flex-1"
              autoFocus
            />
          </div>
        </div>

        {/* Language grid */}
        <div
          role="radiogroup"
          aria-label="Languages"
          className="overflow-y-auto flex-1 p-4 grid grid-cols-2 gap-2"
        >
          {filtered.map((lang) => {
            const isActive = locale === lang.code;
            return (
              <button
                key={lang.code}
                role="radio"
                aria-checked={isActive}
                onClick={() => handleSelect(lang.code)}
                dir={lang.dir ?? "ltr"}
                className={`flex items-center justify-between gap-2 px-3 py-3 rounded-2xl border transition text-left ${
                  isActive
                    ? "bg-[#0055A6] border-[#0055A6] text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-800 hover:bg-blue-50 hover:border-blue-200"
                }`}
              >
                <div className="min-w-0">
                  <span
                    className={`text-[13px] font-bold block truncate ${
                      isActive ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {lang.nativeName}
                  </span>
                  <span
                    className={`text-[10px] block truncate ${
                      isActive ? "text-blue-200" : "text-gray-500"
                    }`}
                  >
                    {lang.name}
                  </span>
                </div>
                {isActive && (
                  <Check className="w-4 h-4 text-white shrink-0" />
                )}
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-400 text-sm">
              No languages found
            </div>
          )}
        </div>

        {/* Footer safe area */}
        <div className="h-safe-bottom pb-4" />
      </div>
    </>
  );
};
