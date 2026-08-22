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
  Zap,
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] || (isAdmin ? "Admin" : "Passenger")}</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            {isAdmin ? "Admin Superuser Account — Manage system operations, staff & users" : "Manage your trips, tickets, and profile"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link href="/admin/dashboard">
              <Button className="bg-slate-950 hover:bg-slate-900 text-teal-400 font-bold text-xs px-4 h-9 rounded-xl shadow-md border border-teal-500/40 cursor-pointer flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-teal-400" />
                Admin Command HQ
              </Button>
            </Link>
          )}
          <Link href="/search">
            <Button className="gradient-teal text-white font-bold text-xs px-4 h-9 rounded-xl shadow-sm cursor-pointer hidden sm:flex">
              <Search className="h-3.5 w-3.5 mr-1.5" />
              Search Buses
            </Button>
          </Link>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-teal-500/50 p-4 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <p className="text-xs font-black text-white flex items-center gap-2">
                Logged in as Admin: <span className="text-teal-300 font-mono">{user?.email || "rasel4897981@gmail.com"}</span>
              </p>
              <p className="text-[11px] text-slate-400">Access high-throughput parallel ops engine, RBAC role assignment & operator approvals.</p>
            </div>
          </div>
          <Link href="/admin/dashboard">
            <Button className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs h-9 px-4 rounded-xl shrink-0 cursor-pointer">
              Launch Admin Dashboard →
            </Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <StatsCards
        totalBookings={bookings.length}
        upcomingTrips={upcomingTrips}
        completedTrips={completedTrips}
        cancelledTrips={cancelledTrips}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/search"
          className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 hover:border-teal-300 hover:shadow-md transition-all group"
        >
          <div className="h-10 w-10 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
            <Search className="h-5 w-5 text-teal-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">Search Buses</p>
            <p className="text-[11px] text-slate-500 font-medium">Find & book new trips</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
        </Link>

        <Link
          href="/dashboard/bookings"
          className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 hover:border-teal-300 hover:shadow-md transition-all group"
        >
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <Ticket className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">My Bookings</p>
            <p className="text-[11px] text-slate-500 font-medium">View tickets & history</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
        </Link>

        <Link
          href="/dashboard/profile"
          className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 hover:border-teal-300 hover:shadow-md transition-all group"
        >
          <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">My Profile</p>
            <p className="text-[11px] text-slate-500 font-medium">Update your details</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
        </Link>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-slate-900">Recent Bookings</h2>
          {bookings.length > 3 && (
            <Link
              href="/dashboard/bookings"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600 mx-auto" />
            <p className="text-sm text-slate-500 font-medium mt-2">Loading bookings...</p>
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Ticket className="h-8 w-8 text-slate-300 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">No bookings yet</h3>
              <p className="text-xs text-slate-500 mt-0.5">Search for buses and book your first trip!</p>
            </div>
            <Link href="/search">
              <Button className="gradient-teal text-white font-bold text-xs px-4 h-9 rounded-xl shadow-sm cursor-pointer">
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
