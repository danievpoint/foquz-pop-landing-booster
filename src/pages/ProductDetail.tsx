import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { allProducts } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import StockBadge from "@/components/StockBadge";
import MarqueeBanner from "@/components/MarqueeBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft, X, ShoppingBag } from "lucide-react";
import foquzBox from "@/assets/foquz-box.png";

// Preload all product images on module load
allProducts.forEach((p) => {
  const img = new Image();
  img.src = p.image;
});

const BundleBanner = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10001] bg-black/50 backdrop-blur-sm"
            onClick={() => setDismissed(true)}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none"
          >
          <div
            className="relative w-full max-w-sm md:max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-foreground/10 flex flex-col items-center text-center gap-4 pointer-events-auto"
            style={{ backgroundColor: "#75559f" }}
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <Link to="/produkt/starter-bundle" onClick={() => setDismissed(true)}>
              <img src={foquzBox} alt="FOQUZ Power Bundle" className="w-40 h-40 md:w-52 md:h-52 object-cover rounded-2xl drop-shadow-xl" />
            </Link>
            <h3 className="text-white font-extrabold text-xl md:text-2xl leading-tight">
              FOQUZ POWER BUNDLE – Alle 3 Sorten!
            </h3>
            <p className="text-white/70 text-sm md:text-base">
              Spar 15% und teste alle Geschmacksrichtungen in einer Box.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-white font-black text-2xl md:text-3xl">14,99€</span>
              <span className="text-white/50 line-through text-base md:text-lg">23,97€</span>
            </div>
            <button
              onClick={() => {
                addToCart(1, { id: "starter-bundle", name: "FOQUZ Power Bundle (3 Sorten)", price: 14.99, image: foquzBox });
                setDismissed(true);
              }}
              className="comic-btn text-base md:text-lg py-3 px-10 md:py-4 md:px-14 font-black flex items-center gap-2 mt-2"
              style={{ backgroundColor: "#ffd618", color: "#000" }}
            >
              <ShoppingBag className="w-5 h-5" />
              BUNDLE SICHERN
            </button>
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const OtherProductCard = ({ p, addToCart, isAvailable }: { p: typeof allProducts[0]; addToCart: any; isAvailable: (name: string) => boolean | null }) => (
  <div
    className={`group rounded-xl overflow-hidden border-2 border-foreground/5 hover:border-foreground/20 transition-all duration-300`}
    style={p.isBundle ? { backgroundColor: "#75559f" } : undefined}
  >
    <Link to={`/produkt/${p.handle}`}>
      <div className="overflow-hidden">
        <img src={p.image} alt={p.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-2.5 pb-1">
        <h3 className={`font-extrabold text-xs mb-0.5 ${p.isBundle ? "text-white" : ""}`}>{p.name}</h3>
        <div className="flex items-center gap-1.5">
          <span className={`font-black text-sm ${p.isBundle ? "text-white" : ""}`}>{p.price}</span>
          {p.originalPrice && (
            <span className={`line-through text-[10px] ${p.isBundle ? "text-white/60" : "text-muted-foreground/50"}`}>{p.originalPrice}</span>
          )}
          {!p.isBundle && <StockBadge available={isAvailable(p.name)} />}
        </div>
      </div>
    </Link>
    <div className="px-2.5 pb-2.5">
      <button
        onClick={() =>
          addToCart(1, {
            id: p.isBundle ? "starter-bundle" : p.name,
            name: p.isBundle ? "FOQUZ Power Bundle (3 Sorten)" : p.name,
            price: p.numericPrice,
            image: p.image,
          })
        }
        className="comic-btn w-full text-[9px] !py-1 !px-2 font-black"
        style={{ backgroundColor: p.isBundle ? "#ffd618" : p.color, color: "#000" }}
      >
        FOKUS SICHERN
      </button>
    </div>
  </div>
);

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addToCart } = useCart();
  const { isAvailable } = useProductAvailability();

  const product = allProducts.find((p) => p.handle === handle);
  const otherProducts = allProducts.filter((p) => p.handle !== handle);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [handle]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-2">Produkt nicht gefunden</h1>
          <Link to="/#sorten" className="text-primary underline font-semibold">Zurück zur Übersicht</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MarqueeBanner />
      <Navbar />

      {/* Back link */}
      <div className="container mx-auto px-4 pt-20 md:pt-28">
        <Link
          to="/#sorten"
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-3 md:mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Alle Sorten
        </Link>
      </div>

      {/* Product detail */}
      <section className="container mx-auto px-4 pb-8 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-16 items-start">
          {/* Image — sticky on desktop */}
          <div className="rounded-2xl overflow-hidden w-[85%] md:w-[65%] lg:w-full mx-auto lg:mx-0 lg:self-start">
            {product.video ? (
              <video
                src={product.video}
                muted
                loop
                autoPlay
                playsInline
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                onContextMenu={(e) => e.preventDefault()}
                preload="auto"
                className="w-full aspect-square object-cover"
              />
            ) : (
              <img
                src={product.image}
                alt={product.name}
                fetchPriority="high"
                className="w-full aspect-square object-cover"
              />
            )}
          </div>

          {/* Info + Entdecke auch on desktop */}
          <div className="py-0 lg:py-4">
            <h1 className="text-2xl lg:text-5xl font-extrabold mb-1 lg:mb-2">{product.name}</h1>
            <p className="text-muted-foreground text-sm lg:text-lg mb-3 lg:mb-6 whitespace-pre-line leading-snug">
              {product.desc}
            </p>

            <div className="flex items-center gap-3 mb-0.5 lg:mb-1">
              <span className="text-2xl lg:text-4xl font-black">{product.price}</span>
              {product.originalPrice && (
                <span className="text-base lg:text-lg text-muted-foreground line-through">{product.originalPrice}</span>
              )}
              <StockBadge available={isAvailable(product.name)} />
            </div>
            <span className="text-[10px] lg:text-xs text-muted-foreground mb-3 lg:mb-6 block">inkl. MwSt.</span>

            <button
              onClick={() =>
                addToCart(1, {
                  id: product.isBundle ? "starter-bundle" : product.name,
                  name: product.isBundle ? "FOQUZ Power Bundle (3 Sorten)" : product.name,
                  price: product.numericPrice,
                  image: product.image,
                })
              }
              className="comic-btn text-xs lg:text-base py-2.5 px-8 lg:py-3 lg:px-10 font-black mb-5 lg:mb-8"
              style={{ backgroundColor: product.isBundle ? "#ffd618" : product.color, color: "#000" }}
            >
              {product.isBundle ? "BUNDLE SICHERN" : "FOKUS SICHERN"}
            </button>

            {/* Ingredients */}
            <div className="border-t-2 border-foreground/10 pt-3 lg:pt-6">
              <h3 className="font-extrabold text-sm lg:text-lg mb-2 lg:mb-4">
                {product.isBundle ? "WAS IST DRIN?" : "WAS STECKT DRIN?"}
              </h3>
              <div className="flex flex-wrap gap-1.5 lg:hidden">
                {product.ingredients.map((ing) => (
                  <span key={ing} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-secondary/30 rounded-full px-2.5 py-1">
                    <span className="text-[8px]">✓</span>
                    {ing}
                  </span>
                ))}
              </div>
              <ul className="hidden lg:block space-y-2">
                {product.ingredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ backgroundColor: "#ffd618" }}>✓</span>
                    {ing}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] lg:text-xs font-bold text-muted-foreground mt-2 lg:mt-4">
                {product.isBundle ? "Spar 15% gegenüber Einzelkauf." : "100% Natur. Ohne Chemie. Ohne Bullshit."}
              </p>
            </div>

            {/* Scroll hint – mobile/tablet only */}
            <div className="lg:hidden flex justify-center mt-4 animate-bounce">
              <svg width="24" height="14" viewBox="0 0 20 12" fill="none" className="text-muted-foreground">
                <path d="M2 2L10 10L18 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Entdecke auch – inline on desktop */}
            <div className="hidden lg:block border-t-2 border-foreground/10 pt-6 mt-8">
              <h3 className="font-extrabold text-lg mb-4">ENTDECKE AUCH</h3>
              <div className="grid grid-cols-3 gap-4">
                {otherProducts.map((p) => (
                  <OtherProductCard key={p.handle} p={p} addToCart={addToCart} isAvailable={isAvailable} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other products – mobile/tablet only */}
      <section className="lg:hidden py-8" style={{ backgroundColor: "white" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-extrabold text-center mb-4">ENTDECKE AUCH</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {otherProducts.map((p, i) => (
              <div key={p.handle} className={otherProducts.length % 2 !== 0 && i === otherProducts.length - 1 ? "col-span-2 sm:col-span-1 max-w-[50%] sm:max-w-full mx-auto" : ""}>
                <OtherProductCard p={p} addToCart={addToCart} isAvailable={isAvailable} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Bundle suggestion banner - only on non-bundle pages */}
      {!product?.isBundle && <BundleBanner />}
    </div>
  );
};

export default ProductDetail;
