"use client";

import { ArrowUpDown } from "lucide-react";
import { OPERATOR_PROFILES } from "@/lib/data/buses";

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
  operatorFilter,
  setOperatorFilter,
  sortBy,
  setSortBy,
  totalResults,
}: SearchFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Time & Type Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {[
            { id: "all", label: "All Times" },
            { id: "morning", label: "Morning" },
            { id: "afternoon", label: "Afternoon" },
            { id: "night", label: "Night" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeFilter(t.id)}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                timeFilter === t.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {[
            { id: "all", label: "All Buses" },
            { id: "ac", label: "AC" },
            { id: "non-ac", label: "Non-AC" },
            { id: "sleeper", label: "Sleeper" },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBusTypeFilter(b.id)}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                busTypeFilter === b.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Results Count & Sort Dropdown */}
      <div className="flex items-center gap-3">
        <span className="font-bold text-slate-700 hidden sm:inline">
          {totalResults} buses found
        </span>

        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3.5 w-3.5 text-teal-600 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 font-bold px-2.5 py-1.5 rounded-lg text-xs focus:border-teal-600 cursor-pointer"
          >
            <option value="earliest">Earliest</option>
            <option value="fare-low">Cheapest</option>
            <option value="fare-high">Highest Fare</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
