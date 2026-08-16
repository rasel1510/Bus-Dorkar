"use client";

import { Search, Armchair, CreditCard, TicketCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Search Routes",
    description: "Select your departure district, destination, date, and passenger count.",
  },
  {
    step: "02",
    icon: Armchair,
    title: "Select Seats",
    description: "Choose your preferred seats from our interactive 2+2, 2+1, or sleeper layout.",
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Instant Payment",
    description: "Pay securely via bKash, Nagad, SSLCommerz, or choose counter payment.",
  },
  {
    step: "04",
    icon: TicketCheck,
    title: "Digital QR Ticket",
    description: "Receive an instant digital ticket with QR code for seamless terminal check-in.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-slate-50 relative border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 tracking-wider uppercase">
            Simple & Fast
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How <span className="gradient-text">Bus Dorkar</span> Works
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            Book your inter-district bus ticket in less than 2 minutes.
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
                  {item.step}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
