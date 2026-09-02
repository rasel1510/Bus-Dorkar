"use client";

import { Ticket, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface StatsCardsProps {
  totalBookings: number;
  upcomingTrips: number;
  completedTrips: number;
  cancelledTrips: number;
}

export function StatsCards({ totalBookings, upcomingTrips, completedTrips, cancelledTrips }: StatsCardsProps) {
  const { language, tNum } = useLanguage();

  const stats = [
    {
      labelEn: "Total Bookings",
      labelBn: "মোট বুকিং",
      value: totalBookings,
      icon: Ticket,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
      borderColor: "border-teal-200",
    },
    {
      labelEn: "Upcoming Trips",
      labelBn: "আসন্ন ভ্রমণ",
      value: upcomingTrips,
      icon: Clock,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      labelEn: "Completed",
      labelBn: "সম্পন্ন",
      value: completedTrips,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
    {
      labelEn: "Cancelled",
      labelBn: "বাতিলকৃত",
      value: cancelledTrips,
      icon: XCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl border ${stat.borderColor} p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className={`h-10 w-10 ${stat.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{tNum(stat.value)}</p>
            <p className="text-[11px] font-semibold text-slate-500">
              {language === "bn" ? stat.labelBn : stat.labelEn}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
