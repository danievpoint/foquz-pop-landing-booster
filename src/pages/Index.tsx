import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection, { useHeroReady } from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import MarqueeBanner from "@/components/MarqueeBanner";
import CookieBanner from "@/components/CookieBanner";
import NewsletterPopup from "@/components/NewsletterPopup";

const HowToSection = lazy(() => import("@/components/HowToSection"));
const WhyFoquzSection = lazy(() => import("@/components/WhyFoquzSection"));
const BundleSection = lazy(() => import("@/components/BundleSection"));
const CrewSection = lazy(() => import("@/components/CrewSection"));

const NewsletterSection = lazy(() => import("@/components/NewsletterSection"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionFallback = () => <div className="min-h-[200px]" />;

const Index = () => {
  const heroReady = useHeroReady();

  return (
    <>
        <div className={`min-h-screen transition-opacity duration-500 ${heroReady ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {!heroReady && (
            <div className="fixed inset-0 z-[99999] bg-background flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          )}
        <MarqueeBanner />
        <Navbar />
        <HeroSection />
        <ProductGrid />
        <Suspense fallback={<SectionFallback />}>
          <HowToSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <WhyFoquzSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <BundleSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <NewsletterSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CrewSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>
      <CookieBanner />
      <NewsletterPopup />
    </>
  );
};

export default Index;
