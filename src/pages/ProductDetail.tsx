import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { allProducts } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import StockBadge from "@/components/StockBadge";
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
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDismissed(true)}
          />

          {/* Popup */}
          <div
            className="relative w-full max-w-sm md:max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-foreground/10 flex flex-col items-center text-center gap-4"
            style={{ backgroundColor: "#75559f" }}
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <Link
              to="/produkt/starter-bundle"
              onClick={() => setDismissed(true)}
            >
              <img
                src={foquzBox}
                alt="Starter Bundle"
                className="w-40 h-40 md:w-52 md:h-52 object-cover rounded-2xl drop-shadow-xl"
              />
            </Link>

            <h3 className="text-white font-extrabold text-xl md:text-2xl leading-tight">
              STARTER BUNDLE – Alle 3 Sorten!
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
                addToCart(1, {
                  id: "starter-bundle",
                  name: "Starter Bundle (3 Sorten)",
                  price: 14.99,
                  image: foquzBox,
                });
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
      )}
    </AnimatePresence>
  );
};

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
          <Link to="/#sorten" className="text-primary underline font-semibold">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
      <section className="container mx-auto px-4 pb-8 md:pb-24">
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 items-start">
          {/* Image — compact on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden w-[65%] md:w-full mx-auto md:mx-0"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="py-0 md:py-4"
          >
            <h1 className="text-2xl md:text-5xl font-extrabold mb-1 md:mb-2">{product.name}</h1>
            <p className="text-muted-foreground text-sm md:text-lg mb-3 md:mb-6 whitespace-pre-line leading-snug">
              {product.desc}
            </p>

            <div className="flex items-center gap-3 mb-0.5 md:mb-1">
              <span className="text-2xl md:text-4xl font-black">{product.price}</span>
              {product.originalPrice && (
                <span className="text-base md:text-lg text-muted-foreground line-through">{product.originalPrice}</span>
              )}
              <StockBadge available={isAvailable(product.name)} />
            </div>
            <span className="text-[10px] md:text-xs text-muted-foreground mb-3 md:mb-6 block">inkl. MwSt.</span>

            <button
              onClick={() =>
                addToCart(1, {
                  id: product.isBundle ? "starter-bundle" : product.name,
                  name: product.isBundle ? "Starter Bundle (3 Sorten)" : product.name,
                  price: product.numericPrice,
                  image: product.image,
                })
              }
              className="comic-btn text-xs md:text-base py-2.5 px-8 md:py-3 md:px-10 font-black mb-5 md:mb-8"
              style={{ backgroundColor: product.isBundle ? "#ffd618" : product.color, color: "#000" }}
            >
              {product.isBundle ? "BUNDLE SICHERN" : "FOKUS SICHERN"}
            </button>

            {/* Ingredients */}
            <div className="border-t-2 border-foreground/10 pt-4 md:pt-6">
              <h3 className="font-extrabold text-base md:text-lg mb-3 md:mb-4">
                {product.isBundle ? "WAS IST DRIN?" : "WAS STECKT DRIN?"}
              </h3>
              <ul className="space-y-1.5 md:space-y-2">
                {product.ingredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-2 text-xs md:text-sm">
                    <span
                      className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-black shrink-0"
                      style={{ backgroundColor: "#ffd618" }}
                    >
                      ✓
                    </span>
                    {ing}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] md:text-xs font-bold text-muted-foreground mt-3 md:mt-4">
                {product.isBundle ? "Spar 15% gegenüber Einzelkauf." : "100% Natur. Ohne Chemie. Ohne Bullshit."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other products */}
      <section className="py-8 md:py-20" style={{ background: "linear-gradient(135deg, #ffd618 0%, #e88a3a 30%, #e94362 60%, #75559f 100%)" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-4xl font-extrabold text-center mb-4 md:mb-8">
            ENTDECKE AUCH
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto">
            {otherProducts.map((p) => (
              <div
                key={p.handle}
                className={`group rounded-xl md:rounded-2xl overflow-hidden border-2 border-foreground/5 hover:border-foreground/20 transition-all duration-300 ${p.isBundle ? "col-span-2 sm:col-span-1 max-w-[60%] sm:max-w-none mx-auto" : ""}`}
                style={p.isBundle ? { backgroundColor: "#75559f" } : undefined}
              >
                <Link to={`/produkt/${p.handle}`}>
                  <div className="overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5 md:p-4 pb-1 md:pb-2">
                    <h3 className={`font-extrabold text-xs md:text-base mb-0.5 ${p.isBundle ? "text-white" : ""}`}>{p.name}</h3>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className={`font-black text-sm md:text-lg ${p.isBundle ? "text-white" : ""}`}>{p.price}</span>
                      {p.originalPrice && (
                        <span className={`line-through text-[10px] md:text-xs ${p.isBundle ? "text-white/60" : "text-muted-foreground/50"}`}>{p.originalPrice}</span>
                      )}
                      {!p.isBundle && <StockBadge available={isAvailable(p.name)} />}
                    </div>
                  </div>
                </Link>
                <div className="px-2.5 md:px-4 pb-2.5 md:pb-4">
                  <button
                    onClick={() =>
                      addToCart(1, {
                        id: p.isBundle ? "starter-bundle" : p.name,
                        name: p.isBundle ? "Starter Bundle (3 Sorten)" : p.name,
                        price: p.numericPrice,
                        image: p.image,
                      })
                    }
                    className="comic-btn w-full text-[9px] md:text-xs !py-1 !px-2 md:!py-2 md:!px-4 font-black"
                    style={{ backgroundColor: p.isBundle ? "#ffd618" : p.color, color: "#000" }}
                  >
                    FOKUS SICHERN
                  </button>
                </div>
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
