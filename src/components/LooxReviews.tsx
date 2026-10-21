import { useEffect, useRef } from "react";
import { openCookieSettings, useConsent, writeConsent } from "@/lib/consent";
import { loadLooxIfAllowed } from "@/lib/consentRuntime";

interface LooxReviewsProps {
  productId: string;
  embedded?: boolean;
}

/** Platzhalter, solange keine Einwilligung in externe Bewertungsinhalte vorliegt. */
export const LooxConsentPlaceholder = () => (
  <div className="mx-auto max-w-xl rounded-2xl border-2 border-dashed border-foreground/40 bg-muted/40 p-6 text-center">
    <p className="font-black uppercase mb-2">Kundenbewertungen von Loox</p>
    <p className="text-sm text-muted-foreground mb-4">
      Die Bewertungen werden vom externen Anbieter Loox (Loox Ltd., Israel) geladen. Dabei werden u. a. Ihre
      IP-Adresse und Geräteinformationen an Loox übertragen. Ihre Einwilligung können Sie jederzeit in den{" "}
      <button type="button" onClick={openCookieSettings} className="underline font-semibold">Cookie-Einstellungen</button>{" "}
      widerrufen. Mehr in der <a href="/datenschutz" className="underline font-semibold">Datenschutzerklärung</a>.
    </p>
    <button
      type="button"
      onClick={() => writeConsent({ reviews: true })}
      className="comic-btn bg-primary text-primary-foreground text-sm py-2 px-4"
    >
      BEWERTUNGEN LADEN
    </button>
  </div>
);

/**
 * Loox-Bewertungen (Aggregat über alle Shop-Bewertungen).
 * Pro Seite existiert immer nur EIN #looxReviews Element.
 * Bewertungen können ausschließlich über die Loox-Einladungsmail nach
 * einer echten Bestellung abgegeben werden – deshalb gibt es hier
 * bewusst keinen "Bewertung schreiben"-Button.
 */
const LooxReviews = ({ productId, embedded = false }: LooxReviewsProps) => {
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
        {!embedded && <h2 className="text-2xl md:text-4xl font-black text-center mb-8 uppercase">
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
