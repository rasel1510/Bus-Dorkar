"use client";

import Link from "next/link";
import { Bus, MapPin, Phone, Mail, Shield, Heart } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useLanguage } from "@/context/language-context";

export function Footer() {
  const { language, t, tNum } = useLanguage();

  const popularRoutes = [
    { en: "Dhaka to Cox's Bazar", bn: "ঢাকা থেকে কক্সবাজার" },
    { en: "Dhaka to Sylhet", bn: "ঢাকা থেকে সিলেট" },
    { en: "Dhaka to Chattogram", bn: "ঢাকা থেকে চট্টগ্রাম" },
    { en: "Dhaka to Rajshahi", bn: "ঢাকা থেকে রাজশাহী" },
    { en: "Dhaka to Khulna", bn: "ঢাকা থেকে খুলনা" },
    { en: "Dhaka to Rangpur", bn: "ঢাকা থেকে রংপুর" },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo textSize="text-2xl" />
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-normal">
              {t("footer_desc")}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold text-teal-700">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-teal-600" />
                {language === "bn" ? "১০০% ভেরিফাইড অপারেটর" : "100% Verified Operators"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-teal-600" />
                {language === "bn" ? "শুধুমাত্র আন্তঃজেলা" : "Inter-District Only"}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              {t("footer_top_routes")}
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {popularRoutes.map((route) => (
                <li key={route.en}>
                  <Link href="/search" className="hover:text-teal-700 hover:underline transition-colors">
                    {language === "bn" ? route.bn : `${route.en} Bus`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              {t("footer_quick_links")}
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {[
                { name: t("search_buses"), href: "/search" },
                { name: t("nav_routes"), href: "/routes" },
                { name: t("nav_timetable"), href: "/timetable" },
                { name: t("nav_operators"), href: "/operators" },
                { name: language === "bn" ? "অপারেটর পোর্টাল" : "Operator Portal", href: "/operator/login" },
                { name: language === "bn" ? "কাউন্টার স্টাফ চেক-ইন" : "Counter Staff Check-in", href: "/counter/login" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-teal-700 hover:underline transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("open-pwa-install"))}
                  className="hover:text-teal-700 hover:underline transition-colors text-xs font-medium text-left cursor-pointer"
                >
                  {t("nav_install_pwa")}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              {t("footer_support")}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>{t("footer_hotline")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>{t("footer_email")}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>{t("footer_address")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
          <p>© {tNum(2026)} {language === "bn" ? "বাস দরকার। সর্বস্বত্ব সংরক্ষিত।" : "Bus Dorkar. All rights reserved."}</p>
          <div className="flex items-center gap-1 text-slate-600">
            <span>{language === "bn" ? "তৈরি হয়েছে" : "Made with"}</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span>{language === "bn" ? "বাংলাদেশের জন্য 🇧🇩" : "for Bangladesh 🇧🇩"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
