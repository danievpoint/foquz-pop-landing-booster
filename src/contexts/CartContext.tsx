import { createContext, useContext, useState, ReactNode, useCallback } from "react";
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
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (qty?: number, product?: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  total: 0,
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
});

export const useCart = () => useContext(CartContext);

const DEFAULT_PRODUCT: Omit<CartItem, "qty"> = {
  id: "bundle",
  name: "FOQUZ Bundle",
  price: 14.99,
  image: "",
};

const CONFETTI_COLORS = [
  "hsl(48 100% 55%)",
  "hsl(349 80% 59%)",
  "hsl(158 35% 62%)",
  "hsl(24 87% 55%)",
  "hsl(229 33% 58%)",
  "hsl(0 0% 100%)",
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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

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
      particleCount: 220,
      spread: 180,
      origin: { x: 0.5, y: 0.12 },
      gravity: 1.15,
      ticks: 220,
      startVelocity: 32,
      decay: 0.92,
      scalar: 1.35,
      colors: CONFETTI_COLORS,
    });

    const origins = [
      { x: 0.05, y: 0.02 },
      { x: 0.18, y: 0.04 },
      { x: 0.31, y: 0.02 },
      { x: 0.44, y: 0.04 },
      { x: 0.57, y: 0.02 },
      { x: 0.7, y: 0.04 },
      { x: 0.83, y: 0.02 },
      { x: 0.96, y: 0.04 },
    ];

    void Promise.all(
      origins.map((origin, i) =>
        myConfetti({
          particleCount: 110,
          spread: 100,
          origin,
          gravity: 1.05,
          ticks: 260,
          startVelocity: 40,
          decay: 0.91,
          scalar: 1.25,
          colors: CONFETTI_COLORS,
          drift: (i - 4) * 0.18,
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

  return (
    <CartContext.Provider value={{ items, count, total, isOpen, openCart, closeCart, addToCart, removeFromCart, updateQty }}>
      {children}
    </CartContext.Provider>
  );
};
