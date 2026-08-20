"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)]">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg gradient-teal flex items-center justify-center">
            <Bus className="h-4 w-4 text-white" />
          </div>
          Passenger Portal
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const mobileNavLinks = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/bookings", label: "Tickets", icon: Ticket },
    { href: "/dashboard/notifications", label: "Alerts", icon: Bell },
    { href: "/dashboard/saved", label: "Saved", icon: Bookmark },
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
