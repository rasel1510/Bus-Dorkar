import { Navbar } from "@/components/layout/navbar";
import { HeroSearch } from "@/components/home/hero-search";
import { StatsBar } from "@/components/home/stats-bar";
import { PopularRoutes } from "@/components/home/popular-routes";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { OperatorsCarousel } from "@/components/home/operators-carousel";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bd-navy-950 flex flex-col font-sans selection:bg-bd-teal-500 selection:text-bd-navy-950">
      <Navbar />
      <main className="flex-1">
        <HeroSearch />
        <StatsBar />
        <PopularRoutes />
        <HowItWorks />
        <Features />
        <OperatorsCarousel />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
