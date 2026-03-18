import { useState, useEffect, useRef, useCallback } from "react";
import foquzLogo from "@/assets/foquz-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import StockBadge from "@/components/StockBadge";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import { products } from "@/data/products";

// Preload all product images immediately
products.forEach((p) => {
  const img = new Image();
  img.src = p.image;
});

const cardVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({
    opacity: 1,
    y: 0,
  })
};

const slideVariantsInstant = {
  enter: () => ({ opacity: 0 }),
  center: { opacity: 1 },
  exit: () => ({ opacity: 0 })
};

const slideVariantsSmooth = {
  enter: () => ({ opacity: 0 }),
  center: { opacity: 1 },
  exit: () => ({ opacity: 0 })
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
    className="relative bg-card rounded-2xl p-8 max-w-sm w-full shadow-2xl border-2 border-foreground/10"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    transition={{ duration: 0.25 }}>
    
      <button
      onClick={onClose}
      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border-2 border-foreground/20 hover:bg-foreground/10 transition-colors font-barlow font-extrabold text-sm">
      
        ✕
      </button>
      <h3 className="font-barlow font-extrabold text-2xl mb-1">
        WAS STECKT DRIN?
      </h3>
      <p className="text-sm text-muted-foreground mb-5 font-semibold">
        {product.name}
      </p>
      <ul className="space-y-2 mb-6">
        {product.ingredients.map((ing) =>
      <li key={ing} className="flex items-center gap-2 text-sm">
            <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
          style={{ backgroundColor: "#ffd618" }}>
          
              ✓
            </span>
            {ing}
          </li>
      )}
      </ul>
      <p className="text-xs font-bold text-muted-foreground">
        100% Natur. Ohne Chemie. Ohne Bullshit.
      </p>
    </motion.div>
  </motion.div>;


const InfoButton = ({ onClick, color }: {onClick: () => void;color: string;}) =>
<button
  onClick={onClick}
  className="w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center font-barlow font-bold text-2xl leading-none transition-colors duration-200 hover:border-transparent shrink-0 ml-auto"
  style={{ backgroundColor: color, color: "#000" }}
  onMouseEnter={(e) => {
    e.currentTarget.style.opacity = "0.8";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.opacity = "1";
  }}>
  
    +
  </button>;


const ProductGrid = () => {
  const { addToCart } = useCart();
  const { isAvailable } = useProductAvailability();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [infoProduct, setInfoProduct] = useState<(typeof products)[0] | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const goTo = useCallback((index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setAutoPlay(false);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    setAutoPlay(false);
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % products.length);
  }, []);

  const goPrev = useCallback(() => {
    setAutoPlay(false);
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  }, []);

  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isSwiping = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchEndX.current = e.touches[0].clientX;
      touchStartTime.current = Date.now();
      isSwiping.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
      const dx = Math.abs(touchEndX.current - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (!isSwiping.current && dy > 10) {
        // User is scrolling vertically — don't interfere
        return;
      }
      if (dx > dy && dx > 15) {
        isSwiping.current = true;
        e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      if (!isSwiping.current) return;
      const diff = touchStartX.current - touchEndX.current;
      const elapsed = Date.now() - touchStartTime.current;
      const velocity = Math.abs(diff) / elapsed;
      // Trigger on short fast swipes (velocity) or longer drags (distance)
      if (Math.abs(diff) > 30 || velocity > 0.3) {
        if (diff > 0) goNext();else
        goPrev();
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [goNext, goPrev]);

  return (
    <>
      <section id="sorten" className="section-padding pt-4 md:pt-24 pb-8 md:pb-28 bg-background relative z-10 scroll-mt-20">
        <div className="container mx-auto">
          <h2
            className="md:text-[60px] md:leading-[0.9] text-center mb-1 md:mb-4 text-2xl">
            
            WÄHLE DEINEN VIBE
          </h2>
          <p className="text-muted-foreground font-medium md:text-lg text-center max-w-xl mx-auto text-xs">
            Drei Sorten, drei mal maximale Energie.<br />Finde den Kick, der perfekt zu deiner Session passt.
          </p>

          {/* Desktop: static grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 mx-auto mt-12">
            {products.map((p, i) =>
            <motion.div
              key={p.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col">
              
                <Link to={`/produkt/${p.handle}`} className="rounded-2xl overflow-hidden mb-4 block">
                    <img
                  src={p.image}
                  alt={p.name}
                  className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300" />
                
                </Link>
                <div className="py-2">
                  <Link to={`/produkt/${p.handle}`} className="text-lg font-extrabold mb-1 block hover:opacity-70 transition-opacity">
                    {p.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">{p.desc}</p>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-black">{p.price}</span>
                    <StockBadge available={isAvailable(p.name)} />
                  </div>
                  <span className="text-xs text-muted-foreground mb-3 block">inkl. MwSt.</span>
                  <div className="flex items-center gap-3">
                    <button
                    onClick={() => addToCart(1, { id: p.name, name: p.name, price: p.numericPrice, image: p.image })}
                    className="comic-btn bg-card text-foreground text-sm py-2 px-6">
                    
                      FOKUS SICHERN
                    </button>
                    <InfoButton onClick={() => setInfoProduct(p)} color={p.color} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Mobile: carousel */}
          <div className="lg:hidden mt-3">
            <div
              ref={carouselRef}
              className="relative overflow-hidden"
              style={{ minHeight: 380, touchAction: 'pan-y', willChange: 'transform', contain: 'layout style' }}>
              
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeIndex}
                  variants={autoPlay ? slideVariantsSmooth : slideVariantsInstant}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={autoPlay ? { duration: 0.5, ease: "easeInOut" } : { duration: 0 }}
                  style={{ willChange: 'opacity' }}
                  className="flex flex-col items-center">
                  
                    <Link to={`/produkt/${products[activeIndex].handle}`} className="rounded-2xl overflow-hidden mb-1 w-full max-w-lg mx-auto block">
                        <img
                      src={products[activeIndex].image}
                      alt={products[activeIndex].name}
                      className="w-full aspect-square object-cover" />
                    
                    </Link>
                  <div className="py-1 text-center">
                    <Link to={`/produkt/${products[activeIndex].handle}`} className="text-base font-extrabold mb-0 block hover:opacity-70 transition-opacity">
                      {products[activeIndex].name}
                    </Link>
                    <p className="text-xs text-muted-foreground mb-1.5 whitespace-pre-line leading-snug">{products[activeIndex].desc}</p>
                    <div className="flex items-center justify-center gap-2 mb-0.5">
                      <span className="text-xl font-black">{products[activeIndex].price}</span>
                      <StockBadge available={isAvailable(products[activeIndex].name)} />
                    </div>
                    <span className="text-[10px] text-muted-foreground mb-1.5 block">inkl. MwSt.</span>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => addToCart(1, { id: products[activeIndex].name, name: products[activeIndex].name, price: products[activeIndex].numericPrice, image: products[activeIndex].image })}
                        className="comic-btn bg-card text-foreground text-xs py-2 px-5">
                        
                        FOKUS SICHERN
                      </button>
                      <InfoButton onClick={() => setInfoProduct(products[activeIndex])} color={products[activeIndex].color} />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Arrows + Dots */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={goPrev} className="w-6 h-6 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/10 transition-colors">
                <ChevronLeft className="w-3 h-3" />
              </button>
              <div className="flex gap-2">
                {products.map((_, i) =>
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "bg-foreground scale-125" : "bg-foreground/30"}`
                  } />
                )}
              </div>
              <button onClick={goNext} className="w-6 h-6 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/10 transition-colors">
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