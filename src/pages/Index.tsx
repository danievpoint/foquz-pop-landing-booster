import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import HowToSection from "@/components/HowToSection";
import BundleSection from "@/components/BundleSection";
import WhyFoquzSection from "@/components/WhyFoquzSection";
import ReviewSection from "@/components/ReviewSection";
import TrustBar from "@/components/TrustBar";

import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { CartProvider } from "@/contexts/CartContext";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <Navbar />
        <HeroSection />
        <ProductGrid />
        <HowToSection />
        <WhyFoquzSection />
        <BundleSection />
        <ReviewSection />
        <TrustBar />
        
        <NewsletterSection />
        <Footer />
      </div>
      <CookieBanner />
    </CartProvider>
  );
};

export default Index;
