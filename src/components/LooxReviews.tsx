import { useEffect, useRef } from "react";

interface LooxReviewsProps {
  productId: string;
}

/**
 * Loox-Bewertungen (Aggregat über alle Shop-Bewertungen).
 * Pro Seite existiert immer nur EIN #looxReviews Element.
 * Bei Client-Side-Routing wird das Widget neu initialisiert.
 */
const LooxReviews = ({ productId }: LooxReviewsProps) => {
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
    <section className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-black text-center mb-8 uppercase">
          DAS SAGEN UNSERE KUNDEN
        </h2>
        <div
          key={productId}
          ref={containerRef}
          id="looxReviews"
          data-product-id={productId}
          data-loox-aggregate
          data-write-btn="true"
        />
      </div>
    </section>
  );
};

export default LooxReviews;
