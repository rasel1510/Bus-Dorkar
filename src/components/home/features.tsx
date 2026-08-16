"use client";

import { ShieldCheck, QrCode, Lock, Clock, MapPin, Building2 } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Verified Operators",
    description: "Every operator on Bus Dorkar undergoes trade license, fitness, and service quality verification before publishing trips.",
    color: "text-bd-teal-400",
  },
  {
    icon: Lock,
    title: "Concurrency-Safe Seat Lock",
    description: "Our transactional seat engine ensures no double bookings. Your selected seat is temporarily locked while you complete payment.",
    color: "text-bd-emerald-400",
  },
  {
    icon: QrCode,
    title: "Digital QR Ticket & Check-in",
    description: "No paper ticket printing required. Show your digitally signed QR code at the bus terminal for instant staff check-in.",
    color: "text-bd-teal-400",
  },
  {
    icon: MapPin,
    title: "Geospatial Terminal Discovery",
    description: "Find bus counters, terminals, and boarding points across all 64 districts directly on an interactive map with directions.",
    color: "text-bd-emerald-400",
  },
  {
    icon: Clock,
    title: "Real-Time Timetable Engine",
    description: "Access up-to-date departure schedules for morning, afternoon, evening, and night trips across all inter-district routes.",
    color: "text-bd-teal-400",
  },
  {
    icon: Building2,
    title: "Operator & Staff Portal",
    description: "Dedicated operator management for company profile, fleet control, trip scheduling, counter staff check-in, and revenue analytics.",
    color: "text-bd-emerald-400",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-bd-navy-950 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-bd-teal-400 tracking-wider uppercase">
            Built For Bangladesh
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Why Choose <span className="gradient-text">Bus Dorkar</span>?
          </h2>
          <p className="text-slate-300 text-sm">
            Designed specifically for inter-district transportation management, seat safety, and real-world Bangladesh usage.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 border border-white/5 hover:border-bd-teal-500/30 hover-lift transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bd-teal-500/10 border border-bd-teal-500/20 mb-5 group-hover:scale-110 transition-transform">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-bd-teal-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
