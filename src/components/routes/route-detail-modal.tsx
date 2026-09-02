"use client";

import Link from "next/link";
import { BusRoute } from "@/lib/data/routes-data";
import {
  MapPin,
  Clock,
  Navigation,
  ArrowRight,
  Building2,
  Sparkles,
  ShieldCheck,
  Compass,
  Bus,
  ExternalLink,
  Milestone,
  CheckCircle2,
  Calendar,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/language-context";

interface RouteDetailModalProps {
  route: BusRoute | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RouteDetailModal({
  route,
  open,
  onOpenChange,
}: RouteDetailModalProps) {
  const { language, t, tNum, tCurrency, tDistance, tDuration } = useLanguage();

  if (!route) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-white border border-slate-200 rounded-2xl shadow-2xl">
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-6 rounded-t-2xl relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-mono">
                {route.corridorType}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                {route.highway}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>{language === "bn" ? route.fromNameBn : route.fromName}</span>
                <ArrowRight className="h-5 w-5 text-teal-400 shrink-0" />
                <span>{language === "bn" ? route.toNameBn : route.toName}</span>
              </h2>
              <p className="text-xs text-slate-300 font-medium mt-1">
                {language === "bn"
                  ? `${route.fromNameBn} থেকে ${route.toNameBn} — ${route.fromDivision} থেকে ${route.toDivision} বিভাগ`
                  : `${route.fromName} to ${route.toName} — ${route.fromDivision} to ${route.toDivision} Division`}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-slate-800 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block uppercase">{t("distance")}</span>
              <span className="text-xs sm:text-sm font-bold text-white">{tDistance(route.distanceKm)}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block uppercase">{t("est_duration")}</span>
              <span className="text-xs sm:text-sm font-bold text-white">{tDuration(route.duration)}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block uppercase">{t("daily_trips")}</span>
              <span className="text-xs sm:text-sm font-bold text-teal-400">{tNum(route.dailyTrips)}+</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block uppercase">{t("starting_from")}</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400">{tCurrency(route.startingFareBDT)}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Route Overview Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {language === "bn" ? "রুটের বিবরণ" : "Route Overview"}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              {route.description}
            </p>
          </div>

          {/* Key Route Highlights */}
          {route.keyHighlights && route.keyHighlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                {language === "bn" ? "প্রধান হাইওয়ে হাইলাইটস ও ল্যান্ডমার্ক" : "Key Highway Highlights & Landmarks"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {route.keyHighlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stop-by-Stop Sequential Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {language === "bn"
                  ? `যাত্রাবিরতি ও বোর্ডিং পয়েন্ট (${tNum(route.stops.length)} টি স্টপ)`
                  : `Intermediate Stops & Boarding Points (${route.stops.length} Stops)`}
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {t("distance")}: {tDistance(route.distanceKm)}
              </span>
            </div>

            <div className="space-y-0 relative before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {route.stops.map((stop, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === route.stops.length - 1;

                return (
                  <div
                    key={idx}
                    className="relative flex items-start gap-3.5 py-2.5 group"
                  >
                    {/* Node Dot */}
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 font-mono text-xs font-bold transition-transform group-hover:scale-110 shadow-xs ${
                        isFirst
                          ? "bg-teal-600 text-white ring-4 ring-teal-100"
                          : isLast
                          ? "bg-slate-900 text-white ring-4 ring-slate-100"
                          : stop.isMajorTerminal
                          ? "bg-teal-100 text-teal-800 border border-teal-300"
                          : "bg-white text-slate-500 border border-slate-300"
                      }`}
                    >
                      {isFirst ? "A" : isLast ? "B" : idx + 1}
                    </div>

                    {/* Stop Info Card */}
                    <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 group-hover:border-teal-300 group-hover:shadow-xs transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                              {language === "bn" ? stop.nameBn : stop.name}
                            </span>
                            {stop.isMajorTerminal && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-slate-100 text-slate-700 border-slate-200">
                                {language === "bn" ? "প্রধান টার্মিনাল" : "Major Terminal"}
                              </Badge>
                            )}
                          </div>
                          {language === "bn" && (
                            <p className="text-[11px] text-slate-500 font-medium">
                              {stop.name}
                            </p>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                          +{tDistance(stop.kmFromOrigin)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operating Bus Companies */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              {language === "bn"
                ? `এই রুটের ভেরিফাইড অপারেটর (${tNum(route.operators.length)} টি)`
                : `Verified Operators Serving This Route (${route.operators.length})`}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {route.operators.map((operator) => (
                <div
                  key={operator.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-teal-600/10 text-teal-700 flex items-center justify-center font-bold text-xs">
                      <Bus className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{operator.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-amber-600 flex items-center">
                          ★ {tNum(operator.rating)}
                        </span>
                        <span className="text-slate-300 text-[10px]">•</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {operator.types.map((t) => t.replace("_", " ")).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-500 block">
              {language === "bn" ? "এই করিডোরের ভাড়া" : "Fares on this corridor"}
            </span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              {tCurrency(route.startingFareBDT)} - {tCurrency(route.maxFareBDT)} {language === "bn" ? "/ সিট" : "/ seat"}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs font-semibold text-slate-700 rounded-xl h-10 px-4 cursor-pointer"
            >
              {language === "bn" ? "বন্ধ করুন" : "Close"}
            </Button>
            <Link
              href={`/search?from=${route.fromId}&to=${route.toId}`}
              className="flex-1 sm:flex-initial"
            >
              <Button className="w-full sm:w-auto gradient-teal text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-md shadow-teal-600/20 hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5">
                <Bus className="h-4 w-4" />
                {t("view_buses")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
