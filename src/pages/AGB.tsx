import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalContent from "@/components/LegalContent";
import html from "@/legal/agb.html?raw";

const AGB = () => (
  <div className="min-h-screen">
    <SeoHead title={"AGB – FOQUZ"} description={"Allgemeine Geschäftsbedingungen der FOQUZ GmbH für den Onlineshop."} path={"/agb"} />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>
      <LegalContent html={html} />
    </div>
    <Footer />
  </div>
);

export default AGB;
