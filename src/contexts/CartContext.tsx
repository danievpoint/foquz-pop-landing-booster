import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { applyDiscountCodeToCart, createShopifyCheckout, isShopifyCartCompleted, VARIANT_GID_BY_ID } from "@/lib/shopify";
import { getPendingDiscountCode, setPendingDiscountCode } from "@/lib/attribution";
import { trackAddedToCart } from "@/lib/klaviyo";
import giftSticker from "@/assets/gift-sticker.png.asset.json";
import giftNasenstripes from "@/assets/gift-nasenstripes.jpg.asset.json";

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
  price: 19.98,
  image: "",
};

// Gratis-Zugaben: liegen automatisch im Warenkorb, sobald das Power Bundle
// enthalten ist. Nicht einzeln kaufbar, nicht entfernbar.
// FEATURE-FLAG: auf `true` setzen, um die Gratis-Zugaben wieder zu aktivieren.
export const GIFTS_ENABLED = true;
const BUNDLE_IDS = ["bundle", "starter-bundle"];
export const GIFT_ITEMS: Omit<CartItem, "qty">[] = [
  { id: "gift-nasenstripes", name: "Nasen-Stripes (gratis)", price: 0, image: giftNasenstripes.url },
  { id: "gift-sticker", name: "FOQUZ Sticker (gratis)", price: 0, image: giftSticker.url },
];
export const GIFT_ITEM_IDS = GIFT_ITEMS.map((g) => g.id);
export const isGiftItem = (id: string) => GIFTS_ENABLED && GIFT_ITEM_IDS.includes(id);
const isGiftItemId = (id: string) => GIFT_ITEM_IDS.includes(id);


// Known discount codes and their percentage values.
// Used so we can locally pick the highest-value code and preview the total.
// Unknown (e.g. influencer) codes still get passed to Shopify.
const KNOWN_DISCOUNTS: Record<string, number> = {
  MATYAS: 10,
  KEVIN: 10,
  LIVIO: 10,
  CLOUD10: 10,
  WOLKE7: 15,
  FOQUZ20: 20,

};




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
  const [shopifyDiscountedSubtotal, setShopifyDiscountedSubtotal] = useState<number | null>(null);
  const shopifyCartIdRef = useRef<string | null>(null);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const activateNewsletterDiscount = useCallback(() => {
    localStorage.setItem(DISCOUNT_KEY, "true");
    setHasNewsletterDiscount(true);
  }, []);

  const [manualDiscountCode, setManualDiscountCode] = useState<string | null>(() => {
    // A code coming from /discount/:code wins over a previously stored one.
    return getPendingDiscountCode() ?? localStorage.getItem(MANUAL_CODE_KEY);
  });

  const applyManualDiscountCode = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    localStorage.setItem(MANUAL_CODE_KEY, normalized);
    setPendingDiscountCode(normalized);
    setManualDiscountCode(normalized);

    // If a Shopify cart already exists, update it in place via
    // cartDiscountCodesUpdate instead of recreating the cart.
    const cartId = shopifyCartIdRef.current;
    if (cartId) {
      void applyDiscountCodeToCart(cartId, [normalized])
        .then((result) => {
          if (!result) return;
          setCheckoutUrl(result.url);
          setShopifyDiscountedSubtotal(result.discountedSubtotal);
          if (!result.discountApplicable) {
            localStorage.removeItem(MANUAL_CODE_KEY);
            setPendingDiscountCode(null);
            setManualDiscountCode(null);
            toast.error("Dieser Rabattcode ist f\u00fcr deinen Warenkorb nicht g\u00fcltig.");
          }
        })
        .catch((e) => console.error("cartDiscountCodesUpdate failed:", e));
    }
  }, []);

  const clearManualDiscountCode = useCallback(() => {
    localStorage.removeItem(MANUAL_CODE_KEY);
    setPendingDiscountCode(null);
    setManualDiscountCode(null);
  }, []);

  const pendingKlaviyoAdd = useRef<CartItem | null>(null);

  const addToCart = useCallback((qty = 1, product?: Omit<CartItem, "qty">) => {
    const p = product || DEFAULT_PRODUCT;
    // Gratis-Zugaben können nicht direkt gekauft werden.
    if (isGiftItem(p.id)) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) {
        return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...p, qty }];
    });

    pendingKlaviyoAdd.current = { ...p, qty };
    setLastAddedProductId(p.id);
    setAddToCartTimestamp(Date.now());

    fireCelebrationConfetti();
    setIsOpen(true);
  }, []);


  const removeFromCart = useCallback((id: string) => {
    if (isGiftItem(id)) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (isGiftItem(id)) return;
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    }
  }, []);

  // Gratis-Zugaben automatisch mit dem Power Bundle synchronisieren.
  // Bei deaktiviertem Flag werden evtl. gespeicherte Zugaben entfernt.
  useEffect(() => {
    const bundleQty = items
      .filter((i) => BUNDLE_IDS.includes(i.id))
      .reduce((s, i) => s + i.qty, 0);

    const wantedQty = GIFTS_ENABLED && bundleQty > 0 ? 1 : 0;
    const needsUpdate = GIFT_ITEMS.some((g) => {
      const current = items.find((i) => i.id === g.id);
      return (current?.qty ?? 0) !== wantedQty;
    });
    if (!needsUpdate) return;

    setItems((prev) => {
      const withoutGifts = prev.filter((i) => !isGiftItemId(i.id));
      if (wantedQty <= 0) return withoutGifts;
      return [...withoutGifts, ...GIFT_ITEMS.map((g) => ({ ...g, qty: 1 }))];
    });
  }, [items]);


  // Klaviyo "Added to Cart" – mit dem Warenkorb NACH dem Hinzufügen.
  useEffect(() => {
    const added = pendingKlaviyoAdd.current;
    if (!added || addToCartTimestamp === 0) return;
    pendingKlaviyoAdd.current = null;
    trackAddedToCart(added, items);
  }, [addToCartTimestamp, items]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Auto-applied codes based on cart state:
  //  - CLOUD10  (10%) on the entire cart when the newsletter discount is unlocked
  // Only ONE code applies. If the user entered a manual code, that wins.
  // Otherwise the highest-percentage auto code wins (no stacking).
  const autoCandidates: { code: string; pct: number }[] = [];
  if (hasNewsletterDiscount) autoCandidates.push({ code: NEWSLETTER_DISCOUNT_CODE, pct: 10 });
  const bestAuto = autoCandidates.sort((a, b) => b.pct - a.pct)[0];

  let discountCode: string | null = null;
  let activeDiscountPercent = 0;

  if (manualDiscountCode) {
    const knownPct = KNOWN_DISCOUNTS[manualDiscountCode];
    const manualPct = knownPct ?? (bestAuto?.pct ?? 0);
    const bestAutoPct = bestAuto?.pct ?? 0;

    if (manualPct >= bestAutoPct) {
      discountCode = manualDiscountCode;
      activeDiscountPercent = manualPct;
    } else if (bestAuto) {
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

  // Use Shopify's returned subtotal as source of truth (handles unknown codes).
  // Falls back to a Shopify-compatible preview while the API response loads.
  // Shopify kürzt Prozent-Rabatte pro Einheit auf ganze Cent ab.
  const localDiscountAmount = items.reduce((sum, item) => {
    const unitDiscount = Math.floor((item.price * activeDiscountPercent) + Number.EPSILON) / 100;
    return sum + unitDiscount * item.qty;
  }, 0);


  const localDiscountedTotal = Math.max(0, Math.round((total - localDiscountAmount) * 100) / 100);
  const discountedTotal =
    discountCode && shopifyDiscountedSubtotal !== null
      ? Math.min(shopifyDiscountedSubtotal, total)
      : localDiscountedTotal;
  if (discountCode && shopifyDiscountedSubtotal !== null && total > 0) {
    activeDiscountPercent = Math.max(0, Math.round(((total - discountedTotal) / total) * 100));
  }


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
      setShopifyDiscountedSubtotal(null);
      return;
    }

    const lines = getCheckoutLines();
    if (lines.length === 0) {
      setCheckoutUrl(null);
      setIsCheckingOut(false);
      setShopifyDiscountedSubtotal(null);
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
          setShopifyDiscountedSubtotal(result.discountedSubtotal);

          if (discountCode && !result.discountApplicable && manualDiscountCode === discountCode) {
            localStorage.removeItem(MANUAL_CODE_KEY);
            setPendingDiscountCode(null);
            setManualDiscountCode(null);
            toast.error("Dieser Rabattcode ist für deinen Warenkorb nicht gültig.");
          }
        } else {
          setCheckoutUrl(null);
          setShopifyDiscountedSubtotal(null);
        }
      })
      .catch((e) => {
        console.error("Checkout preparation error:", e);
        if (!cancelled) {
          setCheckoutUrl(null);
          setShopifyDiscountedSubtotal(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsCheckingOut(false);
      });

    return () => {
      cancelled = true;
    };
  }, [items, discountCode, manualDiscountCode, getCheckoutLines]);

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
          setPendingDiscountCode(null);
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
