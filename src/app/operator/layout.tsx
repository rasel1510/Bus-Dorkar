"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { BANGLADESH_OPERATORS, OperatorDetailedProfile } from "@/lib/data/operators-data";
import {
  LayoutDashboard,
  Bus,
  MapPin,
  Clock,
  Building2,
  Ticket,
  RotateCcw,
  Users,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  Bell,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/operator/dashboard", label: "Dashboard HQ", icon: LayoutDashboard, badge: "LIVE" },
  { href: "/operator/buses", label: "Bus Fleet Management", icon: Bus },
  { href: "/operator/routes", label: "Routes & Schedules", icon: MapPin },
  { href: "/operator/counters", label: "Counter Terminals", icon: Building2 },
  { href: "/operator/bookings", label: "Passenger Manifest", icon: Ticket, badge: "Real-time" },
  { href: "/operator/policy", label: "Refund & Cancellation", icon: RotateCcw },
];

export default function OperatorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [selectedOpId, setSelectedOpId] = useState("green-line");
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentOp: OperatorDetailedProfile =
    BANGLADESH_OPERATORS.find((o) => o.id === selectedOpId) || BANGLADESH_OPERATORS[0];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/operator/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center text-white">
            <Bus className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">Bus Dorkar</div>
            <div className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
              Operator Portal
            </div>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:flex flex-col w-full md:w-68 lg:w-72 bg-white border-r border-slate-200 shrink-0 z-40 fixed md:sticky top-0 h-screen overflow-y-auto shadow-xs`}
      >
        {/* Portal Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public App</span>
            </Link>
            <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] font-mono">
              B2B OPS
            </Badge>
          </div>

          <Link href="/operator/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-teal p-0.5 shadow-md shadow-teal-600/20 flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                Operator HQ
              </h1>
              <p className="text-[11px] text-slate-500 font-mono font-semibold">FLEET COMMAND CENTER</p>
            </div>
          </Link>
        </div>

        {/* Operator Switcher (For Pair Programming / Demo) */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Managing Operator</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <select
            value={selectedOpId}
            onChange={(e) => setSelectedOpId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
          >
            {BANGLADESH_OPERATORS.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
              </option>
            ))}
          </select>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
            <span>BRTA: {currentOp.brtaRegistrationNo.split("-")[1] || "VERIFIED"}</span>
            <Link
              href={`/operators/${currentOp.slug}`}
              target="_blank"
              className="text-teal-700 hover:underline font-bold flex items-center gap-1"
            >
              Public Profile <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 flex-1">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Operator Management
          </div>
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      active ? "text-teal-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      active
                        ? "bg-teal-500/30 text-teal-300"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Operator Status & Support */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentOp.logoBg} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
              {currentOp.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">
                {currentOp.name}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active & Booking Ready
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-800">
              {currentOp.name} — Command Operations
            </h2>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
              Active Fleet: {currentOp.fleetCount} Coaches
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link href={`/operators/${currentOp.slug}`} target="_blank">
              <Button
                variant="outline"
                className="h-8 text-xs font-semibold border-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                <span>View Public Page</span>
              </Button>
            </Link>
            <Link href="/timetable">
              <Button
                variant="ghost"
                className="h-8 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                National Timetable
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
