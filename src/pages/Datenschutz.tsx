import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalContent from "@/components/LegalContent";
import html from "@/legal/datenschutz.html?raw";

const Datenschutz = () => (
  <div className="min-h-screen">
    <SeoHead title={"Datenschutzerklärung – FOQUZ"} description={"Informationen zur Verarbeitung personenbezogener Daten im Onlineshop der FOQUZ GmbH."} path={"/datenschutz"} />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Datenschutzerklärung</h1>
      <LegalContent html={html} />
    </div>
    <Footer />
  </div>
);

export default Datenschutz;
