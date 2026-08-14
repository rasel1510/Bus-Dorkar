"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Users, ArrowRightLeft, Search, Bus, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DistrictCombobox } from "@/components/ui/district-combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { InteractiveMap } from "@/components/home/interactive-map";

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
    <section className="relative pt-20 pb-12 bg-bd-navy-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {/* ===== TOP: GLASSMORPHISM SEARCH CARD ===== */}
        <div className="max-w-5xl mx-auto glass-card rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/50 gradient-border">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Bus Type Filters */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 mr-1">Bus Type:</span>
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

              <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-bd-teal-400" />
                  Verified Inter-District Operators
                </span>
              </div>
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
                  <PopoverTrigger
                    render={
                      <Button
                        id="search-date-btn"
                        variant="outline"
                        className="w-full justify-start bg-bd-navy-900/80 border-white/10 text-left font-normal text-foreground hover:bg-bd-navy-800 hover:border-bd-teal-500/50 h-12 rounded-xl"
                      />
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-bd-teal-400" />
                    {date ? format(date, "dd MMM yyyy") : <span>Pick date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-bd-navy-900 border-white/10 text-foreground z-50">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
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
                  className="w-full h-12 gradient-teal hover:opacity-95 text-bd-navy-950 font-bold text-base rounded-xl shadow-xl shadow-bd-teal-500/25 transition-all hover:shadow-bd-teal-500/40 flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" strokeWidth={2.5} />
                  Search Buses
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* ===== BOTTOM: INTERACTIVE BANGLADESH MAP WITH LIVE LOCATION ===== */}
        <div className="max-w-5xl mx-auto">
          <InteractiveMap
            fromDistrictId={fromDistrict}
            toDistrictId={toDistrict}
            onSelectFromDistrict={(id) => setFromDistrict(id)}
          />
        </div>
      </div>
    </section>
  );
}
