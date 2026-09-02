import { useEffect, useRef, useState } from "react";

interface LooxRatingProps {
  productId: string;
  className?: string;
}

/**
 * Offizielles Loox Sterne-Aggregat-Badge.
 * Wird automatisch ausgeblendet, solange Loox keine Bewertungen rendert.
 */
const LooxRating = ({ productId, className = "" }: LooxRatingProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setHasContent(false);

    const check = () => {
      if (el.innerHTML.trim().length > 0) setHasContent(true);
    };

    const observer = new MutationObserver(check);
    observer.observe(el, { childList: true, subtree: true });

    const t = setTimeout(() => {
      try {
        const loox = (window as unknown as { loox?: { intg?: { reload?: () => void } } }).loox;
        loox?.intg?.reload?.();
      } catch {
        /* noop */
      }
      check();
    }, 150);

    return () => {
      observer.disconnect();
      clearTimeout(t);
    };
  }, [productId]);

  return (
    <div className={hasContent ? className : "hidden"}>
      <div key={productId} ref={ref} className="loox-rating" data-id={productId} data-fetch="true" />
    </div>
  );
};

export default LooxRating;
