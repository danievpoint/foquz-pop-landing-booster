import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";

const FAQ = () => (
  <CartProvider>
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Häufig gestellte Fragen</h1>
        <div className="space-y-6 opacity-80 leading-relaxed [&_p]:leading-[1.45]">
          <div>
            <h3 className="font-bold text-lg mb-2">Was ist FOQUZ?</h3>
            <p>FOQUZ ist die Original Riechdose aus Deutschland – 100% aromatisch, 100% legal, 100% Wolke 7!</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Wie verwende ich FOQUZ?</h3>
            <p>Einfach Dose öffnen, genießen und Dose wieder verschließen. Schau dir unsere Anleitung an für mehr Details.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Wie lange hält der Duft?</h3>
            <p>Bei richtiger Verwendung hält der Duft mehrere Wochen bis Monate.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </CartProvider>
);

export default FAQ;
