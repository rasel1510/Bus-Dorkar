"use client";

import { ShieldCheck, QrCode, Lock, Clock, MapPin, Building2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Features() {
  const { language, t, tNum } = useLanguage();

  const features = [
    {
      icon: ShieldCheck,
      titleEn: "100% Verified Operators",
      titleBn: "১০০% ভেরিফাইড অপারেটর",
      descEn: "Every operator on Bus Dorkar undergoes trade license, fitness, and service quality verification before publishing trips.",
      descBn: "বাস দরকারের প্রতিটি বাস অপারেটরের ট্রেড লাইসেন্স ও কোচের গুণগত মান যাচাই করে ট্রিপ প্রকাশ করা হয়।",
      color: "text-teal-600",
    },
    {
      icon: Lock,
      titleEn: "Concurrency-Safe Seat Lock",
      titleBn: "নিরাপদ লাইভ সিট রিজার্ভেশন",
      descEn: "Our transactional seat engine ensures no double bookings. Your selected seat is temporarily locked while you complete payment.",
      descBn: "একই সিট ডাবল বুকিং হওয়া রোধ করতে স্বয়ংক্রিয় সিট লকিং সিস্টেম। পেমেন্ট চলাকালীন আপনার সিট নিরাপদ থাকে।",
      color: "text-emerald-600",
    },
    {
      icon: QrCode,
      titleEn: "Digital QR Ticket & Check-in",
      titleBn: "ডিজিটাল কিউআর টিকিট ও বোর্ডিং",
      descEn: "No paper ticket printing required. Show your digitally signed QR code at the bus terminal for instant staff check-in.",
      descBn: "কাগজের টিকিটের ঝামেলা নেই। কাউন্টারে শুধুমাত্র ডিজিটাল কিউআর কোড দেখিয়ে সরাসরি বাসে উঠুন।",
      color: "text-teal-600",
    },
    {
      icon: MapPin,
      titleEn: "Geospatial Terminal Discovery",
      titleBn: "মানচিত্রে কাউন্টার ও টার্মিনাল",
      descEn: "Find bus counters, terminals, and boarding points across all 64 districts directly on an interactive map with directions.",
      descBn: "বাংলাদেশের সকল ৬৪ জেলার বাস টার্মিনাল, কাউন্টার ও বোর্ডিং পয়েন্ট সহজে ম্যাপে খুঁজে বের করুন।",
      color: "text-emerald-600",
    },
    {
      icon: Clock,
      titleEn: "Real-Time Timetable Engine",
      titleBn: "রিয়েল-টাইম সময়সূচী ও ট্রিপ",
      descEn: "Access up-to-date departure schedules for morning, afternoon, evening, and night trips across all inter-district routes.",
      descBn: "সকল আন্তঃজেলা রুটে সকাল, দুপুর, সন্ধ্যা ও রাতের ট্রিপের সঠিক ও সর্বশেষ সময়সূচী দেখুন।",
      color: "text-teal-600",
    },
    {
      icon: Building2,
      titleEn: "Operator & Staff Portal",
      titleBn: "অপারেটর ও স্টাফ পোর্টাল",
      descEn: "Dedicated operator management for company profile, fleet control, trip scheduling, counter staff check-in, and revenue analytics.",
      descBn: "বাস কোম্পানিগুলোর জন্য বহর ব্যবস্থাপনা, সিট শিডিউল, স্টাফ লগইন এবং রাজস্ব হিসাবের আধুনিক সুবিধা।",
      color: "text-emerald-600",
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 tracking-wider uppercase">
            {language === "bn" ? "বাংলাদেশের জন্য তৈরি" : "Built For Bangladesh"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {language === "bn" ? "কেন " : "Why Choose "}
            <span className="gradient-text">{language === "bn" ? "বাস দরকার" : "Bus Dorkar"}</span>?
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            {t("features_subtitle")}
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
                {language === "bn" ? feature.titleBn : feature.titleEn}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {language === "bn" ? feature.descBn : feature.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
