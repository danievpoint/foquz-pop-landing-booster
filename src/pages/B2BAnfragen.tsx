import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";

const B2BAnfragen = () => (
  <CartProvider>
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">B2B Anfragen</h1>
        <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45]">
          <p>Du möchtest FOQUZ in deinem Shop oder Unternehmen anbieten? Kontaktiere uns für B2B-Konditionen und individuelle Angebote.</p>
          <p>Schreib uns eine E-Mail und wir melden uns bei dir.</p>
        </div>
      </div>
      <Footer />
    </div>
  </CartProvider>
);

export default B2BAnfragen;
