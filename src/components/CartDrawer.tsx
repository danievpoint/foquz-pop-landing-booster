import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, Sparkles, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import foquzBox from "@/assets/foquz-box.png";

const BUNDLE_ID = "starter-bundle";
const BUNDLE_LIST_PRICE = 19.99;
const BUNDLE_EFFECTIVE_PRICE = 14.99;
const SINGLE_PRICE = 7.49;

const CartDrawer = () => {
  const {
    items,
    count,
    total,
    discountedTotal,
    hasNewsletterDiscount,
    discountCode,
    isOpen,
    closeCart,
    removeFromCart,
    updateQty,
    checkout,
    isCheckingOut,
    checkoutUrl,
    addToCart,
  } = useCart();

  const discountAmount = total - discountedTotal;

  // Show bundle upsell if cart has singles but no bundle yet.
  const hasBundle = items.some((i) => i.id === BUNDLE_ID);
  const singlesInCart = items.filter((i) => i.id !== BUNDLE_ID);
  const singlesCount = singlesInCart.reduce((s, i) => s + i.qty, 0);
  const showBundleUpsell = !hasBundle && singlesCount > 0;

  // Ersparnis pro Bundle vs. 3× einzeln
  const bundleSavings = (SINGLE_PRICE * 3 - BUNDLE_EFFECTIVE_PRICE).toFixed(2).replace(".", ",");
  const singlesPriceLabel = (SINGLE_PRICE * 3).toFixed(2).replace(".", ",");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[10001]"
            onClick={closeCart}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-[10002] flex flex-col border-l-4 border-foreground shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-foreground">
              <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                <ShoppingBag size={24} />
                Warenkorb ({count})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Warenkorb schließen"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="mt-4 text-lg font-bold">Dein Warenkorb ist leer</p>
                  <p className="text-sm mt-1">Füge Produkte hinzu, um loszulegen!</p>
                  {hasNewsletterDiscount && (
                    <div className="flex items-center gap-2 bg-green-100 border-2 border-green-400 rounded-xl px-4 py-2.5 mt-6 text-left">
                      <Tag size={18} className="text-green-600 shrink-0" />
                      <span className="text-green-800 font-bold text-sm">10% Newsletter-Rabatt aktiv ✓</span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 p-4 bg-muted/50 rounded-xl border-2 border-foreground"
                    >
                      {item.image && (
                        <img src={item.image} alt={item.name} width={80} height={80} className="w-20 h-20 object-cover rounded-lg" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-sm uppercase truncate">{item.name}</h3>
                        <p className="text-lg font-black mt-1">€{item.price.toFixed(2)}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-8 h-8 flex items-center justify-center border-2 border-foreground rounded-lg hover:bg-muted transition-colors"
                            aria-label="Menge verringern"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-black text-sm w-8 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-8 h-8 flex items-center justify-center border-2 border-foreground rounded-lg hover:bg-muted transition-colors"
                            aria-label="Menge erhöhen"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="self-start p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        aria-label="Produkt entfernen"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}

                  {/* Dezenter Bundle-Upsell im Cart (ersetzt das alte Popup) */}
                  {showBundleUpsell && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 rounded-xl border-2 border-dashed border-foreground/50 bg-[#ffd618]/20"
                    >
                      <img
                        src={foquzBox}
                        alt="FOQUZ Power Bundle"
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-primary">
                          <Sparkles size={12} /> Empfehlung
                        </div>
                        <h3 className="font-black text-sm uppercase leading-tight">
                          Alle 3 Sorten – Power Bundle
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          3× einzeln <span className="line-through">€{singlesPriceLabel}</span>{" "}
                          → Bundle <span className="line-through">€{BUNDLE_LIST_PRICE.toFixed(2)}</span> mit Code <span className="font-black text-foreground">LAUNCH25</span> nur <span className="font-black text-foreground">€{BUNDLE_EFFECTIVE_PRICE.toFixed(2)}</span>{" "}
                          <span className="font-bold text-green-700">(spare €{bundleSavings})</span>
                        </p>
                        <button
                          onClick={() =>
                            addToCart(1, {
                              id: BUNDLE_ID,
                              name: "FOQUZ Power Bundle (3 Sorten)",
                              price: BUNDLE_LIST_PRICE,
                              image: foquzBox,
                            })
                          }
                          className="comic-btn bg-primary text-primary-foreground text-xs py-1.5 px-4 mt-2"
                        >
                          BUNDLE HINZUFÜGEN
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t-2 border-foreground space-y-3">
                {hasNewsletterDiscount && (
                  <div className="flex items-center gap-2 bg-green-100 border-2 border-green-400 rounded-xl px-4 py-2.5">
                    <Tag size={18} className="text-green-600 shrink-0" />
                    <div className="flex-1">
                      <span className="text-green-800 font-bold text-sm">Newsletter-Rabatt: 10% (Code: {discountCode})</span>
                    </div>
                    <span className="text-green-700 font-black text-sm">-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {/* Versand-Hinweis + Progressbar zum Gratis-Versand */}
                {(() => {
                  const THRESHOLD = 29.99;
                  const freeShipping = discountedTotal >= THRESHOLD;
                  const missing = Math.max(0, THRESHOLD - discountedTotal);
                  const pct = Math.min(100, (discountedTotal / THRESHOLD) * 100);
                  return (
                    <div className="rounded-xl border-2 border-foreground bg-muted/40 p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-black uppercase">
                        <span className="flex items-center gap-1.5">🚚 Gratis-Versand</span>
                        {freeShipping ? (
                          <span className="text-green-700">Freigeschaltet ✓</span>
                        ) : (
                          <span className="text-foreground/70">
                            Noch €{missing.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </div>
                      <div className="h-2 w-full rounded-full bg-foreground/10 overflow-hidden border border-foreground/20">
                        <motion.div
                          className={`h-full ${freeShipping ? "bg-green-500" : "bg-primary"}`}
                          initial={false}
                          animate={{ width: `${pct}%` }}
                          transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        />
                      </div>
                      <div className="text-[11px] font-bold text-foreground/70">
                        {freeShipping
                          ? "Dein Versand geht aufs Haus 🎉"
                          : `Versand: DE €2,90 · AT/CH €3,00 · gratis ab €${THRESHOLD.toFixed(2).replace(".", ",")}`}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Gesamt</span>
                  <div className="text-right">
                    {hasNewsletterDiscount && (
                      <span className="text-sm text-muted-foreground line-through block">€{total.toFixed(2)}</span>
                    )}
                    <span className="text-2xl font-black">€{discountedTotal.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-right -mt-2">
                  inkl. MwSt., zzgl. Versand (gratis ab €29,99).
                </p>
                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sessionStorage.setItem("foquz_checkout_pending", "1")}
                    className="comic-btn bg-primary text-primary-foreground w-full text-lg block text-center"
                  >
                    ZUR KASSE
                  </a>
                ) : (
                  <button
                    onClick={checkout}
                    disabled={isCheckingOut}
                    className="comic-btn bg-primary text-primary-foreground w-full text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    LÄDT...
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
