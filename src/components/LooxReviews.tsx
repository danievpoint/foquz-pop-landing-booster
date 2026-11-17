import { useEffect, useRef } from "react";
import { useConsent, writeConsent } from "@/lib/consent";
import { loadLooxIfAllowed } from "@/lib/consentRuntime";
import { Button } from "@/components/ui/button";

interface LooxReviewsProps {
  productId?: string;
  embedded?: boolean;
}

/** Platzhalter, solange keine Einwilligung in externe Bewertungsinhalte vorliegt. */
export const LooxConsentPlaceholder = () => (
  <div className="loox-consent-card mx-auto max-w-xl rounded-lg border-4 border-border p-6 sm:p-8 text-center font-barlow">
    <h2 className="text-2xl md:text-3xl font-extrabold uppercase mb-4 leading-tight">DAS SAGEN UNSERE KUNDEN</h2>
    <p className="text-base text-foreground leading-relaxed mb-6">
      Unsere echten Kundenbewertungen werden über unseren Dienstleister Loox geladen. Erst mit deinem Klick werden dabei Daten an Loox übertragen. Mehr dazu in der{" "}
      <a href="/datenschutz" className="underline font-semibold leading-relaxed">Datenschutzerklärung</a>.
    </p>
    <Button
      type="button"
      variant="secondary"
      onClick={() => writeConsent({ reviews: true })}
      className="loox-consent-button h-auto min-h-12 w-full sm:w-auto whitespace-normal rounded-lg border-2 border-border text-foreground font-extrabold text-base leading-tight py-3 px-5"
    >
      BEWERTUNGEN ANZEIGEN
    </Button>
  </div>
);

/**
 * Loox-Bewertungen (Aggregat über alle Shop-Bewertungen).
 * Pro Seite existiert immer nur EIN #looxReviews Element.
 * Bewertungen können ausschließlich über die Loox-Einladungsmail nach
 * einer echten Bestellung abgegeben werden – deshalb gibt es hier
 * bewusst keinen "Bewertung schreiben"-Button.
 */
const LooxReviews = ({ productId = "10276794335574", embedded = false }: LooxReviewsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reviews } = useConsent();

  useEffect(() => {
    if (!reviews) return;
    const el = containerRef.current;
    if (!el) return;
    // Widget-Inhalt bei Produktwechsel zurücksetzen und Loox neu rendern lassen
    el.innerHTML = "";
    const t = setTimeout(loadLooxIfAllowed, 100);
    return () => clearTimeout(t);
  }, [productId, reviews]);

  return (
    <section className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4">
        {!embedded && reviews && <h2 className="text-2xl md:text-4xl font-black text-center mb-8 uppercase">
          DAS SAGEN UNSERE KUNDEN
        </h2>}
        {reviews ? (
          /* Kein data-product-id: so zeigt Loox ALLE Shop-Bewertungen (Aggregat),
             nicht nur die des aktuellen Produkts. */
          <div
            key={productId}
            ref={containerRef}
            id="looxReviews"
            data-loox-aggregate
            data-write-btn="false"
          />
        ) : (
          <LooxConsentPlaceholder />
        )}
      </div>
    </section>
  );
};

export default LooxReviews;
