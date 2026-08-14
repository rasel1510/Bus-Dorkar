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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";

const navLinks = [
  { href: "/routes", label: "Routes", icon: MapPin },
  { href: "/timetable", label: "Timetable", icon: Clock },
  { href: "/operators", label: "Operators", icon: Building2 },
  { href: "/track", label: "Track", icon: LocateFixed },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getFirstLetter = (name: string) => {
    if (!name || !name.trim()) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  const getDashboardLink = () => {
    if (user?.role === "BUS_OPERATOR") return "/operator/dashboard";
    if (user?.role === "ADMIN") return "/admin/dashboard";
    return "/dashboard";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" id="navbar-logo">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-teal transition-transform group-hover:scale-110">
            <Bus className="h-5 w-5 text-bd-navy-950" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Bus <span className="gradient-text">Dorkar</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              id={`nav-${link.label.toLowerCase()}`}
              className="group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-white/5"
            >
              <link.icon className="h-4 w-4 text-bd-teal-500/60 transition-colors group-hover:text-bd-teal-500" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden items-center gap-3 md:flex min-h-[40px]">
          {!mounted ? (
            <div className="h-9 w-28 bg-white/5 animate-pulse rounded-xl" />
          ) : user ? (
            /* Logged In: Displays ONLY Profile Icon with First Letter + User Info Dropdown (No Signup Button) */
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    id="user-profile-menu-trigger"
                    className="flex items-center gap-2.5 p-1.5 pl-2 pr-3.5 rounded-full bg-bd-navy-900/90 border border-white/10 hover:border-bd-teal-500/40 hover:bg-bd-navy-800 transition-all cursor-pointer shadow-md group"
                  />
                }
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-teal text-bd-navy-950 font-black text-sm shadow-md shadow-bd-teal-500/20">
                  {getFirstLetter(user.name)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white max-w-[130px] truncate leading-tight group-hover:text-bd-teal-400 transition-colors">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium capitalize">
                    {user.role.toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-transform" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 bg-bd-navy-900 border border-white/10 p-1.5 shadow-2xl rounded-2xl space-y-1"
              >

                <DropdownMenuItem
                  render={
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                    />
                  }
                >
                  <LayoutDashboard className="h-4 w-4 text-bd-teal-400" />
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={
                    <Link
                      href="/dashboard/bookings"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                    />
                  }
                >
                  <Ticket className="h-4 w-4 text-bd-teal-400" />
                  My Tickets & Bookings
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/5 my-1" />

                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors"
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  id="nav-login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/10 rounded-lg px-5 cursor-pointer"
                >
                  <UserCircle className="h-4 w-4 mr-1.5" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  id="nav-signup"
                  className="gradient-teal hover:opacity-90 text-bd-navy-950 font-semibold text-sm rounded-lg px-5 shadow-lg shadow-bd-teal-500/20 transition-all hover:shadow-bd-teal-500/30 cursor-pointer"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="text-foreground md:hidden" id="mobile-menu-trigger" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 bg-bd-navy-900 border-l border-white/5 p-0"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-teal">
                    <Bus className="h-5 w-5 text-bd-navy-950" strokeWidth={2.5} />
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    Bus <span className="gradient-text">Dorkar</span>
                  </span>
                </div>
              </div>

              {/* Logged In Mobile Card */}
              {user && (
                <div className="p-4 mx-4 mt-4 bg-bd-navy-950/80 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-teal text-bd-navy-950 font-black text-sm">
                      {getFirstLetter(user.name)}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs text-bd-teal-400 capitalize">{user.role.toLowerCase().replace("_", " ")}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Nav Links */}
              <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-white/5"
                  >
                    <link.icon className="h-5 w-5 text-bd-teal-500/70" />
                    {link.label}
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="pt-2 border-t border-white/5 my-2"></div>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-white bg-white/5 border border-white/5"
                    >
                      <LayoutDashboard className="h-5 w-5 text-bd-teal-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-white bg-white/5 border border-white/5"
                    >
                      <Ticket className="h-5 w-5 text-bd-teal-400" />
                      My Tickets
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="p-5 space-y-3 border-t border-white/5">
                {user ? (
                  <Button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full h-11 text-base font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5 text-red-400" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full h-11 text-base font-medium border-white/10 text-foreground hover:bg-white/5 rounded-xl cursor-pointer"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full h-11 text-base font-semibold gradient-teal text-bd-navy-950 rounded-xl shadow-lg shadow-bd-teal-500/20 cursor-pointer">
                        Create Account
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
