import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";

const Anleitung = () => (
  <div className="min-h-screen">
    <MarqueeBanner />
    <Navbar />
    <div className="container mx-auto px-4 pt-32 md:pt-40 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Anleitung</h1>
      <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45]">
        <p>Hier findest du eine ausführliche Anleitung zur Verwendung deiner FOQUZ Riechdose.</p>
        <p>Detaillierte Schritt-für-Schritt-Anweisungen folgen in Kürze.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Anleitung;