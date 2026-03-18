import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartDrawer = () => {
  const { items, count, total, discountedTotal, hasNewsletterDiscount, isOpen, closeCart, removeFromCart, updateQty } = useCart();

  const discountAmount = total - discountedTotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[10001]"
            onClick={closeCart}
          />

          {/* Drawer */}
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
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="flex gap-4 p-4 bg-muted/50 rounded-xl border-2 border-foreground"
                  >
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-sm uppercase truncate">{item.name}</h3>
                      <p className="text-lg font-black mt-1">€{item.price.toFixed(2)}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center border-2 border-foreground rounded-lg hover:bg-muted transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-black text-sm w-8 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center border-2 border-foreground rounded-lg hover:bg-muted transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="self-start p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t-2 border-foreground space-y-3">
                {/* Newsletter discount badge */}
                {hasNewsletterDiscount && (
                  <div className="flex items-center gap-2 bg-green-100 border-2 border-green-400 rounded-xl px-4 py-2.5">
                    <Tag size={18} className="text-green-600 shrink-0" />
                    <div className="flex-1">
                      <span className="text-green-800 font-bold text-sm">Newsletter-Rabatt: 10%</span>
                    </div>
                    <span className="text-green-700 font-black text-sm">-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Gesamt</span>
                  <div className="text-right">
                    {hasNewsletterDiscount && (
                      <span className="text-sm text-muted-foreground line-through block">€{total.toFixed(2)}</span>
                    )}
                    <span className="text-2xl font-black">€{discountedTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button className="comic-btn bg-primary text-primary-foreground w-full text-lg">
                  ZUR KASSE
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;