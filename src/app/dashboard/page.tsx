"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { BookingCard, BookingCardData } from "@/components/dashboard/booking-card";
import {
  ArrowRight,
  Ticket,
  Search,
  User,
  Loader2,
  Shield,
  MapPin,
  Calendar,
  Sparkles,
  Bus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN" || user?.email?.toLowerCase() === "rasel4897981@gmail.com";

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

  const upcomingTrips = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING" || b.status === "PAYMENT_PENDING"
  ).length;
  const completedTrips = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelledTrips = bookings.filter((b) => b.status === "CANCELLED").length;

  const recentBookings = bookings.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Welcome Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 p-5 sm:p-6 text-white shadow-lg shadow-teal-600/15">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-3 right-4 opacity-10">
          <Bus className="h-20 w-20 text-white" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-teal-100 text-xs font-semibold mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              {getGreeting()}
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Passenger"}
            </h1>
            <p className="text-teal-100/90 text-xs font-medium mt-1 max-w-md">
              {isAdmin
                ? "Admin superuser account — manage system operations, staff & users"
                : "Manage your trips, tickets, and travel history from one place"}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <Link href="/admin/dashboard">
                <Button className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 h-9 rounded-xl backdrop-blur-sm border border-white/20 cursor-pointer flex items-center gap-1.5 shadow-sm">
                  <Shield className="h-3.5 w-3.5" />
                  Admin HQ
                </Button>
              </Link>
            )}
            <Link href="/search">
              <Button className="bg-white hover:bg-teal-50 text-teal-800 font-bold text-xs px-4 h-9 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm">
                <Search className="h-3.5 w-3.5" />
                Search Buses
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsCards
        totalBookings={bookings.length}
        upcomingTrips={upcomingTrips}
        completedTrips={completedTrips}
        cancelledTrips={cancelledTrips}
      />

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/search"
            className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5 hover:border-teal-300 hover:shadow-md transition-all group"
          >
            <div className="h-11 w-11 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl flex items-center justify-center group-hover:from-teal-100 group-hover:to-teal-150 transition-colors shrink-0 shadow-sm shadow-teal-100">
              <Search className="h-5 w-5 text-teal-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">Search Buses</p>
              <p className="text-[11px] text-slate-500 font-medium">Find & book new trips</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>

          <Link
            href="/dashboard/bookings"
            className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5 hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <div className="h-11 w-11 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center group-hover:from-emerald-100 group-hover:to-emerald-150 transition-colors shrink-0 shadow-sm shadow-emerald-100">
              <Ticket className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">My Bookings</p>
              <p className="text-[11px] text-slate-500 font-medium">View tickets & history</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>

          <Link
            href="/dashboard/profile"
            className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="h-11 w-11 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-150 transition-colors shrink-0 shadow-sm shadow-blue-100">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">My Profile</p>
              <p className="text-[11px] text-slate-500 font-medium">Update your details</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Bookings</h2>
          {bookings.length > 3 && (
            <Link
              href="/dashboard/bookings"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600 mx-auto" />
            <p className="text-sm text-slate-500 font-medium mt-2.5">Loading your bookings...</p>
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 border-dashed p-10 text-center space-y-4">
            {/* Illustrative empty state */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <Ticket className="h-7 w-7 text-slate-300" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-teal-600" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">No bookings yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Start your journey — search for buses, compare routes, and book your first trip.
              </p>
            </div>
            <Link href="/search">
              <Button className="gradient-teal text-white font-bold text-xs px-5 h-9 rounded-xl shadow-sm shadow-teal-600/15 cursor-pointer">
                <Search className="h-3.5 w-3.5 mr-1.5" />
                Search Buses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentBookings.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
