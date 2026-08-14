"use client";

import Link from "next/link";
import { ArrowRight, Clock, Building2, MapPin } from "lucide-react";
import { popularRoutes } from "@/lib/data/districts";
import { Badge } from "@/components/ui/badge";

export function PopularRoutes() {
  return (
    <section className="py-20 bg-bd-navy-950 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-bd-teal-400 tracking-wider uppercase mb-2">
              <MapPin className="h-3.5 w-3.5" />
              Popular Destinations
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Top Inter-District <span className="gradient-text">Routes</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Discover Bangladesh's most traveled inter-district routes with luxury AC and non-AC coaches.
            </p>
          </div>
          <Link
            href="/routes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-bd-teal-400 hover:text-bd-teal-300 mt-4 sm:mt-0 group"
          >
            View All 500+ Routes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularRoutes.map((route, idx) => (
            <Link
              key={idx}
              href={`/search?from=${route.fromId}&to=${route.toId}`}
              className="glass-card rounded-2xl p-5 border border-white/5 hover:border-bd-teal-500/40 hover-lift transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Route Header */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="bg-bd-teal-500/10 text-bd-teal-400 border-bd-teal-500/20 text-xs">
                    Inter-District
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {route.duration}
                  </span>
                </div>

                {/* From -> To */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white group-hover:text-bd-teal-400 transition-colors">
                      {route.from}
                    </span>
                    <ArrowRight className="h-4 w-4 text-bd-teal-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    <span className="text-lg font-bold text-white group-hover:text-bd-teal-400 transition-colors">
                      {route.to}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Fare & Operators */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Starting from</span>
                  <span className="text-base font-extrabold text-bd-emerald-400">
                    {route.price}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {route.operators} Operators
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
