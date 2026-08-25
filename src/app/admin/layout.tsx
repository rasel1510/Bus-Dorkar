"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  Cpu,
  Users,
  Building2,
  Ticket,
  ShieldCheck,
  Activity,
  LogOut,
  Bell,
  Search,
  Zap,
  Server,
  Database,
  ArrowLeft,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Command Center", icon: LayoutDashboard, badge: "LIVE" },
  { href: "/admin/passengers", label: "Passengers Directory", icon: Users },
  { href: "/admin/staff", label: "Counter Staff & Drivers", icon: UserCheck },
  { href: "/admin/operators", label: "Bus Operators HQ", icon: Building2, alert: 3 },
  { href: "/admin/operations", label: "Parallel Ops Engine", icon: Cpu, badge: "45K TPS" },
  { href: "/admin/users", label: "Role Elevation & RBAC", icon: ShieldCheck },
  { href: "/admin/bookings", label: "Global Ticket Oversight", icon: Ticket },
  { href: "/admin/audit-logs", label: "Security & Audit Logs", icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = Router();
  const { user, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [liveTps, setLiveTps] = useState(48210);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setLiveTps(Math.floor(45000 + Math.random() * 8000));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row antialiased selection:bg-teal-600 selection:text-white">
      {/* High-Density Admin Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 z-40 shadow-xs">
        <div>
          {/* Header Branding */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl gradient-teal p-0.5 shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <Zap className="h-5 w-5 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Bus Dorkar <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-mono font-bold">HQ</span>
                </h1>
                <p className="text-[11px] text-slate-500 font-mono font-semibold tracking-wider">ENTERPRISE ADMIN</p>
              </div>
            </Link>
          </div>

          {/* System Ops Health Indicator */}
          <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Engine Cluster
              </span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px]">OPTIMAL</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 text-[10px] font-medium">Parallel Throughput</span>
              <span className="text-slate-900 font-bold text-xs">{liveTps.toLocaleString()} ops/s</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 mt-2">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              System Modules
            </div>
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    active
                      ? "bg-teal-50 text-teal-800 border border-teal-200 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? "text-teal-600" : "text-slate-400 group-hover:text-teal-600"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200 font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold animate-pulse">
                      {item.alert}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Quick Actions Footer */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors px-2 py-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Passenger View
          </Link>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="h-8 w-8 rounded-lg gradient-teal text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                {mounted && user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{mounted && user?.name ? user.name : "System Administrator"}</p>
                <p className="text-[10px] text-teal-700 font-mono font-semibold truncate">{mounted && user?.email ? user.email : "admin@busdorkar.com"}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Operational Bar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search across passengers, operators, ticket codes, buses..."
                className="h-9 w-80 bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 pl-9 pr-4 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Database className="h-3.5 w-3.5 text-teal-600" /> PG Pool: <strong className="text-slate-900">64 Active</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Server className="h-3.5 w-3.5 text-emerald-600" /> Latency: <strong className="text-slate-900">0.45ms</strong>
              </span>
            </div>

            <div className="h-8 px-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs">
              <Activity className="h-3.5 w-3.5 text-teal-600 animate-pulse" /> RBAC: ADMIN SUPERUSER
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  const router = useRouter();
  return router;
}
