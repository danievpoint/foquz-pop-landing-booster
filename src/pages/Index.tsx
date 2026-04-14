import { lazy, Suspense, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection, { useHeroReady } from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import MarqueeBanner from "@/components/MarqueeBanner";
import CookieBanner from "@/components/CookieBanner";
import NewsletterPopup from "@/components/NewsletterPopup";
import BundlePopup from "@/components/BundlePopup";

const HowToSection = lazy(() => import("@/components/HowToSection"));
const WhyFoquzSection = lazy(() => import("@/components/WhyFoquzSection"));
const BundleSection = lazy(() => import("@/components/BundleSection"));
const CrewSection = lazy(() => import("@/components/CrewSection"));

const NewsletterSection = lazy(() => import("@/components/NewsletterSection"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionFallback = () => <div className="min-h-[200px]" />;

const Index = () => {
  const heroReady = useHeroReady();

  // Lock scroll until hero is ready to prevent desync
  useEffect(() => {
    if (!heroReady) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      // Preserve current scroll position when unlocking
      const y = window.scrollY;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' });
      });
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [heroReady]);

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
          <BundleSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <HowToSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <WhyFoquzSection />
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
