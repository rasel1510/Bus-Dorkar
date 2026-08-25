"use client";

import { useState } from "react";
import { Ticket, Search, CheckCircle2, RefreshCw, XCircle, RotateCcw, Filter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingItem {
  id: string;
  bookingCode: string;
  passengerName: string;
  operator: string;
  routeName: string;
  seats: string[];
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const mockBookings: BookingItem[] = [
  {
    id: "b-101",
    bookingCode: "BD-20260821-X901",
    passengerName: "Tanvir Ahmed",
    operator: "Green Line Paribahan",
    routeName: "Dhaka → Chittagong",
    seats: ["A1", "A2"],
    amount: 2400,
    status: "CONFIRMED",
    paymentMethod: "bKash",
    createdAt: "2026-08-21T14:30:00.000Z",
  },
  {
    id: "b-102",
    bookingCode: "BD-20260821-K412",
    passengerName: "Tanvir Hossain",
    operator: "Hanif Enterprise",
    routeName: "Dhaka → Sylhet",
    seats: ["B3"],
    amount: 950,
    status: "CONFIRMED",
    paymentMethod: "Nagad",
    createdAt: "2026-08-21T15:10:00.000Z",
  },
  {
    id: "b-103",
    bookingCode: "BD-20260821-M883",
    passengerName: "Nusrat Jahan",
    operator: "Shyamoli NR Travels",
    routeName: "Dhaka → Rajshahi",
    seats: ["C1", "C2"],
    amount: 1700,
    status: "PENDING",
    paymentMethod: "SSLCOMMERZ",
    createdAt: "2026-08-21T16:05:00.000Z",
  },
  {
    id: "b-104",
    bookingCode: "BD-20260820-Z771",
    passengerName: "Kamrul Islam",
    operator: "Shohag Paribahan",
    routeName: "Dhaka → Cox's Bazar",
    seats: ["D1"],
    amount: 1500,
    status: "CANCELLED",
    paymentMethod: "bKash",
    createdAt: "2026-08-20T11:20:00.000Z",
  },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(mockBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [notice, setNotice] = useState("");

  const handleCancelAndRefund = (bookingCode: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingCode === bookingCode ? { ...b, status: "CANCELLED" } : b))
    );
    setNotice(`Ticket ${bookingCode} cancelled and 100% refund initiated.`);
    setTimeout(() => setNotice(""), 4000);
  };

  const filtered = bookings.filter((b) => {
    const matchesFilter = statusFilter === "ALL" || b.status === statusFilter;
    const matchesSearch =
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.passengerName.toLowerCase().includes(search.toLowerCase()) ||
      b.operator.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Ticket className="h-6 w-6 text-emerald-600" /> Global Ticket Oversight & Seat Lock Control
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor real-time passenger reservations across all bus operators, override seat locks, and process emergency refunds.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {notice}
        </div>
      )}

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "CONFIRMED", "PENDING", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket code or passenger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-64 bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 pl-9 pr-3 rounded-xl focus:outline-none focus:border-emerald-600 font-medium"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Ticket Code</th>
                <th className="px-5 py-3.5">Passenger</th>
                <th className="px-5 py-3.5">Operator & Route</th>
                <th className="px-5 py-3.5">Seats & Fare</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Emergency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-teal-700">
                    {b.bookingCode}
                    <span className="block text-[10px] text-slate-400 font-normal">Via {b.paymentMethod}</span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900 text-xs">{b.passengerName}</p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">{b.operator}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="h-3 w-3 text-teal-600" /> {b.routeName}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-mono">
                    <span className="text-slate-700 font-medium">{b.seats.join(", ")}</span>
                    <p className="font-bold text-emerald-700 text-xs mt-0.5">৳{b.amount.toLocaleString()}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border font-bold ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : b.status === "CANCELLED"
                          ? "bg-red-50 text-red-800 border-red-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    {b.status !== "CANCELLED" ? (
                      <Button
                        onClick={() => handleCancelAndRefund(b.bookingCode)}
                        size="sm"
                        className="bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 text-xs font-bold h-8 rounded-lg cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1 text-red-600" /> Refund & Cancel
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono font-medium">Refunded</span>
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
