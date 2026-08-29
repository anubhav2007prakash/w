"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export interface CountryCode {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dial: string; // e.g. "+91"
  flag: string; // emoji flag
}

// Popular countries first, then alphabetical
export const COUNTRIES: CountryCode[] = [
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { code: "RU", name: "Russia", dial: "+7", flag: "🇷🇺" },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰" },
  { code: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵" },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳" },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { code: "IL", name: "Israel", dial: "+972", flag: "🇮🇱" },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
];

interface CountryCodePickerProps {
  value: string; // dial code e.g. "+91"
  onChange: (dialCode: string, country: CountryCode) => void;
  disabled?: boolean;
}

export const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedCountry =
    COUNTRIES.find((c) => c.dial === value) || COUNTRIES[0]; // Default to India

  // Filter countries by name or dial code
  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearch("");
          }
        }}
        disabled={disabled}
        className={`flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-l-xl px-2.5 py-2.5 text-xs text-white transition shrink-0 h-full ${
          disabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-white/15 cursor-pointer"
        } ${isOpen ? "border-[#00DDE5]" : ""}`}
      >
        <span className="text-sm leading-none">{selectedCountry.flag}</span>
        <span className="font-mono font-bold text-[11px]">{selectedCountry.dial}</span>
        <ChevronDown
          className={`w-3 h-3 text-white/50 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-[#0a2a44] border border-white/20 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-scale-up">
          {/* Search input */}
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl pl-8 pr-7 py-1.5 text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-2 text-white/40 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Country list */}
          <div className="max-h-52 overflow-y-auto scrollbar-thin p-1">
            {filtered.length === 0 ? (
              <p className="text-center text-[10px] text-white/40 py-4">
                No countries found
              </p>
            ) : (
              filtered.map((country) => {
                const isSelected = country.dial === value;
                return (
                  <button
                    key={country.code + country.dial}
                    type="button"
                    onClick={() => {
                      onChange(country.dial, country);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition text-[11px] ${
                      isSelected
                        ? "bg-[#0055A6]/40 text-white"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-base leading-none shrink-0">
                      {country.flag}
                    </span>
                    <span className="flex-1 truncate font-medium">{country.name}</span>
                    <span className="font-mono font-bold text-white/60 text-[10px] shrink-0">
                      {country.dial}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00DDE5] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
