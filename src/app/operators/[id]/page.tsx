"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  BANGLADESH_OPERATORS,
  getOperatorBySlug,
  OperatorDetailedProfile,
} from "@/lib/data/operators-data";
import { getBusTripsForRoute, BusTrip } from "@/lib/data/buses";
import { SeatSelectorModal } from "@/components/search/seat-selector-modal";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Star,
  ShieldCheck,
  CheckCircle2,
  Bus,
  MapPin,
  Clock,
  ArrowRight,
  PhoneCall,
  Mail,
  Globe,
  Navigation,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
  SlidersHorizontal,
  Armchair,
  Check,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  ThumbsUp,
  User,
} from "lucide-react";

export default function OperatorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { language, t, tNum, tCurrency } = useLanguage();

  const operatorSlug = typeof params.id === "string" ? params.id : "";
  const operator = useMemo(() => {
    const found = getOperatorBySlug(operatorSlug);
    return found || BANGLADESH_OPERATORS[0];
  }, [operatorSlug]);

  const [activeTab, setActiveTab] = useState<
    "overview" | "fleet" | "routes" | "counters" | "policy" | "reviews"
  >("overview");

  // Booking modal integration
  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);
  const [seatModalOpen, setSeatModalOpen] = useState(false);

  // Generate dynamic live trips for this operator on their popular routes
  const operatorTrips = useMemo(() => {
    const allTrips: BusTrip[] = [];
    operator.popularRoutes.forEach((route) => {
      const generated = getBusTripsForRoute(
        route.fromId,
        route.toId,
        route.fromName,
        route.toName
      );
      // Map operator branding
      const customized = generated.slice(0, 3).map((t, idx) => ({
        ...t,
        operatorId: operator.id,
        operatorName: operator.name,
        operatorLogoBg: operator.logoBg,
        operatorRating: operator.rating,
        operatorReviews: `${operator.totalReviews}`,
        fareBDT: route.baseFareBDT + (idx === 1 ? 150 : 0),
      }));
      allTrips.push(...customized);
    });
    return allTrips;
  }, [operator]);

  const openBookingForTrip = (trip: BusTrip) => {
    setSelectedTrip(trip);
    setSeatModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 pt-16 pb-16">
        {/* Operator Hero Banner */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
              <Link href="/" className="hover:text-teal-700">
                {language === "bn" ? "হোম" : "Home"}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/operators" className="hover:text-teal-700">
                {language === "bn" ? "অপারেটরস" : "Operators"}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold">
                {language === "bn" ? operator.nameBn : operator.name}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Brand identity */}
              <div className="flex items-start gap-4 sm:gap-5">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${operator.logoBg} text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-md shrink-0`}
                >
                  {operator.name.charAt(0)}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {language === "bn" ? operator.nameBn : operator.name}
                    </h1>
                    <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-xs font-semibold px-2.5 py-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-600" />
                      {operator.badgeLabel}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                    {language === "bn" ? operator.taglineBn : operator.tagline}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono flex-wrap pt-0.5">
                    <span>Trade Lic: {operator.tradeLicenseNo}</span>
                    <span>•</span>
                    <span>BRTA Permit: {operator.brtaRegistrationNo}</span>
                    <span>•</span>
                    <span>Since {operator.establishedYear}</span>
                  </div>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                <a href={`tel:${operator.hotline.split(" / ")[0]}`}>
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs h-10 px-4 rounded-xl flex items-center gap-2 w-full sm:w-auto"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                    <span>{operator.hotline.split(" / ")[0]}</span>
                  </Button>
                </a>
                <Button
                  onClick={() => setActiveTab("routes")}
                  className="gradient-teal text-white font-semibold text-xs h-10 px-5 rounded-xl shadow-xs flex items-center gap-2 w-full sm:w-auto"
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "টিকেট বুক করুন" : "Book Tickets"}</span>
                </Button>
              </div>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 pt-8 border-t border-slate-100">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                  <span>{language === "bn" ? "গ্রাহক সন্তুষ্টি" : "Rating Score"}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  {tNum(operator.rating)} / 5.0
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {tNum(operator.totalReviews)} verified reviews
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                  <span>{t("on_time_punctuality")}</span>
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <div className="text-xl font-black text-emerald-700 tracking-tight">
                  {tNum(operator.punctualityRate)}%
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Live GPS monitored runs
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                  <span>{t("safety_rating")}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-xl font-black text-blue-700 tracking-tight">
                  {tNum(operator.safetyIndex)}%
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  BRTA certified captains
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                  <span>{language === "bn" ? "বার্ষিক যাত্রী" : "Annual Commuters"}</span>
                  <User className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  {operator.annualPassengers}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Across 64 districts
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation Bar */}
        <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-bold">
              {[
                { id: "overview", label: language === "bn" ? "ওভারভিউ" : "Overview & Specs" },
                { id: "fleet", label: language === "bn" ? "বাস বহর" : `Fleet (${operator.fleetModels.length})` },
                { id: "routes", label: language === "bn" ? "রুট ও টিকেট" : `Schedules & Booking` },
                { id: "counters", label: language === "bn" ? "কাউন্টার নেটওয়ার্ক" : `Counters (${operator.counters.length})` },
                { id: "policy", label: language === "bn" ? "বাতিল ও রিফান্ড" : "Cancellation Policy" },
                { id: "reviews", label: language === "bn" ? "যাত্রীদের রিভিউ" : `Reviews (${operator.reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Contents */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-xs">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-600" />
                    {language === "bn" ? "কোম্পানি পরিচিতি" : "About the Operator"}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {language === "bn" ? operator.descriptionBn : operator.description}
                  </p>

                  <div className="pt-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      {language === "bn" ? "প্রধান যাত্রী সুবিধাসমূহ" : "Key Comfort Standards"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(language === "bn" ? operator.featuresBn : operator.features).map((feat, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popular routes snapshot */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-teal-600" />
                      {language === "bn" ? "জনপ্রিয় রুটসমূহ" : "High Frequency Corridors"}
                    </h3>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab("routes")}
                      className="text-teal-700 hover:text-teal-900 text-xs font-semibold p-0 h-auto"
                    >
                      {language === "bn" ? "সব রুট দেখুন →" : "View All Schedules →"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {operator.popularRoutes.map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {language === "bn" ? `${r.fromNameBn} ↔ ${r.toNameBn}` : `${r.fromName} ↔ ${r.toName}`}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {r.durationHours} • {r.dailyDepartures} trips/day
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block font-black text-sm text-slate-900">
                            ৳{tNum(r.baseFareBDT)}
                          </span>
                          <span className="text-[10px] text-teal-700 font-semibold uppercase">
                            Regular
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Info Card */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {language === "bn" ? "যোগাযোগ ও প্রধান কার্যালয়" : "Official Contact & HQ"}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-semibold text-slate-800">
                          {language === "bn" ? "হেড অফিস:" : "Head Office:"}
                        </span>
                        <span className="text-slate-500">
                          {language === "bn" ? operator.headOfficeAddressBn : operator.headOfficeAddress}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <PhoneCall className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-semibold text-slate-800">
                          {language === "bn" ? "২৪/৭ হেল্পলাইন:" : "Helpline & Booking:"}
                        </span>
                        <a href={`tel:${operator.hotline}`} className="text-teal-700 hover:underline font-mono">
                          {operator.hotline}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-semibold text-slate-800">
                          {language === "bn" ? "ইমেইল সাপোর্ট:" : "Email Inquiries:"}
                        </span>
                        <a href={`mailto:${operator.email}`} className="text-teal-700 hover:underline">
                          {operator.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Globe className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-semibold text-slate-800">
                          {language === "bn" ? "অফিসিয়াল ওয়েবসাইট:" : "Official Portal:"}
                        </span>
                        <a
                          href={operator.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-700 hover:underline break-all font-mono"
                        >
                          {operator.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operator Safety Seal */}
                <div className="p-5 rounded-2xl bg-teal-900 text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-300" />
                    <span className="font-bold text-sm">Bus Dorkar Trust Guarantee</span>
                  </div>
                  <p className="text-xs text-teal-100 leading-relaxed">
                    All trips booked for this operator carry 100% seat confirmation, digital ticket voucher, and instant online cancellation rights.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. FLEET & COACHES TAB */}
          {activeTab === "fleet" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="max-w-2xl">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {language === "bn" ? "বহরের কোচ ও প্রযুক্তি" : "Registered Fleet Specifications"}
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    {language === "bn"
                      ? "প্রতিটি কোচের ইঞ্জিন স্পেসিফিকেশন, আসন বিন্যাস ও যাত্রী সুবিধা যাচাই করুন।"
                      : "Verified coach chassis, seating layouts, and ergonomics inspected under BRTA transportation standards."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                  {operator.fleetModels.map((bus) => (
                    <div
                      key={bus.id}
                      className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="bg-slate-900 text-white text-[10px] font-mono mb-1.5">
                            {bus.category}
                          </Badge>
                          <h3 className="font-extrabold text-slate-900 text-base">
                            {bus.modelName}
                          </h3>
                          <span className="text-xs text-teal-700 font-semibold">
                            {language === "bn" ? bus.categoryLabelBn : bus.categoryLabel}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-mono block">Capacity</span>
                          <span className="text-lg font-black text-slate-900 font-mono">
                            {tNum(bus.totalSeats)} Seats
                          </span>
                        </div>
                      </div>

                      {/* Technical Specs Grid */}
                      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white border border-slate-200/80 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Layout
                          </span>
                          <span className="font-semibold text-slate-800">{bus.layout} Configuration</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Seat Pitch
                          </span>
                          <span className="font-semibold text-slate-800">{bus.seatPitchedCm} cm Legroom</span>
                        </div>
                        <div className="col-span-2 border-t border-slate-100 pt-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Powertrain
                          </span>
                          <span className="font-mono text-slate-700 text-[11px]">{bus.engineSpecs}</span>
                        </div>
                      </div>

                      {/* Amenities checklist */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          {language === "bn" ? "সুবিধাসমূহ" : "Onboard Facilities"}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(language === "bn" ? bus.facilitiesBn : bus.facilities).map((fac, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              {fac}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. SCHEDULES & BOOKING TAB */}
          {activeTab === "routes" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      {language === "bn" ? "লাইভ শিডিউল ও আসন বুকিং" : "Live Schedules & Seat Reservation"}
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                      {language === "bn"
                        ? "সরাসরি আসন নির্বাচন করুন ও তাৎক্ষণিক ডিজিটাল টিকিট কাটুন।"
                        : "Browse direct departures and select your preferred seats with real-time inventory."}
                    </p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs self-start sm:self-auto">
                    ● Real-Time Seat Engine Active
                  </Badge>
                </div>

                <div className="space-y-4">
                  {operatorTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="border border-slate-200 rounded-2xl p-5 hover:border-teal-300 transition-all bg-white hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      {/* Left: Journey info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono border-slate-300">
                            {trip.busTypeLabel}
                          </Badge>
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            {trip.availableSeats} seats left
                          </span>
                        </div>

                        {/* Timing route */}
                        <div className="flex items-center gap-4 sm:gap-6 pt-1">
                          <div>
                            <div className="text-lg font-black text-slate-900 font-mono">
                              {trip.departureTime}
                            </div>
                            <div className="text-xs font-bold text-slate-600">
                              {trip.fromDistrictName}
                            </div>
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 font-mono">{trip.duration}</span>
                            <div className="w-20 sm:w-28 h-0.5 bg-slate-200 relative my-1">
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-600" />
                            </div>
                            <span className="text-[10px] text-teal-700 font-bold">Direct Express</span>
                          </div>

                          <div>
                            <div className="text-lg font-black text-slate-900 font-mono">
                              {trip.arrivalTime}
                            </div>
                            <div className="text-xs font-bold text-slate-600">
                              {trip.toDistrictName}
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-400 font-medium">
                          Boarding: {trip.boardingPoints.slice(0, 2).join(" • ")}
                        </div>
                      </div>

                      {/* Right: Fare & Select Seat CTA */}
                      <div className="flex items-center md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Fare per seat
                          </span>
                          <span className="text-2xl font-black text-slate-900 font-mono">
                            ৳{tNum(trip.fareBDT)}
                          </span>
                        </div>

                        <Button
                          onClick={() => openBookingForTrip(trip)}
                          className="gradient-teal text-white font-semibold text-xs h-9 px-5 rounded-xl shadow-xs flex items-center gap-1.5 mt-2"
                        >
                          <Armchair className="w-3.5 h-3.5" />
                          <span>{language === "bn" ? "আসন নির্বাচন করুন" : "Select Seat"}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. COUNTERS & TERMINALS TAB */}
          {activeTab === "counters" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {language === "bn" ? "অনুমোদিত কাউন্টার ও টার্মিনাল ডিরেক্টরি" : "Authorized Counter Network"}
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                    {language === "bn"
                      ? "টিকিট বুকিং, বোর্ডিং ও তথ্যের জন্য সরাসরি কাউন্টার ম্যানেজারের সাথে যোগাযোগ করুন।"
                      : "Direct manager hotlines, terminal stations, and operating hours across all districts."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {operator.counters.map((c) => (
                    <div
                      key={c.id}
                      className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-slate-900 text-sm">
                              {language === "bn" ? c.nameBn : c.name}
                            </h3>
                            {c.isMainHub && (
                              <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-[10px]">
                                Central Hub
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 font-medium">{c.terminalName}</span>
                        </div>
                        <Badge variant="outline" className="text-slate-600 font-mono text-[10px]">
                          {c.districtName}
                        </Badge>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{language === "bn" ? c.addressBn : c.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <a href={`tel:${c.phone}`} className="font-mono text-teal-700 hover:underline font-bold">
                            {c.phone}
                          </a>
                          <span className="text-slate-400">({c.manager})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-slate-500 font-medium">
                            {language === "bn" ? c.openingHoursBn : c.openingHours}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <a
                          href={`https://www.google.com/maps?q=${c.lat},${c.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          {language === "bn" ? "গুগল ম্যাপে দেখুন →" : "View on Google Maps →"}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. CANCELLATION & REFUND POLICY TAB */}
          {activeTab === "policy" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="max-w-2xl mb-6">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-bold mb-2">
                    <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                    Section 27 Compliant Refund Framework
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {language === "bn" ? "টিকিট বাতিল ও রিফান্ড নীতিমালা" : "Verified Cancellation & Refund Policy"}
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    {language === "bn"
                      ? "যাত্রার সময়ের উপর ভিত্তি করে নির্ধারিত রিফান্ড হারের পূর্ণ বিবরণ।"
                      : "Transparent refund tiers calculated automatically based on remaining hours before scheduled departure."}
                  </p>
                </div>

                {/* Policy Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                        <th className="p-3.5 rounded-tl-xl">{language === "bn" ? "যাত্রার পূর্বের সময়" : "Time Before Departure"}</th>
                        <th className="p-3.5">{language === "bn" ? "রিফান্ড প্রাপ্তি" : "Refund Amount"}</th>
                        <th className="p-3.5">{language === "bn" ? "কর্তন / ফি" : "Deduction Fee"}</th>
                        <th className="p-3.5 rounded-tr-xl">{language === "bn" ? "প্রক্রিয়াকরণ মাধ্যম" : "Mode"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900">
                          {language === "bn" ? "৪৮ ঘণ্টার বেশি আগে" : "> 48 Hours Before Trip"}
                        </td>
                        <td className="p-3.5 font-black text-emerald-700 text-sm">
                          {operator.cancellationPolicy.moreThan48hRefundPct}% Refund
                        </td>
                        <td className="p-3.5 text-slate-500">
                          10% (Min. ৳{operator.cancellationPolicy.processingFeeBDT} gateway charge)
                        </td>
                        <td className="p-3.5 text-slate-600">Instant Online / Source Gateway</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900">
                          {language === "bn" ? "২৪ থেকে ৪৮ ঘণ্টার মধ্যে" : "24 – 48 Hours Before Trip"}
                        </td>
                        <td className="p-3.5 font-black text-teal-700 text-sm">
                          {operator.cancellationPolicy.between24And48hRefundPct}% Refund
                        </td>
                        <td className="p-3.5 text-slate-500">30% cancellation deduction</td>
                        <td className="p-3.5 text-slate-600">Instant Online / Source Gateway</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900">
                          {language === "bn" ? "৬ থেকে ২৪ ঘণ্টার মধ্যে" : "6 – 24 Hours Before Trip"}
                        </td>
                        <td className="p-3.5 font-black text-amber-700 text-sm">
                          {operator.cancellationPolicy.between6And24hRefundPct}% Refund
                        </td>
                        <td className="p-3.5 text-slate-500">60% cancellation deduction</td>
                        <td className="p-3.5 text-slate-600">Instant Online / Source Gateway</td>
                      </tr>
                      <tr className="bg-rose-50/30">
                        <td className="p-3.5 font-bold text-rose-900">
                          {language === "bn" ? "৬ ঘণ্টার কম সময়ে" : "< 6 Hours Before Trip"}
                        </td>
                        <td className="p-3.5 font-bold text-rose-600 text-sm">
                          {language === "bn" ? "কোনো রিফান্ড নেই" : "No Refund (0%)"}
                        </td>
                        <td className="p-3.5 text-slate-500">100% (Seat inventory frozen)</td>
                        <td className="p-3.5 text-slate-500">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block">Operator Policy Note:</span>
                  <p>{language === "bn" ? operator.cancellationPolicy.notesBn : operator.cancellationPolicy.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* 6. REVIEWS & RATINGS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      {language === "bn" ? "যাত্রীদের যাচাইকৃত রিভিউ" : "Verified Customer Ratings"}
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                      {language === "bn"
                        ? "শুধুমাত্র ভ্রমণ সম্পন্নকারী যাত্রীদের মতামত ও রেটিং।"
                        : "Ratings can only be submitted by passengers with completed bookings."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-black text-slate-900 font-mono">
                      {tNum(operator.rating)}
                    </div>
                    <div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        Based on {tNum(operator.totalReviews)} reviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating category breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">Cleanliness</span>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: "98%" }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900">4.9 / 5.0</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">Seat Comfort</span>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: "96%" }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900">4.8 / 5.0</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">Punctuality</span>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: "97%" }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900">4.8 / 5.0</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">Staff Behavior</span>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: "95%" }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900">4.7 / 5.0</span>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4 pt-6">
                  {operator.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{rev.userName}</span>
                          {rev.verifiedBooking && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                              Verified Booking
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{rev.travelDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">• Route: {rev.route}</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        &ldquo;{language === "bn" ? rev.commentBn : rev.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Integrated Seat Selector Modal */}
      <SeatSelectorModal
        trip={selectedTrip}
        open={seatModalOpen}
        onClose={() => setSeatModalOpen(false)}
        dateStr="Today"
      />

      <Footer />
    </div>
  );
}
