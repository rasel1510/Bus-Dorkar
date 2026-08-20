"use client";

import { useState, useEffect } from "react";
import { BookingCard, BookingCardData } from "@/components/dashboard/booking-card";
import { Loader2, Ticket, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type StatusFilter = "all" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const filterButtons: { label: string; value: StatusFilter; count: number }[] = [
    { label: "All", value: "all", count: bookings.length },
    {
      label: "Upcoming",
      value: "CONFIRMED",
      count: bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING").length,
    },
    {
      label: "Completed",
      value: "COMPLETED",
      count: bookings.filter((b) => b.status === "COMPLETED").length,
    },
    {
      label: "Cancelled",
      value: "CANCELLED",
      count: bookings.filter((b) => b.status === "CANCELLED").length,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">My Bookings</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            View and manage all your bus tickets
          </p>
        </div>
        <Link href="/search">
          <Button className="gradient-teal text-white font-bold text-xs px-4 h-9 rounded-xl shadow-sm cursor-pointer">
            <Search className="h-3.5 w-3.5 mr-1.5" />
            Book New
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterButtons.map((fb) => (
          <button
            key={fb.value}
            onClick={() => setFilter(fb.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === fb.value
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300"
            }`}
          >
            {fb.label}
            <span
              className={`ml-1.5 text-[10px] ${
                filter === fb.value ? "text-teal-100" : "text-slate-400"
              }`}
            >
              {fb.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600 mx-auto" />
          <p className="text-sm text-slate-500 font-medium mt-2">Loading your bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Ticket className="h-10 w-10 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {filter === "all"
                ? "No bookings yet"
                : `No ${filter.toLowerCase()} bookings`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {filter === "all"
                ? "Your booking history will appear here after your first trip."
                : "Try switching to a different filter."}
            </p>
          </div>
          {filter === "all" && (
            <Link href="/search">
              <Button className="gradient-teal text-white font-bold text-xs px-4 h-9 rounded-xl shadow-sm cursor-pointer mt-1">
                Search Buses
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredBookings.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
