import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";

const B2BAnfragen = () => (
  <div className="min-h-screen">
    <MarqueeBanner />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">B2B Anfragen</h1>
      <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45]">
        <p className="font-extrabold">Werden Sie FOQUZ-Partner</p>
        <p>FOQUZ steht für Qualität, Innovation und ein Produkt, das sich vom Gewohnten abhebt.</p>
        <p>Wenn Sie FOQUZ als Händler vertreiben oder eine individuelle B2B-Kooperation mit uns eingehen möchten, freuen wir uns darauf, von Ihnen zu hören.</p>
        <p>Für Händleranfragen, Großbestellungen und Kooperationen erreichen Sie uns unter:</p>
        <p className="font-extrabold">office@foquz.de</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default B2BAnfragen;