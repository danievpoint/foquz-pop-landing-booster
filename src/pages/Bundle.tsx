import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BundleSection from "@/components/BundleSection";
import LooxReviews from "@/components/LooxReviews";
import SeoHead from "@/components/SeoHead";

const BUNDLE_PRODUCT_ID = "10276796498262";

const Bundle = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="FOQUZ Power Bundle – Alle 3 Sorten in einer Box"
        description="Teste alle 3 FOQUZ Sorten in einer limitierten Box. Inklusive Sticker-Set & Nasenstrips."
        path="/bundle"
      />
      <Navbar />
      <main>
        <BundleSection />
        <LooxReviews productId={BUNDLE_PRODUCT_ID} />
      </main>
      <Footer />
    </div>
  );
};

export default Bundle;
