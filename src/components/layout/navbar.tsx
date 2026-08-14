"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Bus,
  Menu,
  X,
  MapPin,
  Clock,
  Building2,
  LocateFixed,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { href: "/routes", label: "Routes", icon: MapPin },
  { href: "/timetable", label: "Timetable", icon: Clock },
  { href: "/operators", label: "Operators", icon: Building2 },
  { href: "/track", label: "Track", icon: LocateFixed },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button
              variant="ghost"
              id="nav-login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/10 rounded-lg px-5"
            >
              <UserCircle className="h-4 w-4 mr-1.5" />
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              id="nav-signup"
              className="gradient-teal hover:opacity-90 text-bd-navy-950 font-semibold text-sm rounded-lg px-5 shadow-lg shadow-bd-teal-500/20 transition-all hover:shadow-bd-teal-500/30"
            >
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-foreground" id="mobile-menu-trigger">
              <Menu className="h-5 w-5" />
            </Button>
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

              {/* Mobile Nav Links */}
              <div className="flex-1 px-4 py-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-white/5"
                  >
                    <link.icon className="h-5 w-5 text-bd-teal-500/70" />
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="p-5 space-y-3 border-t border-white/5">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full h-11 text-base font-medium border-white/10 text-foreground hover:bg-white/5 rounded-xl"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full h-11 text-base font-semibold gradient-teal text-bd-navy-950 rounded-xl shadow-lg shadow-bd-teal-500/20">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
