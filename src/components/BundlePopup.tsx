import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import foquzBox from "@/assets/foquz-box.png";
import { Link } from "react-router-dom";

const STORAGE_KEY = "foquz_bundle_popup_dismissed";

const BundlePopup = () => {
  const [visible, setVisible] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 60000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const handleAddToCart = () => {
    addToCart(1, {
      id: "starter-bundle",
      name: "FOQUZ Power Bundle (3 Sorten)",
      price: 14.99,
      image: foquzBox,
    });
    dismiss();
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10005] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[10006] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl border-2 border-foreground/10 bg-card text-center pointer-events-auto">
              <button
                onClick={dismiss}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <Link to="/produkt/starter-bundle" onClick={dismiss}>
                <img
                  src={foquzBox}
                  alt="FOQUZ Power Bundle Box"
                  className="w-40 h-40 mx-auto mb-3 drop-shadow-lg object-contain hover:scale-105 transition-transform"
                />
              </Link>

              <h3 className="text-2xl font-extrabold mb-1">
                FOQUZ POWER BUNDLE 🔥
              </h3>
              <p className="text-muted-foreground text-sm mb-2 leading-relaxed">
                Alle 3 Sorten in einer Box – spare ganze <strong className="text-foreground">28%</strong>!
              </p>

              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="text-2xl font-black text-foreground">14,99€</span>
                <span className="text-base text-muted-foreground line-through">23,97€</span>
              </div>

              <button
                onClick={handleAddToCart}
                className="comic-btn text-sm py-3 px-8 font-black w-full"
                style={{ backgroundColor: "#ffd618", color: "#000" }}
              >
                JETZT BUNDLE SICHERN
              </button>

              <p className="text-[11px] text-muted-foreground mt-3">
                Limitiert – Nur solange der Vorrat reicht!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BundlePopup;
