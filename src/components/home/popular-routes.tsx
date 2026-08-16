"use client";

import Link from "next/link";
import { ArrowRight, Clock, Building2, MapPin } from "lucide-react";
import { popularRoutes } from "@/lib/data/districts";
import { Badge } from "@/components/ui/badge";

export function PopularRoutes() {
  return (
    <section className="py-20 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 tracking-wider uppercase mb-2">
              <MapPin className="h-3.5 w-3.5" />
              Popular Destinations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Top Inter-District <span className="gradient-text">Routes</span>
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-xl font-medium">
              Discover Bangladesh's most traveled inter-district routes with luxury AC and non-AC coaches.
            </p>
          </div>
          <Link
            href="/routes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 mt-4 sm:mt-0 group"
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
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-500 hover-lift transition-all group flex flex-col justify-between shadow-sm hover:shadow-xl"
            >
              <div>
                {/* Route Header */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200 text-xs font-bold">
                    Inter-District
                  </Badge>
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {route.duration}
                  </span>
                </div>

                {/* From -> To */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {route.from}
                    </span>
                    <ArrowRight className="h-4 w-4 text-teal-600 group-hover:translate-x-1 transition-all" />
                    <span className="text-lg font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {route.to}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Fare & Operators */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Starting from</span>
                  <span className="text-base font-extrabold text-emerald-700">
                    {route.price}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-slate-400" />
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
