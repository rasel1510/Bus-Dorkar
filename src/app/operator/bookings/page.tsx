"use client";

import { useState } from "react";
import {
  Ticket,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Phone,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Filter,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface BookingManifestItem {
  id: string;
  bookingCode: string;
  passengerName: string;
  phone: string;
  route: string;
  departureTime: string;
  travelDate: string;
  seats: string[];
  totalFare: number;
  paymentMethod: "BKASH" | "NAGAD" | "CARD" | "COUNTER_CASH";
  status: "CONFIRMED" | "CHECKED_IN" | "CANCELLED";
  qrVerified: boolean;
}

const INITIAL_BOOKINGS: BookingManifestItem[] = [
  {
    id: "BK-01",
    bookingCode: "BD-20260814-8X92KD",
    passengerName: "Tanzim Hasan",
    phone: "+880 1711-223344",
    route: "Dhaka (Sayedabad) → Cox's Bazar",
    departureTime: "08:30 PM",
    travelDate: "Today",
    seats: ["A1", "A2"],
    totalFare: 3600,
    paymentMethod: "BKASH",
    status: "CHECKED_IN",
    qrVerified: true,
  },
  {
    id: "BK-02",
    bookingCode: "BD-20260814-5M11QR",
    passengerName: "Farhana Yasmin",
    phone: "+880 1819-334455",
    route: "Dhaka (Rajarbagh) → Sylhet",
    departureTime: "10:15 AM",
    travelDate: "Today",
    seats: ["B3"],
    totalFare: 1200,
    paymentMethod: "NAGAD",
    status: "CONFIRMED",
    qrVerified: false,
  },
  {
    id: "BK-03",
    bookingCode: "BD-20260814-9P44LX",
    passengerName: "Dr. Nabila Rahman",
    phone: "+880 1912-556677",
    route: "Dhaka (Sayedabad) → Chattogram",
    departureTime: "08:00 AM",
    travelDate: "Today",
    seats: ["C1", "C2", "C3"],
    totalFare: 3900,
    paymentMethod: "CARD",
    status: "CHECKED_IN",
    qrVerified: true,
  },
  {
    id: "BK-04",
    bookingCode: "BD-20260814-2K88TN",
    passengerName: "Mokhlesur Rahman",
    phone: "+880 1715-667788",
    route: "Dhaka (Gabtoli) → Rajshahi",
    departureTime: "01:30 PM",
    travelDate: "Today",
    seats: ["D1", "D2"],
    totalFare: 2200,
    paymentMethod: "BKASH",
    status: "CONFIRMED",
    qrVerified: false,
  },
  {
    id: "BK-05",
    bookingCode: "BD-20260814-7R99AB",
    passengerName: "Ahsan Habib",
    phone: "+880 1814-778899",
    route: "Dhaka (Rajarbagh) → Cox's Bazar",
    departureTime: "10:00 PM",
    travelDate: "Today",
    seats: ["E1"],
    totalFare: 1800,
    paymentMethod: "COUNTER_CASH",
    status: "CONFIRMED",
    qrVerified: false,
  },
  {
    id: "BK-06",
    bookingCode: "BD-20260814-3X12OP",
    passengerName: "Rafiqul Islam",
    phone: "+880 1718-990011",
    route: "Dhaka (Sayedabad) → Sylhet",
    departureTime: "07:15 AM",
    travelDate: "Today",
    seats: ["F2"],
    totalFare: 1200,
    paymentMethod: "BKASH",
    status: "CANCELLED",
    qrVerified: false,
  },
];

export default function OperatorBookingsPage() {
  const [bookings, setBookings] = useState<BookingManifestItem[]>(INITIAL_BOOKINGS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const toggleCheckIn = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const nextStatus = b.status === "CHECKED_IN" ? "CONFIRMED" : "CHECKED_IN";
        return { ...b, status: nextStatus, qrVerified: nextStatus === "CHECKED_IN" };
      })
    );
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.passengerName.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.route.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const checkedInCount = bookings.filter((b) => b.status === "CHECKED_IN").length;
  const totalRevenue = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((acc, curr) => acc + curr.totalFare, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Passenger Manifest & Ticket Oversight
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Aligned with Sections 12, 14 & 15: Digital tickets, QR check-in, and seat assignments.
          </p>
        </div>

        <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-xs font-mono self-start sm:self-auto">
          ● Live Manifest Stream
        </Badge>
      </div>

      {/* Quick Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Total Manifest</span>
          <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
            {bookings.length} Passengers
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Boarded / Checked-In</span>
          <span className="text-xl font-black text-emerald-700 font-mono mt-0.5 block">
            {checkedInCount} Boarded
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Pending Boarding</span>
          <span className="text-xl font-black text-amber-700 font-mono mt-0.5 block">
            {bookings.filter((b) => b.status === "CONFIRMED").length} Upcoming
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Gross Settled</span>
          <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
            ৳{totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search booking code (e.g. BD-2026), passenger name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked-In</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Manifest Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Booking Reference</th>
                <th className="p-3.5">Passenger Details</th>
                <th className="p-3.5">Route & Departure</th>
                <th className="p-3.5">Seats</th>
                <th className="p-3.5">Fare & Gateway</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-teal-600" />
                      <span>{item.bookingCode}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Date: {item.travelDate}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{item.passengerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{item.phone}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-800">{item.route}</div>
                    <div className="text-[11px] text-teal-700 font-mono">{item.departureTime}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {item.seats.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800 text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-slate-900">৳{item.totalFare}</div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      via {item.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <Badge
                      className={`text-[10px] font-semibold ${
                        item.status === "CHECKED_IN"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : item.status === "CONFIRMED"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {item.status === "CHECKED_IN"
                        ? "Checked-In"
                        : item.status === "CONFIRMED"
                        ? "Confirmed"
                        : "Cancelled"}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    {item.status !== "CANCELLED" && (
                      <Button
                        size="sm"
                        variant={item.status === "CHECKED_IN" ? "outline" : "default"}
                        onClick={() => toggleCheckIn(item.id)}
                        className={`h-7 text-xs font-semibold rounded-lg ${
                          item.status === "CHECKED_IN"
                            ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                            : "gradient-teal text-white shadow-xs"
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5 mr-1" />
                        {item.status === "CHECKED_IN" ? "Undo Check-In" : "Check-In"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
