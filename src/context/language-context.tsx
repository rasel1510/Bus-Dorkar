"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Language, translations, TranslationKey } from "@/lib/i18n/translations";
import {
  toBanglaDigits,
  formatLocalizedNumber,
  formatLocalizedCurrency,
  formatLocalizedTime,
  formatLocalizedDistance,
  formatLocalizedDuration,
} from "@/lib/i18n/number-converter";
import { divisions } from "@/lib/data/districts";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey | string, defaultText?: string) => string;
  tNum: (num: number | string | undefined | null) => string;
  tCurrency: (amount: number | string | undefined | null) => string;
  tTime: (timeStr: string | undefined | null) => string;
  tDistance: (distanceKm: number | string) => string;
  tDuration: (durationStr: string | undefined | null) => string;
  tDistrict: (districtIdOrName: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "bus_dorkar_language";

// Create lookup map for district English & Bangla names
const districtMapBn: Record<string, string> = {};
const districtMapEn: Record<string, string> = {};
divisions.forEach((div) => {
  div.districts.forEach((d) => {
    districtMapBn[d.id.toLowerCase()] = d.nameBn;
    districtMapBn[d.name.toLowerCase()] = d.nameBn;
    districtMapEn[d.id.toLowerCase()] = d.name;
    districtMapEn[d.name.toLowerCase()] = d.name;
  });
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang === "en" || savedLang === "bn") {
        setLanguageState(savedLang);
      }
    } catch {
      // Ignore localStorage errors (e.g. incognito/SSR)
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // Ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "bn" : "en");
  }, [language, setLanguage]);

  const t = useCallback(
    (key: TranslationKey | string, defaultText?: string): string => {
      const langDict = translations[language] as Record<string, string>;
      if (langDict && langDict[key]) {
        return langDict[key];
      }
      // Fallback to English dictionary
      const enDict = translations.en as Record<string, string>;
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      return defaultText || key;
    },
    [language]
  );

  const tNum = useCallback(
    (num: number | string | undefined | null): string => {
      return formatLocalizedNumber(num, language);
    },
    [language]
  );

  const tCurrency = useCallback(
    (amount: number | string | undefined | null): string => {
      return formatLocalizedCurrency(amount, language);
    },
    [language]
  );

  const tTime = useCallback(
    (timeStr: string | undefined | null): string => {
      return formatLocalizedTime(timeStr, language);
    },
    [language]
  );

  const tDistance = useCallback(
    (distanceKm: number | string): string => {
      return formatLocalizedDistance(distanceKm, language);
    },
    [language]
  );

  const tDuration = useCallback(
    (durationStr: string | undefined | null): string => {
      return formatLocalizedDuration(durationStr, language);
    },
    [language]
  );

  const tDistrict = useCallback(
    (districtIdOrName: string): string => {
      if (!districtIdOrName) return "";
      const key = districtIdOrName.trim().toLowerCase();
      if (language === "en") {
        return districtMapEn[key] || districtIdOrName;
      }
      return districtMapBn[key] || districtIdOrName;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        tNum,
        tCurrency,
        tTime,
        tDistance,
        tDuration,
        tDistrict,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
