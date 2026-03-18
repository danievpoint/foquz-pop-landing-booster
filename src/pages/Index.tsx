import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

const ProductGrid = lazy(() => import("@/components/ProductGrid"));
const HowToSection = lazy(() => import("@/components/HowToSection"));
const WhyFoquzSection = lazy(() => import("@/components/WhyFoquzSection"));
const BundleSection = lazy(() => import("@/components/BundleSection"));
const ReviewSection = lazy(() => import("@/components/ReviewSection"));
const TrustBar = lazy(() => import("@/components/TrustBar"));
const NewsletterSection = lazy(() => import("@/components/NewsletterSection"));
const Footer = lazy(() => import("@/components/Footer"));
const CookieBanner = lazy(() => import("@/components/CookieBanner"));

const SectionFallback = () => <div className="min-h-[200px]" />;

const Index = () => {
  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <HeroSection />
        <Suspense fallback={<SectionFallback />}>
          <ProductGrid />
        </Suspense>
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
          <ReviewSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <TrustBar />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <NewsletterSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <CookieBanner />
      </Suspense>
    </>
  );
};

export default Index;
