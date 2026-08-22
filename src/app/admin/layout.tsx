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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Command Center", icon: LayoutDashboard, badge: "LIVE" },
  { href: "/admin/operations", label: "Parallel Ops Engine", icon: Cpu, badge: "45K TPS" },
  { href: "/admin/users", label: "User Directory & RBAC", icon: Users },
  { href: "/admin/operators", label: "Operator Verifications", icon: Building2, alert: 3 },
  { href: "/admin/bookings", label: "Global Ticket Oversight", icon: Ticket },
  { href: "/admin/audit-logs", label: "Security & Audit Logs", icon: ShieldCheck },
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row antialiased selection:bg-teal-500 selection:text-white">
      {/* High-Density Admin Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between shrink-0 z-40">
        <div>
          {/* Header Branding */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="h-5 w-5 text-teal-400 fill-teal-400" />
                </div>
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  Bus Dorkar <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">HQ</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-mono tracking-wider">ENTERPRISE ADMIN</p>
              </div>
            </Link>
          </div>

          {/* System Ops Health Indicator */}
          <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Engine Cluster
              </span>
              <span className="font-mono font-bold text-emerald-400 text-[11px]">OPTIMAL</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 text-[10px]">Parallel Throughput</span>
              <span className="text-slate-200 font-bold text-xs">{liveTps.toLocaleString()} ops/s</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 mt-2">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-md shadow-teal-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? "text-teal-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
                      {item.alert}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Quick Actions Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors px-2 py-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Passenger View
          </Link>

          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || "Rasel Admin"}</p>
                <p className="text-[10px] text-teal-400 font-mono truncate">{user?.email || "rasel4897981@gmail.com"}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Operational Bar */}
        <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search across passengers, operators, ticket codes, buses..."
                className="h-9 w-80 bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 pl-9 pr-4 rounded-xl focus:outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-400">
                <Database className="h-3.5 w-3.5 text-teal-400" /> PG Pool: <strong className="text-white">64 Active</strong>
              </span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Server className="h-3.5 w-3.5 text-emerald-400" /> Latency: <strong className="text-white">0.45ms</strong>
              </span>
            </div>

            <div className="h-8 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 animate-pulse" /> RBAC: ADMIN SUPERUSER
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950 overflow-y-auto">
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
