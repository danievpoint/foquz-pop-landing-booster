import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import StockBadge from "@/components/StockBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft, X, ShoppingBag } from "lucide-react";
import foquzBox from "@/assets/foquz-box.png";

const BundleBanner = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-4 left-0 right-0 z-50 px-4 md:px-6 flex justify-center"
        >
          <div
            className="w-full max-w-md md:max-w-lg rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-2xl border-2 border-foreground/10"
            style={{ backgroundColor: "#75559f" }}
          >
            <img
              src={foquzBox}
              alt="Starter Bundle"
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-extrabold text-sm md:text-base leading-tight">
                STARTER BUNDLE – Alle 3 Sorten!
              </p>
              <p className="text-white/70 text-xs md:text-sm">
                Spar 15% · Nur 14,99€
              </p>
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
              className="comic-btn text-xs md:text-sm py-2 px-4 md:py-2.5 md:px-5 font-black shrink-0 flex items-center gap-1.5"
              style={{ backgroundColor: "#ffd618", color: "#000" }}
            >
              <ShoppingBag className="w-4 h-4" />
              BUNDLE
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/60 hover:text-white transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
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

  const product = products.find((p) => p.handle === handle);
  const otherProducts = products.filter((p) => p.handle !== handle);

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
              <StockBadge available={isAvailable(product.name)} />
            </div>
            <span className="text-[10px] md:text-xs text-muted-foreground mb-3 md:mb-6 block">inkl. MwSt.</span>

            <button
              onClick={() =>
                addToCart(1, {
                  id: product.name,
                  name: product.name,
                  price: product.numericPrice,
                  image: product.image,
                })
              }
              className="comic-btn text-xs md:text-base py-2.5 px-8 md:py-3 md:px-10 font-black mb-5 md:mb-8"
              style={{ backgroundColor: product.color, color: "#000" }}
            >
              FOKUS SICHERN
            </button>

            {/* Ingredients */}
            <div className="border-t-2 border-foreground/10 pt-4 md:pt-6">
              <h3 className="font-extrabold text-base md:text-lg mb-3 md:mb-4">WAS STECKT DRIN?</h3>
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
                100% Natur. Ohne Chemie. Ohne Bullshit.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other products */}
      <section className="bg-card/50 py-8 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-4xl font-extrabold text-center mb-4 md:mb-8">
            ENTDECKE AUCH
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-6 max-w-2xl mx-auto">
            {otherProducts.map((p) => (
              <Link
                key={p.handle}
                to={`/produkt/${p.handle}`}
                className="group rounded-xl md:rounded-2xl overflow-hidden bg-card border-2 border-foreground/5 hover:border-foreground/20 transition-all duration-300"
              >
                <div className="overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5 md:p-4">
                  <h3 className="font-extrabold text-xs md:text-base mb-0.5">{p.name}</h3>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="font-black text-sm md:text-lg">{p.price}</span>
                    <StockBadge available={isAvailable(p.name)} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Bundle suggestion banner */}
      <BundleBanner />
    </div>
  );
};

export default ProductDetail;
