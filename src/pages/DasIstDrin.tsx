import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DasIstDrin = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container mx-auto px-4 pt-20 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Das ist drin</h1>
      <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45]">
        <p>Erfahre hier alles über die Inhaltsstoffe unserer FOQUZ Riechdosen. Transparenz ist uns wichtig.</p>
        <p>Detaillierte Informationen folgen in Kürze.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default DasIstDrin;