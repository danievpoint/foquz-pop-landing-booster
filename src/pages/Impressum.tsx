import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalContent from "@/components/LegalContent";
import html from "@/legal/impressum.html?raw";

const Impressum = () => (
  <div className="min-h-screen">
    <SeoHead title={"Impressum – FOQUZ GmbH"} description={"Anbieterkennzeichnung der FOQUZ GmbH gemäß § 5 DDG."} path={"/impressum"} />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Impressum</h1>
      <LegalContent html={html} />
    </div>
    <Footer />
  </div>
);

export default Impressum;
