import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import CookieBanner from "@/components/CookieBanner";
import NewsletterPopup, { NEWSLETTER_POPUP_ENABLED } from "@/components/NewsletterPopup";

const HowToSection = lazy(() => import("@/components/HowToSection"));
const WhyFoquzSection = lazy(() => import("@/components/WhyFoquzSection"));
const BundleSection = lazy(() => import("@/components/BundleSection"));
const CrewSection = lazy(() => import("@/components/CrewSection"));
const FaqSection = lazy(() => import("@/components/FaqSection"));

const NewsletterSection = lazy(() => import("@/components/NewsletterSection"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionFallback = () => <div className="min-h-[200px]" />;

const Index = () => {
  return (
    <>
        <div className="min-h-screen">
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
          <FaqSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <NewsletterSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CrewSection />
        </Suspense>
        {NEWSLETTER_POPUP_ENABLED && <NewsletterPopup />}
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>
      <CookieBanner />
    </>
  );
};

export default Index;
