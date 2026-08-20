"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Armchair,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface BookingCardData {
  id: string;
  bookingCode: string;
  status: string;
  fromDistrict: string;
  toDistrict: string;
  departureTime: string;
  travelDate: string;
  seats: string[];
  totalAmount: number;
  operatorName: string;
  paymentMethod: string;
  createdAt: string;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "COMPLETED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "CANCELLED":
      return "bg-red-50 text-red-600 border-red-200";
    case "PENDING":
    case "PAYMENT_PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "EXPIRED":
      return "bg-slate-100 text-slate-500 border-slate-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export function BookingCard({ booking }: { booking: BookingCardData }) {
  return (
    <Link
      href={`/dashboard/bookings/${booking.id}`}
      className="block bg-white rounded-2xl border border-slate-200 p-4 hover:border-teal-300 hover:shadow-md transition-all group"
    >
      {/* Top Row: Code + Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 tracking-wide">
          {booking.bookingCode}
        </span>
        <Badge
          variant="outline"
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusStyle(booking.status)}`}
        >
          {booking.status.replace("_", " ")}
        </Badge>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-extrabold text-slate-900">{booking.fromDistrict}</span>
        <ArrowRight className="h-3.5 w-3.5 text-teal-600" />
        <span className="text-sm font-extrabold text-slate-900">{booking.toDistrict}</span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 text-slate-400" />
          {booking.travelDate}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-slate-400" />
          {booking.departureTime}
        </div>
        <div className="flex items-center gap-1.5">
          <Armchair className="h-3 w-3 text-slate-400" />
          {booking.seats.join(", ")}
        </div>
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-3 w-3 text-slate-400" />
          {booking.paymentMethod.replace("_", " ")}
        </div>
      </div>

      {/* Footer: Operator + Price */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-[11px] font-semibold text-slate-500">{booking.operatorName}</span>
        <span className="text-sm font-extrabold text-emerald-700">৳ {booking.totalAmount}</span>
      </div>
    </Link>
  );
}
