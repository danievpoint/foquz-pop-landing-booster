import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Ist FOQUZ legal?",
    a: "Ja, 100%. FOQUZ enthält ausschließlich natürliche ätherische Öle, Kräuterauszüge und Aromen. Nichts davon ist rezeptpflichtig oder eingeschränkt.",
  },
  {
    q: "Was ist drin?",
    a: "Je nach Sorte eine Mischung aus ätherischen Ölen wie Menthol, Zitronengras, Osmanthus- und Jasminblüte, Kräutern und natürlichen Aromen. Keine Tabakprodukte, kein Nikotin, kein Koffein.",
  },
  {
    q: "Wie benutze ich FOQUZ?",
    a: "Dose öffnen, kurz an der Nase vorbeiführen und tief einatmen. Danach direkt wieder verschließen, damit der Duft möglichst lange erhalten bleibt.",
  },
  {
    q: "Wie lange hält eine Dose?",
    a: "Bei normaler Anwendung und richtigem Verschließen mehrere Wochen bis Monate. Nicht direkter Sonneneinstrahlung aussetzen.",
  },
  {
    q: "Wann kommt meine Bestellung?",
    a: "Wir versenden werktags innerhalb von 24 Stunden aus Deutschland. Die typische Lieferzeit innerhalb DE beträgt 1–3 Werktage. Versandkosten werden im Checkout angezeigt.",
  },
  {
    q: "Kann ich zurückgeben?",
    a: "Innerhalb von 14 Tagen problemlos, sofern das Produkt originalverpackt und unbenutzt ist. Details in unserer Widerrufsbelehrung im Footer.",
  },
];

const FaqItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="comic-card bg-card overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left"
      >
        <span className="font-extrabold text-base md:text-lg">{q}</span>
        <ChevronDown
          size={20}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 md:px-6 md:pb-6 -mt-1">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </motion.div>
  );
};

const FaqSection = () => {
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
    <section id="faq" className="section-padding py-12 md:py-20 bg-background scroll-mt-[124px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-5xl font-black mb-2">HÄUFIGE FRAGEN</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Kurz erklärt – bevor du fragst.
          </p>
        </div>
        <div className="space-y-3 md:space-y-4">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
