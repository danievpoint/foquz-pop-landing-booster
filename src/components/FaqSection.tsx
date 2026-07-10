import { Link } from "react-router-dom";
import { Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { faqs } from "@/data/faqs";
import FaqItem from "@/components/FaqItem";

// Auf der Landingpage werden bewusst nur die ersten 7 Fragen gezeigt.
// Alle 31 Fragen findet der Nutzer auf der dedizierten /faq Seite.
const INITIAL_VISIBLE = [0, 1, 3, 9, 10, 21, 22];

const FaqSection = () => {
  const visibleFaqs = INITIAL_VISIBLE.map((i) => ({ faq: faqs[i], index: i }));

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
    <section
      id="faq"
      className="section-padding py-14 md:py-24 bg-background scroll-mt-[124px] relative overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Sparkles className="absolute top-10 left-6 md:left-16 text-primary/40 hidden md:block" size={26} />
        <Sparkles className="absolute top-8 right-1/3 text-foreground/20 hidden md:block" size={22} />
        <Sparkles className="absolute bottom-16 right-8 md:right-16 text-primary/30" size={20} />
      </div>

      <div className="container mx-auto max-w-3xl relative">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 comic-outline comic-shadow bg-secondary px-4 py-1.5 rounded-full mb-4">
            <HelpCircle size={16} />
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider">
              Fragen & Antworten
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-3">HÄUFIGE FRAGEN</h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto">
            Alles rund um FOQUZ – kurz, ehrlich und ohne Umwege erklärt.
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {visibleFaqs.map(({ faq, index }) => (
            <FaqItem key={faq.q} faq={faq} index={index} />
          ))}
        </div>

        <div className="mt-8 md:mt-10 flex flex-col items-center gap-3">
          <Link
            to="/faq"
            className="comic-btn bg-primary text-primary-foreground inline-flex items-center gap-2"
          >
            Alle {faqs.length} Fragen anzeigen
            <ArrowRight size={20} />
          </Link>
          <p className="text-xs md:text-sm text-muted-foreground">
            Zeige {INITIAL_VISIBLE.length} von {faqs.length} Fragen
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
