"use client";

import { Bus, MapPin, Users, Building2 } from "lucide-react";

const stats = [
  { icon: Building2, value: "50+", label: "Verified Operators", color: "text-teal-600" },
  { icon: MapPin, value: "500+", label: "Inter-District Routes", color: "text-emerald-600" },
  { icon: Bus, value: "1,200+", label: "Daily Bus Trips", color: "text-teal-600" },
  { icon: Users, value: "10,000+", label: "Daily Passengers", color: "text-emerald-600" },
];

export function StatsBar() {
  return (
    <section className="relative z-20 -mt-8 mx-auto max-w-6xl px-4 sm:px-6">
      <div className="bg-white rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border border-slate-200 shadow-xl shadow-slate-200/50">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <stat.icon className={`h-6 w-6 ${stat.color} mb-1`} />
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stat.value}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-600">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
