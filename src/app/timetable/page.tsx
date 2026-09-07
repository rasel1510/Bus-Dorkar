"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { allDistricts, majorTerminals } from "@/lib/data/districts";
import { getBusTripsForRoute, BusTrip, OPERATOR_PROFILES } from "@/lib/data/buses";
import { DistrictCombobox } from "@/components/ui/district-combobox";
import { SeatSelectorModal } from "@/components/search/seat-selector-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, addDays } from "date-fns";
import {
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  ArrowRightLeft,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ShieldCheck,
  Armchair,
  Building2,
  Phone,
  Navigation,
  Compass,
  CheckCircle2,
  Layers,
  ChevronRight,
  Info,
  SlidersHorizontal,
  Bus,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

// Counter information structure aligned with Section 22 of Project Specification
interface CounterInfo {
  id: string;
  name: string;
  nameBn: string;
  address: string;
  addressBn: string;
  phone: string;
  openingHours: string;
  openingHoursBn: string;
  manager: string;
  districtId: string;
  latitude: number;
  longitude: number;
}

const DISTRICT_COUNTERS: Record<string, CounterInfo[]> = {
  dhaka: [
    {
      id: "sayedabad-main",
      name: "Sayedabad Central Counter Hub",
      nameBn: "সায়েদাবাদ কেন্দ্রীয় কাউন্টার হাব",
      address: "Sayedabad Inter-District Bus Terminal, Jatrabari, Dhaka-1204",
      addressBn: "সায়েদাবাদ আন্তঃজেলা বাস টার্মিনাল, যাত্রাবাড়ী, ঢাকা-১২০৪",
      phone: "+880 1711-002233",
      openingHours: "24 Hours (Round the Clock)",
      openingHoursBn: "২৪ ঘণ্টা (সার্বক্ষণিক খোলা)",
      manager: "Rafiqul Islam",
      districtId: "dhaka",
      latitude: 23.7115,
      longitude: 90.4265,
    },
    {
      id: "gabtoli-terminal",
      name: "Gabtoli North-Bengal Counter",
      nameBn: "গাবতলী উত্তরবঙ্গ কাউন্টার",
      address: "Gabtoli Inter-District Terminal Gate 2, Mirpur, Dhaka-1216",
      addressBn: "গাবতলী আন্তঃজেলা টার্মিনাল গেট ২, মিরপুর, ঢাকা-১২১৬",
      phone: "+880 1819-445566",
      openingHours: "05:30 AM - 11:45 PM",
      openingHoursBn: "সকাল ০৫:৩০ - রাত ১১:৪৫",
      manager: "Anwar Hossain",
      districtId: "dhaka",
      latitude: 23.7806,
      longitude: 90.3436,
    },
    {
      id: "mohakhali-hub",
      name: "Mohakhali Mymensingh/Sylhet Hub",
      nameBn: "মহাখালী ময়মনসিংহ/সিলেট হাব",
      address: "Mohakhali Bus Terminal Main concourse, Dhaka-1212",
      addressBn: "মহাখালী বাস টার্মিনাল মূল ভবন, ঢাকা-১২১২",
      phone: "+880 1912-778899",
      openingHours: "06:00 AM - 11:30 PM",
      openingHoursBn: "সকাল ০৬:০০ - রাত ১১:৩০",
      manager: "Kamrul Hasan",
      districtId: "dhaka",
      latitude: 23.7779,
      longitude: 90.4013,
    },
    {
      id: "kalabagan-vip",
      name: "Kalabagan VIP Executive Counter",
      nameBn: "কলাবাগান ভিআইপি এক্সিকিউটিভ কাউন্টার",
      address: "Mirpur Road, Near Kalabagan Bus Stand, Dhanmondi, Dhaka",
      addressBn: "মিরপুর রোড, কলাবাগান বাস স্ট্যান্ডের কাছে, ধানমন্ডি, ঢাকা",
      phone: "+880 1713-990011",
      openingHours: "06:30 AM - 11:30 PM",
      openingHoursBn: "সকাল ০৬:৩০ - রাত ১১:৩০",
      manager: "Tareq Aziz",
      districtId: "dhaka",
      latitude: 23.7485,
      longitude: 90.3802,
    },
  ],
  "coxs-bazar": [
    {
      id: "kolatoli-beach",
      name: "Kolatoli Beach Main Terminal Counter",
      nameBn: "কলাতলী বীচ মেইন টার্মিনাল কাউন্টার",
      address: "Hotel Motel Zone, Kolatoli Circle, Cox's Bazar",
      addressBn: "হোটেল মোটেল জোন, কলাতলী গোলচত্বর, কক্সবাজার",
      phone: "+880 1814-112233",
      openingHours: "06:00 AM - 11:45 PM",
      openingHoursBn: "সকাল ০৬:০০ - রাত ১১:৪৫",
      manager: "Zahidul Karim",
      districtId: "coxs-bazar",
      latitude: 21.4272,
      longitude: 92.0058,
    },
    {
      id: "jhawtala-point",
      name: "Jhawtala Central Counter",
      nameBn: "ঝাউতলা সেন্ট্রাল কাউন্টার",
      address: "Jhawtala Main Road, Cox's Bazar Sadar",
      addressBn: "ঝাউতলা প্রধান সড়ক, কক্সবাজার সদর",
      phone: "+880 1819-223344",
      openingHours: "07:00 AM - 10:30 PM",
      openingHoursBn: "সকাল ০৭:০০ - রাত ১০:৩০",
      manager: "Farhad Mahmud",
      districtId: "coxs-bazar",
      latitude: 21.4395,
      longitude: 91.9782,
    },
  ],
  chattogram: [
    {
      id: "dampara-main",
      name: "Dampara Central Counter",
      nameBn: "দামপাড়া সেন্ট্রাল কাউন্টার",
      address: "Dampara Bus Station, CDA Avenue, Chattogram",
      addressBn: "দামপাড়া বাস স্টেশন, সিডিএ এভিনিউ, চট্টগ্রাম",
      phone: "+880 1819-556677",
      openingHours: "24 Hours (Round the Clock)",
      openingHoursBn: "২৪ ঘণ্টা (সার্বক্ষণিক খোলা)",
      manager: "Mahfuzur Rahman",
      districtId: "chattogram",
      latitude: 22.3569,
      longitude: 91.7832,
    },
    {
      id: "ak-khan-gate",
      name: "AK Khan Gate Expressway Terminal",
      nameBn: "এ কে খান গেট এক্সপ্রেসওয়ে টার্মিনাল",
      address: "AK Khan More, Dhaka-Chattogram Highway, Chattogram",
      addressBn: "এ কে খান মোড়, ঢাকা-চট্টগ্রাম মহাসড়ক, চট্টগ্রাম",
      phone: "+880 1818-889900",
      openingHours: "06:00 AM - 11:59 PM",
      openingHoursBn: "সকাল ০৬:০০ - রাত ১১:৫৯",
      manager: "Shahidul Alam",
      districtId: "chattogram",
      latitude: 22.3789,
      longitude: 91.7845,
    },
  ],
  sylhet: [
    {
      id: "kadamtoli-central",
      name: "Kadamtoli Central Bus Terminal",
      nameBn: "কদমতলী কেন্দ্রীয় বাস টার্মিনাল",
      address: "Kadamtoli, South Surma, Sylhet-3100",
      addressBn: "কদমতলী, দক্ষিণ সুরমা, সিলেট-৩১০০",
      phone: "+880 1712-334455",
      openingHours: "05:00 AM - 11:30 PM",
      openingHoursBn: "সকাল ০৫:০০ - রাত ১১:৩০",
      manager: "Enamul Hoque",
      districtId: "sylhet",
      latitude: 24.8986,
      longitude: 91.8687,
    },
  ],
};

const TIME_SLOTS = [
  { id: "all", labelEn: "All Departures", labelBn: "সব সময়সূচী", icon: Clock, timeRange: "24 Hours" },
  { id: "morning", labelEn: "Morning", labelBn: "সকাল", icon: Sun, timeRange: "06:00 AM - 12:00 PM" },
  { id: "afternoon", labelEn: "Afternoon", labelBn: "দুপুর", icon: Sunset, timeRange: "12:00 PM - 06:00 PM" },
  { id: "evening", labelEn: "Evening", labelBn: "সন্ধ্যা", icon: Sunset, timeRange: "06:00 PM - 12:00 AM" },
  { id: "night", labelEn: "Night Bus", labelBn: "রাতের বাস", icon: Moon, timeRange: "12:00 AM - 06:00 AM" },
];

const SCHEDULE_TYPES = [
  { id: "all", labelEn: "All Schedules", labelBn: "সকল সময়সূচী" },
  { id: "daily", labelEn: "Daily Fixed", labelBn: "দৈনিক নিয়মিত" },
  { id: "weekly", labelEn: "Weekend Express", labelBn: "সাপ্তাহিক স্পেশাল" },
  { id: "seasonal", labelEn: "Holiday Holiday Special", labelBn: "ঈদ/ছুটি স্পেশাল" },
];

function TimetableContent() {
  const { language, t, tNum, tCurrency, tDuration, tDistance, tTime, tDistrict } = useLanguage();

  const [fromDistrictId, setFromDistrictId] = useState("dhaka");
  const [toDistrictId, setToDistrictId] = useState("coxs-bazar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTimeSlot, setActiveTimeSlot] = useState("all");
  const [activeScheduleType, setActiveScheduleType] = useState("all");
  const [selectedCoachType, setSelectedCoachType] = useState("all");
  const [selectedOperator, setSelectedOperator] = useState("all");

  // Counter Modal State
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [selectedCounterDistrict, setSelectedCounterDistrict] = useState<string>("dhaka");

  // Booking Modal State
  const [activeTripForModal, setActiveTripForModal] = useState<BusTrip | null>(null);
  const [seatModalOpen, setSeatModalOpen] = useState(false);

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
      format(selectedDate, "yyyy-MM-dd")
    );
  }, [fromDistrict, toDistrict, selectedDate]);

  const filteredTrips = useMemo(() => {
    let list = [...rawTrips];

    // Filter by Time Slot (Section 21)
    if (activeTimeSlot === "morning") {
      list = list.filter((t) => t.departure24h >= 6 && t.departure24h < 12);
    } else if (activeTimeSlot === "afternoon") {
      list = list.filter((t) => t.departure24h >= 12 && t.departure24h < 18);
    } else if (activeTimeSlot === "evening") {
      list = list.filter((t) => t.departure24h >= 18 && t.departure24h < 24);
    } else if (activeTimeSlot === "night") {
      list = list.filter((t) => t.departure24h >= 0 && t.departure24h < 6 || t.departure24h >= 22);
    }

    // Filter by Coach Type
    if (selectedCoachType === "ac") {
      list = list.filter((t) => t.busType === "AC_SCANIA" || t.busType === "AC_VOLVO");
    } else if (selectedCoachType === "non-ac") {
      list = list.filter((t) => t.busType === "NON_AC_DELUXE");
    } else if (selectedCoachType === "sleeper") {
      list = list.filter((t) => t.busType === "SLEEPER_LUXURY");
    }

    // Filter by Operator
    if (selectedOperator !== "all") {
      list = list.filter((t) => t.operatorId === selectedOperator);
    }

    return list.sort((a, b) => a.departure24h - b.departure24h);
  }, [rawTrips, activeTimeSlot, selectedCoachType, selectedOperator]);

  const earliestTrip = filteredTrips[0]?.departureTime || "06:30 AM";
  const latestTrip = filteredTrips[filteredTrips.length - 1]?.departureTime || "11:30 PM";

  const handleOpenSeatModal = (trip: BusTrip) => {
    setActiveTripForModal(trip);
    setSeatModalOpen(true);
  };

  const handleOpenCounters = (districtId: string) => {
    setSelectedCounterDistrict(districtId);
    setCounterModalOpen(true);
  };

  const activeCounters = DISTRICT_COUNTERS[selectedCounterDistrict] || [
    {
      id: `${selectedCounterDistrict}-default`,
      name: `${tDistrict(selectedCounterDistrict)} Central Counter`,
      nameBn: `${tDistrict(selectedCounterDistrict)} সেন্ট্রাল কাউন্টার`,
      address: `Main Road Bus Stand, ${tDistrict(selectedCounterDistrict)}`,
      addressBn: `মেইন রোড বাস স্ট্যান্ড, ${tDistrict(selectedCounterDistrict)}`,
      phone: "+880 1711-000000",
      openingHours: "06:00 AM - 10:30 PM",
      openingHoursBn: "সকাল ০৬:০০ - রাত ১০:৩০",
      manager: "Station Manager",
      districtId: selectedCounterDistrict,
      latitude: 23.8103,
      longitude: 90.4125,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        {/* HERO BANNER SECTION */}
        <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Badge className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-mono mb-2">
                  {language === "bn" ? "অফিসিয়াল সময়সূচী ইঞ্জিন" : "Official Timetable Engine"}
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
                  <Clock className="h-7 w-7 text-teal-400 shrink-0" />
                  <span>
                    {language === "bn" ? "আন্তঃজেলা বাস " : "Inter-District Bus "}
                    <span className="gradient-text">{language === "bn" ? "সময়সূচী" : "Timetables"}</span>
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 font-normal">
                  {language === "bn"
                    ? "সকাল, দুপুর, সন্ধ্যা ও রাতের সকল ভেরিফাইড কোচের নিয়মিত সময়সূচী, কাউন্টার ও আসন তালিকা।"
                    : "Real-time departure schedules, morning to night time slots, counter contacts & live seat availability across Bangladesh."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenCounters(fromDistrictId)}
                  className="bg-slate-800/80 hover:bg-slate-700 text-teal-300 border-slate-700 rounded-xl text-xs font-bold h-10 px-3.5 flex items-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  {language === "bn" ? "কাউন্টার খুঁজুন" : "Counter Directory"}
                </Button>
              </div>
            </div>

            {/* QUICK ROUTE & DATE SELECTOR BAR */}
            <div className="bg-slate-800/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-700/70 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
              <div className="md:col-span-4">
                <DistrictCombobox
                  value={fromDistrictId}
                  onChange={setFromDistrictId}
                  placeholder={language === "bn" ? "যাত্রার স্থান" : "From District"}
                  disabledDistrictId={toDistrictId}
                />
              </div>

              <div className="md:col-span-1 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleSwap}
                  className="rounded-xl bg-slate-700 border-slate-600 text-teal-400 hover:text-white hover:bg-teal-600 h-10 w-10 shrink-0 cursor-pointer transition-all"
                  title={language === "bn" ? "স্থান অদলবদল করুন" : "Swap Origin & Destination"}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="md:col-span-4">
                <DistrictCombobox
                  value={toDistrictId}
                  onChange={setToDistrictId}
                  placeholder={language === "bn" ? "গন্তব্য স্থান" : "To District"}
                  disabledDistrictId={fromDistrictId}
                />
              </div>

              <div className="md:col-span-3">
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-slate-50 border-slate-300 text-slate-900 font-bold h-12 rounded-xl text-xs"
                      />
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                    <span>
                      {language === "bn"
                        ? `${tNum(format(selectedDate, "dd"))} ${format(selectedDate, "MMM yyyy")}`
                        : format(selectedDate, "dd MMM yyyy")}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-slate-200 text-slate-900 shadow-xl z-50">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => d && setSelectedDate(d)}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="bg-white text-slate-900 rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* QUICK DATE TABS */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-mono text-[11px] shrink-0">
                {language === "bn" ? "তারিখ:" : "Day:"}
              </span>
              {[
                { labelEn: "Today", labelBn: "আজ", date: new Date() },
                { labelEn: "Tomorrow", labelBn: "আগামীকাল", date: addDays(new Date(), 1) },
                { labelEn: "In 2 Days", labelBn: "২ দিন পর", date: addDays(new Date(), 2) },
                { labelEn: "In 3 Days", labelBn: "৩ দিন পর", date: addDays(new Date(), 3) },
              ].map((tab, idx) => {
                const isSelected = format(selectedDate, "yyyy-MM-dd") === format(tab.date, "yyyy-MM-dd");
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDate(tab.date)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-teal-500 text-white font-extrabold shadow-sm"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {language === "bn" ? tab.labelBn : tab.labelEn} (
                    {language === "bn" ? tNum(format(tab.date, "dd MMM")) : format(tab.date, "dd MMM")})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* TIME SLOTS FILTER BAR (SECTION 21 SPECIFICATION) */}
        <section className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Time slot buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {TIME_SLOTS.map((slot) => {
                  const Icon = slot.icon;
                  const isActive = activeTimeSlot === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setActiveTimeSlot(slot.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? "bg-teal-600 text-white shadow-sm font-black"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-teal-600"}`} />
                      <span>{language === "bn" ? slot.labelBn : slot.labelEn}</span>
                      <span className={`text-[10px] ml-0.5 opacity-80 hidden sm:inline ${isActive ? "text-white" : "text-slate-500"}`}>
                        ({slot.timeRange})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Coach Type Dropdown Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={selectedCoachType}
                  onChange={(e) => setSelectedCoachType(e.target.value)}
                  className="h-9 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 px-3 cursor-pointer outline-none focus:border-teal-600"
                >
                  <option value="all">{language === "bn" ? "সকল কোচ টাইপ" : "All Bus Types"}</option>
                  <option value="ac">{language === "bn" ? "এসি কোচ (Scania/Volvo)" : "AC Coach (Scania/Volvo)"}</option>
                  <option value="sleeper">{language === "bn" ? "স্লিপার ক্লাস" : "Sleeper Class"}</option>
                  <option value="non-ac">{language === "bn" ? "নন-এসি ডিলাক্স" : "Non-AC Deluxe"}</option>
                </select>

                <select
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="h-9 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 px-3 cursor-pointer outline-none focus:border-teal-600 max-w-[150px] truncate"
                >
                  <option value="all">{language === "bn" ? "সকল অপারেটর" : "All Operators"}</option>
                  {OPERATOR_PROFILES.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* TIMETABLE METRICS SUMMARY BAR */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 font-mono">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                {language === "bn" ? "দৈনিক মোট ট্রিপ" : "Total Daily Trips"}
              </span>
              <span className="text-base sm:text-lg font-black text-teal-700">
                {tNum(filteredTrips.length)} {language === "bn" ? "টি বাস" : "Trips"}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                {language === "bn" ? "প্রথম যাত্রা (Earliest)" : "First Departure"}
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {tTime(earliestTrip)}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                {language === "bn" ? "সর্বশেষ রাতের বাস" : "Latest Night Coach"}
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {tTime(latestTrip)}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                {language === "bn" ? "ভাড়া পরিসীমা" : "Fare Range"}
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-700">
                {tCurrency(rawTrips[0]?.fareBDT || 900)}
              </span>
            </div>
          </div>
        </section>

        {/* TIMETABLE SCHEDULE CARDS / LIST */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>{tDistrict(fromDistrict.name)}</span>
              <ArrowRight className="h-4 w-4 text-teal-600 shrink-0" />
              <span>{tDistrict(toDistrict.name)}</span>
              <span className="text-xs font-semibold text-slate-500">
                ({tNum(filteredTrips.length)} {language === "bn" ? "টি শিডিউল পাওয়া গেছে" : "scheduled buses"})
              </span>
            </h2>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenCounters(toDistrictId)}
              className="text-xs font-bold text-slate-700 hover:text-teal-700 border-slate-200 rounded-lg cursor-pointer h-8"
            >
              <Building2 className="h-3.5 w-3.5 mr-1 text-teal-600" />
              {language === "bn" ? "গন্তব্য কাউন্টারসমূহ" : "Arrival Counters"}
            </Button>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3 shadow-xs">
              <Info className="h-8 w-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">
                {language === "bn"
                  ? "নির্বাচিত ফিল্টারে কোনো বাস সময়সূচী পাওয়া যায়নি।"
                  : "No scheduled departures found for selected time slot."}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {language === "bn"
                  ? "অনুগ্রহ করে অন্য কোনো সময় স্লট (যেমন সকাল বা রাত) নির্বাচন করুন অথবা ফিল্টার রিসেট করুন।"
                  : "Try switching time slots (e.g. Morning or Night) or resetting your operator filter."}
              </p>
              <Button
                onClick={() => {
                  setActiveTimeSlot("all");
                  setSelectedCoachType("all");
                  setSelectedOperator("all");
                }}
                className="gradient-teal text-white font-extrabold text-xs px-5 h-9 rounded-xl cursor-pointer"
              >
                {language === "bn" ? "সকল সময়সূচী দেখুন" : "View All Departures"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-teal-500 transition-all group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Operator & Bus Type Info */}
                    <div className="lg:col-span-4 flex items-start gap-3">
                      <div
                        className={`h-11 w-11 rounded-xl bg-gradient-to-br ${trip.operatorLogoBg} flex items-center justify-center text-white shrink-0 shadow-xs`}
                      >
                        <Bus className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-extrabold text-slate-900 truncate">
                            {trip.operatorName}
                          </h3>
                          {trip.isVerified && (
                            <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-600 truncate mt-0.5">
                          {trip.busTypeLabel}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span className="font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            {trip.seatLayout} Layout
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">
                            {tNum(trip.availableSeats)} {language === "bn" ? "টি সিট ফাঁকা" : "seats left"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Departure / Arrival Timeline */}
                    <div className="lg:col-span-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between gap-2">
                        {/* Origin Departure */}
                        <div>
                          <span className="text-base sm:text-lg font-black text-slate-900 font-mono block">
                            {tTime(trip.departureTime)}
                          </span>
                          <span className="text-xs font-bold text-slate-700 truncate block max-w-[110px] sm:max-w-none">
                            {tDistrict(trip.fromDistrictName)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium truncate block max-w-[120px]">
                            {trip.boardingPoints[0]?.split("(")[1]?.replace(")", "") || "Main Counter"}
                          </span>
                        </div>

                        {/* Mid Indicator */}
                        <div className="flex flex-col items-center px-1">
                          <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-0.5 mb-1">
                            <Clock className="h-3 w-3 text-teal-600" /> {tDuration(trip.duration)}
                          </span>
                          <div className="w-16 sm:w-28 flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-teal-600 shrink-0" />
                            <div className="flex-1 border-t border-dashed border-teal-400" />
                            <ArrowRight className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                          </div>
                          <span className="text-[9px] font-mono text-teal-700 font-bold mt-1">
                            {language === "bn" ? "সরাসরি এক্সপ্রেস" : "Non-Stop Express"}
                          </span>
                        </div>

                        {/* Destination Arrival */}
                        <div className="text-right">
                          <span className="text-base sm:text-lg font-black text-slate-900 font-mono block">
                            {tTime(trip.arrivalTime)}
                          </span>
                          <span className="text-xs font-bold text-slate-700 truncate block max-w-[110px] sm:max-w-none">
                            {tDistrict(trip.toDistrictName)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium truncate block max-w-[120px]">
                            {trip.droppingPoints[0]?.split(" ")[0] || "Drop Station"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between gap-2 text-right">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">
                          {t("fare_per_seat")}
                        </span>
                        <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                          {tCurrency(trip.fareBDT)}
                        </span>
                      </div>

                      <Button
                        type="button"
                        onClick={() => handleOpenSeatModal(trip)}
                        className="gradient-teal text-white font-extrabold text-xs px-4 h-10 rounded-xl shadow-xs hover:opacity-95 flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Armchair className="h-4 w-4" />
                        {language === "bn" ? "সিট নির্বাচন করুন" : "Select Seat"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* COUNTER DIRECTORY MODAL (SECTION 22 SPECIFICATION) */}
      <Dialog open={counterModalOpen} onOpenChange={setCounterModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 bg-white border border-slate-200 rounded-2xl shadow-2xl">
          <div className="bg-slate-900 text-white p-6 rounded-t-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-mono">
                {language === "bn" ? "অফিসিয়াল কাউন্টার ও টার্মিনাল ডিরেক্টরি" : "Official Counter Directory"}
              </Badge>
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-teal-400" />
              <span>{tDistrict(selectedCounterDistrict)} {language === "bn" ? "কাউন্টার নেটওয়ার্ক" : "Counters"}</span>
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-1">
              {language === "bn"
                ? "ঠিকানা, সার্বক্ষণিক মোবাইল নম্বর ও খোলার সময়সূচী"
                : "Verified counter address, contact numbers & operational hours."}
            </p>
          </div>

          <div className="p-6 space-y-4">
            {activeCounters.map((counter) => (
              <div
                key={counter.id}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-teal-400 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {language === "bn" ? counter.nameBn : counter.name}
                    </h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <span>{language === "bn" ? counter.addressBn : counter.address}</span>
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] shrink-0 font-bold">
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-700 font-mono">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-teal-600" />
                    <span className="font-bold">{counter.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:col-span-2">
                    <Clock className="h-3 w-3 text-teal-600" />
                    <span className="text-[11px] font-sans">
                      {language === "bn" ? counter.openingHoursBn : counter.openingHours}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setCounterModalOpen(false)}
              className="text-xs font-bold rounded-xl px-5 h-9"
            >
              {language === "bn" ? "বন্ধ করুন" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SEAT SELECTOR MODAL */}
      <SeatSelectorModal
        trip={activeTripForModal}
        open={seatModalOpen}
        onClose={() => setSeatModalOpen(false)}
        dateStr={format(selectedDate, "dd MMM yyyy")}
      />

      <Footer />
    </div>
  );
}

export default function TimetablePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-slate-600 font-bold text-sm">
          Loading Bangladesh Bus Timetables...
        </div>
      }
    >
      <TimetableContent />
    </Suspense>
  );
}
