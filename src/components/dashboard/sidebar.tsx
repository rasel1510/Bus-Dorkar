"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import {
  LayoutDashboard,
  Ticket,
  User,
  Bell,
  Bookmark,
  CreditCard,
  Lock,
  Bus,
  ChevronRight,
  Shield,
  Sparkles,
  Home,
  ExternalLink,
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const isAdmin = user?.role === "ADMIN" || user?.email?.toLowerCase() === "admin@busdorkar.com" || user?.email?.toLowerCase() === "demo@busdorkar.com";

  const sidebarLinks = [
    { href: "/dashboard", labelEn: "Overview", labelBn: "ওভারভিউ", icon: LayoutDashboard },
    { href: "/dashboard/bookings", labelEn: "My Bookings", labelBn: "আমার বুকিং", icon: Ticket },
    { href: "/dashboard/notifications", labelEn: "Notifications", labelBn: "নোটিফিকেশন", icon: Bell },
    { href: "/dashboard/saved", labelEn: "Saved Items", labelBn: "সংরক্ষিত", icon: Bookmark },
    { href: "/dashboard/payments", labelEn: "Payments", labelBn: "পেমেন্ট হিস্ট্রি", icon: CreditCard },
    { href: "/dashboard/profile", labelEn: "Profile", labelBn: "প্রোফাইল", icon: User },
    { href: "/dashboard/security", labelEn: "Security", labelBn: "নিরাপত্তা", icon: Lock },
  ];

  const getFirstLetter = (name: string) => {
    if (!name || !name.trim()) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-64px)]">
      {/* User Card */}
      {user && (
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 ${isAdmin ? "bg-gradient-to-br from-slate-800 to-slate-950" : "gradient-teal"}`}>
              {getFirstLetter(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight">{user.name}</p>
              <p className="text-[10px] font-semibold text-slate-400 capitalize leading-tight">{user.role.toLowerCase().replace("_", " ")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Quick-Launch */}
      {isAdmin && (
        <div className="px-4 pt-3">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-teal-500/30 text-white hover:border-teal-400/60 shadow-sm group transition-all"
          >
            <div className="h-7 w-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Shield className="h-3.5 w-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-white truncate">Admin Command HQ</span>
                <Sparkles className="h-2.5 w-2.5 text-teal-400 shrink-0" />
              </div>
              <p className="text-[9px] text-slate-400 font-mono font-semibold truncate">Parallel Ops & RBAC</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-teal-400/70 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 pt-4 pb-3 space-y-0.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {language === "bn" ? "মেনু" : "Menu"}
        </div>
        {sidebarLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all group ${
                active
                  ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <link.icon
                className={`h-[16px] w-[16px] shrink-0 ${
                  active ? "text-teal-600" : "text-slate-400 group-hover:text-teal-600"
                } transition-colors`}
              />
              <span className="flex-1 truncate">
                {language === "bn" ? link.labelBn : link.labelEn}
              </span>
              {active && <ChevronRight className="h-3.5 w-3.5 text-teal-500 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-teal-700 hover:bg-teal-50/50 transition-all group"
        >
          <Home className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
          <span className="flex-1">{language === "bn" ? "হোমপেজে ফিরে যান" : "Back to Homepage"}</span>
          <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
        </Link>
      </div>
    </aside>
  );
}

/** Mobile bottom navigation for dashboard */
export function DashboardMobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isAdmin = user?.role === "ADMIN" || user?.email?.toLowerCase() === "admin@busdorkar.com" || user?.email?.toLowerCase() === "demo@busdorkar.com";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const mobileNavLinks = [
    { href: "/dashboard", labelEn: "Home", labelBn: "হোম", icon: LayoutDashboard },
    ...(isAdmin ? [{ href: "/admin/dashboard", labelEn: "Admin", labelBn: "অ্যাডমিন", icon: Shield }] : []),
    { href: "/dashboard/bookings", labelEn: "Tickets", labelBn: "টিকিট", icon: Ticket },
    { href: "/dashboard/notifications", labelEn: "Alerts", labelBn: "অ্যালার্ট", icon: Bell },
    { href: "/dashboard/profile", labelEn: "Profile", labelBn: "প্রোফাইল", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-1 pb-safe">
      <div className="flex items-center justify-around py-1.5">
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
              <div className={`p-1 rounded-lg ${active ? "bg-teal-50" : ""}`}>
                <link.icon className={`h-5 w-5 ${active ? "text-teal-600" : "text-slate-400"}`} />
              </div>
              {language === "bn" ? link.labelBn : link.labelEn}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
