import { useEffect, useRef } from "react";

interface LooxReviewsProps {
  productId: string;
}

interface LooxWindow {
  LOOX?: {
    showReviewForm?: (productId: string) => void;
  };
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

  const handleWriteReview = () => {
    try {
      const loox = (window as unknown as LooxWindow).LOOX;
      if (loox?.showReviewForm) {
        loox.showReviewForm(productId);
        return;
      }
    } catch {
      /* noop */
    }
    // Fallback für Adblocker / nicht geladenes Widget
    window.open(
      `https://loox.io/widget/CB2AJBwsHX/ugc/review-form?productId=${encodeURIComponent(productId)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-black text-center mb-8 uppercase">
          DAS SAGEN UNSERE KUNDEN
        </h2>
        <div className="flex justify-center mb-6 md:mb-8">
          <button
            type="button"
            onClick={handleWriteReview}
            className="comic-btn text-sm md:text-base px-8 py-3 md:px-10 md:py-4"
            style={{ backgroundColor: "#FFD11A", color: "#000", borderWidth: 3 }}
          >
            BEWERTUNG SCHREIBEN
          </button>
        </div>
        <div
          key={productId}
          ref={containerRef}
          id="looxReviews"
          data-product-id={productId}
          data-loox-aggregate
          data-write-btn="false"
        />
      </div>
    </section>
  );
};

export default LooxReviews;
