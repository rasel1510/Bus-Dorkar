"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Bus,
  Menu,
  MapPin,
  Clock,
  Building2,
  LocateFixed,
  UserCircle,
  LogOut,
  LayoutDashboard,
  Ticket,
  ChevronDown,
  User,
  Shield,
  Smartphone,
  Languages,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { href: "/routes", label: t("nav_routes"), icon: MapPin },
    { href: "/timetable", label: t("nav_timetable"), icon: Clock },
    { href: "/operators", label: t("nav_operators"), icon: Building2 },
    { href: "/track", label: t("nav_track"), icon: LocateFixed },
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user?.role === "ADMIN" || user?.email?.toLowerCase() === "admin@busdorkar.com" || user?.email?.toLowerCase() === "demo@busdorkar.com";

  const getFirstLetter = (name: string) => {
    if (!name || !name.trim()) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  const getDashboardLink = () => {
    if (user?.role === "BUS_OPERATOR") return "/operator/dashboard";
    if (isAdmin) return "/admin/dashboard";
    return "/dashboard";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-white/80 backdrop-blur-sm border-b border-slate-100"
      }`}
    >
      <nav className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" id="navbar-logo">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-teal transition-transform group-hover:scale-110 shadow-md shadow-teal-600/20">
            <Bus className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            {language === "bn" ? "বাস " : "Bus "}
            <span className="gradient-text">{language === "bn" ? "দরকার" : "Dorkar"}</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              id={`nav-${link.href.replace("/", "") || "home"}`}
              className="group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-all hover:text-teal-700 hover:bg-slate-100"
            >
              <link.icon className="h-4 w-4 text-teal-600/70 transition-colors group-hover:text-teal-600" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Section: Language Switcher & Auth */}
        <div className="hidden items-center gap-2.5 md:flex min-h-[40px]">
          {/* Language Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  id="language-selector-trigger"
                  aria-label="Change Language"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                />
              }
            >
              <Languages className="h-3.5 w-3.5 text-teal-600" />
              <span>{language === "en" ? "EN" : "বাংলা"}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-36 bg-white border border-slate-200 p-1 shadow-xl rounded-xl z-50"
            >
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className={`flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  language === "en" ? "bg-teal-50 text-teal-700 font-extrabold" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>English (EN)</span>
                {language === "en" && <Check className="h-3.5 w-3.5 text-teal-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("bn")}
                className={`flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  language === "bn" ? "bg-teal-50 text-teal-700 font-extrabold" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>বাংলা (BN)</span>
                {language === "bn" && <Check className="h-3.5 w-3.5 text-teal-600" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {!mounted ? (
            <div className="h-9 w-28 bg-slate-100 animate-pulse rounded-xl" />
          ) : user ? (
            /* Logged In: Displays Profile Icon with User Info Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    id="user-profile-menu-trigger"
                    className="flex items-center gap-2.5 p-1.5 pl-2 pr-3.5 rounded-full bg-slate-100 border border-slate-200 hover:border-teal-600/50 hover:bg-slate-200 transition-all cursor-pointer shadow-sm group"
                  />
                }
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-teal text-white font-black text-sm shadow-md shadow-teal-600/20">
                  {getFirstLetter(user.name)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 max-w-[130px] truncate leading-tight group-hover:text-teal-700 transition-colors">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold capitalize">
                    {user.role.toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-900 transition-transform" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border border-slate-200 p-1.5 shadow-2xl rounded-2xl space-y-1 z-50"
              >
                {isAdmin && (
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-50 rounded-xl cursor-pointer transition-colors"
                      />
                    }
                  >
                    <Shield className="h-4 w-4 text-teal-600" />
                    {t("nav_admin")}
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  render={
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                    />
                  }
                >
                  <LayoutDashboard className="h-4 w-4 text-teal-600" />
                  {t("nav_dashboard")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={
                    <Link
                      href="/dashboard/bookings"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                    />
                  }
                >
                  <Ticket className="h-4 w-4 text-teal-600" />
                  {t("nav_my_tickets")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => window.dispatchEvent(new Event("open-pwa-install"))}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  <Smartphone className="h-4 w-4 text-teal-600" />
                  {t("nav_install_pwa")}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-200 my-1" />

                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                >
                  <LogOut className="h-4 w-4 text-red-600" />
                  {t("nav_sign_out")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  id="nav-login"
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg px-4 cursor-pointer"
                >
                  <UserCircle className="h-4 w-4 mr-1.5 text-slate-600" />
                  {t("nav_login")}
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  id="nav-signup"
                  className="gradient-teal hover:opacity-90 text-white font-bold text-sm rounded-lg px-4 shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                >
                  {t("nav_signup")}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="text-slate-900 md:hidden" id="mobile-menu-trigger" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 bg-white border-l border-slate-200 p-0"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-teal">
                    <Bus className="h-5 w-5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    {language === "bn" ? "বাস " : "Bus "}
                    <span className="gradient-text">{language === "bn" ? "দরকার" : "Dorkar"}</span>
                  </span>
                </div>
              </div>

              {/* Language Switcher for Mobile */}
              <div className="px-4 pt-4">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      language === "en" ? "bg-white text-teal-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Languages className="h-3.5 w-3.5 text-teal-600" />
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("bn")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      language === "bn" ? "bg-white text-teal-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Languages className="h-3.5 w-3.5 text-teal-600" />
                    বাংলা
                  </button>
                </div>
              </div>

              {/* Logged In Mobile Card */}
              {user && (
                <div className="p-4 mx-4 mt-3 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-teal text-white font-black text-sm">
                      {getFirstLetter(user.name)}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-teal-700 font-semibold capitalize">{user.role.toLowerCase().replace("_", " ")}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Nav Links */}
              <div className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-700 transition-all hover:text-slate-900 hover:bg-slate-100"
                  >
                    <link.icon className="h-5 w-5 text-teal-600" />
                    {link.label}
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="pt-2 border-t border-slate-200 my-2"></div>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-900 bg-slate-100 border border-slate-200"
                    >
                      <LayoutDashboard className="h-5 w-5 text-teal-600" />
                      {t("nav_dashboard")}
                    </Link>
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-900 bg-slate-100 border border-slate-200"
                    >
                      <Ticket className="h-5 w-5 text-teal-600" />
                      {t("nav_my_tickets")}
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        window.dispatchEvent(new Event("open-pwa-install"));
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-teal-800 bg-teal-50 border border-teal-200 cursor-pointer"
                    >
                      <Smartphone className="h-5 w-5 text-teal-600" />
                      {t("nav_install_pwa")}
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="p-5 space-y-3 border-t border-slate-200">
                {user ? (
                  <Button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full h-11 text-base font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5 text-red-600" />
                    {t("nav_sign_out")}
                  </Button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full h-11 text-base font-semibold border-slate-300 text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer"
                      >
                        {t("nav_login")}
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full h-11 text-base font-bold gradient-teal text-white rounded-xl shadow-md shadow-teal-600/20 cursor-pointer">
                        {t("nav_signup")}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
