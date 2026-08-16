"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Users, ArrowRightLeft, Search, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DistrictCombobox } from "@/components/ui/district-combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("@/components/home/interactive-map").then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[450px] w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 font-semibold text-sm">
        Loading Interactive Bangladesh Map...
      </div>
    ),
  }
);

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
    <section className="relative pt-24 pb-12 bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {/* ===== TOP: HIGH-CONTRAST LIGHT SEARCH CARD ===== */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-200">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Bus Type Filters */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 mr-1">Bus Type:</span>
                {[
                  { id: "all", label: "All Buses" },
                  { id: "ac", label: "AC Bus" },
                  { id: "non-ac", label: "Non-AC Bus" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setBusType(t.id as any)}
                    className={`text-xs px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                      busType === t.id
                        ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 text-teal-700">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  Verified Inter-District Operators
                </span>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              {/* FROM DISTRICT */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-teal-600" />
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
                  className="rounded-full bg-slate-100 border-slate-300 hover:bg-teal-50 hover:border-teal-600 text-teal-700 h-10 w-10 shrink-0 transition-all hover:rotate-180 cursor-pointer"
                  title="Swap Origin & Destination"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* TO DISTRICT */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
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
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-teal-600" />
                  Journey Date
                </label>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        id="search-date-btn"
                        variant="outline"
                        className="w-full justify-start bg-slate-50 border-slate-300 text-left font-semibold text-slate-900 hover:bg-slate-100 hover:border-teal-600 h-12 rounded-xl"
                      />
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                    {date ? format(date, "dd MMM yyyy") : <span>Pick date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-slate-200 text-slate-900 shadow-2xl z-50">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="bg-white text-slate-900 rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Bottom Row: Passengers & Submit */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2">
              {/* Passengers */}
              <div className="sm:col-span-5 flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Users className="h-4 w-4 text-teal-600 ml-2" />
                <span className="text-xs font-bold text-slate-700">Passengers:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPassengers(num)}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                        passengers === num
                          ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                          : "text-slate-700 hover:bg-slate-200"
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
                  className="w-full h-12 gradient-teal hover:opacity-95 text-white font-extrabold text-base rounded-xl shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            onSelectToDistrict={(id) => setToDistrict(id)}
          />
        </div>
      </div>
    </section>
  );
}
