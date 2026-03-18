import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  discountedTotal: number;
  hasNewsletterDiscount: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (qty?: number, product?: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  activateNewsletterDiscount: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  total: 0,
  discountedTotal: 0,
  hasNewsletterDiscount: false,
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  activateNewsletterDiscount: () => {},
});

export const useCart = () => useContext(CartContext);

const DEFAULT_PRODUCT: Omit<CartItem, "qty"> = {
  id: "bundle",
  name: "FOQUZ Bundle",
  price: 14.99,
  image: "",
};

const CONFETTI_COLORS = [
  "#ffd618", "#ff4d8d", "#00d4aa", "#ff6b6b", "#75559f",
  "#00cec9", "#ff9f43", "#e84393", "#55efc4", "#a29bfe",
  "#fdcb6e", "#ffffff",
];

let confettiCanvas: HTMLCanvasElement | null = null;
let confettiInstance: ReturnType<typeof confetti.create> | null = null;

const getConfettiInstance = () => {
  if (confettiInstance) return confettiInstance;
  confettiCanvas = document.createElement("canvas");
  confettiCanvas.style.position = "fixed";
  confettiCanvas.style.top = "0";
  confettiCanvas.style.left = "0";
  confettiCanvas.style.width = "100vw";
  confettiCanvas.style.height = "100vh";
  confettiCanvas.style.pointerEvents = "none";
  confettiCanvas.style.zIndex = "99999";
  document.body.appendChild(confettiCanvas);
  confettiInstance = confetti.create(confettiCanvas, { resize: true });
  return confettiInstance;
};

const DISCOUNT_KEY = "foquz_newsletter_discount";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewsletterDiscount, setHasNewsletterDiscount] = useState(() => {
    return localStorage.getItem(DISCOUNT_KEY) === "true";
  });

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const activateNewsletterDiscount = useCallback(() => {
    localStorage.setItem(DISCOUNT_KEY, "true");
    setHasNewsletterDiscount(true);
  }, []);

  const addToCart = useCallback((qty = 1, product?: Omit<CartItem, "qty">) => {
    const p = product || DEFAULT_PRODUCT;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) {
        return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...p, qty }];
    });

    const myConfetti = getConfettiInstance();
    void myConfetti({
      particleCount: 120, spread: 160, origin: { x: 0.5, y: 0.1 },
      gravity: 1.4, ticks: 140, startVelocity: 28, decay: 0.93, scalar: 1.1, colors: CONFETTI_COLORS,
    });
    const origins = [
      { x: 0.1, y: 0.03 }, { x: 0.3, y: 0.02 }, { x: 0.5, y: 0.03 },
      { x: 0.7, y: 0.02 }, { x: 0.9, y: 0.03 },
    ];
    void Promise.all(
      origins.map((origin, i) =>
        myConfetti({
          particleCount: 60, spread: 90, origin, gravity: 1.3, ticks: 150,
          startVelocity: 30, decay: 0.93, scalar: 1.0, colors: CONFETTI_COLORS, drift: (i - 2) * 0.15,
        })
      )
    );
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    }
  }, []);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountedTotal = hasNewsletterDiscount ? total * 0.9 : total;

  return (
    <CartContext.Provider value={{
      items, count, total, discountedTotal, hasNewsletterDiscount,
      isOpen, openCart, closeCart, addToCart, removeFromCart, updateQty, activateNewsletterDiscount,
    }}>
      {children}
    </CartContext.Provider>
  );
};
