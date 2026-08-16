"use client";

import { ShieldCheck, QrCode, Lock, Clock, MapPin, Building2 } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Verified Operators",
    description: "Every operator on Bus Dorkar undergoes trade license, fitness, and service quality verification before publishing trips.",
    color: "text-teal-600",
  },
  {
    icon: Lock,
    title: "Concurrency-Safe Seat Lock",
    description: "Our transactional seat engine ensures no double bookings. Your selected seat is temporarily locked while you complete payment.",
    color: "text-emerald-600",
  },
  {
    icon: QrCode,
    title: "Digital QR Ticket & Check-in",
    description: "No paper ticket printing required. Show your digitally signed QR code at the bus terminal for instant staff check-in.",
    color: "text-teal-600",
  },
  {
    icon: MapPin,
    title: "Geospatial Terminal Discovery",
    description: "Find bus counters, terminals, and boarding points across all 64 districts directly on an interactive map with directions.",
    color: "text-emerald-600",
  },
  {
    icon: Clock,
    title: "Real-Time Timetable Engine",
    description: "Access up-to-date departure schedules for morning, afternoon, evening, and night trips across all inter-district routes.",
    color: "text-teal-600",
  },
  {
    icon: Building2,
    title: "Operator & Staff Portal",
    description: "Dedicated operator management for company profile, fleet control, trip scheduling, counter staff check-in, and revenue analytics.",
    color: "text-emerald-600",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 tracking-wider uppercase">
            Built For Bangladesh
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Choose <span className="gradient-text">Bus Dorkar</span>?
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            Designed specifically for inter-district transportation management, seat safety, and real-world Bangladesh usage.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200 hover:bg-white hover:border-teal-500 hover-lift transition-all group shadow-sm hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 mb-5 group-hover:scale-110 transition-transform">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
