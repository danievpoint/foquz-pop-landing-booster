import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { createShopifyCheckout, isShopifyCartCompleted, VARIANT_GID_BY_ID } from "@/lib/shopify";

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
  discountCode: string | null;
  activeDiscountPercent: number;
  bundleDiscountPercent: number;
  otherDiscountPercent: number;
  manualDiscountCode: string | null;
  applyManualDiscountCode: (code: string) => void;
  clearManualDiscountCode: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (qty?: number, product?: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  activateNewsletterDiscount: () => void;
  popupOpen: boolean;
  setPopupOpen: (v: boolean) => void;
  lastAddedProductId: string | null;
  addToCartTimestamp: number;
  checkout: () => Promise<void>;
  isCheckingOut: boolean;
  checkoutUrl: string | null;
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  total: 0,
  discountedTotal: 0,
  hasNewsletterDiscount: false,
  discountCode: null,
  activeDiscountPercent: 0,
  manualDiscountCode: null,
  applyManualDiscountCode: () => {},
  clearManualDiscountCode: () => {},
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  activateNewsletterDiscount: () => {},
  popupOpen: false,
  setPopupOpen: () => {},
  lastAddedProductId: null,
  addToCartTimestamp: 0,
  checkout: async () => {},
  isCheckingOut: false,
  checkoutUrl: null,
});

export const useCart = () => useContext(CartContext);

const DEFAULT_PRODUCT: Omit<CartItem, "qty"> = {
  id: "bundle",
  name: "FOQUZ Bundle",
  price: 19.99,
  image: "",
};

// Known discount codes and their percentage values.
// Used so we can locally pick the highest-value code and preview the total.
// Unknown (e.g. influencer) codes still get passed to Shopify.
const KNOWN_DISCOUNTS: Record<string, number> = {
  LAUNCH25: 25,
  ICEBLOCK25: 25,
  CLOUD10: 10,
};

const BUNDLE_IDS = new Set(["bundle", "starter-bundle"]);
const MANUAL_CODE_KEY = "foquz_manual_discount_code";
// Muss identisch zu Shopify-Versandprofil (Zone DE) sein. Änderungen in
// Shopify müssen hier nachgezogen werden – Storefront API liefert die
// Versandschwelle nicht aus.
const FREE_SHIPPING_THRESHOLD = 29;


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

const fireCelebrationConfetti = () => {
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
};


const DISCOUNT_KEY = "foquz_newsletter_discount";
const NEWSLETTER_DISCOUNT_CODE = "CLOUD10";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewsletterDiscount, setHasNewsletterDiscount] = useState(() => {
    return localStorage.getItem(DISCOUNT_KEY) === "true";
  });
  const [popupOpen, setPopupOpen] = useState(false);
  const [lastAddedProductId, setLastAddedProductId] = useState<string | null>(null);
  const [addToCartTimestamp, setAddToCartTimestamp] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const shopifyCartIdRef = useRef<string | null>(null);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const activateNewsletterDiscount = useCallback(() => {
    localStorage.setItem(DISCOUNT_KEY, "true");
    setHasNewsletterDiscount(true);
  }, []);

  const [manualDiscountCode, setManualDiscountCode] = useState<string | null>(() => {
    return localStorage.getItem(MANUAL_CODE_KEY);
  });

  const applyManualDiscountCode = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    localStorage.setItem(MANUAL_CODE_KEY, normalized);
    setManualDiscountCode(normalized);
  }, []);

  const clearManualDiscountCode = useCallback(() => {
    localStorage.removeItem(MANUAL_CODE_KEY);
    setManualDiscountCode(null);
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

    setLastAddedProductId(p.id);
    setAddToCartTimestamp(Date.now());

    fireCelebrationConfetti();
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

  // LAUNCH25 only applies to the Power Bundle, not to other products.
  const bundleTotal = items
    .filter((i) => BUNDLE_IDS.has(i.id))
    .reduce((sum, i) => sum + i.price * i.qty, 0);

  // Auto-applied codes based on cart state:
  //  - LAUNCH25 (25%) on the Power Bundle subtotal whenever the bundle is in the cart
  //  - CLOUD10  (10%) on the entire cart when the newsletter discount is unlocked
  // Only ONE code applies. If the user entered a manual code, that wins.
  // Otherwise the highest-percentage auto code wins (no stacking).
  const hasBundleInCart = bundleTotal > 0;

  // Collect auto-applied candidates
  const autoCandidates: { code: string; pct: number }[] = [];
  if (hasBundleInCart) autoCandidates.push({ code: "LAUNCH25", pct: 25 });
  if (hasNewsletterDiscount) autoCandidates.push({ code: NEWSLETTER_DISCOUNT_CODE, pct: 10 });
  const bestAuto = autoCandidates.sort((a, b) => b.pct - a.pct)[0];

  let discountCode: string | null = null;
  let activeDiscountPercent = 0;

  if (manualDiscountCode) {
    // Unknown codes (e.g. influencer codes) are assumed to be at least as good
    // as the best auto code, so influencers always get attribution when their
    // code is entered. Known codes are compared by their percentage value.
    const knownPct = KNOWN_DISCOUNTS[manualDiscountCode];
    const manualPct = knownPct ?? (bestAuto?.pct ?? 0);
    const bestAutoPct = bestAuto?.pct ?? 0;

    if (manualPct >= bestAutoPct) {
      discountCode = manualDiscountCode;
      activeDiscountPercent = manualPct;
    } else if (bestAuto) {
      // Manual code is worse than auto — keep the better auto code.
      discountCode = bestAuto.code;
      activeDiscountPercent = bestAuto.pct;
    } else {
      discountCode = manualDiscountCode;
      activeDiscountPercent = manualPct;
    }
  } else if (bestAuto) {
    discountCode = bestAuto.code;
    activeDiscountPercent = bestAuto.pct;
  }

  // LAUNCH25 only discounts the Power Bundle subtotal; other codes apply to the whole cart.
  const discountedTotal =
    discountCode === "LAUNCH25"
      ? total - bundleTotal * (activeDiscountPercent / 100)
      : total * (1 - activeDiscountPercent / 100);


  const getCheckoutLines = useCallback(() => {
    return items
      .map((i) => {
        const variantId = VARIANT_GID_BY_ID[i.id];
        if (!variantId) {
          console.warn(`No Shopify variant mapped for cart item id "${i.id}"`);
          return null;
        }
        return { variantId, quantity: i.qty };
      })
      .filter((l): l is { variantId: string; quantity: number } => l !== null);
  }, [items]);

  // Fire celebration confetti when free-shipping threshold is unlocked.
  const freeShippingUnlocked = items.length > 0 && discountedTotal >= FREE_SHIPPING_THRESHOLD;
  const prevFreeShippingRef = useRef(freeShippingUnlocked);
  useEffect(() => {
    if (freeShippingUnlocked && !prevFreeShippingRef.current) {
      fireCelebrationConfetti();
    }
    prevFreeShippingRef.current = freeShippingUnlocked;
  }, [freeShippingUnlocked]);



  useEffect(() => {
    if (items.length === 0) {
      setCheckoutUrl(null);
      setIsCheckingOut(false);
      return;
    }

    const lines = getCheckoutLines();
    if (lines.length === 0) {
      setCheckoutUrl(null);
      setIsCheckingOut(false);
      return;
    }

    let cancelled = false;
    setIsCheckingOut(true);
    setCheckoutUrl(null);

    createShopifyCheckout(lines, discountCode ? [discountCode] : undefined)
      .then((result) => {
        if (cancelled) return;
        if (result) {
          shopifyCartIdRef.current = result.cartId;
          setCheckoutUrl(result.url);
        } else {
          setCheckoutUrl(null);
        }
      })
      .catch((e) => {
        console.error("Checkout preparation error:", e);
        if (!cancelled) setCheckoutUrl(null);
      })
      .finally(() => {
        if (!cancelled) setIsCheckingOut(false);
      });

    return () => {
      cancelled = true;
    };
  }, [items, discountCode, getCheckoutLines]);

  const checkout = useCallback(async () => {
    if (items.length === 0 || isCheckingOut) return;

    const lines = getCheckoutLines();

    if (lines.length === 0) {
      toast.error("Checkout nicht möglich: Produkte sind nicht mit dem Shop verknüpft.");
      return;
    }

    if (!checkoutUrl) {
      toast.error("Checkout wird noch vorbereitet. Bitte kurz erneut klicken.");
      return;
    }

    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    sessionStorage.setItem("foquz_checkout_pending", "1");
  }, [items.length, isCheckingOut, checkoutUrl, getCheckoutLines]);

  // Only clear the cart once the Shopify checkout was actually completed
  // (i.e. the Shopify cart no longer exists or has 0 items). If the user
  // returns without paying, the cart stays intact.
  useEffect(() => {
    let checking = false;
    const handleVisibility = async () => {
      if (document.visibilityState !== "visible") return;
      if (sessionStorage.getItem("foquz_checkout_pending") !== "1") return;
      const cartId = shopifyCartIdRef.current;
      if (!cartId || checking) return;
      checking = true;
      try {
        const completed = await isShopifyCartCompleted(cartId);
        if (completed) {
          sessionStorage.removeItem("foquz_checkout_pending");
          shopifyCartIdRef.current = null;
          setItems([]);
          setIsOpen(false);
          setCheckoutUrl(null);
          localStorage.removeItem(DISCOUNT_KEY);
          setHasNewsletterDiscount(false);
          localStorage.removeItem(MANUAL_CODE_KEY);
          setManualDiscountCode(null);
        }
      } finally {
        checking = false;
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, []);

  return (
    <CartContext.Provider value={{
      items, count, total, discountedTotal, hasNewsletterDiscount, discountCode,
      activeDiscountPercent, manualDiscountCode, applyManualDiscountCode, clearManualDiscountCode,
      isOpen, openCart, closeCart, addToCart, removeFromCart, updateQty, activateNewsletterDiscount,
      popupOpen, setPopupOpen, lastAddedProductId, addToCartTimestamp,
      checkout, isCheckingOut, checkoutUrl,
    }}>

      {children}
    </CartContext.Provider>
  );
};
