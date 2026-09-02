"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BANGLADESH_ROUTES, BusRoute } from "@/lib/data/routes-data";
import { RouteCard } from "@/components/routes/route-card";
import { RouteDetailModal } from "@/components/routes/route-detail-modal";
import { RoutesStats } from "@/components/routes/routes-stats";
import { RoutesInteractiveMap } from "@/components/routes/routes-interactive-map";
import {
  Search,
  MapPin,
  ArrowRight,
  Filter,
  LayoutGrid,
  List,
  Map as MapIcon,
  Sparkles,
  Layers,
  Clock,
  Building2,
  X,
  Compass,
  ArrowUpDown,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";

const DIVISIONS = [
  { id: "all", name: "All Divisions", nameBn: "সব বিভাগ" },
  { id: "Dhaka", name: "Dhaka", nameBn: "ঢাকা" },
  { id: "Chattogram", name: "Chattogram", nameBn: "চট্টগ্রাম" },
  { id: "Sylhet", name: "Sylhet", nameBn: "সিলেট" },
  { id: "Rajshahi", name: "Rajshahi", nameBn: "রাজশাহী" },
  { id: "Khulna", name: "Khulna", nameBn: "খুলনা" },
  { id: "Barishal", name: "Barishal", nameBn: "বরিশাল" },
  { id: "Rangpur", name: "Rangpur", nameBn: "রংপুর" },
  { id: "Mymensingh", name: "Mymensingh", nameBn: "ময়মনসিংহ" },
];

const CORRIDOR_TYPES = [
  "All",
  "National Express",
  "Coastal Corridor",
  "Northern Trunk",
  "Padma Corridor",
  "Hill Tracts",
  "Sylhet Tea Valley",
  "Cross-Regional",
];

export default function RoutesPage() {
  const { language, t, tNum, tCurrency, tDistance, tDuration } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedCorridor, setSelectedCorridor] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "duration" | "fare-low" | "distance">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "table" | "map">("grid");
  const [selectedRouteForModal, setSelectedRouteForModal] = useState<BusRoute | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filtered & Sorted Routes
  const filteredRoutes = useMemo(() => {
    let result = [...BANGLADESH_ROUTES];

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.fromName.toLowerCase().includes(q) ||
          r.toName.toLowerCase().includes(q) ||
          r.fromNameBn.includes(q) ||
          r.toNameBn.includes(q) ||
          r.highway.toLowerCase().includes(q) ||
          r.corridorType.toLowerCase().includes(q) ||
          r.stops.some((s) => s.name.toLowerCase().includes(q) || s.nameBn.includes(q))
      );
    }

    // Division filter
    if (selectedDivision !== "all") {
      result = result.filter(
        (r) =>
          r.fromDivision.toLowerCase() === selectedDivision.toLowerCase() ||
          r.toDivision.toLowerCase() === selectedDivision.toLowerCase()
      );
    }

    // Corridor filter
    if (selectedCorridor !== "All") {
      result = result.filter((r) => r.corridorType === selectedCorridor);
    }

    // Sorting
    if (sortBy === "popular") {
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.dailyTrips - a.dailyTrips);
    } else if (sortBy === "duration") {
      result.sort((a, b) => a.durationHours - b.durationHours);
    } else if (sortBy === "fare-low") {
      result.sort((a, b) => a.startingFareBDT - b.startingFareBDT);
    } else if (sortBy === "distance") {
      result.sort((a, b) => b.distanceKm - a.distanceKm);
    }

    return result;
  }, [searchQuery, selectedDivision, selectedCorridor, sortBy]);

  const handleOpenDetailModal = (route: BusRoute) => {
    setSelectedRouteForModal(route);
    setModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDivision("all");
    setSelectedCorridor("All");
    setSortBy("popular");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        {/* Page Header Section */}
        <section className="bg-white border-b border-slate-200/80 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {language === "bn" ? "আন্তঃজেলা " : "Inter-District "}
                  <span className="gradient-text">{language === "bn" ? "বাস রুটসমূহ" : "Bus Routes"}</span>
                </h1>
              </div>

              {/* Quick Search Input */}
              <div className="w-full md:w-80">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("routes_search_placeholder")}
                    className="h-11 bg-slate-50 border-slate-200 pl-10 pr-9 text-xs sm:text-sm font-medium rounded-xl focus:bg-white transition-all shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Division Filter Pills */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-bold text-slate-400 uppercase mr-1 shrink-0">
                {language === "bn" ? "বিভাগসমূহ:" : "Divisions:"}
              </span>
              {DIVISIONS.map((div) => {
                const active = selectedDivision.toLowerCase() === div.id.toLowerCase();
                return (
                  <button
                    key={div.id}
                    onClick={() => setSelectedDivision(div.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      active
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    <span>{language === "bn" ? div.nameBn : div.name}</span>
                    {div.id !== "all" && (
                      <span className={`ml-1 text-[10px] font-normal ${active ? "text-slate-300" : "text-slate-400"}`}>
                        ({language === "bn" ? div.name : div.nameBn})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
          {/* Key Stats Bar */}
          <RoutesStats />

          {/* Control Toolbar: Corridor filter, Sort, and View Mode */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                {t("highway_corridor")}:
              </span>
              <select
                value={selectedCorridor}
                onChange={(e) => setSelectedCorridor(e.target.value)}
                className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                {CORRIDOR_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? (language === "bn" ? "সকল করিডোর" : "All Corridor Types") : type}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                  {t("sort_by")}:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="popular">{language === "bn" ? "জনপ্রিয়তা" : "Most Popular"}</option>
                  <option value="duration">{language === "bn" ? "কম সময়" : "Shortest Duration"}</option>
                  <option value="fare-low">{language === "bn" ? "কম ভাড়া" : "Lowest Starting Fare"}</option>
                  <option value="distance">{language === "bn" ? "দীর্ঘ দূরত্ব" : "Longest Distance"}</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle & Results Count */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-xs font-mono font-bold text-slate-500">
                {tNum(filteredRoutes.length)} {language === "bn" ? "টি করিডোর" : "Corridors"}
              </span>

              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  title="Table View"
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  title="Network Map View"
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    viewMode === "map"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(searchQuery || selectedDivision !== "all" || selectedCorridor !== "All") && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-medium">{language === "bn" ? "সক্রিয় ফিল্টার:" : "Active filters:"}</span>
              {searchQuery && (
                <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 flex items-center gap-1">
                  Query: "{searchQuery}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                </Badge>
              )}
              {selectedDivision !== "all" && (
                <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 flex items-center gap-1">
                  Division: {selectedDivision}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedDivision("all")} />
                </Badge>
              )}
              {selectedCorridor !== "All" && (
                <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 flex items-center gap-1">
                  Corridor: {selectedCorridor}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCorridor("All")} />
                </Badge>
              )}
              <button
                onClick={handleClearFilters}
                className="text-teal-700 font-bold hover:underline cursor-pointer ml-1"
              >
                {language === "bn" ? "সব ফিল্টার মুছুন" : "Clear all filters"}
              </button>
            </div>
          )}

          {/* View Modes Rendering */}
          {filteredRoutes.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <Compass className="h-8 w-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-800">
                  {language === "bn" ? "কোনো রুট করিডোর পাওয়া যায়নি" : "No matching route corridors found"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {language === "bn" ? "অন্য কোনো জেলা সার্চ করুন অথবা ফিল্টার রিসেট করুন।" : "Try adjusting your search keywords or reset the division and corridor filters."}
                </p>
              </div>
              <Button
                onClick={handleClearFilters}
                className="gradient-teal text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
              >
                {language === "bn" ? "ফিল্টার রিসেট করুন" : "Reset Route Filters"}
              </Button>
            </div>
          ) : viewMode === "map" ? (
            /* Map View */
            <div className="space-y-4">
              <RoutesInteractiveMap
                routes={filteredRoutes}
                selectedRoute={selectedRouteForModal}
                onSelectRoute={handleOpenDetailModal}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onSelectRoute={handleOpenDetailModal}
                  />
                ))}
              </div>
            </div>
          ) : viewMode === "table" ? (
            /* Dense Compact Table View */
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono uppercase text-[10px]">
                      <th className="p-4 font-bold">{language === "bn" ? "রুট ও করিডোর" : "Route & Corridor"}</th>
                      <th className="p-4 font-bold">{t("distance")}</th>
                      <th className="p-4 font-bold">{t("est_duration")}</th>
                      <th className="p-4 font-bold">{t("daily_trips")}</th>
                      <th className="p-4 font-bold">{t("fare_range")}</th>
                      <th className="p-4 font-bold">{t("highway_corridor")}</th>
                      <th className="p-4 font-bold text-right">{language === "bn" ? "অ্যাকশন" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredRoutes.map((route) => (
                      <tr key={route.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {language === "bn" ? route.fromNameBn : route.fromName}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-teal-600" />
                            <span className="font-bold text-slate-900 text-sm">
                              {language === "bn" ? route.toNameBn : route.toName}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {language === "bn"
                              ? `${route.fromName} → ${route.toName} (${route.corridorType})`
                              : `${route.fromDivision} to ${route.toDivision} (${route.corridorType})`}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-800">
                          {tDistance(route.distanceKm)}
                        </td>
                        <td className="p-4 font-mono text-slate-700">
                          {tDuration(route.duration)}
                        </td>
                        <td className="p-4 font-mono text-teal-700 font-bold">
                          {tNum(route.dailyTrips)}+ {language === "bn" ? "ট্রিপ" : "trips"}
                        </td>
                        <td className="p-4 font-mono font-black text-emerald-700">
                          {tCurrency(route.startingFareBDT)} - {tCurrency(route.maxFareBDT)}
                        </td>
                        <td className="p-4 text-slate-600 text-[11px] max-w-[200px] truncate">
                          {route.highway}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              onClick={() => handleOpenDetailModal(route)}
                              className="h-8 px-2.5 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              {language === "bn" ? "স্টপ" : "Stops"}
                            </Button>
                            <Link href={`/search?from=${route.fromId}&to=${route.toId}`}>
                              <Button className="gradient-teal text-white h-8 px-3 text-xs font-bold rounded-lg cursor-pointer">
                                {t("view_buses")}
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onSelectRoute={handleOpenDetailModal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Stop Breakdown Modal */}
      <RouteDetailModal
        route={selectedRouteForModal}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <Footer />
    </div>
  );
}
