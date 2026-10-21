import { useEffect, useRef, useState } from "react";
import { useConsent } from "@/lib/consent";
import { loadLooxIfAllowed } from "@/lib/consentRuntime";

interface LooxRatingProps {
  productId: string;
  className?: string;
}

/**
 * Offizielles Loox Sterne-Aggregat-Badge.
 * Erst nach Einwilligung in externe Bewertungsinhalte; der Platzhalter mit
 * Laden-Knopf steht im Bewertungsbereich (LooxReviews).
 */
const LooxRating = ({ productId, className = "" }: LooxRatingProps) => {
  const { reviews } = useConsent();
  const ref = useRef<HTMLDivElement>(null);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    if (!reviews) return;
    const el = ref.current;
    if (!el) return;
    setHasContent(false);

    const check = () => {
      const hasStars = !!el.querySelector('svg, img, .loox-icon, [class*="star"]');
      setHasContent(hasStars);
    };
    const observer = new MutationObserver(check);
    observer.observe(el, { childList: true, subtree: true, attributes: true });

    const t = setTimeout(() => {
      loadLooxIfAllowed();
      check();
    }, 150);
    const t2 = setTimeout(check, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [productId, reviews]);

  if (!reviews) return null;

  return (
    <div className={hasContent ? className : "hidden"}>
      <div key={productId} ref={ref} className="loox-rating" data-id={productId} data-fetch="true" />
    </div>
  );
};

export default LooxRating;
