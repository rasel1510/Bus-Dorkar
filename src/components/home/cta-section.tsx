"use client";

import Link from "next/link";
import { ArrowRight, Bus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden bg-bd-navy-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-12 lg:p-16 border border-white/10 relative overflow-hidden text-center gradient-border shadow-2xl">
          {/* Background Glows */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-bd-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-bd-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bd-teal-500/10 border border-bd-teal-500/20 text-bd-teal-400 text-xs font-semibold uppercase mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Ready To Travel Across Bangladesh?
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight mb-4">
            Book Your Inter-District Bus Ticket <span className="gradient-text">Now</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8 font-normal">
            Join thousands of passengers traveling comfortably between Dhaka, Chattogram, Sylhet, Cox's Bazar, Rajshahi, and beyond.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/search?from=dhaka&to=coxs-bazar">
              <Button
                id="cta-search-btn"
                className="gradient-teal hover:opacity-95 text-bd-navy-950 font-bold text-base h-13 px-8 rounded-xl shadow-xl shadow-bd-teal-500/25 flex items-center gap-2"
              >
                <Bus className="h-5 w-5 text-bd-navy-950" />
                Find Buses Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                id="cta-signup-btn"
                className="h-13 px-8 text-base font-semibold border-white/10 text-white hover:bg-white/5 rounded-xl"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
