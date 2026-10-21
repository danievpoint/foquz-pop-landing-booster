import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalContent from "@/components/LegalContent";
import html from "@/legal/widerruf.html?raw";

const Widerrufsbelehrung = () => (
  <div className="min-h-screen">
    <SeoHead title={"Widerrufsbelehrung – FOQUZ"} description={"Widerrufsrecht, Muster-Widerrufsformular und Online-Widerruf für FOQUZ Bestellungen."} path={"/widerrufsbelehrung"} />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Widerrufsbelehrung</h1>
      <Link to="/vertrag-widerrufen" id="widerrufsformular" className="mb-8 inline-flex items-center justify-center rounded-full bg-foreground text-background font-bold px-6 py-3 text-sm hover:opacity-90 transition-opacity">
        Vertrag widerrufen
      </Link>
      <LegalContent html={html} />
    </div>
    <Footer />
  </div>
);

export default Widerrufsbelehrung;
