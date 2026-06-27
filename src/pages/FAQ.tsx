import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const faqs = [
  {
    q: "Was ist FOQUZ?",
    a: "FOQUZ ist die Original Riechdose aus Deutschland – 100% aromatisch, 100% legal, 100% Wolke 7!",
  },
  {
    q: "Wie verwende ich FOQUZ?",
    a: "Einfach Dose öffnen, genießen und Dose wieder verschließen. Schau dir unsere Anleitung an für mehr Details.",
  },
  {
    q: "Wie lange hält der Duft?",
    a: "Bei richtiger Verwendung hält der Duft mehrere Wochen bis Monate.",
  },
];

const FAQ = () => {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <div className="min-h-screen">
      <SeoHead
        title="Häufig gestellte Fragen – FOQUZ"
        description="Antworten zu Verwendung, Inhaltsstoffen, Versand und Haltbarkeit der FOQUZ Riechdose."
        path="/faq"
        jsonLd={faqLd}
      />
      <MarqueeBanner />
      <Navbar />
      <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Häufig gestellte Fragen</h1>
        <div className="space-y-6 opacity-80 leading-relaxed [&_p]:leading-[1.45]">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-bold text-lg mb-2">{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
