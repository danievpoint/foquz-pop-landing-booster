import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";

const Impressum = () => (
  <CartProvider>
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Impressum</h1>
        <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45]">
          <h2 className="text-xl font-bold">Inhalte gemäß §5 DDG</h2>
          <p>Foquz GmbH<br />Gewerbering am Brand 8<br />82549 Königsdorf</p>
          <p>Handelsregister: wird nachgereicht<br />Registergericht: wird nachgereicht</p>
          <p>Vertreten durch: Kevin Zaremnba, Matthias Kurpiers</p>
          <h2 className="text-xl font-bold">Kontaktdaten:</h2>
          <p>E-Mail: info@foquz.de<br />Telefon: 00491702420257</p>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />wird nachgereicht</p>
        </div>
      </div>
      <Footer />
    </div>
  </CartProvider>
);

export default Impressum;
