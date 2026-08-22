"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  Ticket,
  User,
  Bell,
  Bookmark,
  CreditCard,
  Lock,
  HelpCircle,
  Bus,
  ChevronRight,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react";

export const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "My Bookings", icon: Ticket },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/saved", label: "Saved Items", icon: Bookmark },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/security", label: "Security", icon: Lock },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.email?.toLowerCase() === "rasel4897981@gmail.com";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)]">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${isAdmin ? "bg-slate-950 text-teal-400" : "gradient-teal text-white"}`}>
            {isAdmin ? <Shield className="h-4 w-4 text-teal-400" /> : <Bus className="h-4 w-4 text-white" />}
          </div>
          <div>
            <span className="block leading-tight">{isAdmin ? "Admin Superuser Portal" : "Passenger Portal"}</span>
            {isAdmin && <span className="text-[10px] text-teal-700 font-mono font-bold">ADMIN HQ CONTROL</span>}
          </div>
        </h2>
      </div>

      {/* Admin Highlight Button */}
      {isAdmin && (
        <div className="p-3 pb-0">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-teal-500/40 text-white hover:border-teal-400 shadow-md shadow-slate-950/20 group transition-all"
          >
            <div className="h-8 w-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-white truncate">Admin Command HQ</span>
                <Sparkles className="h-3 w-3 text-teal-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono font-semibold truncate">Parallel Ops & RBAC</p>
            </div>
            <ChevronRight className="h-4 w-4 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          User Menu
        </div>
        {sidebarLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                active
                  ? "bg-teal-50 text-teal-800 border border-teal-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <link.icon
                className={`h-4 w-4 ${
                  active ? "text-teal-600" : "text-slate-400 group-hover:text-teal-600"
                }`}
              />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 text-teal-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Help */}
      <div className="p-4 border-t border-slate-100">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          Back to Homepage
        </Link>
      </div>
    </aside>
  );
}

/** Mobile bottom navigation for dashboard */
export function DashboardMobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.email?.toLowerCase() === "rasel4897981@gmail.com";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const mobileNavLinks = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    ...(isAdmin ? [{ href: "/admin/dashboard", label: "Admin HQ", icon: Shield }] : []),
    { href: "/dashboard/bookings", label: "Tickets", icon: Ticket },
    { href: "/dashboard/notifications", label: "Alerts", icon: Bell },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {mobileNavLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-colors ${
                active ? "text-teal-700 font-extrabold" : "text-slate-400"
              }`}
            >
              <link.icon className={`h-5 w-5 ${active ? "text-teal-600" : "text-slate-400"}`} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
