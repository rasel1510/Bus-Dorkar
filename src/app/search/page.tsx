"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { allDistricts } from "@/lib/data/districts";
import { getBusTripsForRoute, BusTrip } from "@/lib/data/buses";
import { DistrictCombobox } from "@/components/ui/district-combobox";
import { SearchFilters } from "@/components/search/search-filters";
import { BusTripCard } from "@/components/search/bus-trip-card";
import { SeatSelectorModal } from "@/components/search/seat-selector-modal";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  MapPin,
  Calendar as CalendarIcon,
  ArrowRightLeft,
  ArrowRight,
  Info,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const { language, t, tNum, tDistrict } = useLanguage();

  const initialFrom = searchParams.get("from") || "dhaka";
  const initialTo = searchParams.get("to") || "coxs-bazar";
  const initialDateStr = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");

  const [fromDistrictId, setFromDistrictId] = useState(initialFrom);
  const [toDistrictId, setToDistrictId] = useState(initialTo);
  const [date, setDate] = useState<Date | undefined>(
    initialDateStr ? new Date(initialDateStr) : new Date()
  );

  const [timeFilter, setTimeFilter] = useState("all");
  const [busTypeFilter, setBusTypeFilter] = useState("all");
  const [operatorFilter, setOperatorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("earliest");

  const [activeTripForModal, setActiveTripForModal] = useState<BusTrip | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fromDistrict = allDistricts.find((d) => d.id === fromDistrictId) || allDistricts[0];
  const toDistrict = allDistricts.find((d) => d.id === toDistrictId) || allDistricts[1];

  const handleSwap = () => {
    const temp = fromDistrictId;
    setFromDistrictId(toDistrictId);
    setToDistrictId(temp);
  };

  const rawTrips = useMemo(() => {
    return getBusTripsForRoute(
      fromDistrict.id,
      toDistrict.id,
      fromDistrict.name,
      toDistrict.name,
      date ? format(date, "yyyy-MM-dd") : ""
    );
  }, [fromDistrict, toDistrict, date]);

  const filteredTrips = useMemo(() => {
    let result = [...rawTrips];

    if (timeFilter === "morning") {
      result = result.filter((t) => t.departure24h >= 6 && t.departure24h < 12);
    } else if (timeFilter === "afternoon") {
      result = result.filter((t) => t.departure24h >= 12 && t.departure24h < 18);
    } else if (timeFilter === "night") {
      result = result.filter((t) => t.departure24h >= 18 || t.departure24h < 6);
    }

    if (busTypeFilter === "ac") {
      result = result.filter((t) => t.busType === "AC_SCANIA" || t.busType === "AC_VOLVO");
    } else if (busTypeFilter === "non-ac") {
      result = result.filter((t) => t.busType === "NON_AC_DELUXE");
    } else if (busTypeFilter === "sleeper") {
      result = result.filter((t) => t.busType === "SLEEPER_LUXURY");
    }

    if (operatorFilter !== "all") {
      result = result.filter((t) => t.operatorId === operatorFilter);
    }

    if (sortBy === "earliest") {
      result.sort((a, b) => a.departure24h - b.departure24h);
    } else if (sortBy === "fare-low") {
      result.sort((a, b) => a.fareBDT - b.fareBDT);
    } else if (sortBy === "fare-high") {
      result.sort((a, b) => b.fareBDT - a.fareBDT);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.operatorRating - a.operatorRating);
    }

    return result;
  }, [rawTrips, timeFilter, busTypeFilter, operatorFilter, sortBy]);

  const handleOpenSeatModal = (trip: BusTrip) => {
    setActiveTripForModal(trip);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        {/* TOP COMPACT ROUTE ADJUSTER */}
        <section className="bg-white border-b border-slate-200 py-3">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto flex-1">
                <div className="w-full flex-1">
                  <DistrictCombobox
                    value={fromDistrictId}
                    onChange={setFromDistrictId}
                    placeholder={t("select_from_district")}
                    disabledDistrictId={toDistrictId}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleSwap}
                  className="rounded-lg bg-slate-50 border-slate-300 text-teal-700 h-10 w-10 shrink-0 cursor-pointer my-0.5 sm:my-0"
                  title={language === "bn" ? "স্থান অদলবদল করুন" : "Swap Origin & Destination"}
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                </Button>
                <div className="w-full flex-1">
                  <DistrictCombobox
                    value={toDistrictId}
                    onChange={setToDistrictId}
                    placeholder={t("select_to_district")}
                    disabledDistrictId={fromDistrictId}
                  />
                </div>
              </div>

              <div className="w-full md:w-48">
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-slate-50 border-slate-300 text-left font-bold text-slate-900 h-10 rounded-xl text-xs"
                      />
                    }
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-teal-600" />
                    {date ? (
                      <span>
                        {language === "bn"
                          ? tNum(format(date, "dd")) + " " + format(date, "MMM yyyy")
                          : format(date, "dd MMM yyyy")}
                      </span>
                    ) : (
                      <span>{t("departure_date")}</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-slate-200 text-slate-900 shadow-xl z-50">
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
          </div>
        </section>

        {/* MAIN RESULTS AREA */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-6 space-y-4">
          {/* Route Title */}
          <div className="flex items-center justify-between pt-1">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>{tDistrict(fromDistrict.name)}</span>
              <ArrowRight className="h-4 w-4 text-teal-600" />
              <span>{tDistrict(toDistrict.name)}</span>
            </h1>
            <span className="text-xs font-semibold text-slate-500">
              {date ? (
                language === "bn"
                  ? `${tNum(format(date, "dd"))} ${format(date, "MMMM yyyy")}`
                  : format(date, "EEEE, dd MMMM yyyy")
              ) : (
                t("today")
              )}
            </span>
          </div>

          {/* FILTER BAR */}
          <SearchFilters
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            busTypeFilter={busTypeFilter}
            setBusTypeFilter={setBusTypeFilter}
            operatorFilter={operatorFilter}
            setOperatorFilter={setOperatorFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalResults={filteredTrips.length}
          />

          {/* BUS TRIPS LISTING */}
          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm space-y-2">
              <Info className="h-6 w-6 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">
                {t("no_buses_found")}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t("try_adjusting_filters")}
              </p>
              <Button
                onClick={() => {
                  setTimeFilter("all");
                  setBusTypeFilter("all");
                  setOperatorFilter("all");
                }}
                className="gradient-teal text-white font-bold text-xs px-4 h-9 rounded-lg shadow-sm cursor-pointer mt-1"
              >
                {t("filter_reset")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTrips.map((trip) => (
                <BusTripCard
                  key={trip.id}
                  trip={trip}
                  onSelectTrip={handleOpenSeatModal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* SEAT MODAL */}
      <SeatSelectorModal
        trip={activeTripForModal}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dateStr={date ? format(date, "dd MMM yyyy") : "Today"}
      />

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-slate-600 font-bold text-sm">
          Loading bus timetables...
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
