import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalContent from "@/components/LegalContent";
import html from "@/legal/garantie.html?raw";

const Garantie = () => (
  <div className="min-h-screen">
    <SeoHead title={"Duftgarantie – FOQUZ"} description={"Garantiebedingungen der freiwilligen 4-Wochen-Duftgarantie der FOQUZ GmbH."} path={"/garantie"} />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Duftgarantie</h1>
      <LegalContent html={html} />
    </div>
    <Footer />
  </div>
);

export default Garantie;
