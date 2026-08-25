"use client";

import Link from "next/link";
import { Bus, MapPin, Phone, Mail, Shield, Heart } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo textSize="text-2xl" />
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-normal">
              Bus Dorkar is Bangladesh's dedicated inter-district bus discovery, timetable, and ticketing management platform. Real-time seat reservation across all 64 districts.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold text-teal-700">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-teal-600" /> 100% Verified Operators
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-teal-600" /> Inter-District Only
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Popular Routes</h4>
            <ul className="space-y-2 text-xs font-medium">
              {["Dhaka to Cox's Bazar", "Dhaka to Sylhet", "Dhaka to Chattogram", "Dhaka to Rajshahi", "Dhaka to Khulna", "Dhaka to Rangpur"].map((route) => (
                <li key={route}>
                  <Link href="/search" className="hover:text-teal-700 hover:underline transition-colors">
                    {route} Bus
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-2 text-xs font-medium">
              {[
                { name: "Search Buses", href: "/search" },
                { name: "Route Map", href: "/routes" },
                { name: "Timetable & Schedules", href: "/timetable" },
                { name: "Verified Operators", href: "/operators" },
                { name: "Operator Portal", href: "/operator/login" },
                { name: "Counter Staff Check-in", href: "/counter/login" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-teal-700 hover:underline transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("open-pwa-install"))}
                  className="hover:text-teal-700 hover:underline transition-colors text-xs font-medium text-left cursor-pointer"
                >
                  Install PWA App
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Contact & Support</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>24/7 Helpline: +880 9612-000111</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>support@busdorkar.com.bd</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>Gabtoli & Sayedabad Counter Hubs, Dhaka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
          <p>© 2026 Bus Dorkar. All rights reserved. Inter-District Bus Transportation Platform Bangladesh.</p>
          <div className="flex items-center gap-1 text-slate-600">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span>for Bangladesh 🇧🇩</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
