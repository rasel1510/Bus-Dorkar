"use client";

import { BusTrip } from "@/lib/data/buses";
import { Button } from "@/components/ui/button";
import {
  Bus,
  Clock,
  ShieldCheck,
  Star,
  ArrowRight,
  Armchair,
} from "lucide-react";

interface BusTripCardProps {
  trip: BusTrip;
  onSelectTrip: (trip: BusTrip) => void;
}

export function BusTripCard({ trip, onSelectTrip }: BusTripCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-5 shadow-sm hover:shadow-md hover:border-teal-500 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
        {/* Left: Operator & Type */}
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${trip.operatorLogoBg} flex items-center justify-center text-white shrink-0 shadow-sm`}>
              <Bus className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-slate-900">
                  {trip.operatorName}
                </h3>
                {trip.isVerified && (
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mt-0.5">
                <span>{trip.busTypeLabel}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-amber-700 font-bold">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {trip.operatorRating}
                </span>
              </div>
            </div>
          </div>

          {/* Price badge visible on mobile top-right */}
          <div className="md:hidden text-right">
            <span className="text-base font-black text-slate-900 block">
              ৳ {trip.fareBDT}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold">
              {trip.availableSeats} left
            </span>
          </div>
        </div>

        {/* Center: Timetable (Skyss Style) */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 bg-slate-50 px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200">
          <div>
            <span className="text-sm sm:text-base font-black text-slate-900">{trip.departureTime}</span>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 truncate max-w-[90px] sm:max-w-none">{trip.fromDistrictName}</p>
          </div>

          <div className="flex flex-col items-center px-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3 text-teal-600" /> {trip.duration}
            </span>
            <div className="w-16 xs:w-24 sm:w-32 flex items-center gap-1 my-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-600 shrink-0"></div>
              <div className="flex-1 border-t border-dashed border-teal-500"></div>
              <ArrowRight className="h-3 w-3 text-teal-600 shrink-0" />
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm sm:text-base font-black text-slate-900">{trip.arrivalTime}</span>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 truncate max-w-[90px] sm:max-w-none">{trip.toDistrictName}</p>
          </div>
        </div>

        {/* Right: Seat Availability & Price CTA (Desktop + Mobile CTA) */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4">
          <div className="hidden md:block text-right">
            <span className="text-xs text-emerald-700 font-bold block">
              {trip.availableSeats} seats left
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              ৳ {trip.fareBDT}
            </span>
          </div>

          <Button
            type="button"
            onClick={() => onSelectTrip(trip)}
            className="w-full md:w-auto h-11 md:h-10 gradient-teal hover:opacity-95 text-white font-extrabold text-xs sm:text-xs px-4 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Armchair className="h-4 w-4" />
            Select Seats
          </Button>
        </div>
      </div>
    </div>
  );
}
