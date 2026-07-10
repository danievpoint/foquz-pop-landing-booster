import { Link } from "react-router-dom";
import { useMemo } from "react";
import { HelpCircle, ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import FaqItem from "@/components/FaqItem";
import { faqs } from "@/data/faqs";

const Faq = () => {
  const grouped = useMemo(() => {
    const map = new Map<string, { faq: typeof faqs[number]; index: number }[]>();
    faqs.forEach((faq, index) => {
      const arr = map.get(faq.category) ?? [];
      arr.push({ faq, index });
      map.set(faq.category, arr);
    });
    return Array.from(map.entries());
  }, []);

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
    <>
      <SeoHead
        title="FAQ – Häufige Fragen zu FOQUZ | Alle 31 Antworten"
        description="Alle Antworten rund um FOQUZ: Anwendung, Inhaltsstoffe, Sorten, Sicherheit, Bestellung & Versand. Kurz, ehrlich und ohne Umwege erklärt."
        canonical="/faq"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Navbar />
      <main className="bg-background min-h-screen pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto max-w-3xl px-4 relative">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Sparkles className="absolute top-4 left-2 text-primary/30 hidden md:block" size={22} />
            <Sparkles className="absolute bottom-20 right-4 text-primary/30" size={18} />
          </div>

          <div className="text-center mb-10 md:mb-14 relative">
            <div className="inline-flex items-center gap-2 comic-outline comic-shadow bg-secondary px-4 py-1.5 rounded-full mb-4">
              <HelpCircle size={16} />
              <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider">
                Fragen & Antworten
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-3">HÄUFIGE FRAGEN</h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto">
              Alle {faqs.length} Antworten rund um FOQUZ – kurz, ehrlich und ohne Umwege erklärt.
            </p>
          </div>

          <div className="space-y-10 md:space-y-14">
            {grouped.map(([category, entries]) => (
              <section key={category}>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide mb-4 md:mb-6">
                  {category}
                </h2>
                <div className="space-y-3 md:space-y-4">
                  {entries.map(({ faq, index }) => (
                    <FaqItem key={faq.q} faq={faq} index={index} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 md:mt-16 flex justify-center">
            <Link
              to="/"
              className="comic-btn bg-secondary text-secondary-foreground inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Faq;
