"use client";

import { ArrowUpDown } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface SearchFiltersProps {
  timeFilter: string;
  setTimeFilter: (val: string) => void;
  busTypeFilter: string;
  setBusTypeFilter: (val: string) => void;
  operatorFilter: string;
  setOperatorFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  totalResults: number;
}

export function SearchFilters({
  timeFilter,
  setTimeFilter,
  busTypeFilter,
  setBusTypeFilter,
  sortBy,
  setSortBy,
  totalResults,
}: SearchFiltersProps) {
  const { language, t, tNum } = useLanguage();

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
      {/* Time & Type Filter Chips (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto">
        {/* Time Chips */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          {[
            { id: "all", labelEn: "All Times", labelBn: "সব সময়" },
            { id: "morning", labelEn: "Morning", labelBn: "সকাল" },
            { id: "afternoon", labelEn: "Afternoon", labelBn: "দুপুর" },
            { id: "night", labelEn: "Night", labelBn: "রাত" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTimeFilter(item.id)}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-all cursor-pointer shrink-0 ${
                timeFilter === item.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {language === "bn" ? item.labelBn : item.labelEn}
            </button>
          ))}
        </div>

        {/* Bus Type Chips */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          {[
            { id: "all", labelEn: "All Buses", labelBn: "সব বাস" },
            { id: "ac", labelEn: "AC", labelBn: "এসি" },
            { id: "non-ac", labelEn: "Non-AC", labelBn: "নন-এসি" },
            { id: "sleeper", labelEn: "Sleeper", labelBn: "স্লিপার" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setBusTypeFilter(item.id)}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-all cursor-pointer shrink-0 ${
                busTypeFilter === item.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {language === "bn" ? item.labelBn : item.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Results Count & Sort Dropdown */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <span className="font-bold text-slate-700 text-xs">
          {language === "bn"
            ? `${tNum(totalResults)} টি বাস পাওয়া গেছে`
            : `${totalResults} ${totalResults === 1 ? "bus" : "buses"} found`}
        </span>

        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3.5 w-3.5 text-teal-600 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 font-bold px-2.5 py-1.5 rounded-lg text-xs focus:border-teal-600 cursor-pointer"
          >
            <option value="earliest">{t("sort_earliest")}</option>
            <option value="fare-low">{t("sort_cheapest")}</option>
            <option value="fare-high">{language === "bn" ? "সর্বোচ্চ ভাড়া" : "Highest Fare"}</option>
            <option value="rating">{t("sort_rating")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
