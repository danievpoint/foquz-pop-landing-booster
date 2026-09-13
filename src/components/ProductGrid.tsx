import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import StockBadge from "@/components/StockBadge";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { products } from "@/data/products";
import AutoVideo from "@/components/AutoVideo";
import { AccordionSections } from "@/pages/ProductDetail";
import { prefetchProductGallery } from "@/lib/shopify";

// Preload all product images immediately
products.forEach((p) => {
  const img = new Image();
  img.src = p.videoPoster ?? p.image;
});

// Galerie-Bilder der Produktseiten im Hintergrund vorladen (kleine WebP-Varianten)
if (typeof window !== "undefined") {
  const warm = () => products.forEach((p) => prefetchProductGallery(p.handle, [200, 800]));
  if ("requestIdleCallback" in window) {
    (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(warm);
  } else {
    setTimeout(warm, 1500);
  }
}


const cardVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({
    opacity: 1,
    y: 0,
  })
};


const InfoOverlay = ({
  product,
  onClose



}: {product: (typeof products)[0];onClose: () => void;}) =>
<motion.div
  className="fixed inset-0 z-50 flex items-center justify-center p-4"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}>
  
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <motion.div
    className="relative bg-card rounded-2xl max-w-md w-full shadow-2xl border-2 border-foreground/10 max-h-[85vh] flex flex-col"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    transition={{ duration: 0.25 }}>
    
      <button
      onClick={onClose}
      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border-2 border-foreground/20 hover:bg-foreground/10 transition-colors font-barlow font-extrabold text-sm z-10 bg-card">
      
        ✕
      </button>
      <div className="px-6 pt-6 pb-2 shrink-0">
        <h3 className="font-barlow font-extrabold text-2xl mb-1 pr-10">
          {product.name}
        </h3>
      </div>
      <div className="px-6 pb-6 overflow-y-auto">
        <AccordionSections product={product} isBundlePage={false} />
      </div>
    </motion.div>
  </motion.div>;


const InfoButton = ({ onClick }: {onClick: () => void;}) =>
<button
  onClick={onClick}
  className="w-8 h-8 rounded-full comic-btn bg-white text-black flex items-center justify-center font-barlow font-bold text-lg leading-none hover:opacity-80 shrink-0 !p-0">
  ?
</button>;




/**
 * Mobile carousel slide: exact-first-frame poster overlays the video.
 * Only the centered slide plays. As soon as the active slide changes, its
 * video starts while every peeking neighbour remains paused.
 * It loops endlessly; the next slide is chosen exclusively by
 * swipe/arrows/dots (no auto-advance on video end).
 *
 * The poster stays on top of the video until the real `playing` event fires,
 * then it is removed instantly (no transition). If iOS blocks autoplay the
 * poster stays visible — the native Safari play button never appears because
 * the video element itself stays `visibility: hidden` until it truly plays.
 */
const MobileVideoWithPoster = memo(({
  src,
  poster,
  play,
  near,
}: {
  src: string;
  poster: string;
  play: boolean;
  /** Nur aktive und direkt benachbarte Slides laden ueberhaupt Video-Daten. */
  near: boolean;
}) => {
  return (
    <div
      className="relative w-full aspect-square overflow-hidden"
      style={{ backgroundImage: `url(${poster})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {near ? (
        <AutoVideo
          src={src}
          poster={poster}
          loop
          play={play}
          preload={play ? "auto" : "metadata"}
          className="relative w-full aspect-square object-cover [transform:translateZ(0)]"
        />
      ) : (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
});
MobileVideoWithPoster.displayName = "MobileVideoWithPoster";




const DesktopHoverVideo = ({ video, poster }: { video: string; poster: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const wantPlayRef = useRef(false);

  const handleEnter = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    wantPlayRef.current = true;
    // Await any in-flight play/pause transition before issuing a new play()
    const attempt = () => {
      if (!wantPlayRef.current || !videoRef.current) return;
      const p = videoRef.current.play();
      if (p !== undefined) {
        playPromiseRef.current = p;
        p.catch(() => {}).finally(() => {
          playPromiseRef.current = null;
        });
      }
    };
    if (playPromiseRef.current) {
      playPromiseRef.current.then(attempt, attempt);
    } else {
      attempt();
    }
  }, []);

  const handleLeave = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    wantPlayRef.current = false;
    const doPause = () => {
      const v = videoRef.current;
      if (!v || wantPlayRef.current) return;
      try {
        v.pause();
        v.currentTime = 0;
      } catch {
        // ignore
      }
    };
    // If a play() is still pending, wait for it to resolve to avoid AbortError
    if (playPromiseRef.current) {
      playPromiseRef.current.then(doPause, doPause);
    } else {
      doPause();
    }
  }, []);

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <video
        ref={videoRef}
        src={video}
        poster={poster}
        muted
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
        className="w-full aspect-square object-cover"
      />
    </div>
  );
};

const ProductGrid = () => {
  const { addToCart } = useCart();
  const { isAvailable } = useProductAvailability();
  // Drei vollständige Produktreihen geben dem nativen Swipe genug Puffer.
  // Nach jeder Bewegung wird unsichtbar in die mittlere Reihe zurückgesetzt.
  // Dadurch kann keine Sorte am echten Anfang/Ende des Scrollbereichs landen.
  const COPY_COUNT = 3;
  const CENTER_COPY = 1;
  const extendedProducts = useMemo(
    () => Array.from({ length: COPY_COUNT }, () => products).flat(),
    []
  );
  // Karussell startet mittig, damit links und rechts jeweils ein Produkt angeschnitten sichtbar ist.
  const startRealIndex = Math.floor((products.length - 1) / 2);
  const startExtendedIndex = CENTER_COPY * products.length + startRealIndex;
  const [extendedActiveIndex, setExtendedActiveIndex] = useState(startExtendedIndex);
  const activeIndexRef = useRef(extendedActiveIndex);
  const [direction, setDirection] = useState(1);
  const [infoProduct, setInfoProduct] = useState<(typeof products)[0] | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isResettingRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useLockBodyScroll(Boolean(infoProduct));

  const getRealIndex = useCallback((extendedIndex: number) => {
    return ((extendedIndex % products.length) + products.length) % products.length;
  }, []);

  const realActiveIndex = getRealIndex(extendedActiveIndex);

  useEffect(() => {
    activeIndexRef.current = extendedActiveIndex;
  }, [extendedActiveIndex]);

  const scrollToExtended = useCallback((index: number, behavior: ScrollBehavior = 'auto') => {
    const el = carouselRef.current;
    if (!el) return;
    const slide = el.querySelector(`[data-slide-index="${index}"]`);
    if (!slide) return;
    const containerWidth = el.clientWidth;
    const slideWidth = (slide as HTMLElement).offsetWidth;
    const scrollLeft = (slide as HTMLElement).offsetLeft - (containerWidth - slideWidth) / 2;
    isResettingRef.current = true;
    el.scrollTo({ left: scrollLeft, behavior });
    setTimeout(() => { isResettingRef.current = false; }, 50);
  }, []);

  const goToReal = useCallback((realIndex: number) => {
    setDirection(realIndex > realActiveIndex ? 1 : -1);
    setAutoPlay(false);
    const extendedIndex = CENTER_COPY * products.length + realIndex;
    setExtendedActiveIndex(extendedIndex);
    scrollToExtended(extendedIndex);
  }, [realActiveIndex, scrollToExtended]);

  const goNext = useCallback(() => {
    setAutoPlay(false);
    setDirection(1);
    setExtendedActiveIndex((prev) => {
      const next = Math.min(prev + 1, extendedProducts.length - 2);
      scrollToExtended(next);
      return next;
    });
  }, [extendedProducts.length, scrollToExtended]);

  const goPrev = useCallback(() => {
    setAutoPlay(false);
    setDirection(-1);
    setExtendedActiveIndex((prev) => {
      const next = Math.max(prev - 1, 1);
      scrollToExtended(next);
      return next;
    });
  }, [extendedProducts.length, scrollToExtended]);

  const isCloneIndex = useCallback((index: number) => {
    const centerStart = CENTER_COPY * products.length;
    return index < centerStart || index >= centerStart + products.length;
  }, []);

  // Wenn das Karussell auf einem Klon landet, sofort (ohne Animation) zum echten Gegenstück springen.
  const resetFromClone = useCallback((cloneIndex: number) => {
    const el = carouselRef.current;
    if (!el) return;
    if (!isCloneIndex(cloneIndex)) return;
    const target = CENTER_COPY * products.length + getRealIndex(cloneIndex);
    const slide = el.querySelector(`[data-slide-index="${target}"]`) as HTMLElement | null;
    if (!slide) return;
    isResettingRef.current = true;
    const containerWidth = el.clientWidth;
    el.scrollLeft = slide.offsetLeft - (containerWidth - slide.offsetWidth) / 2;
    setExtendedActiveIndex(target);
    setTimeout(() => { isResettingRef.current = false; }, 50);
  }, [getRealIndex, isCloneIndex]);

  const handleCarouselScroll = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      const el = carouselRef.current;
      if (!el || isResettingRef.current) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      const slides = Array.from(el.querySelectorAll('[data-slide-index]')) as HTMLElement[];
      const nearest = slides.reduce((best, slide) => {
        const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
        return distance < best.distance
          ? { index: Number(slide.dataset.slideIndex), distance }
          : best;
      }, { index: activeIndexRef.current, distance: Number.POSITIVE_INFINITY });
      activeIndexRef.current = nearest.index;
      setExtendedActiveIndex(nearest.index);
      if (isCloneIndex(nearest.index)) resetFromClone(nearest.index);
    }, 40);
  }, [isCloneIndex, resetFromClone]);

  useEffect(() => () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  }, []);

  // Auto-advance only for products without video; video products advance via onended
  useEffect(() => {
    if (!autoPlay) return;
    const currentProduct = products[realActiveIndex];
    if (currentProduct.video) return; // video drives its own advancement
    const timer = setTimeout(() => {
      setDirection(1);
      setExtendedActiveIndex((prev) => {
        const next = Math.min(prev + 1, extendedProducts.length - 2);
        scrollToExtended(next);
        return next;
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, [autoPlay, realActiveIndex, extendedProducts.length, scrollToExtended]);

  // Scroll carousel when extendedActiveIndex changes, unless we are resetting from a clone
  useEffect(() => {
    if (isResettingRef.current) return;
    scrollToExtended(extendedActiveIndex, 'auto');
  }, [extendedActiveIndex, scrollToExtended]);

  return (
    <>
      <section id="sorten" className="section-padding pt-4 md:pt-24 pb-8 md:pb-28 bg-background relative z-10 scroll-mt-20">
        <div className="container mx-auto">
          <div className="hidden lg:block" style={{ containerType: 'inline-size' }}>
            <style>{`
              .pg-headline { font-size: clamp(2.5rem, 3.8cqw, 3.75rem); line-height: 0.9; margin-bottom: clamp(0.5rem, 0.8cqw, 0.875rem); }
              .pg-subtitle { font-size: clamp(0.875rem, 1.1cqw, 1.125rem); }
              .pg-grid { gap: clamp(1.25rem, 2cqw, 2rem); margin-top: clamp(1.5rem, 2.5cqw, 2.5rem); }
              .pg-card-title { font-size: clamp(1rem, 1.2cqw, 1.25rem); margin-bottom: clamp(0.125rem, 0.2cqw, 0.25rem); }
              .pg-card-desc { font-size: clamp(0.75rem, 0.85cqw, 0.875rem); margin-bottom: clamp(0.5rem, 0.8cqw, 0.875rem); }
              .pg-card-price { font-size: clamp(1.25rem, 1.6cqw, 1.5rem); }
              .pg-card-tax { font-size: clamp(0.625rem, 0.7cqw, 0.75rem); margin-bottom: clamp(0.5rem, 0.8cqw, 0.875rem); }
              .pg-card-btn { font-size: clamp(0.75rem, 0.85cqw, 0.875rem) !important; padding: clamp(0.4rem, 0.55cqw, 0.55rem) clamp(1rem, 1.5cqw, 1.5rem) !important; }
              .pg-card-gap { gap: clamp(0.5rem, 0.8cqw, 0.875rem); margin-bottom: clamp(0.125rem, 0.2cqw, 0.25rem); }
              .pg-card-actions { gap: clamp(0.5rem, 0.8cqw, 0.875rem); }
              .pg-card-img { margin-bottom: clamp(0.625rem, 1cqw, 1rem); }
              .pg-card-body { padding: clamp(0.3rem, 0.5cqw, 0.5rem) 0; }
            `}</style>
            <h2 className="pg-headline text-center">
              WÄHLE DEINEN VIBE
            </h2>
            <p className="pg-subtitle text-muted-foreground font-medium text-center max-w-xl mx-auto leading-relaxed">
              Drei Sorten, drei mal maximale Energie.<br />Finde den Kick, der perfekt zu deiner Session passt.
            </p>
            <div className="pg-grid grid grid-cols-3 mx-auto">
              {products.map((p, i) => {
                return (
                <motion.div
                  key={p.name}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col group">
                    <Link to={`/produkt/${p.handle}`} className="rounded-2xl overflow-hidden pg-card-img block relative">
                      {p.video ? (
                        <DesktopHoverVideo video={p.video} poster={p.videoPoster ?? p.image} />
                      ) : (
                        <img src={p.image} alt={p.name} className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300" />
                      )}
                    </Link>
                    <div className="pg-card-body">
                      <Link to={`/produkt/${p.handle}`} className="pg-card-title font-extrabold block hover:opacity-70 transition-opacity text-center">
                        {p.name}
                      </Link>
                      <p className="pg-card-desc text-muted-foreground whitespace-pre-line text-center">{p.desc}</p>
                      <div className="pg-card-gap flex items-center justify-center">
                        <span className="pg-card-price font-black">{p.price}</span>
                        <StockBadge available={isAvailable(p.name)} />
                      </div>
                      <span className="pg-card-tax text-muted-foreground block text-center">inkl. MwSt.</span>
                      <div className="pg-card-actions flex items-center justify-center gap-3">
                        <button
                          onClick={() => addToCart(1, { id: p.name, name: p.name, price: p.numericPrice, image: p.image })}
                          className="comic-btn text-black pg-card-btn"
                          style={{ backgroundColor: p.color }}>
                          IN DEN WARENKORB
                        </button>
                        <InfoButton onClick={() => setInfoProduct(p)} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile heading */}
          <div className="lg:hidden">
            <h2 className="md:text-[60px] md:leading-[0.9] text-center mb-1 md:mb-4 text-2xl">
              WÄHLE DEINEN VIBE
            </h2>
            <p className="text-muted-foreground font-medium md:text-lg text-center max-w-xl mx-auto text-xs leading-relaxed">
              Drei Sorten, drei mal maximale Energie.<br />Finde den Kick, der perfekt zu deiner Session passt.
            </p>
          </div>

          {/* Mobile: peeking carousel */}
          <div className="lg:hidden mt-3 w-screen relative left-1/2 -translate-x-1/2">
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-[14vw]"
              style={{ touchAction: 'pan-x pan-y', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {extendedProducts.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  data-slide-index={i}
                  className="w-[72vw] shrink-0 snap-center"
                  style={{ scrollSnapStop: 'always' }}>
                  <Link to={`/produkt/${p.handle}`} className="rounded-2xl overflow-hidden mb-1 block relative" style={{ backgroundColor: p.color + '22' }}>
                    {p.video ? (
                      <MobileVideoWithPoster
                        key={`slide-${i}-${p.name}`}
                        src={p.video}
                        poster={p.videoPoster ?? p.image}
                        play={i === extendedActiveIndex}
                        near={Math.abs(i - extendedActiveIndex) <= 1}
                      />
                    ) : (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="relative w-full aspect-square object-cover" />
                    )}
                  </Link>
                </div>
              ))}
            </div>

            <div className="py-1 text-center flex flex-col items-center">
              <Link to={`/produkt/${products[realActiveIndex].handle}`} className="text-base font-extrabold mb-0 block hover:opacity-70 transition-opacity">
                {products[realActiveIndex].name}
              </Link>
              <p className="text-xs text-muted-foreground mb-1.5 whitespace-pre-line leading-snug min-h-[2.5rem]">{products[realActiveIndex].desc}</p>
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <span className="text-xl font-black">{products[realActiveIndex].price}</span>
                <StockBadge available={isAvailable(products[realActiveIndex].name)} />
              </div>
              <span className="text-[10px] text-muted-foreground mb-1.5 block px-4 text-center">inkl. MwSt.</span>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setAutoPlay(false);
                    const p = products[realActiveIndex];
                    addToCart(1, { id: p.name, name: p.name, price: p.numericPrice, image: p.image });
                  }}
                  className="comic-btn text-black text-xs py-2 px-5"
                  style={{ backgroundColor: products[realActiveIndex].color }}>
                  IN DEN WARENKORB
                </button>
                <InfoButton onClick={() => setInfoProduct(products[realActiveIndex])} />
              </div>
            </div>

            {/* Arrows + Dots */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button aria-label="Vorheriges Produkt" onClick={goPrev} className="w-6 h-6 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/10 transition-colors">
                <ChevronLeft className="w-3 h-3" />
              </button>
              <div className="flex gap-2">
                {products.map((_, i) =>
                <button
                  key={i}
                  aria-label={`Gehe zu Produkt ${i + 1}`}
                  aria-current={i === realActiveIndex ? "true" : undefined}
                  onClick={() => goToReal(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === realActiveIndex ? "bg-foreground scale-125" : "bg-foreground/30"}`
                  } />
                )}
              </div>
              <button aria-label="Nächstes Produkt" onClick={goNext} className="w-6 h-6 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/10 transition-colors">
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Overlay */}
      <AnimatePresence>
        {infoProduct &&
        <InfoOverlay product={infoProduct} onClose={() => setInfoProduct(null)} />
        }
      </AnimatePresence>
    </>);

};

export default ProductGrid;
