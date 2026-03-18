import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Datenschutz = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container mx-auto px-4 pt-40 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Datenschutzerklärung</h1>
      <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45]">
        <p>Hier findest du unsere Datenschutzerklärung. Diese Seite wird in Kürze mit allen relevanten Informationen aktualisiert.</p>
        <p>Bei Fragen zum Datenschutz kontaktiere uns gerne per E-Mail.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Datenschutz;