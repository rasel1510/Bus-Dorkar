"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Bus,
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
  RotateCcw,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DepartureItem {
  id: string;
  departureTime: string;
  route: string;
  coachReg: string;
  busType: string;
  driverName: string;
  driverPhone: string;
  bookedSeats: number;
  totalSeats: number;
  status: "BOARDING" | "SCHEDULED" | "DEPARTED" | "DELAYED";
}

const DEMO_DEPARTURES: DepartureItem[] = [
  {
    id: "DEP-101",
    departureTime: "06:30 AM",
    route: "Dhaka (Sayedabad) → Cox's Bazar",
    coachReg: "Dhaka Metro-B 14-8891",
    busType: "Scania K410 Multi-Axle",
    driverName: "Md. Alamgir Hossain",
    driverPhone: "+880 1711-234567",
    bookedSeats: 36,
    totalSeats: 36,
    status: "DEPARTED",
  },
  {
    id: "DEP-102",
    departureTime: "08:00 AM",
    route: "Dhaka (Rajarbagh) → Chattogram (Dampara)",
    coachReg: "Dhaka Metro-B 15-2234",
    busType: "Volvo B11R 9600",
    driverName: "Kalam Sheikh",
    driverPhone: "+880 1819-345678",
    bookedSeats: 34,
    totalSeats: 36,
    status: "DEPARTED",
  },
  {
    id: "DEP-103",
    departureTime: "10:15 AM",
    route: "Dhaka (Sayedabad) → Sylhet (Kadamtali)",
    coachReg: "Dhaka Metro-B 12-9901",
    busType: "Scania Touring VIP",
    driverName: "Anisur Rahman",
    driverPhone: "+880 1912-456789",
    bookedSeats: 31,
    totalSeats: 36,
    status: "BOARDING",
  },
  {
    id: "DEP-104",
    departureTime: "01:30 PM",
    route: "Dhaka (Gabtoli) → Rajshahi (Shiroil)",
    coachReg: "Dhaka Metro-B 16-7782",
    busType: "Scania Multi-Axle",
    driverName: "Rafiqul Islam",
    driverPhone: "+880 1715-567890",
    bookedSeats: 28,
    totalSeats: 36,
    status: "SCHEDULED",
  },
  {
    id: "DEP-105",
    departureTime: "08:30 PM",
    route: "Dhaka (Rajarbagh) → Cox's Bazar (Jhawtala)",
    coachReg: "Dhaka Metro-B 18-3321",
    busType: "Double Decker Sleeper",
    driverName: "Zahirul Haque",
    driverPhone: "+880 1812-678901",
    bookedSeats: 26,
    totalSeats: 28,
    status: "SCHEDULED",
  },
  {
    id: "DEP-106",
    departureTime: "10:00 PM",
    route: "Dhaka (Sayedabad) → Chattogram",
    coachReg: "Dhaka Metro-B 14-5510",
    busType: "Scania Multi-Axle",
    driverName: "Harunur Rashid",
    driverPhone: "+880 1718-789012",
    bookedSeats: 32,
    totalSeats: 36,
    status: "SCHEDULED",
  },
];

export default function OperatorDashboardPage() {
  const [departures, setDepartures] = useState<DepartureItem[]>(DEMO_DEPARTURES);

  const toggleStatus = (id: string) => {
    setDepartures((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const nextStatus =
          d.status === "SCHEDULED"
            ? "BOARDING"
            : d.status === "BOARDING"
            ? "DEPARTED"
            : "SCHEDULED";
        return { ...d, status: nextStatus };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Fleet Command & Revenue HQ
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Real-time highway operations, ticket settlement, and coach dispatch control.
          </p>
        </div>

        {/* Quick link shortcuts */}
        <div className="flex items-center gap-2">
          <Link href="/operator/buses">
            <Button
              variant="outline"
              className="h-9 text-xs font-semibold border-slate-300 rounded-xl"
            >
              <Bus className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
              Manage Buses
            </Button>
          </Link>
          <Link href="/operator/bookings">
            <Button className="gradient-teal text-white h-9 text-xs font-semibold rounded-xl shadow-xs">
              <Ticket className="w-3.5 h-3.5 mr-1.5" />
              Passenger Manifest
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards (Section 17 of Project Spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today&apos;s Ticket Gross
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              ৳
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              ৳4,82,450
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% vs yesterday</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono border-t border-slate-100 pt-2">
            Weekly total: ৳31,40,200
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Confirmed Seats
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              342 Bookings
            </div>
            <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Digital QR verified</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono border-t border-slate-100 pt-2">
            18 cancelled according to policy
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Occupancy Load
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              89.4%
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: "89.4%" }} />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono border-t border-slate-100 pt-2">
            Highest load: Dhaka ↔ Cox&apos;s Bazar (98%)
          </div>
        </div>

        {/* Today's Departures */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today&apos;s Trips
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              42 Departures
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>97.4% On-time dispatch</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono border-t border-slate-100 pt-2">
            18 completed • 6 boarding • 18 upcoming
          </div>
        </div>
      </div>

      {/* Fleet Status & Operational Short Cuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Departures Board (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Live Highway Departures Board
              </h2>
              <p className="text-xs text-slate-500">
                Real-time coach assignments and passenger boarding statuses.
              </p>
            </div>
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px] font-mono">
              Auto-sync: 10s
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3 rounded-tl-xl">Departure</th>
                  <th className="p-3">Route Corridor</th>
                  <th className="p-3">Assigned Coach</th>
                  <th className="p-3">Occupancy</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-tr-xl text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departures.map((dep) => {
                  const occPct = Math.round((dep.bookedSeats / dep.totalSeats) * 100);
                  return (
                    <tr key={dep.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {dep.departureTime}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">
                        <div>{dep.route}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          Driver: {dep.driverName} ({dep.driverPhone})
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-mono text-slate-800">{dep.coachReg}</div>
                        <div className="text-[10px] text-teal-700">{dep.busType}</div>
                      </td>
                      <td className="p-3 font-mono">
                        <div className="font-bold text-slate-900">
                          {dep.bookedSeats}/{dep.totalSeats} ({occPct}%)
                        </div>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              occPct >= 90
                                ? "bg-emerald-600"
                                : occPct >= 70
                                ? "bg-teal-600"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${occPct}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          className={`text-[10px] font-semibold ${
                            dep.status === "DEPARTED"
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : dep.status === "BOARDING"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 animate-pulse"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {dep.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          onClick={() => toggleStatus(dep.id)}
                          className="h-7 text-[11px] font-semibold text-teal-700 hover:text-teal-900 px-2"
                        >
                          Toggle Status
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet & Management Quick Modules */}
        <div className="space-y-6">
          {/* Fleet Status Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Fleet Readiness Summary
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-800">Active on Highway</span>
                </div>
                <span className="font-mono font-bold text-slate-900">28 Coaches</span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span className="font-semibold text-slate-800">Terminal Ready / Boarding</span>
                </div>
                <span className="font-mono font-bold text-slate-900">8 Coaches</span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-slate-800">Scheduled Maintenance</span>
                </div>
                <span className="font-mono font-bold text-slate-900">3 Coaches</span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="font-semibold text-slate-800">Reserve Standby</span>
                </div>
                <span className="font-mono font-bold text-slate-900">6 Coaches</span>
              </div>
            </div>

            <Link href="/operator/buses" className="block pt-1">
              <Button
                variant="outline"
                className="w-full text-xs font-semibold border-slate-300 text-slate-700 h-9 rounded-xl"
              >
                View Full Fleet Registry →
              </Button>
            </Link>
          </div>

          {/* Quick Hub Navigation Links */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Management Modules
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/operator/routes"
                className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/60 hover:bg-white transition-all space-y-1 block"
              >
                <MapPin className="w-4 h-4 text-teal-600" />
                <span className="block font-bold text-slate-800">Routes</span>
                <span className="text-[10px] text-slate-400">Schedules & Fares</span>
              </Link>
              <Link
                href="/operator/counters"
                className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/60 hover:bg-white transition-all space-y-1 block"
              >
                <Building2 className="w-4 h-4 text-teal-600" />
                <span className="block font-bold text-slate-800">Counters</span>
                <span className="text-[10px] text-slate-400">Staff & Terminals</span>
              </Link>
              <Link
                href="/operator/bookings"
                className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/60 hover:bg-white transition-all space-y-1 block"
              >
                <Ticket className="w-4 h-4 text-teal-600" />
                <span className="block font-bold text-slate-800">Manifest</span>
                <span className="text-[10px] text-slate-400">QR Check-in</span>
              </Link>
              <Link
                href="/operator/policy"
                className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/60 hover:bg-white transition-all space-y-1 block"
              >
                <RotateCcw className="w-4 h-4 text-teal-600" />
                <span className="block font-bold text-slate-800">Refunds</span>
                <span className="text-[10px] text-slate-400">Section 27 Rules</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
