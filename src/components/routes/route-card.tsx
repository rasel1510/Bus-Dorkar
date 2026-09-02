"use client";

import Link from "next/link";
import { useState } from "react";
import { BusRoute } from "@/lib/data/routes-data";
import {
  Clock,
  Navigation,
  ArrowRight,
  Building2,
  Bookmark,
  Sparkles,
  MapPin,
  Bus,
  Layers,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";

interface RouteCardProps {
  route: BusRoute;
  onSelectRoute: (route: BusRoute) => void;
  isSaved?: boolean;
  onToggleSave?: (routeId: string) => void;
}

export function RouteCard({
  route,
  onSelectRoute,
  isSaved = false,
  onToggleSave,
}: RouteCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const { language, t, tNum, tCurrency, tDuration, tDistance } = useLanguage();

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSaved = !saved;
    setSaved(newSaved);
    if (onToggleSave) {
      onToggleSave(route.id);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Top Corridor Badge & Bookmark */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant="outline"
              className="bg-slate-50 text-slate-700 border-slate-200 font-mono text-[11px] font-semibold px-2 py-0.5"
            >
              {route.corridorType}
            </Badge>
            {route.isPopular && (
              <Badge className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold px-2 py-0.5">
                <Sparkles className="h-2.5 w-2.5 mr-1 text-teal-600" />
                {language === "bn" ? "জনপ্রিয়" : "Popular"}
              </Badge>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleBookmark}
            title={saved ? "Remove from saved" : "Save route"}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              saved
                ? "bg-teal-50 border-teal-200 text-teal-700"
                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-teal-600 hover:bg-slate-100"
            }`}
          >
            <Bookmark
              className={`h-4 w-4 ${saved ? "fill-teal-600 text-teal-600" : ""}`}
            />
          </button>
        </div>

        {/* Origin -> Destination Section */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight block truncate">
                {language === "bn" ? route.fromNameBn : route.fromName}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block truncate">
                {language === "bn" ? `${route.fromName} • ${route.fromDivision}` : `${route.fromNameBn} • ${route.fromDivision}`}
              </span>
            </div>

            <div className="flex flex-col items-center shrink-0 px-2">
              <span className="text-[10px] font-mono text-slate-600 font-bold mb-0.5">
                {tDistance(route.distanceKm)}
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <div className="w-8 sm:w-12 h-0.5 bg-teal-200" />
                <ArrowRight className="h-3.5 w-3.5 text-teal-600 -ml-1" />
              </div>
              <span className="text-[10px] font-mono text-teal-700 font-bold mt-0.5 flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5" /> {tDuration(route.duration)}
              </span>
            </div>

            <div className="min-w-0 text-right">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight block truncate">
                {language === "bn" ? route.toNameBn : route.toName}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block truncate">
                {language === "bn" ? `${route.toName} • ${route.toDivision}` : `${route.toNameBn} • ${route.toDivision}`}
              </span>
            </div>
          </div>
        </div>

        {/* Highway Tag & Stops Breakdown */}
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
            <span className="truncate max-w-[200px] text-slate-500">
              {route.highway}
            </span>
            <span className="font-mono text-teal-700 font-bold shrink-0">
              {tNum(route.stops.length)} {language === "bn" ? "টি স্টপ" : "Stops"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Layers className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">
              {language === "bn"
                ? `ভায়া ${route.stops.slice(1, -1).map((s) => s.nameBn.split(" ")[0]).join(" → ") || "ডিরেক্ট এক্সপ্রেস"}`
                : `via ${route.stops.slice(1, -1).map((s) => s.name.split(" ")[0]).join(" → ") || "Direct Express"}`}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Operators, Fare & Actions */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-mono text-slate-600 font-bold block">
            {t("starting_from")}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-emerald-700 font-mono">
              {tCurrency(route.startingFareBDT)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {language === "bn" ? "/ সিট" : "/ seat"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSelectRoute(route)}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200 rounded-xl h-9 px-3 cursor-pointer"
          >
            {language === "bn" ? "স্টপ ও তথ্য" : "Stops & Info"}
          </Button>

          <Link href={`/search?from=${route.fromId}&to=${route.toId}`}>
            <Button className="gradient-teal text-white font-extrabold text-xs rounded-xl h-9 px-3.5 shadow-xs hover:opacity-95 cursor-pointer flex items-center gap-1">
              {t("view_buses")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
