import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";

const UeberUns = () => (
  <div className="min-h-screen">
    <MarqueeBanner />
    <Navbar />
    <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Über uns</h1>
      <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45]">
        <p>FOQUZ steht für einzigartige Dufterlebnisse – Made in Germany. Unsere Mission ist es, mit innovativen Riechdosen unvergessliche Momente zu schaffen.</p>
        <p>Mehr Informationen folgen in Kürze.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default UeberUns;