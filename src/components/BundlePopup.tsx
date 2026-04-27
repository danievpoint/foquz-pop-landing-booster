import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import foquzBox from "@/assets/foquz-box.png";
import { Link } from "react-router-dom";

const STORAGE_KEY = "foquz_bundle_popup_dismissed";
const BUNDLE_SHOWN_KEY = "foquz_bundle_popup_shown_at";

const BundlePopup = () => {
  const [visible, setVisible] = useState(false);
  const { addToCart, popupOpen, setPopupOpen, lastAddedProductId, addToCartTimestamp } = useCart();
  const shownRef = useRef(false);

  useEffect(() => {
    if (addToCartTimestamp === 0) return;
    if (shownRef.current) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (popupOpen) return;
    if (lastAddedProductId === "starter-bundle") return;

    const timer = setTimeout(() => {
      if (popupOpen || shownRef.current || sessionStorage.getItem(STORAGE_KEY)) return;
      shownRef.current = true;
      setVisible(true);
      setPopupOpen(true);
      sessionStorage.setItem(BUNDLE_SHOWN_KEY, String(Date.now()));
    }, 1500);

    return () => clearTimeout(timer);
  }, [addToCartTimestamp, lastAddedProductId, popupOpen, setPopupOpen]);

  const dismiss = () => {
    setVisible(false);
    setPopupOpen(false);
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
            transition={{ duration: 0.2 }}
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
            <div
              className="relative w-full max-w-sm md:max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-foreground/10 flex flex-col items-center text-center gap-4 pointer-events-auto"
              style={{ backgroundColor: "#75559f" }}
            >
              <button
                onClick={dismiss}
                className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <Link to="/produkt/starter-bundle" onClick={dismiss}>
                <img
                  src={foquzBox}
                  alt="FOQUZ Power Bundle"
                  className="w-40 h-40 md:w-52 md:h-52 object-cover rounded-2xl drop-shadow-xl"
                />
              </Link>

              <h3 className="text-white font-extrabold text-xl md:text-2xl leading-tight">
                FOQUZ POWER BUNDLE – Alle 3 Sorten!
              </h3>
              <p className="text-white/70 text-sm md:text-base">
                Spar <span className="font-black">15%</span> und teste alle Geschmacksrichtungen in einer Box.
              </p>

              <div className="flex items-center gap-3">
                <span className="text-white font-black text-2xl md:text-3xl">14,99€</span>
                <span className="text-white/50 line-through text-base md:text-lg">23,97€</span>
              </div>

              <button
                onClick={handleAddToCart}
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

export default BundlePopup;
