"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Users, ArrowRightLeft, Search, Bus, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DistrictCombobox } from "@/components/ui/district-combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { majorTerminals } from "@/lib/data/districts";

export function HeroSearch() {
  const router = useRouter();
  const [fromDistrict, setFromDistrict] = useState("dhaka");
  const [toDistrict, setToDistrict] = useState("coxs-bazar");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [passengers, setPassengers] = useState(1);
  const [busType, setBusType] = useState<"all" | "ac" | "non-ac">("all");

  const handleSwap = () => {
    const temp = fromDistrict;
    setFromDistrict(toDistrict);
    setToDistrict(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDistrict || !toDistrict) return;
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    router.push(
      `/search?from=${fromDistrict}&to=${toDistrict}&date=${formattedDate}&passengers=${passengers}&type=${busType}`
    );
  };

  return (
    <section className="relative min-h-[90vh] pt-24 pb-16 flex items-center justify-center overflow-hidden bg-bd-navy-950">
      {/* ===== MAP GRAPHIC BACKGROUND ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        {/* SVG Route Canvas */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Bangladesh Route Grid Lines */}
          {/* Dhaka to Cox's Bazar */}
          <path d="M 600,320 Q 720,440 850,560 T 920,680" fill="none" stroke="url(#routeGradient)" strokeWidth="3" filter="url(#glow)" className="route-line" />
          {/* Dhaka to Sylhet */}
          <path d="M 600,320 Q 700,240 820,180" fill="none" stroke="url(#routeGradient)" strokeWidth="2.5" filter="url(#glow)" className="route-line" />
          {/* Dhaka to Rajshahi */}
          <path d="M 600,320 Q 480,280 380,260" fill="none" stroke="url(#routeGradient)" strokeWidth="2.5" filter="url(#glow)" className="route-line" />
          {/* Dhaka to Chattogram */}
          <path d="M 600,320 Q 750,480 850,560" fill="none" stroke="url(#routeGradient)" strokeWidth="3" filter="url(#glow)" className="route-line" />
          {/* Dhaka to Khulna */}
          <path d="M 600,320 Q 500,420 420,500" fill="none" stroke="url(#routeGradient)" strokeWidth="2" filter="url(#glow)" className="route-line" />
          {/* Dhaka to Rangpur */}
          <path d="M 600,320 Q 480,200 400,120" fill="none" stroke="url(#routeGradient)" strokeWidth="2" filter="url(#glow)" className="route-line" />
          {/* Chattogram to Cox's Bazar */}
          <path d="M 850,560 Q 880,620 920,680" fill="none" stroke="url(#routeGradient)" strokeWidth="2.5" filter="url(#glow)" className="route-line" />

          {/* Glowing City Nodes */}
          {/* Dhaka Hub */}
          <g transform="translate(600, 320)">
            <circle r="16" fill="#14b8a6" opacity="0.2" className="animate-ping" />
            <circle r="8" fill="#14b8a6" filter="url(#glow)" />
            <circle r="4" fill="#ffffff" />
            <text x="14" y="5" fill="#e2e8f0" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Dhaka (Hub)</text>
          </g>

          {/* Chattogram */}
          <g transform="translate(850, 560)">
            <circle r="12" fill="#10b981" opacity="0.2" className="animate-ping" />
            <circle r="6" fill="#10b981" filter="url(#glow)" />
            <text x="12" y="4" fill="#cbd5e1" fontSize="12" fontFamily="sans-serif">Chattogram</text>
          </g>

          {/* Cox's Bazar */}
          <g transform="translate(920, 680)">
            <circle r="12" fill="#2dd4bf" opacity="0.2" className="animate-ping" />
            <circle r="6" fill="#2dd4bf" filter="url(#glow)" />
            <text x="12" y="4" fill="#cbd5e1" fontSize="12" fontFamily="sans-serif">Cox's Bazar</text>
          </g>

          {/* Sylhet */}
          <g transform="translate(820, 180)">
            <circle r="10" fill="#14b8a6" opacity="0.2" />
            <circle r="5" fill="#14b8a6" filter="url(#glow)" />
            <text x="10" y="4" fill="#cbd5e1" fontSize="12" fontFamily="sans-serif">Sylhet</text>
          </g>

          {/* Rajshahi */}
          <g transform="translate(380, 260)">
            <circle r="10" fill="#14b8a6" opacity="0.2" />
            <circle r="5" fill="#14b8a6" filter="url(#glow)" />
            <text x="-65" y="4" fill="#cbd5e1" fontSize="12" fontFamily="sans-serif">Rajshahi</text>
          </g>

          {/* Khulna */}
          <g transform="translate(420, 500)">
            <circle r="10" fill="#10b981" opacity="0.2" />
            <circle r="5" fill="#10b981" filter="url(#glow)" />
            <text x="-50" y="4" fill="#cbd5e1" fontSize="12" fontFamily="sans-serif">Khulna</text>
          </g>

          {/* Rangpur */}
          <g transform="translate(400, 120)">
            <circle r="10" fill="#2dd4bf" opacity="0.2" />
            <circle r="5" fill="#2dd4bf" filter="url(#glow)" />
            <text x="-60" y="4" fill="#cbd5e1" fontSize="12" fontFamily="sans-serif">Rangpur</text>
          </g>
        </svg>

        {/* Gradient Overlay Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-bd-navy-950/60 to-bd-navy-950" />
      </div>

      {/* ===== HERO CONTENT & SEARCH FORM ===== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bd-teal-500/10 border border-bd-teal-500/20 text-bd-teal-400 text-xs font-semibold tracking-wide uppercase shadow-inner">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Inter-District Bus Ticketing Across Bangladesh</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Journey Across{" "}
            <span className="gradient-text">Bangladesh</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Book inter-district bus tickets with real-time seat mapping, verified operators, and instant digital tickets.
          </p>
        </div>

        {/* ===== GLASSMORPHISM SEARCH CARD ===== */}
        <div className="max-w-4xl mx-auto glass-card rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/50 gradient-border">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Bus Type Filters */}
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <span className="text-xs font-medium text-slate-400 mr-2">Bus Type:</span>
              {[
                { id: "all", label: "All Buses" },
                { id: "ac", label: "AC Bus" },
                { id: "non-ac", label: "Non-AC Bus" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBusType(t.id as any)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                    busType === t.id
                      ? "bg-bd-teal-500 text-bd-navy-950 font-semibold shadow-md shadow-bd-teal-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              {/* FROM DISTRICT */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-bd-teal-400" />
                  From (Departure)
                </label>
                <DistrictCombobox
                  id="search-from-district"
                  value={fromDistrict}
                  onChange={setFromDistrict}
                  placeholder="Select Origin"
                  disabledDistrictId={toDistrict}
                />
              </div>

              {/* SWAP BUTTON */}
              <div className="hidden md:flex md:col-span-1 justify-center pb-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleSwap}
                  id="swap-districts-btn"
                  className="rounded-full bg-bd-navy-800 border-white/10 hover:bg-bd-teal-500/20 hover:border-bd-teal-500/50 text-bd-teal-400 h-10 w-10 shrink-0 transition-all hover:rotate-180"
                  title="Swap Origin & Destination"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* TO DISTRICT */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-bd-emerald-400" />
                  To (Destination)
                </label>
                <DistrictCombobox
                  id="search-to-district"
                  value={toDistrict}
                  onChange={setToDistrict}
                  placeholder="Select Destination"
                  disabledDistrictId={fromDistrict}
                />
              </div>

              {/* DATE PICKER */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-bd-teal-400" />
                  Journey Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="search-date-btn"
                      variant="outline"
                      className="w-full justify-start bg-bd-navy-900/80 border-white/10 text-left font-normal text-foreground hover:bg-bd-navy-800 hover:border-bd-teal-500/50 h-12 rounded-xl"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-bd-teal-400" />
                      {date ? format(date, "dd MMM yyyy") : <span>Pick date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-bd-navy-900 border-white/10 text-foreground z-50">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="bg-bd-navy-900 text-foreground rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Bottom Row: Passengers & Submit */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2">
              {/* Passengers */}
              <div className="sm:col-span-5 flex items-center gap-3 bg-bd-navy-900/50 p-2.5 rounded-xl border border-white/5">
                <Users className="h-4 w-4 text-bd-teal-400 ml-2" />
                <span className="text-xs font-medium text-slate-300">Passengers:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPassengers(num)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all ${
                        passengers === num
                          ? "bg-bd-teal-500 text-bd-navy-950 shadow-md shadow-bd-teal-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="sm:col-span-7">
                <Button
                  type="submit"
                  id="search-buses-btn"
                  className="w-full h-12 gradient-teal hover:opacity-95 text-bd-navy-950 font-bold text-base rounded-xl shadow-xl shadow-bd-teal-500/25 transition-all hover:shadow-bd-teal-500/40 hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" strokeWidth={2.5} />
                  Search Buses
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Quick Micro Features */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-bd-teal-400" />
            100% Verified Operators
          </span>
          <span className="flex items-center gap-1.5">
            <Bus className="h-4 w-4 text-bd-emerald-400" />
            Instant Seat Lock & Digital QR Ticket
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-bd-teal-400" />
            All 64 Bangladesh Districts Covered
          </span>
        </div>
      </div>
    </section>
  );
}
