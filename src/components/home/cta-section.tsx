"use client";

import Link from "next/link";
import { ArrowRight, Bus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function CTASection() {
  const { language, t } = useLanguage();

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-12 lg:p-16 border border-slate-800 relative overflow-hidden text-center shadow-2xl">
          {/* Background Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase mb-4 sm:mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            {t("cta_title")}
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight mb-3 sm:mb-4">
            {language === "bn" ? "আপনার আন্তঃজেলা বাসের টিকিট কাটুন " : "Book Your Inter-District Bus Ticket "}
            <span className="gradient-text">{language === "bn" ? "এখনই" : "Now"}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-lg max-w-xl mx-auto mb-6 sm:mb-8 font-medium">
            {t("cta_subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Link href="/search?from=dhaka&to=coxs-bazar" className="w-full sm:w-auto">
              <Button
                id="cta-search-btn"
                className="w-full sm:w-auto gradient-teal hover:opacity-95 text-white font-extrabold text-base h-12 sm:h-13 px-8 rounded-xl shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Bus className="h-5 w-5 text-white" />
                {t("cta_button")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                variant="outline"
                id="cta-signup-btn"
                className="w-full sm:w-auto h-12 sm:h-13 px-8 text-base font-bold border-slate-700 text-white hover:bg-slate-800 rounded-xl cursor-pointer active:scale-[0.98]"
              >
                {language === "bn" ? "ফ্রি একাউন্ট তৈরি করুন" : "Create Free Account"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
