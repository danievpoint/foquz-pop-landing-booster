import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const Impressum = () => (
  <div className="min-h-screen">
    <SeoHead title={"Impressum – FOQUZ GmbH"} description={"Anbieterkennzeichnung der FOQUZ GmbH gemäß §5 DDG."} path={"/impressum"} />
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
        <p>E-Mail: info@foquz.de<br />Telefon: +49 170 2420257</p>
        <h2 className="text-xl font-bold">Berufsbezeichnung:</h2>
        <p>Onlinehändler</p>
        <h2 className="text-xl font-bold">Verbraucherstreitbeilegung / Universalschlichtungsstelle:</h2>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        <h2 className="text-xl font-bold">Online-Streitbeilegung (OS-Plattform):</h2>
        <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter folgender Adresse finden: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="underline">https://ec.europa.eu/consumers/odr</a>. Unsere E-Mail-Adresse lautet: info@foquz.de.</p>
        <h2 className="text-xl font-bold">Haftung für Inhalte und Links:</h2>
        <p>Als Diensteanbieter sind wir gemäß §7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Für Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Impressum;