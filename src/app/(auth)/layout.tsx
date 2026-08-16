import Link from "next/link";
import { Bus, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-3 sm:p-5 relative overflow-x-hidden overflow-y-auto selection:bg-teal-600 selection:text-white">
      {/* Background Ambient Tint Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="flex items-center justify-between max-w-7xl w-full mx-auto z-10 shrink-0">
        <Logo />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors bg-white border border-slate-200 shadow-sm px-3.5 py-2 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
      </header>

      {/* Main Content Container */}
      <main className="my-auto py-2 sm:py-4 z-10 flex justify-center items-center">{children}</main>

      {/* Auth Footer */}
      <footer className="text-center text-xs text-slate-500 font-medium z-10 shrink-0 py-1">
        <p>© 2026 Bus Dorkar. Secure Inter-District Bus Ticketing System Bangladesh.</p>
      </footer>
    </div>
  );
}
