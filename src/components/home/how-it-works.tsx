"use client";

import { Search, Armchair, CreditCard, TicketCheck } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function HowItWorks() {
  const { language, t, tNum } = useLanguage();

  const steps = [
    {
      step: "01",
      icon: Search,
      titleEn: "Search Routes",
      titleBn: "রুট ও তারিখ নির্ধারণ",
      descEn: "Select your departure district, destination, date, and passenger count.",
      descBn: "আপনার যাত্রার জেলা, গন্তব্য, কাঙ্ক্ষিত তারিখ এবং যাত্রী সংখ্যা নির্বাচন করুন।",
    },
    {
      step: "02",
      icon: Armchair,
      titleEn: "Select Seats",
      titleBn: "সিট পছন্দ করুন",
      descEn: "Choose your preferred seats from our interactive 2+2, 2+1, or sleeper layout.",
      descBn: "বাসের ২+২, ২+১ বা স্লিপার সিট প্ল্যান থেকে আপনার পছন্দের সিট বেছে নিন।",
    },
    {
      step: "03",
      icon: CreditCard,
      titleEn: "Instant Payment",
      titleBn: "নিরাপদ পেমেন্ট",
      descEn: "Pay securely via bKash, Nagad, Card, or choose counter cash payment.",
      descBn: "বিকাশ, নগদ, কার্ড অথবা কাউন্টার ক্যাশের মাধ্যমে সহজে পেমেন্ট সম্পন্ন করুন।",
    },
    {
      step: "04",
      icon: TicketCheck,
      titleEn: "Digital QR Ticket",
      titleBn: "ডিজিটাল কিউআর টিকিট",
      descEn: "Receive an instant digital ticket with QR code for seamless terminal check-in.",
      descBn: "মুহূর্তেই কিউআর কোডসহ ডিজিটাল টিকিট বুঝে নিন এবং ঝামেলাহীন ভ্রমণ উপভোগ করুন।",
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-slate-50 relative border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 tracking-wider uppercase">
            {language === "bn" ? "সহজ ও দ্রুত" : "Simple & Fast"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {language === "bn" ? "কীভাবে কাজ করে " : "How "}
            <span className="gradient-text">{language === "bn" ? "বাস দরকার" : "Bus Dorkar"}</span>
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            {language === "bn" ? "মাত্র ২ মিনিটে আপনার আন্তঃজেলা বাসের টিকিট কাটুন।" : "Book your inter-district bus ticket in less than 2 minutes."}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md relative group hover:border-teal-500 transition-all hover-lift"
            >
              {/* Step Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-teal text-white shadow-md shadow-teal-600/20">
                  <item.icon className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <span className="text-3xl font-extrabold text-slate-300 group-hover:text-teal-600 transition-colors">
                  {tNum(item.step)}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                {language === "bn" ? item.titleBn : item.titleEn}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {language === "bn" ? item.descBn : item.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
