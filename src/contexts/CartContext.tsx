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
    // Fire confetti instantly with high z-index
    const myCanvas = document.createElement("canvas");
    myCanvas.style.position = "fixed";
    myCanvas.style.top = "0";
    myCanvas.style.left = "0";
    myCanvas.style.width = "100vw";
    myCanvas.style.height = "100vh";
    myCanvas.style.pointerEvents = "none";
    myCanvas.style.zIndex = "99999";
    document.body.appendChild(myCanvas);

    const myConfetti = confetti.create(myCanvas, { resize: true, useWorker: true });

    const colors = ["#ffd618", "#75559f", "#ff6b6b", "#00d4aa", "#ff9f43", "#fff", "#e84393", "#00cec9"];
    const origins = [
      { x: 0.0, y: -0.02 },
      { x: 0.1, y: -0.05 },
      { x: 0.2, y: -0.02 },
      { x: 0.35, y: -0.05 },
      { x: 0.5, y: -0.02 },
      { x: 0.65, y: -0.05 },
      { x: 0.8, y: -0.02 },
      { x: 0.9, y: -0.05 },
      { x: 1.0, y: -0.02 },
    ];

    // Fire all bursts synchronously – zero delay
    const promises = origins.map((origin, i) =>
      myConfetti({
        particleCount: 120,
        spread: 140,
        origin,
        gravity: 0.4,
        ticks: 400,
        startVelocity: 65,
        decay: 0.91,
        scalar: 1.3,
        colors,
        drift: (i - 4) * 0.15,
      })
    );

    Promise.all(promises).then(() => {
      document.body.removeChild(myCanvas);
    });
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
