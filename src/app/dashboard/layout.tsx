"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar, DashboardMobileNav } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <div className="pt-16 flex">
        <DashboardSidebar />
        <main className="flex-1 min-h-[calc(100vh-64px)] pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      <DashboardMobileNav />
    </div>
  );
}
