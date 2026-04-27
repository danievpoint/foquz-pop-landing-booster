import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";

const Impressum = () => (
  <div className="min-h-screen">
    <MarqueeBanner />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Impressum</h1>
      <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45]">
        <h2 className="text-xl font-bold">Angaben gemäß §5 DDG</h2>
        <p>FOQUZ GmbH<br />Gewerbering am Brand 8<br />82549 Königsdorf<br />Deutschland</p>
        <p>Handelsregister: HRB 311769<br />Registergericht: Amtsgericht München</p>
        <p>Vertreten durch die Geschäftsführer:<br />Matthias Kurpiers<br />Kevin Zaremba</p>
        <h2 className="text-xl font-bold">Kontakt:</h2>
        <p>E-Mail: info@foquz.de<br />Telefon: 01702420257</p>
        <h2 className="text-xl font-bold">Berufsbezeichnung:</h2>
        <p>Onlinehändler</p>
        <h2 className="text-xl font-bold">Verbraucherstreitbeilegung / Universalschlichtungsstelle:</h2>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Impressum;