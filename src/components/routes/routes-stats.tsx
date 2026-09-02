"use client";

import { MapPin, Route, Building2, Calendar, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function RoutesStats() {
  const { language, tNum } = useLanguage();

  const stats = [
    {
      labelEn: "Inter-District Corridors",
      labelBn: "আন্তঃজেলা করিডোর",
      value: "500+",
      subtextEn: "Across 64 Districts",
      subtextBn: "৬৪টি জেলা জুড়ে",
      icon: Route,
    },
    {
      labelEn: "Divisional Networks",
      labelBn: "বিভাগীয় নেটওয়ার্ক",
      value: "8 Divisions",
      valueBn: "৮টি বিভাগ",
      subtextEn: "All-Region Coverage",
      subtextBn: "সমগ্র বাংলাদেশ জুড়ে",
      icon: MapPin,
    },
    {
      labelEn: "Registered Bus Operators",
      labelBn: "নিবন্ধিত বাস অপারেটর",
      value: "420+",
      subtextEn: "Verified & GPS Monitored",
      subtextBn: "ভেরিফাইড ও জিপিএস ট্র্যাকড",
      icon: Building2,
    },
    {
      labelEn: "Daily Departures",
      labelBn: "দৈনিক বাস ট্রিপ",
      value: "45,000+",
      subtextEn: "24/7 Timetable Schedule",
      subtextBn: "২৪/৭ সময়সূচী চালিত",
      icon: Zap,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const displayValue =
          language === "bn"
            ? (stat.valueBn || tNum(stat.value))
            : stat.value;

        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs"
          >
            <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-teal-700">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                {displayValue}
              </p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">
                {language === "bn" ? stat.labelBn : stat.labelEn}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                {language === "bn" ? stat.subtextBn : stat.subtextEn}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
