import { useEffect, useRef } from "react";

interface LooxReviewsProps {
  productId: string;
  embedded?: boolean;
}

/**
 * Loox-Bewertungen (Aggregat über alle Shop-Bewertungen).
 * Pro Seite existiert immer nur EIN #looxReviews Element.
 * Bewertungen können ausschließlich über die Loox-Einladungsmail nach
 * einer echten Bestellung abgegeben werden – deshalb gibt es hier
 * bewusst keinen "Bewertung schreiben"-Button.
 */
const LooxReviews = ({ productId, embedded = false }: LooxReviewsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Widget-Inhalt bei Produktwechsel zurücksetzen und Loox neu rendern lassen
    el.innerHTML = "";
    const loox = (window as unknown as { loox?: { intg?: { reload?: () => void } } }).loox;
    const t = setTimeout(() => {
      try {
        loox?.intg?.reload?.();
      } catch {
        /* noop */
      }
    }, 100);
    return () => clearTimeout(t);
  }, [productId]);

  return (
    <section className={embedded ? "w-full" : "w-full py-12 md:py-16"}>
      <div className={embedded ? "w-full" : "container mx-auto px-4"}>
        {!embedded && <h2 className="text-2xl md:text-4xl font-black text-center mb-8 uppercase">
          DAS SAGEN UNSERE KUNDEN
        </h2>}
        {/* Kein data-product-id: so zeigt Loox ALLE Shop-Bewertungen (Aggregat),
            nicht nur die des aktuellen Produkts. */}
        <div
          key={productId}
          ref={containerRef}
          id="looxReviews"
          data-loox-aggregate
          data-write-btn="false"
        />
      </div>
    </section>
  );
};

export default LooxReviews;
