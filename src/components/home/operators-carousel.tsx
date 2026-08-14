"use client";

import { Star, ShieldCheck, Bus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const operators = [
  { name: "Green Line Paribahan", rating: 4.8, reviews: "2.4k", busTypes: "Scania AC • Double Decker", logoBg: "from-emerald-600 to-teal-800" },
  { name: "Shohagh Paribahan", rating: 4.7, reviews: "1.9k", busTypes: "Volvo AC • Executive", logoBg: "from-teal-600 to-cyan-800" },
  { name: "Hanif Enterprise", rating: 4.6, reviews: "3.5k", busTypes: "AC • Non-AC Deluxe", logoBg: "from-blue-600 to-indigo-800" },
  { name: "Ena Transport", rating: 4.5, reviews: "2.8k", busTypes: "Hyundai AC • Deluxe", logoBg: "from-emerald-700 to-green-900" },
  { name: "Shyamoli N.R Travels", rating: 4.7, reviews: "1.6k", busTypes: "Sleeper Coach • AC", logoBg: "from-purple-700 to-indigo-900" },
  { name: "Saintmartin Paribahan", rating: 4.9, reviews: "1.2k", busTypes: "MAN AC • Luxury", logoBg: "from-cyan-600 to-teal-900" },
];

export function OperatorsCarousel() {
  return (
    <section className="py-20 bg-bd-navy-900/40 relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-bd-teal-400 tracking-wider uppercase">
            Top Partners
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Trusted Bus <span className="gradient-text">Operators</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Partnering with Bangladesh's premier inter-district transport companies for maximum safety and comfort.
          </p>
        </div>

        {/* Operators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {operators.map((op, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-white/5 hover:border-bd-teal-500/30 hover-lift transition-all group flex items-center gap-4"
            >
              {/* Operator Logo Badge */}
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${op.logoBg} flex items-center justify-center text-white shrink-0 shadow-lg font-bold text-lg`}>
                <Bus className="h-7 w-7 text-white" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white truncate group-hover:text-bd-teal-400 transition-colors">
                    {op.name}
                  </h3>
                  <ShieldCheck className="h-4 w-4 text-bd-teal-400 shrink-0" title="Verified Operator" />
                </div>
                <p className="text-xs text-slate-400 truncate mb-2">
                  {op.busTypes}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {op.rating}
                  </span>
                  <span className="text-slate-400">({op.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
