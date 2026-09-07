"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BANGLADESH_OPERATORS, OperatorDetailedProfile } from "@/lib/data/operators-data";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Building2,
  Search,
  Star,
  ShieldCheck,
  CheckCircle2,
  Bus,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronRight,
  Wifi,
  Zap,
  Coffee,
  Navigation,
  PhoneCall,
  UserCheck,
  Send,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default function OperatorsPage() {
  const { language, t, tNum } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"rating" | "fleet" | "routes" | "reviews">("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Lead modal for operator partnership
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    companyName: "",
    tradeLicense: "",
    contactName: "",
    phone: "",
    fleetSize: "10-25",
    routes: "",
  });
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  // Filter & sort operators
  const filteredOperators = useMemo(() => {
    let list = [...BANGLADESH_OPERATORS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (op) =>
          op.name.toLowerCase().includes(q) ||
          op.nameBn.includes(q) ||
          op.popularRoutes.some(
            (r) =>
              r.fromName.toLowerCase().includes(q) ||
              r.toName.toLowerCase().includes(q) ||
              r.fromNameBn.includes(q) ||
              r.toNameBn.includes(q)
          ) ||
          op.counters.some((c) => c.districtName.toLowerCase().includes(q) || c.districtNameBn.includes(q))
      );
    }

    if (selectedFilter !== "ALL") {
      list = list.filter((op) => {
        if (selectedFilter === "SCANIA") return op.fleetModels.some((m) => m.category === "AC_SCANIA");
        if (selectedFilter === "VOLVO") return op.fleetModels.some((m) => m.category === "AC_VOLVO");
        if (selectedFilter === "SLEEPER") return op.fleetModels.some((m) => m.category === "SLEEPER_LUXURY");
        if (selectedFilter === "NON_AC") return op.fleetModels.some((m) => m.category === "NON_AC_DELUXE");
        if (selectedFilter === "STATE") return op.id === "brtc";
        return true;
      });
    }

    list.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "fleet") return b.fleetCount - a.fleetCount;
      if (sortBy === "routes") return b.activeRoutesCount - a.activeRoutesCount;
      if (sortBy === "reviews") return b.totalReviews - a.totalReviews;
      return 0;
    });

    return list;
  }, [searchQuery, selectedFilter, sortBy]);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerSubmitted(true);
    setTimeout(() => {
      setPartnerSubmitted(false);
      setPartnerModalOpen(false);
      setPartnerForm({
        companyName: "",
        tradeLicense: "",
        contactName: "",
        phone: "",
        fleetSize: "10-25",
        routes: "",
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{language === "bn" ? "বিআরটিএ ও সরকার অনুমোদিত" : "BRTA & Ministry Verified Network"}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {t("operators_page_title")}
                </h1>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  {t("operators_page_subtitle")}
                </p>
              </div>

              {/* Action: Register fleet */}
              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setPartnerModalOpen(true)}
                  className="gradient-teal text-white shadow-sm hover:opacity-95 font-semibold px-5 py-2.5 h-auto rounded-xl flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  {language === "bn" ? "অপারেটর নিবন্ধন" : "Operator Registration"}
                </Button>
                <Link href="/operator/dashboard">
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-4 py-2.5 h-auto rounded-xl flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4 text-teal-600" />
                    {language === "bn" ? "অপারেটর পোর্টাল" : "Operator Portal"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {tNum(BANGLADESH_OPERATORS.length)}+
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  {language === "bn" ? "ভেরিফাইড অপারেটর" : "Verified Operators"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <div className="text-2xl font-black text-teal-700 tracking-tight">
                  {tNum("4,500")}+
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  {language === "bn" ? "সক্রিয় বাস বহর" : "Registered Coaches"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {tNum("280")}+
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  {language === "bn" ? "আন্তঃজেলা রুট" : "National Routes"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <div className="text-2xl font-black text-emerald-700 tracking-tight">
                  {tNum("96.8")}%
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  {language === "bn" ? "গড় সময়নিষ্ঠতা" : "Avg Punctuality"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder={
                    language === "bn"
                      ? "অপারেটরের নাম, গন্তব্য বা টার্মিনাল খুঁজুন..."
                      : "Search operator name, destination, or terminal..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-slate-50 border-slate-200 rounded-xl text-sm focus:bg-white transition-colors"
                />
              </div>

              {/* Sort and View Mode */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{language === "bn" ? "সাজান:" : "Sort:"}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="rating">{language === "bn" ? "সর্বোচ্চ রেটিং" : "Highest Rating"}</option>
                    <option value="fleet">{language === "bn" ? "বৃহত্তম বহর" : "Fleet Size"}</option>
                    <option value="routes">{language === "bn" ? "সর্বাধিক রুট" : "Most Routes"}</option>
                    <option value="reviews">{language === "bn" ? "সর্বাধিক রিভিউ" : "Most Reviews"}</option>
                  </select>
                </div>

                {/* Grid / List toggle */}
                <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "grid" ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "list" ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-slate-400 font-semibold shrink-0">
                {language === "bn" ? "ক্যাটাগরি:" : "Fleet Type:"}
              </span>
              {[
                { id: "ALL", label: t("filter_all_operators") },
                { id: "SCANIA", label: t("filter_luxury_scania") },
                { id: "VOLVO", label: t("filter_volvo_exec") },
                { id: "SLEEPER", label: t("filter_sleeper") },
                { id: "NON_AC", label: t("filter_non_ac") },
                { id: "STATE", label: language === "bn" ? "বিআরটিসি (সরকারি)" : "BRTC (State Carrier)" },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedFilter(chip.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedFilter === chip.id
                      ? "bg-teal-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Operators Listing */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              {language === "bn"
                ? `${tNum(filteredOperators.length)}টি অনুমোদিত অপারেটর পাওয়া গেছে`
                : `Showing ${filteredOperators.length} Verified Operators`}
            </h2>
          </div>

          {filteredOperators.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">
                {language === "bn" ? "কোনো অপারেটর পাওয়া যায়নি" : "No operators found"}
              </h3>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                {language === "bn"
                  ? "আপনার অনুসন্ধানের সাথে কোনো অপারেটরের তথ্য মেলেনি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।"
                  : "We couldn't find any operators matching your criteria. Try resetting your search or filter."}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("ALL");
                }}
                className="mt-4 text-xs font-semibold"
              >
                {language === "bn" ? "সব ফিল্টার মুছুন" : "Clear All Filters"}
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOperators.map((op) => (
                <div
                  key={op.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all hover:border-slate-300 flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    {/* Top Brand Banner */}
                    <div className={`p-4 bg-gradient-to-r ${op.logoBg} text-white flex items-start justify-between relative`}>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white font-black text-xl shadow-xs">
                          {op.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-base tracking-tight leading-tight text-white drop-shadow-xs">
                              {language === "bn" ? op.nameBn : op.name}
                            </h3>
                            <CheckCircle2 className="w-4 h-4 text-white fill-emerald-400 shrink-0" />
                          </div>
                          <span className="text-[11px] text-white/80 font-mono tracking-wider">
                            Est. {op.establishedYear} • {op.brtaRegistrationNo.split("-")[1] || "BRTA Reg."}
                          </span>
                        </div>
                      </div>

                      {/* Rating pill */}
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                        <span>{tNum(op.rating)}</span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-4">
                      {/* Tagline */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {language === "bn" ? op.taglineBn : op.tagline}
                      </p>

                      {/* Quick Metrics Bar */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                        <div>
                          <span className="block text-xs font-mono font-bold text-slate-900">
                            {tNum(op.fleetCount)}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">
                            {t("fleet_size")}
                          </span>
                        </div>
                        <div className="border-x border-slate-200/80">
                          <span className="block text-xs font-mono font-bold text-slate-900">
                            {tNum(op.activeRoutesCount)}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">
                            {t("active_routes")}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs font-mono font-bold text-emerald-700">
                            {tNum(op.punctualityRate)}%
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">
                            {t("on_time_punctuality")}
                          </span>
                        </div>
                      </div>

                      {/* Fleet Models badges */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          {language === "bn" ? "বহরের ধরণ" : "Coach Categories"}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {op.fleetModels.map((m) => (
                            <span
                              key={m.id}
                              className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium"
                            >
                              {language === "bn" ? m.categoryLabelBn : m.categoryLabel}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Popular Routes Preview */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          {language === "bn" ? "প্রধান রুটসমূহ" : "Popular Corridors"}
                        </div>
                        <div className="space-y-1">
                          {op.popularRoutes.slice(0, 2).map((r) => (
                            <div
                              key={r.id}
                              className="flex items-center justify-between text-xs text-slate-700 hover:text-teal-700 font-medium"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                {language === "bn" ? `${r.fromNameBn} ↔ ${r.toNameBn}` : `${r.fromName} ↔ ${r.toName}`}
                              </span>
                              <span className="font-mono text-[11px] font-bold text-slate-900">
                                ৳{tNum(r.baseFareBDT)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer CTAs */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Link href={`/operators/${op.slug}`} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full border-slate-300 text-slate-800 hover:bg-white hover:text-teal-800 font-semibold text-xs h-9 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        {t("view_operator_profile")}
                        <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                      </Button>
                    </Link>
                    <Link href={`/search?from=dhaka&to=chattogram`} className="shrink-0">
                      <Button
                        className="gradient-teal text-white font-semibold text-xs h-9 px-3 rounded-xl shadow-xs flex items-center gap-1"
                        title="Search Buses"
                      >
                        <Bus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{language === "bn" ? "টিকেট" : "Book"}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredOperators.map((op) => (
                <div
                  key={op.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${op.logoBg} text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0`}
                    >
                      {op.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-slate-900 text-lg">
                          {language === "bn" ? op.nameBn : op.name}
                        </h3>
                        <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] font-semibold">
                          {op.badgeLabel}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{tNum(op.rating)}</span>
                          <span className="text-slate-400 font-normal">({op.totalReviews} rev.)</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                        {language === "bn" ? op.taglineBn : op.tagline}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-1">
                        <span>
                          <strong>{tNum(op.fleetCount)}</strong> {t("fleet_size")}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>{tNum(op.activeRoutesCount)}</strong> {t("active_routes")}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>{tNum(op.countersCount)}</strong> {t("total_counters")}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">
                          {tNum(op.punctualityRate)}% {t("on_time_punctuality")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Link href={`/operators/${op.slug}`}>
                      <Button
                        variant="outline"
                        className="border-slate-300 text-slate-800 font-semibold text-xs h-9 rounded-xl flex items-center gap-1.5"
                      >
                        {t("view_operator_profile")}
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Head-to-Head Comparison Matrix */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                {language === "bn" ? "তুলনামূলক বিশ্লেষণ" : "Comprehensive Comparison"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {language === "bn"
                  ? "শীর্ষস্থানীয় বাস অপারেটরদের তুলনামূলক মেট্রিক্স"
                  : "Compare Bangladesh's Premier Coach Carriers"}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {language === "bn"
                  ? "স্ক্যানিয়া, ভলভো, লাক্সারি স্লিপার এবং যাত্রী সুবিধা সরাসরি তুলনা করুন।"
                  : "Compare fleet specifications, comfort amenities, lounge access, and punctuality side-by-side."}
              </p>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 rounded-tl-xl">{language === "bn" ? "অপারেটর" : "Operator"}</th>
                    <th className="p-3.5">{language === "bn" ? "ফ্ল্যাগশিপ মডেল" : "Flagship Fleet"}</th>
                    <th className="p-3.5">{language === "bn" ? "স্লিপার কোচ" : "Sleeper Option"}</th>
                    <th className="p-3.5">{language === "bn" ? "লাউঞ্জ সুবিধা" : "AC Lounge"}</th>
                    <th className="p-3.5">{language === "bn" ? "সময়নিষ্ঠতা" : "On-Time Rate"}</th>
                    <th className="p-3.5">{language === "bn" ? "রেটিং" : "Rating"}</th>
                    <th className="p-3.5 rounded-tr-xl">{language === "bn" ? "পদক্ষেপ" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {BANGLADESH_OPERATORS.slice(0, 5).map((op) => (
                    <tr key={op.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${op.logoBg}`} />
                          <span>{language === "bn" ? op.nameBn : op.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {op.fleetModels[0]?.modelName.split(" ")[0]} Multi-Axle
                      </td>
                      <td className="p-3.5">
                        {op.fleetModels.some((m) => m.category === "SLEEPER_LUXURY") ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> Available
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="text-emerald-700 font-semibold">Yes (Central Hubs)</span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {tNum(op.punctualityRate)}%
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {tNum(op.rating)}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <Link href={`/operators/${op.slug}`}>
                          <span className="text-teal-700 hover:text-teal-900 font-bold hover:underline flex items-center gap-1">
                            {language === "bn" ? "প্রোফাইল" : "Profile"} <ChevronRight className="w-3 h-3" />
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Partner Onboarding CTA Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="bg-linear-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "অপারেটর অংশীদারিত্ব" : "B2B Transportation Platform"}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {language === "bn"
                  ? "আপনি কি বাস অপারেটর? আপনার বহর আজই বাস দরকার নেটওয়ার্কে যুক্ত করুন"
                  : "Are you a Bus Operator in Bangladesh? Modernize your ticketing with Bus Dorkar"}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {language === "bn"
                  ? "রিয়েল-টাইম আসন বুকিং, কাউন্টার কর্মী ব্যবস্থাপনা, ডিজিটাল কিউআর টিকিট এবং তাৎক্ষণিক রাজস্ব নিরীক্ষণ — সবই একটি একক সেন্ট্রাল সিস্টেমে।"
                  : "Unlock real-time seat inventory, automated counter terminal staff tools, digital QR tickets, and transparent revenue reporting with zero setup fee."}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => setPartnerModalOpen(true)}
                  className="bg-white text-slate-950 hover:bg-slate-100 font-bold px-6 py-3 h-auto rounded-xl shadow-md text-sm"
                >
                  {language === "bn" ? "বিনামূল্যে আবেদন করুন" : "Register Your Company"}
                </Button>
                <Link href="/operator/dashboard">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 font-semibold text-sm px-4 py-3 h-auto"
                  >
                    {language === "bn" ? "পোর্টাল ডেমো দেখুন →" : "Explore Operator Portal →"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Operator Lead Modal */}
      <Dialog open={partnerModalOpen} onOpenChange={setPartnerModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              {language === "bn" ? "বাস অপারেটর হিসেবে যোগ দিন" : "Register Your Bus Company"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              {language === "bn"
                ? "আপনার পরিবহন সংস্থার তথ্য দিন। আমাদের পার্টনার অনবোর্ডিং টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।"
                : "Enter your fleet details. Our operator onboarding team will verify your BRTA license within 24 hours."}
            </DialogDescription>
          </DialogHeader>

          {partnerSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                {language === "bn" ? "আবেদন সফলভাবে গ্রহণ করা হয়েছে!" : "Application Received Successfully!"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === "bn"
                  ? "আমাদের অপারেটর রিলেশনশিপ অফিসার আপনার ফোন নম্বরে শীঘ্রই যোগাযোগ করবেন।"
                  : "Thank you. Our transportation onboarding team will review your details and reach out shortly."}
              </p>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {language === "bn" ? "কোম্পানির নাম *" : "Company Name *"}
                  </label>
                  <Input
                    required
                    placeholder="e.g. Royal Bengal Travels"
                    value={partnerForm.companyName}
                    onChange={(e) => setPartnerForm({ ...partnerForm, companyName: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {language === "bn" ? "ট্রেড লাইসেন্স নং *" : "Trade License No. *"}
                  </label>
                  <Input
                    required
                    placeholder="e.g. TRAD/DSCC/10293"
                    value={partnerForm.tradeLicense}
                    onChange={(e) => setPartnerForm({ ...partnerForm, tradeLicense: e.target.value })}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {language === "bn" ? "যোগাযোগকারী কর্মকর্তা *" : "Contact Person *"}
                  </label>
                  <Input
                    required
                    placeholder="e.g. Md. Rezaul Karim"
                    value={partnerForm.contactName}
                    onChange={(e) => setPartnerForm({ ...partnerForm, contactName: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {language === "bn" ? "মোবাইল নম্বর *" : "Mobile Phone *"}
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="+880 17XXXXXXXX"
                    value={partnerForm.phone}
                    onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  {language === "bn" ? "মোট বাসের সংখ্যা" : "Fleet Size"}
                </label>
                <select
                  value={partnerForm.fleetSize}
                  onChange={(e) => setPartnerForm({ ...partnerForm, fleetSize: e.target.value })}
                  className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-medium text-slate-800"
                >
                  <option value="5-10">5 - 10 Coaches</option>
                  <option value="10-25">10 - 25 Coaches</option>
                  <option value="25-50">25 - 50 Coaches</option>
                  <option value="50+">50+ Coaches (Large Fleet)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  {language === "bn" ? "প্রধান রুটের বিবরণ" : "Key Operated Routes"}
                </label>
                <Input
                  placeholder="e.g. Dhaka to Sylhet, Dhaka to Chattogram"
                  value={partnerForm.routes}
                  onChange={(e) => setPartnerForm({ ...partnerForm, routes: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPartnerModalOpen(false)}
                  className="h-9 text-xs"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </Button>
                <Button type="submit" className="gradient-teal text-white h-9 text-xs font-semibold px-5">
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {language === "bn" ? "আবেদন জমা দিন" : "Submit Registration"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
