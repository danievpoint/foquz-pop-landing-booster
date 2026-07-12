import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Truck,
  Plus as PlusIcon,
} from "lucide-react";
import { useCart, type CartItem } from "@/contexts/CartContext";
import foquzBox from "@/assets/foquz-box.png";
import { products as allSorten, allProducts } from "@/data/products";
import { Link } from "react-router-dom";
import payPaypal from "@/assets/payment/paypal.svg";
import payKlarna from "@/assets/payment/klarna.svg";
import payVisa from "@/assets/payment/visa.svg";
import payMastercard from "@/assets/payment/mastercard.svg";
import payAmex from "@/assets/payment/amex.svg";
import payApplePay from "@/assets/payment/apple-pay.svg";
import { useLockBodyScroll, skipNextScrollRestore } from "@/hooks/use-lock-body-scroll";

const PAYMENT_METHODS = [
  { label: "PayPal", src: payPaypal },
  { label: "Klarna", src: payKlarna },
  { label: "Visa", src: payVisa },
  { label: "Mastercard", src: payMastercard },
  { label: "American Express", src: payAmex },
  { label: "Apple Pay", src: payApplePay },
];

const BUNDLE_ID = "starter-bundle";
const BUNDLE_LIST_PRICE = 19.99;
const BUNDLE_EFFECTIVE_PRICE = 14.99;
const SINGLE_PRICE = 7.49;
// Mindestbestellwert für kostenlosen Versand. Muss identisch zum Shopify-
// Versand-Profil (Zone Deutschland) sein – dort ist die Grenze 29,00 €.
// Shopify stellt die Versandschwelle via Storefront API leider nicht bereit,
// deshalb wird der Wert hier gepflegt und muss bei Änderungen in Shopify
// nachgezogen werden.
const FREE_SHIPPING_THRESHOLD = 29;
const SHIPPING_COST_DE = 4.49;

const getProductHandle = (item: CartItem): string | null => {
  if (item.id === "bundle" || item.id === "starter-bundle") return "starter-bundle";
  const byName = allProducts.find((p) => p.name === item.name);
  if (byName) return byName.handle;
  const byId = allProducts.find((p) => p.handle === item.id);
  if (byId) return byId.handle;
  return null;
};

const CartDrawer = () => {
  const {
    items,
    count,
    total,
    discountedTotal,
    hasNewsletterDiscount,
    discountCode,
    activeDiscountPercent,
    manualDiscountCode,
    applyManualDiscountCode,
    clearManualDiscountCode,
    isOpen,
    closeCart,
    removeFromCart,
    updateQty,
    checkout,
    isCheckingOut,
    checkoutUrl,
    addToCart,
  } = useCart();

  const [codeInput, setCodeInput] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  useLockBodyScroll(isOpen);

  const handleApplyCode = async () => {
    const c = codeInput.trim();
    if (!c || isValidatingCode) return;
    setIsValidatingCode(true);
    setCodeError(null);
    try {
      const { validateDiscountCode } = await import("@/lib/shopify");
      const isValid = await validateDiscountCode(c);
      if (!isValid) {
        setCodeError("Dieser Rabattcode existiert nicht.");
        return;
      }
      applyManualDiscountCode(c);
      setCodeInput("");
    } finally {
      setIsValidatingCode(false);
    }
  };

  const discountAmount = total - discountedTotal;

  // Bundle upsell
  const hasBundle = items.some((i) => i.id === BUNDLE_ID);
  const singlesInCart = items.filter((i) => i.id !== BUNDLE_ID);
  const singlesCount = singlesInCart.reduce((s, i) => s + i.qty, 0);
  const showBundleUpsell = !hasBundle && singlesCount > 0;
  const bundleSavings = (SINGLE_PRICE * 3 - BUNDLE_EFFECTIVE_PRICE).toFixed(2).replace(".", ",");
  const singlesPriceLabel = (SINGLE_PRICE * 3).toFixed(2).replace(".", ",");

  // Shipping/savings
  const freeShipping = discountedTotal >= FREE_SHIPPING_THRESHOLD;
  const missingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedTotal);
  const shipProgress = Math.min(100, (discountedTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const shippingCost = freeShipping ? 0 : SHIPPING_COST_DE;
  const totalSavings = discountAmount + (freeShipping ? SHIPPING_COST_DE : 0);

  // Suggestions carousel
  const inCartIds = new Set(items.map((i) => i.id));
  const suggestions = allSorten.filter((p) => !inCartIds.has(p.name));

  const scrollCarousel = (dir: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-carousel-card]");
    if (cards.length === 0) return;
    const next = Math.max(0, Math.min(cards.length - 1, carouselIndex + dir));
    setCarouselIndex(next);
    cards[next]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const onCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-carousel-card]");
    let closestIdx = 0;
    let closestDist = Infinity;
    const center = el.scrollLeft + el.clientWidth / 2;
    cards.forEach((c, i) => {
      const cCenter = c.offsetLeft + c.clientWidth / 2;
      const d = Math.abs(cCenter - center);
      if (d < closestDist) {
        closestDist = d;
        closestIdx = i;
      }
    });
    if (closestIdx !== carouselIndex) setCarouselIndex(closestIdx);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-x-0 top-0 z-[10003] bg-card pointer-events-none"
            style={{ height: "env(safe-area-inset-top, 0px)" }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[10001] overscroll-contain"
            onClick={closeCart}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-[10002] flex flex-col border-l-0 sm:border-l-4 border-foreground shadow-2xl overscroll-contain"
            style={{ height: "100dvh", maxHeight: "100dvh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-6 border-b-2 border-foreground shrink-0" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)" }}>
              <h2 className="text-xl sm:text-2xl font-black uppercase flex items-center gap-2">
                <ShoppingBag size={22} />
                Warenkorb ({count})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
                aria-label="Warenkorb schließen"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]" style={{ touchAction: "pan-y" }}>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
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
                <div className="px-4 sm:px-6 pt-2 md:pt-6 pb-3 space-y-2.5 md:space-y-5">
                  {/* Rabattcode-Eingabe */}
                  <div>
                    <div className="text-[11px] md:text-xs font-black uppercase tracking-wide mb-1 md:mb-2">Code einfügen</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={codeInput}
                        onChange={(e) => {
                          setCodeInput(e.target.value);
                          if (codeError) setCodeError(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
                        placeholder="Code"
                        disabled={isValidatingCode}
                        style={{ fontSize: "16px" }}
                        className="flex-1 min-w-0 rounded-lg border-2 border-foreground bg-background px-3 md:px-4 py-1 md:py-2.5 font-bold uppercase placeholder:normal-case placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary md:!text-sm"
                      />
                      <button
                        onClick={handleApplyCode}
                        disabled={!codeInput.trim() || isValidatingCode}
                        className="comic-btn bg-primary text-primary-foreground text-[11px] md:text-xs py-1 md:py-2 px-3 md:px-5 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                      >
                        {isValidatingCode ? "PRÜFT…" : "ANWENDEN"}
                      </button>
                    </div>

                    {codeError && (
                      <div className="mt-2 text-xs font-bold text-red-600">
                        {codeError}
                      </div>
                    )}

                    {discountCode && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border-2 border-green-500 rounded-full pl-2 pr-1 py-1">
                        <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                          <Check size={12} className="text-white" strokeWidth={3} />
                        </span>
                        <span className="text-green-800 font-black text-xs uppercase tracking-wide">
                          {discountCode}
                        </span>
                        {manualDiscountCode ? (
                          <button
                            onClick={clearManualDiscountCode}
                            className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/40 transition-colors"
                            aria-label="Rabattcode entfernen"
                          >
                            <X size={12} className="text-green-800" strokeWidth={3} />
                          </button>
                        ) : (
                          <span className="w-5 h-5" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Free-shipping progress bar with truck */}
                  <div>
                      <div className="relative pt-1 md:pt-2 pb-12 md:pb-14 pr-2">
                      <div className="h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden">
                        <motion.div
                          className={`h-full ${freeShipping ? "bg-green-500" : "bg-primary"}`}
                          initial={false}
                          animate={{ width: `${shipProgress}%` }}
                          transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        />
                      </div>
                      <div className="absolute right-0 top-1 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center bg-background ${
                            freeShipping ? "border-green-500 text-green-600" : "border-foreground text-foreground"
                          }`}
                        >
                          <Truck size={14} className="md:hidden" />
                          <Truck size={16} className="hidden md:block" />
                        </div>
                          <span className="text-[9px] md:text-[10px] font-black mt-0.5 md:mt-1 whitespace-nowrap leading-none">
                          {FREE_SHIPPING_THRESHOLD.toFixed(0)}€
                        </span>
                      </div>
                    </div>

                    <div
                        className={`rounded-xl border-2 border-foreground px-3 py-1 md:py-2.5 text-[11px] md:text-sm font-bold ${
                        freeShipping ? "bg-green-100 text-green-800" : "bg-muted/40 text-foreground"
                      }`}
                    >
                      {freeShipping ? (
                        <>🎉 Du hast <span className="font-black uppercase">kostenlosen Versand</span> freigeschaltet!</>
                      ) : (
                        <>
                          Nur noch{" "}
                          <span className="font-black">€{missingForFreeShip.toFixed(2).replace(".", ",")}</span>{" "}
                          zum kostenlosen Versand!
                        </>
                      )}
                    </div>
                  </div>

                  <div className="border-t-2 border-foreground/80" />

                  {/* Items */}
                  <div className="space-y-3 sm:space-y-4">
                    {items.map((item) => {
                      const isBundleItem = item.id === BUNDLE_ID;
                      const hasDiscount =
                        activeDiscountPercent > 0 &&
                        (discountCode !== "LAUNCH25" || isBundleItem);
                      const finalPrice = hasDiscount
                        ? item.price * (1 - activeDiscountPercent / 100)
                        : item.price;
                      const productHandle = getProductHandle(item);
                      const productLink = productHandle ? `/produkt/${productHandle}` : "#";
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 100 }}
                          className="flex gap-3 sm:gap-4"
                        >
                          <div className="w-20 sm:w-24 shrink-0">
                            {item.image && (
                              <Link to={productLink} onClick={() => { skipNextScrollRestore(); closeCart(); }} className="block">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  width={96}
                                  height={96}
                                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-muted/40"
                                />
                              </Link>
                            )}
                            {hasDiscount && (
                              <div className="mt-2 inline-block bg-pink-100 text-pink-700 text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded">
                                Aktion -{activeDiscountPercent}%
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <Link to={productLink} onClick={() => { skipNextScrollRestore(); closeCart(); }} className="block hover:opacity-80 transition-opacity">
                                  <h3 className="font-black text-sm sm:text-base leading-tight">{item.name}</h3>
                                </Link>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                aria-label="Produkt entfernen"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                              {hasDiscount ? (
                                <>
                                  <span className="text-sm text-muted-foreground line-through">
                                    €{item.price.toFixed(2).replace(".", ",")}
                                  </span>
                                  <span className="text-base sm:text-lg font-black text-pink-600">
                                    €{finalPrice.toFixed(2).replace(".", ",")}
                                  </span>
                                </>
                              ) : (
                                <span className="text-base sm:text-lg font-black">
                                  €{item.price.toFixed(2).replace(".", ",")}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-2 w-fit border-2 border-foreground/80 rounded-lg px-1">
                              <button
                                onClick={() => updateQty(item.id, item.qty - 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted transition-colors rounded"
                                aria-label="Menge verringern"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-black text-sm w-7 sm:w-8 text-center">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.id, item.qty + 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted transition-colors rounded"
                                aria-label="Menge erhöhen"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Bundle upsell */}
                  {showBundleUpsell && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 border-dashed border-foreground/50 bg-[#ffd618]/20"
                    >
                      <img
                        src={foquzBox}
                        alt="FOQUZ Power Bundle"
                        width={80}
                        height={80}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-primary">
                          <Sparkles size={12} /> Empfehlung
                        </div>
                        <h3 className="font-black text-sm uppercase leading-tight">
                          Alle 3 Sorten – Power Bundle
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          3× einzeln <span className="line-through">€{singlesPriceLabel}</span> → Bundle{" "}
                          <span className="line-through">€{BUNDLE_LIST_PRICE.toFixed(2)}</span> mit Code{" "}
                          <span className="font-black text-foreground">LAUNCH25</span> nur{" "}
                          <span className="font-black text-foreground">€{BUNDLE_EFFECTIVE_PRICE.toFixed(2)}</span>{" "}
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

                  {/* Nachschub-Upsell (Carousel) */}
                  {suggestions.length > 0 && (
                    <div className="pt-2 border-t-2 border-foreground/80">
                          <h3 className="font-black text-base sm:text-lg uppercase mt-3 sm:mt-4 mb-1">Nachschub sichern</h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 font-semibold">
                        Deine Lieblingssorte gibt's nur solange der Vorrat reicht – leg direkt eine Reserve drauf.
                      </p>
                      <div className="relative">
                        <div
                          ref={carouselRef}
                          onScroll={onCarouselScroll}
                          className="flex gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6 pb-1"
                        >
                          {suggestions.map((p) => {
                            // LAUNCH25 applies only to the Power Bundle, not to single sorten.
                            const discounted =
                              activeDiscountPercent > 0 && discountCode !== "LAUNCH25"
                                ? p.numericPrice * (1 - activeDiscountPercent / 100)
                                : null;
                            return (
                              <Link
                                key={p.handle}
                                to={`/produkt/${p.handle}`}
                                onClick={() => { skipNextScrollRestore(); closeCart(); }}
                                data-carousel-card
                                className="shrink-0 snap-center rounded-xl border-2 border-foreground bg-background p-2.5 sm:p-3 flex gap-2.5 sm:gap-3 hover:opacity-90 transition-opacity"
                                style={{ width: "calc(100% - 2rem)" }}
                              >
                                <div
                                   className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: `${p.color}22` }}
                                >
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col">
                                  <div className="font-black text-sm uppercase leading-tight">{p.name}</div>
                                  <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{p.desc.split("\n")[0]}</div>
                                  <div className="mt-auto flex items-end justify-between gap-2">
                                    <div className="flex items-baseline gap-1.5 flex-wrap">
                                      {discounted !== null ? (
                                        <>
                                          <span className="text-xs text-muted-foreground line-through">
                                            €{p.numericPrice.toFixed(2).replace(".", ",")}
                                          </span>
                                          <span className="text-sm font-black text-pink-600">
                                            €{discounted.toFixed(2).replace(".", ",")}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-sm font-black">
                                          €{p.numericPrice.toFixed(2).replace(".", ",")}
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        addToCart(1, {
                                          id: p.name,
                                          name: p.name,
                                          price: p.numericPrice,
                                          image: p.image,
                                        });
                                      }}
                                      className="w-9 h-9 rounded-lg border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-[2px_2px_0_hsl(var(--foreground))] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_hsl(var(--foreground))] transition-transform"
                                      aria-label={`${p.name} zum Warenkorb hinzufügen`}
                                    >
                                      <PlusIcon size={16} strokeWidth={3} />
                                    </button>
                                  </div>
                                  {discounted !== null && (
                                    <div className="mt-1 inline-block self-start bg-pink-100 text-pink-700 text-[10px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded">
                                      Aktion -{activeDiscountPercent}%
                                    </div>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Dots + Arrows */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {suggestions.map((_, i) => (
                              <span
                                key={i}
                                className={`h-1.5 rounded-full transition-all ${
                                  i === carouselIndex ? "w-4 bg-foreground" : "w-1.5 bg-foreground/25"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => scrollCarousel(-1)}
                              disabled={carouselIndex === 0}
                              className="w-9 h-9 rounded-full border-2 border-foreground bg-background flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-colors"
                              aria-label="Vorheriges Produkt"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              onClick={() => scrollCarousel(1)}
                              disabled={carouselIndex >= suggestions.length - 1}
                              className="w-9 h-9 rounded-full border-2 border-foreground bg-background flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-colors"
                              aria-label="Nächstes Produkt"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t-2 border-foreground space-y-1.5 sm:space-y-2 bg-card shrink-0" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/80">Versandkosten (DE/AT/CH):</span>
                  <span className="font-black">
                    {freeShipping ? (
                      <span className="text-primary font-black uppercase">Gratis</span>
                    ) : (
                      <>€{shippingCost.toFixed(2).replace(".", ",")}</>
                    )}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-black">Du sparst:</span>
                    <span className="bg-pink-100 text-pink-700 text-xs font-black px-2 py-1 rounded">
                      €{totalSavings.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                )}

                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sessionStorage.setItem("foquz_checkout_pending", "1")}
                    className="mt-3 comic-btn bg-primary text-primary-foreground w-full text-base flex items-center justify-center gap-3"
                  >
                    <span>ZUR KASSE</span>
                    <span>€{discountedTotal.toFixed(2).replace(".", ",")}</span>
                  </a>
                ) : (
                  <button
                    onClick={checkout}
                    disabled={isCheckingOut}
                    className="mt-3 comic-btn bg-primary text-primary-foreground w-full text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    LÄDT...
                  </button>
                )}

                {/* Zahlungsmethoden */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5">
                  {PAYMENT_METHODS.map((m) => (
                    <img
                      key={m.label}
                      src={m.src}
                      alt={m.label}
                      width={38}
                      height={24}
                      className="h-6 w-auto"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
