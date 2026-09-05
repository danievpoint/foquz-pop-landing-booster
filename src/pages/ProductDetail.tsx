import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { allProducts, products, bundleProduct } from "@/data/products";
import { faqs } from "@/data/faqs";
import type { CartItem } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import StockBadge from "@/components/StockBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import AutoVideo from "@/components/AutoVideo";
import LooxRating from "@/components/LooxRating";
import PaymentLogos from "@/components/PaymentLogos";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { ChevronLeft, ChevronDown, X, ShoppingBag, Ban, Coffee, Leaf, Flag, Check, Plus, Truck, Timer, Wind } from "lucide-react";
import foquzBox from "@/assets/foquz-box.png";

import { fetchProductGalleryImages, shopifyImageUrl, shopifyImageSrcSet, SHOPIFY_PRODUCT_ID_BY_HANDLE, type ShopifyImage } from "@/lib/shopify";
import { trackViewedProduct } from "@/lib/klaviyo";
import LooxReviews from "@/components/LooxReviews";


// Preload all product images on module load
allProducts.forEach((p) => {
  const img = new Image();
  img.src = p.image;
});

const CoffeeOffIcon = ({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <span className={`relative inline-flex items-center justify-center ${className ?? ""}`}>
    <Coffee className="w-full h-full" strokeWidth={strokeWidth} />
    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="w-[130%] h-[2px] bg-current rotate-45" />
    </span>
  </span>
);

const PAGE_BG = "#C9E9FD";
const YELLOW = "#FFD11A";
// Bewertungen zählen shopweit: überall dieselbe Referenz-Produkt-ID fürs Aggregat
const LOOX_SHOP_AGGREGATE_ID = "10276796498262";
// Echtes Anwendungsfoto (Mensch mit Dose) aus der Shopify-Galerie
const LIFESTYLE_FALLBACK_PHOTO =
  "https://cdn.shopify.com/s/files/1/1012/7609/0710/files/foquz_product_image_thai_anwendung.jpg?v=1788078644";


const formatPrice = (value: number) =>
  `${value.toFixed(2).replace(".", ",")}€`;

const BundleBanner = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { addToCart, isOpen: cartOpen } = useCart();
  useLockBodyScroll(visible && !dismissed && !cartOpen);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  // Hide when cart drawer is open (checkout flow)
  useEffect(() => {
    if (cartOpen && visible) setVisible(false);
  }, [cartOpen, visible]);

  if (dismissed) return null;
  if (cartOpen) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10001] bg-black/50 backdrop-blur-sm"
            onClick={() => setDismissed(true)}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none"
          >
          <div
            className="relative w-full max-w-sm md:max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-foreground/10 flex flex-col items-center text-center gap-4 pointer-events-auto"
            style={{ backgroundColor: "#75559f" }}
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <Link to="/produkt/starter-bundle" onClick={() => setDismissed(true)}>
              <img src={foquzBox} alt="FOQUZ Power Bundle" className="w-40 h-40 md:w-52 md:h-52 object-cover rounded-2xl drop-shadow-xl" />
            </Link>
            <h3 className="text-white font-extrabold text-xl md:text-2xl leading-tight">
              FOQUZ POWER BUNDLE – Alle 3 Sorten!
            </h3>
            <p className="text-white/70 text-sm md:text-base">
              <strong>Spare 11%</strong> gegenüber dem Einzelkauf und teste alle unsere 3 Sorten in einer Box.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-white font-black text-2xl md:text-3xl">{bundleProduct.price}</span>
              {bundleProduct.originalPrice && (
                <span className="text-white/50 line-through text-base md:text-lg">{bundleProduct.originalPrice}</span>
              )}
            </div>
            <button
              onClick={() => {
                addToCart(1, { id: "starter-bundle", name: "FOQUZ Power Bundle (3 Sorten)", price: bundleProduct.numericPrice, image: foquzBox });
                setDismissed(true);
              }}
              className="comic-btn text-base md:text-lg py-3 px-10 md:py-4 md:px-14 font-black flex items-center gap-2 mt-2"
              style={{ backgroundColor: YELLOW, color: "#000" }}
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

type AddToCart = (qty?: number, product?: Omit<CartItem, "qty">) => void;

type AccordionKey = "description" | "ingredients" | "usage" | "faq";

/**
 * Bleibt erhalten für ProductGrid und wird in Schritt 2 als eigene
 * Sektionen unterhalb der Kaufbox wieder eingebaut.
 */
export const AccordionSections = ({
  product,
  isBundlePage,
}: {
  product: typeof allProducts[0];
  isBundlePage: boolean;
}) => {
  const [open, setOpen] = useState<AccordionKey | null>(null);
  const toggle = (k: AccordionKey) => setOpen((cur) => (cur === k ? null : k));

  const borderCls = isBundlePage ? "border-white/20" : "border-foreground/10";
  const mutedCls = isBundlePage ? "text-white/70" : "text-muted-foreground";

  const Item = ({
    k,
    title,
    children,
  }: {
    k: AccordionKey;
    title: string;
    children: React.ReactNode;
  }) => {
    const isOpen = open === k;
    return (
      <div className={`border-t-2 ${borderCls}`}>
        <button
          onClick={() => toggle(k)}
          className="flex items-center justify-between w-full py-3 lg:py-4"
          aria-expanded={isOpen}
        >
          <h3 className="font-extrabold text-sm lg:text-lg text-left">{title}</h3>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pb-4 lg:pb-5 text-sm lg:text-base leading-relaxed">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={`border-b-2 ${borderCls}`}>
      {product.longDesc && (
        <Item k="description" title="BESCHREIBUNG">
          <h4 className="font-extrabold text-base lg:text-lg mb-3">{product.longDesc.heading}</h4>
          <div className="space-y-3">
            {product.longDesc.paragraphs.map((p, i) => (
              <p key={i} className={mutedCls}>{p}</p>
            ))}
          </div>
        </Item>
      )}
      <Item k="ingredients" title={product.isBundle ? "WAS IST DRIN?" : "WAS STECKT DRIN?"}>
        <ul className="space-y-2">
          {product.ingredients.map((ing) => (
            <li key={ing} className="flex items-center gap-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ backgroundColor: YELLOW, color: "#000" }}
              >
                ✓
              </span>
              <span>{ing}</span>
            </li>
          ))}
        </ul>
        {product.isBundle && (
          <p className={`text-xs mt-4 ${mutedCls}`}>
            <strong className={isBundlePage ? "text-white" : ""}>Spar 25%</strong> gegenüber Einzelkauf.
          </p>
        )}
      </Item>

      <Item k="usage" title="ANWENDUNG">
        <ol className="space-y-2 list-decimal pl-5">
          <li>Dose öffnen.</li>
          <li>Kurz daran riechen.</li>
          <li>Tief durchatmen.</li>
          <li>Fertig.</li>
        </ol>
        <p className={`text-xs mt-4 ${mutedCls}`}>
          Ideal für alle, die den traditionellen Kräuterduft lieben.
        </p>
      </Item>

      <Item k="faq" title="FAQ">
        {(() => {
          const productFaqQuestions = [
            "Wofür ist FOQUZ?",
            "Kann ich FOQUZ bei Asthma, Allergien oder Überempfindlichkeit verwenden?",
            "Ist FOQUZ legal?",
            "Wie schnell wird meine Bestellung geliefert?",
          ];
          const filtered = faqs.filter((faq) => productFaqQuestions.includes(faq.q));
          return (
            <div className="space-y-6">
              {filtered.map((faq) => (
                <div key={faq.q}>
                  <p className="font-bold mb-3 leading-[1.7]">{faq.q}</p>
                  <p className={`${mutedCls} leading-snug`}>{faq.a}</p>
                </div>
              ))}
              <Link to="/faq">
                <button
                  className="comic-btn w-full text-sm py-2.5 px-6 font-black mt-2"
                  style={{ backgroundColor: product.isBundle ? YELLOW : product.color, color: "#000" }}
                >
                  ALLE FAQ-FRAGEN
                </button>
              </Link>
            </div>
          );
        })()}
      </Item>
    </div>
  );
};

const VARIANT_SUBTITLES: Record<string, string> = {
  "peach-party": "Pfirsich & Kräuter",
  "lemon-breezy": "Zitrone & Kräuter",
  "thai-style": "Kräuter & Menthol",
};

const VARIANT_ORDER = ["peach-party", "lemon-breezy", "thai-style"];

const comicCard = "border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000]";

const HOW_TO_STEPS = [
  { title: "DOSE AUF", text: "Deckel abdrehen, Dose kurz offen lassen." },
  { title: "KURZ RIECHEN", text: "Dose unter die Nase halten und tief durchatmen. Nicht schnupfen, nur riechen." },
  { title: "WOLKE 7", text: "Frische sitzt, Dose zu, weiter geht's." },
];

const CLAIM_POINTS = [
  "Echte Kräuter statt Chemie",
  "Kein Nikotin, kein Koffein",
  "Wird gerochen, nicht geschnupft",
  "Frei verkäufliches Lifestyle-Produkt",
  "Deutsche Marke",
];

const COMPARISON_ROWS = [
  ["Anwendung", "Wird gerochen, nicht geschnupft", "Wird traditionell geschnupft"],
  ["Nikotin", "Ohne Nikotin", "Ohne Nikotin"],
  ["Duft", "3 Sorten, fruchtig bis kräuterfrisch", "Meist klassisch Menthol und Kampfer"],
  ["Etikett", "Zutaten auf Deutsch ausgewiesen", "Etikett oft nur auf Thai oder Englisch"],
  ["Marke", "Deutsche Marke, FOQUZ GmbH in Bayern", "Importware, meist ohne Ansprechpartner in Deutschland"],
  ["Versand", "DHL nach DE, AT und CH, 2 bis 5 Werktage", "Import, oft lange Lieferzeit"],
  ["Rücksendung", "14 Tage Widerrufsrecht", "Bei Import häufig schwierig"],
  ["Support", "Deutscher Support unter info@foquz.de", "Meist kein deutscher Support"],
];

const LIFESTYLE_POINTS = [
  "In drei Sekunden erledigt",
  "Passt in jede Hosentasche",
  "Ohne Nikotin, ohne Koffein",
];

const PRODUCT_FAQ_QUESTIONS = [
  "Wofür ist FOQUZ?",
  "Kann ich FOQUZ bei Asthma, Allergien oder Überempfindlichkeit verwenden?",
  "Ist FOQUZ legal?",
  "Wie schnell wird meine Bestellung geliefert?",
];


const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-4xl font-black uppercase text-black mb-6 inline-block relative">
    <span className="relative z-10">{children}</span>
    <span className="absolute left-0 right-0 bottom-0 h-2 md:h-3 z-0" style={{ backgroundColor: YELLOW }} />
  </h2>
);

const ProductFaq = () => {
  const [open, setOpen] = useState<string | null>(null);
  const items = faqs.filter((f) => PRODUCT_FAQ_QUESTIONS.includes(f.q));

  return (
    <div className="space-y-3">
      {items.map((faq) => {
        const isOpen = open === faq.q;
        return (
          <div key={faq.q} className={`bg-white text-black overflow-hidden ${comicCard}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : faq.q)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 text-left p-4 md:p-5"
            >
              <span className="font-black text-sm md:text-base leading-snug">{faq.q}</span>
              <span
                className="w-7 h-7 rounded-full border-[3px] border-black flex items-center justify-center shrink-0"
                style={{ backgroundColor: YELLOW }}
              >
                <Plus
                  className={`w-4 h-4 text-black transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                  strokeWidth={4}
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-4 md:px-5 pb-4 md:pb-5 text-sm md:text-base font-medium text-black/70 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <div className="pt-2">
        <Link to="/faq" className="font-black uppercase text-sm underline underline-offset-4 text-black">
          ALLE FAQ-FRAGEN
        </Link>
      </div>
    </div>
  );
};

const CrossSellCard = ({
  p,
  addToCart,
  isAvailable,
}: {
  p: typeof allProducts[0];
  addToCart: AddToCart;
  isAvailable: (name: string) => boolean | null;
}) => (
  <div className={`bg-white text-black overflow-hidden flex flex-col ${comicCard}`}>
    <Link to={`/produkt/${p.handle}`} className="block">
      <img src={p.image} alt={p.name} className="w-full aspect-square object-cover border-b-[3px] border-black" />
      <div className="p-3">
        <h3 className="font-black uppercase text-sm mb-1">{p.name}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-base">{p.price}</span>
          {p.originalPrice && (
            <span className="line-through text-xs text-black/50 font-semibold">{p.originalPrice}</span>
          )}
          {!p.isBundle && <StockBadge available={isAvailable(p.name)} />}
        </div>
      </div>
    </Link>
    <div className="px-3 pb-3 mt-auto">
      <button
        type="button"
        onClick={() =>
          addToCart(1, {
            id: p.isBundle ? "starter-bundle" : p.name,
            name: p.isBundle ? "FOQUZ Power Bundle (3 Sorten)" : p.name,
            price: p.numericPrice,
            image: p.image,
          })
        }
        className="comic-btn w-full text-[11px] !py-2 !px-3 font-black"
        style={{ backgroundColor: YELLOW, color: "#000", borderWidth: 3 }}
      >
        IN DEN WARENKORB
      </button>
    </div>
  </div>
);

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAvailable } = useProductAvailability();

  const product = allProducts.find((p) => p.handle === handle);

  const [galleryImages, setGalleryImages] = useState<ShopifyImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [option, setOption] = useState<"single" | "bundle">("single");
  const [showStickyBar, setShowStickyBar] = useState(false);

  const ctaRef = useRef<HTMLDivElement>(null);
  const footerSentinelRef = useRef<HTMLDivElement>(null);

  const mobileTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(null);
    setGalleryImages([]);
    setActiveSlide(0);
    if (!handle) return;
    let cancelled = false;
    fetchProductGalleryImages(handle).then((imgs) => {
      if (cancelled) return;
      setGalleryImages(imgs);
      // Vollbilder direkt vorladen, damit der Wechsel instant ist
      imgs.forEach((img) => {
        [200, 800, 1200].forEach((w) => {
          const pre = new Image();
          pre.decoding = "async";
          pre.src = shopifyImageUrl(img.url, w);
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, [handle]);

  useEffect(() => {
    setOption(product?.isBundle ? "bundle" : "single");
  }, [product?.handle, product?.isBundle]);

  // Klaviyo "Viewed Product"
  useEffect(() => {
    if (!product) return;
    trackViewedProduct({
      id: product.isBundle ? "starter-bundle" : product.name,
      name: product.name,
      image: product.image,
      price: product.numericPrice,
      url: `/produkt/${product.handle}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.handle]);

  // Sticky Bottom-Bar erst zeigen, wenn Haupt-CTA aus dem Viewport ist
  // und wieder ausblenden, sobald der Footer sichtbar wird.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    let ctaOut = false;
    let footerIn = false;
    const apply = () => setShowStickyBar(ctaOut && !footerIn);

    const obs = new IntersectionObserver(
      ([entry]) => {
        ctaOut = !entry.isIntersecting;
        apply();
      },
      { threshold: 0 }
    );
    obs.observe(el);

    const footerEl = footerSentinelRef.current;
    const footerObs = footerEl
      ? new IntersectionObserver(
          ([entry]) => {
            footerIn = entry.isIntersecting;
            apply();
          },
          { threshold: 0 }
        )
      : null;
    if (footerEl && footerObs) footerObs.observe(footerEl);

    return () => {
      obs.disconnect();
      footerObs?.disconnect();
    };
  }, [product?.handle]);


  const slides = useMemo(() => {
    if (!product) return [] as { url: string; alt: string; shopify: boolean }[];
    const base = [{ url: product.videoPoster ?? product.image, alt: product.name, shopify: false }];
    return [
      ...base,
      ...galleryImages.map((img) => ({ url: img.url, alt: img.altText ?? product.name, shopify: true })),
    ];
  }, [product, galleryImages]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-2">Produkt nicht gefunden</h1>
          <Link to="/#sorten" className="text-primary underline font-semibold">Zurück zur Übersicht</Link>
        </div>
      </div>
    );
  }

  const singleProduct = product.isBundle
    ? products.find((p) => p.handle === "peach-party") ?? products[0]
    : product;

  const selectedProduct = option === "bundle" ? bundleProduct : singleProduct;
  const selectedPrice = selectedProduct.numericPrice;

  const looxProductId = SHOPIFY_PRODUCT_ID_BY_HANDLE[product.handle];

  // Echtes Anwendungsfoto der jeweiligen Sorte, sonst Fallback
  const lifestylePhoto =
    galleryImages.find((img) => img.url.toLowerCase().includes("anwendung"))?.url ??
    LIFESTYLE_FALLBACK_PHOTO;

  const handleAddToCart = () => {
    if (option === "bundle") {
      addToCart(1, {
        id: "starter-bundle",
        name: "FOQUZ Power Bundle (3 Sorten)",
        price: bundleProduct.numericPrice,
        image: bundleProduct.image,
      });
      return;
    }
    addToCart(1, {
      id: singleProduct.name,
      name: singleProduct.name,
      price: singleProduct.numericPrice,
      image: singleProduct.image,
    });
  };

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.desc.replace(/\n/g, " "),
    sku: product.handle,
    brand: { "@type": "Brand", name: "FOQUZ" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.numericPrice.toFixed(2),
      availability: "https://schema.org/InStock",
      url: `https://www.foquz.de/produkt/${product.handle}`,
    },
  };

  const onMobileScroll = () => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveSlide(idx);
  };

  const goToSlide = (i: number) => {
    const el = mobileTrackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const trustPills = ["OHNE NIKOTIN", "OHNE KOFFEIN", "ECHTE KRÄUTER", "DEUTSCHE MARKE"];
  const trustPillsWithIcons = [
    { label: "OHNE NIKOTIN", icon: Ban },
    { label: "OHNE KOFFEIN", icon: CoffeeOffIcon },
    { label: "ECHTE KRÄUTER", icon: Leaf },
    { label: "DEUTSCHE MARKE", icon: Flag },
  ];
  const trustList = [
    "Versand mit DHL nach DE, AT und CH",
    "14 Tage Widerrufsrecht",
    "Sichere Zahlung mit PayPal, Klarna und Kreditkarte",
  ];

  const variants = VARIANT_ORDER.map((h) => products.find((p) => p.handle === h)).filter(
    (p): p is typeof products[0] => !!p
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG }}>
      <SeoHead
        title={`${product.name} – FOQUZ`}
        description={product.desc.replace(/\n/g, " ").slice(0, 155)}
        path={`/produkt/${product.handle}`}
        type="product"
        jsonLd={productLd}
      />
      <Navbar />

      <div className="pt-16 md:pt-20" />

      <div className="container mx-auto px-4 pt-2">
        <Link
          to="/#sorten"
          className="inline-flex items-center gap-1 text-sm font-bold text-black/70 hover:text-black transition-colors mb-1 md:mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Alle Sorten
        </Link>
      </div>

      <section className="container mx-auto px-4 pb-2 md:pb-6 lg:pb-24">
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* ---------- Galerie ---------- */}
          <div className="min-w-0 lg:sticky lg:top-28">
            {/* Mobil: swipebar */}
            <div className="lg:hidden">
              <div
                ref={mobileTrackRef}
                onScroll={onMobileScroll}
                className={`flex overflow-x-auto snap-x snap-mandatory bg-white overflow-hidden ${comicCard}`}
                style={{ scrollbarWidth: "none", maxHeight: "10vh" }}
              >
                {slides.map((s, i) => (
                  <div key={`${s.url}-${i}`} className="min-w-full snap-center" style={{ maxHeight: "10vh" }}>
                    {i === 0 && product.video && !s.shopify ? (
                      <AutoVideo
                        src={product.video}
                        poster={product.videoPoster ?? product.image}
                        className="w-full h-full object-cover"
                        style={{ maxHeight: "10vh" }}
                      />
                    ) : (
                      <img
                        src={s.shopify ? shopifyImageUrl(s.url, 900) : s.url}
                        srcSet={s.shopify ? shopifyImageSrcSet(s.url, [600, 800, 1200]) : undefined}
                        sizes="90vw"
                        alt={s.alt}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-full object-cover"
                        style={{ maxHeight: "10vh" }}
                      />
                    )}
                  </div>
                ))}
              </div>
              {slides.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-1">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Bild ${i + 1}`}
                      onClick={() => goToSlide(i)}
                      className={`h-1.5 rounded-full border-2 border-black transition-all ${
                        activeSlide === i ? "w-4" : "w-1.5"
                      }`}
                      style={{ backgroundColor: activeSlide === i ? YELLOW : "#fff" }}
                    />
                  ))}
                </div>
              )}

              {slides.length > 1 && (
                <div className="mt-1 hidden md:flex gap-1.5 overflow-x-auto scrollbar-hide">
                  {slides.map((s, i) => (
                    <button
                      key={`thumb-${s.url}-${i}`}
                      type="button"
                      aria-label={`Vorschaubild ${i + 1}`}
                      onClick={() => goToSlide(i)}
                      className="shrink-0 w-8 h-8 rounded-md overflow-hidden bg-white transition-all"
                      style={{
                        border: activeSlide === i ? `2px solid ${YELLOW}` : "2px solid #000",
                        boxShadow: activeSlide === i ? "2px 2px 0 0 #000" : "none",
                      }}
                    >
                      <img
                        src={s.shopify ? shopifyImageUrl(s.url, 200) : s.url}
                        alt={s.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Hauptbild + Thumbnails */}
            <div className="hidden lg:block">
              <div className={`bg-white overflow-hidden ${comicCard} max-h-[68vh] aspect-square mx-auto`}>
                {selectedImage ? (
                  <img
                    src={shopifyImageUrl(selectedImage, 1000)}
                    srcSet={shopifyImageSrcSet(selectedImage, [600, 800, 1200])}
                    sizes="(max-width: 1280px) 45vw, 600px"
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : product.video ? (
                  <AutoVideo
                    src={product.video}
                    poster={product.videoPoster ?? product.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-3 mx-auto" style={{ maxWidth: "min(100%, 68vh)" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className={`rounded-xl overflow-hidden bg-white border-[3px] transition-all ${
                      selectedImage === null
                        ? "border-black shadow-[4px_4px_0px_0px_#000]"
                        : "border-black/30 hover:border-black"
                    }`}
                    aria-label={`${product.name} Hauptansicht`}
                  >
                    <img src={product.videoPoster ?? product.image} alt={product.name} className="w-full aspect-square object-cover" />
                  </button>
                  {galleryImages.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setSelectedImage(img.url)}
                      className={`rounded-xl overflow-hidden bg-white border-[3px] transition-all ${
                        selectedImage === img.url
                          ? "border-black shadow-[4px_4px_0px_0px_#000]"
                          : "border-black/30 hover:border-black"
                      }`}
                      aria-label={img.altText ?? `${product.name} Bild`}
                    >
                      <img src={shopifyImageUrl(img.url, 200)} alt={img.altText ?? product.name} loading="lazy" decoding="async" className="w-full aspect-square object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ---------- Kaufbox ---------- */}
          <div className={`min-w-0 bg-white text-black p-2 md:p-7 ${comicCard}`}>
            <h1 className="block w-full text-[1.375rem] sm:text-3xl lg:text-[2.75rem] font-black uppercase leading-tight relative break-words">
              <span className="relative z-10">{product.name}</span>
              <span
                className="absolute left-0 right-0 bottom-0 h-1 lg:h-3 z-0"
                style={{ backgroundColor: YELLOW }}
              />
            </h1>

            <p className="whitespace-pre-line text-sm lg:text-base font-semibold text-black/70 mt-1 md:mt-4 leading-snug md:leading-normal">
              {product.desc}
            </p>

            <LooxRating productId={LOOX_SHOP_AGGREGATE_ID} className="mt-1 md:mt-3" />

            <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2 md:mt-5">
              {trustPillsWithIcons.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="flex items-center gap-1 text-[9px] md:text-[10px] lg:text-xs font-black uppercase text-black px-2 md:px-3 py-1 md:py-1.5 rounded-full border-[2px] md:border-[3px] border-black"
                  style={{ backgroundColor: YELLOW }}
                >
                  <Icon className="w-3 h-3 md:w-4 md:h-4 text-black" strokeWidth={2} />
                  <span>{label}</span>
                </span>
              ))}
            </div>

            {!product.isBundle && (
            <>
            {/* Sorte wählen */}
            <div className="mt-2 md:mt-7">
              <h2 className="text-sm lg:text-lg font-black uppercase mb-1 md:mb-3">SORTE WÄHLEN</h2>
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide md:block md:space-y-2">
                {variants.map((v) => {
                  const active = v.handle === (product.isBundle ? undefined : product.handle);
                  return (
                    <button
                      key={v.handle}
                      type="button"
                      onClick={() => navigate(`/produkt/${v.handle}`)}
                      className={`shrink-0 flex flex-col items-center gap-0.5 p-1 md:p-2 rounded-lg md:rounded-2xl text-center transition-all md:w-full md:flex-row md:gap-2 md:text-left ${
                        active ? "border-[2px] md:border-[3px] border-black" : "border-[2px] border-black/30 hover:border-black bg-white"
                      }`}
                      style={active ? { backgroundColor: YELLOW } : undefined}
                    >
                      <img src={v.image} alt={v.name} className="w-8 h-8 md:w-10 md:h-10 rounded-md md:rounded-lg object-cover border-2 border-black bg-white" />
                      <span className="min-w-0">
                        <span className="block font-black uppercase text-[9px] md:text-sm whitespace-nowrap">{v.name}</span>
                        <span className="hidden md:block text-[10px] md:text-[11px] text-black/60 font-semibold">
                          {VARIANT_SUBTITLES[v.handle]}
                        </span>
                      </span>
                      <span
                        className={`hidden md:block w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-[2px] border-black shrink-0 ${
                          active ? "bg-black" : "bg-white"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menge wählen */}
            <div className="mt-2 md:mt-7">
              <h2 className="text-sm lg:text-lg font-black uppercase mb-0.5">MENGE WÄHLEN</h2>
              <p className="hidden md:block text-xs font-bold text-black/60 uppercase mb-3">Mehr Dosen, mehr Wolke 7</p>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:space-y-3">
                <button
                  type="button"
                  onClick={() => setOption("single")}
                  className={`flex flex-col md:flex-row md:items-center md:justify-between gap-0.5 p-1.5 md:p-2.5 rounded-lg md:rounded-2xl text-left transition-all ${
                    option === "single" ? "border-[2px] md:border-[3px] border-black" : "border-[2px] border-black/30 hover:border-black bg-white"
                  }`}
                  style={option === "single" ? { backgroundColor: YELLOW } : undefined}
                >
                  <span>
                    <span className="block font-black uppercase text-[11px] md:text-sm">1 DOSE</span>
                    <span className="hidden md:block text-[10px] md:text-[11px] text-black/60 font-semibold">Zum Reinschnuppern</span>
                  </span>
                  <span className="md:text-right shrink-0">
                    <span className="block font-black text-sm md:text-lg">{formatPrice(singleProduct.numericPrice)}</span>
                    <span className="block text-[9px] md:text-[10px] text-black/60 font-semibold">
                      {formatPrice(singleProduct.numericPrice)} pro Dose
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOption("bundle")}
                  className={`relative flex flex-col md:flex-row md:items-center md:justify-between gap-0.5 p-1.5 md:p-2.5 rounded-lg md:rounded-2xl text-left transition-all ${
                    option === "bundle" ? "border-[2px] md:border-[3px] border-black" : "border-[2px] border-black/30 hover:border-black bg-white"
                  }`}
                  style={option === "bundle" ? { backgroundColor: YELLOW } : undefined}
                >
                  <span
                    className="absolute -top-2 right-1 text-[9px] md:text-[10px] font-black uppercase px-1.5 md:px-2 py-0.5 rounded-full border-[2px] border-black"
                    style={{ backgroundColor: YELLOW }}
                  >
                    BELIEBT
                  </span>
                  <span>
                    <span className="block font-black uppercase text-[11px] md:text-sm">3 DOSEN</span>
                    <span className="hidden md:block text-[10px] md:text-[11px] text-black/60 font-semibold">
                      Alle 3 Sorten, 11 % sparen
                    </span>
                  </span>
                  <span className="md:text-right shrink-0">
                    <span className="flex items-baseline gap-1 md:justify-end">
                      <span className="font-black text-sm md:text-lg">{formatPrice(bundleProduct.numericPrice)}</span>
                      {bundleProduct.originalPrice && (
                        <span className="text-[10px] md:text-xs line-through text-black/50 font-semibold">
                          {bundleProduct.originalPrice}
                        </span>
                      )}
                    </span>
                    <span className="block text-[9px] md:text-[10px] text-black/60 font-semibold">
                      {formatPrice(bundleProduct.numericPrice / 3)} pro Dose
                    </span>
                  </span>
                </button>
              </div>
            </div>
            </>
            )}

            {product.isBundle && (
              <div className="flex flex-wrap items-baseline gap-2.5 mt-4 md:mt-6">
                <span className="font-black text-3xl">{formatPrice(bundleProduct.numericPrice)}</span>
                {bundleProduct.originalPrice && (
                  <span className="text-base line-through text-black/50 font-semibold">
                    {bundleProduct.originalPrice}
                  </span>
                )}
                <span
                  className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full border-[3px] border-black"
                  style={{ backgroundColor: YELLOW }}
                >
                  11 % SPAREN
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 mt-2 md:mt-5">
              <StockBadge available={isAvailable(selectedProduct.name)} />
              <span className="text-[11px] text-black/50 font-semibold">inkl. MwSt.</span>
            </div>

            {/* Lieferzeit */}
            <div className="flex items-center gap-2.5 mt-2 md:mt-4 mb-1">
              <Truck className="w-4 h-4 md:w-5 md:h-5 text-black shrink-0" strokeWidth={2.5} />
              <span className="font-black uppercase text-xs md:text-sm lg:text-base text-black">AUF LAGER</span>
              <span className="text-xs md:text-sm lg:text-base font-semibold text-black">
                in 2 bis 5 Werktagen bei dir
              </span>
            </div>

            {/* CTA – Mobil direkt sichtbar (Referenz für Sticky-Bar) */}
            <div ref={ctaRef} className="mt-2 md:hidden">
              <button
                type="button"
                onClick={handleAddToCart}
                className="comic-btn w-full text-base py-3 font-black flex items-center justify-center gap-2"
                style={{ backgroundColor: YELLOW, color: "#000", borderWidth: 3 }}
              >
                <ShoppingBag className="w-5 h-5" />
                IN DEN WARENKORB – {formatPrice(selectedPrice)}
              </button>
            </div>

            {/* Trust-Liste – Mobil horizontal/kompakt */}
            <ul className="hidden md:mt-6 md:flex md:flex-col md:gap-0 md:space-y-3">
              {trustList.map((t) => (
                <li key={t} className="flex items-center gap-1 text-[10px] md:text-sm font-semibold leading-tight md:leading-relaxed md:items-start shrink-0">
                  <span
                    className="w-3.5 h-3.5 md:w-5 md:h-5 rounded-full border-2 border-black flex items-center justify-center shrink-0 md:mt-0.5"
                    style={{ backgroundColor: YELLOW }}
                  >
                    <Check className="w-2 h-2 md:w-3 md:h-3 text-black" strokeWidth={4} />
                  </span>
                  <span className="leading-tight md:leading-relaxed whitespace-nowrap">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-2 pt-2 md:mt-5 md:pt-5 border-t-[3px] border-black/10">
              <PaymentLogos compact />
            </div>

            {/* CTA – Desktop */}
            <div className="hidden md:block mt-2 md:mt-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="comic-btn w-full text-base lg:text-lg py-4 font-black flex items-center justify-center gap-2"
                style={{ backgroundColor: YELLOW, color: "#000", borderWidth: 3 }}
              >
                <ShoppingBag className="w-5 h-5" />
                IN DEN WARENKORB – {formatPrice(selectedPrice)}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 1) WAS IST ... ---------- */}
      {product.longDesc && (
        <section className="container mx-auto px-4 -mt-6 md:mt-0 pb-12 md:pb-16">
          <SectionHeading>WAS IST {product.name}</SectionHeading>
          <div className={`bg-white text-black p-4 md:p-6 ${comicCard}`}>
            <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-4 lg:gap-6 items-start">
              <div>
                <h3 className="text-lg md:text-xl font-black uppercase leading-tight mb-2">
                  {product.name}
                </h3>
                <div className="space-y-3 text-sm md:text-base font-medium text-black/75 leading-relaxed">
                  {product.longDesc.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 lg:grid-cols-1 gap-2.5">
                {[
                  { icon: Timer, label: "3 Sekunden", sub: "schneller Kick" },
                  { icon: Wind, label: "Nur riechen", sub: "kein Schnupfen" },
                  { icon: Ban, label: "Ohne Nikotin", sub: "keine Sucht" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-center gap-1.5 border-[3px] border-black rounded-2xl px-2.5 py-3"
                    style={{ backgroundColor: YELLOW }}
                  >
                    <span
                      className="w-10 h-10 rounded-full border-[3px] border-black flex items-center justify-center shrink-0 bg-white"
                    >
                      <Icon className="w-4 h-4 text-black" strokeWidth={2.5} />
                    </span>
                    <div>
                      <span className="block text-xs md:text-sm font-black uppercase leading-snug">{label}</span>
                      <span className="block text-[10px] md:text-xs font-bold text-black/70 leading-snug">{sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- 2) SO GEHT'S ---------- */}
      <section className="container mx-auto px-4 pb-8 md:pb-12">
        <SectionHeading>SO GEHT'S</SectionHeading>
        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {HOW_TO_STEPS.map((step, i) => (
            <div key={step.title} className={`bg-white text-black p-4 md:p-5 ${comicCard}`}>
              <span
                className="w-9 h-9 rounded-full border-[3px] border-black flex items-center justify-center font-black text-base mb-2.5"
                style={{ backgroundColor: YELLOW }}
              >
                {i + 1}
              </span>
              <h3 className="font-black uppercase text-sm md:text-base mb-1.5 leading-snug">{step.title}</h3>
              <p className="text-[13px] md:text-sm font-medium text-black/70 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 3) WAS DRIN IST ---------- */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <SectionHeading>WAS DRIN IST</SectionHeading>
        <p className="text-sm md:text-base font-bold text-black/70 mb-5 -mt-3">
          Echte Kräuter, echtes Menthol. Ohne Nikotin, ohne Koffein.
        </p>
        <div className={`bg-white text-black p-5 md:p-8 ${comicCard}`}>
          <div className="flex flex-wrap gap-2 md:gap-2.5">
            {product.ingredients.map((ing) => (
              <span
                key={ing}
                className="inline-flex items-center gap-1.5 border-[3px] border-black rounded-full px-2.5 py-1.5 bg-white"
              >
                <span
                  className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center shrink-0"
                  style={{ backgroundColor: YELLOW }}
                >
                  <Check className="w-2.5 h-2.5 text-black" strokeWidth={4} />
                </span>
                <span className="text-xs md:text-sm font-bold leading-none">{ing}</span>
              </span>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {trustPillsWithIcons.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 border-[3px] border-black rounded-2xl px-3 py-3"
                style={{ backgroundColor: YELLOW }}
              >
                <span className="w-8 h-8 rounded-full border-[3px] border-black flex items-center justify-center shrink-0 bg-white">
                  <Icon className="w-4 h-4 text-black" strokeWidth={2} />
                </span>
                <span className="text-[11px] md:text-xs font-black uppercase leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 3b) VERGLEICHSTABELLE ---------- */}
      <section className="container mx-auto px-4 pb-8 md:pb-12">
        <SectionHeading>FOQUZ ODER THAILAND-DOSE?</SectionHeading>
        <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-2">
          {COMPARISON_ROWS.map(([feature, foquz, other]) => (
            <div key={feature} className={`bg-white text-black p-2.5 ${comicCard}`}>
              <p className="text-[11px] font-black uppercase tracking-wide mb-1.5">{feature}</p>
              <div className="grid md:grid-cols-2 gap-1.5">
                <div
                  className="flex items-start gap-2 border-[3px] border-black rounded-xl px-2 py-1.5"
                  style={{ backgroundColor: YELLOW }}
                >
                  <Check className="w-4 h-4 text-green-700 shrink-0 mt-0.5" strokeWidth={4} />
                  <span className="text-xs font-semibold leading-snug">
                    <span className="block text-[10px] font-black uppercase mb-0.5">FOQUZ</span>
                    {foquz}
                  </span>
                </div>
                <div className="flex items-start gap-2 border-[3px] border-black rounded-xl px-2 py-1.5 bg-white">
                  <span className="w-2 h-2 rounded-full bg-black/30 shrink-0 mt-1.5" />
                  <span className="text-xs font-semibold text-black/70 leading-snug">
                    <span className="block text-[10px] font-black uppercase text-black mb-0.5">Thailand-Dose</span>
                    {other}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs font-medium text-black/50">
          Vergleich mit typischen importierten Schnupfdosen. Angebote einzelner Anbieter können abweichen.
        </p>
      </section>

      {/* ---------- 3c) BILD + TEXT ---------- */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className={`w-full aspect-square overflow-hidden rounded-2xl ${comicCard}`}>
            <img
              src={shopifyImageUrl(lifestylePhoto, 900)}
              srcSet={shopifyImageSrcSet(lifestylePhoto, [600, 900, 1200])}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Person hält die FOQUZ Riechdose an die Nase"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p
              className="inline-block text-[11px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-[3px] border-black mb-4"
              style={{ backgroundColor: YELLOW }}
            >
              FÜR ZWISCHENDURCH
            </p>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-tight mb-4">
              DER MOMENT, IN DEM DIE NASE WIEDER AUFGEHT
            </h2>
            <p className="text-sm md:text-base font-medium text-black/75 leading-relaxed mb-5">
              Dose auf, kurz riechen, tief durchatmen. Kein Kaffee, kein Energy Drink, kein Nikotin.
              Passt in die Hosentasche und ist in drei Sekunden erledigt, egal ob am Schreibtisch,
              im Gym oder unterwegs.
            </p>
            <ul className="space-y-3">
              {LIFESTYLE_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm md:text-base font-bold leading-relaxed">
                  <span
                    className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: YELLOW }}
                  >
                    <Check className="w-3 h-3 text-black" strokeWidth={4} />
                  </span>
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- 4) Lila Claim-Block ---------- */}

      <section className="w-full border-y-[3px] border-black py-12 md:py-16" style={{ backgroundColor: "#75559f" }}>
        <div className="container mx-auto px-4 text-white">
          <p className="text-xs md:text-sm font-black uppercase tracking-widest text-white/70 mb-3">
            KURZ RIECHEN, AB AUF WOLKE 7
          </p>
          <h2 className="text-2xl md:text-5xl font-black uppercase leading-tight mb-7">
            KEIN NIKOTIN. KEIN KOFFEIN. KEIN KATER.
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3.5 max-w-3xl">
            {CLAIM_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm md:text-base font-bold leading-relaxed">
                <span
                  className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: YELLOW }}
                >
                  <Check className="w-3 h-3 text-black" strokeWidth={4} />
                </span>
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- 5) Gelber Block ---------- */}
      <section className="w-full border-y-[3px] border-black py-12 md:py-16" style={{ backgroundColor: YELLOW }}>
        <div className="container mx-auto px-4 text-black text-center">
          <p className="text-xs md:text-sm font-black uppercase tracking-widest text-black/60 mb-3">
            DEUTSCHE MARKE
          </p>
          <h2 className="text-2xl md:text-5xl font-black uppercase leading-tight mb-4">
            DIE ORIGINAL FOQUZ RIECHDOSE
          </h2>
          <p className="text-sm md:text-lg font-bold max-w-2xl mx-auto text-black/75">
            Die Original Foquz Riechdose aus Deutschland. 100 Prozent aromatisch, 100 Prozent legal,
            100 Prozent Wolke 7.
          </p>
        </div>
      </section>

      {/* ---------- 7) HÄUFIGE FRAGEN ---------- */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <SectionHeading>HÄUFIGE FRAGEN</SectionHeading>
        <ProductFaq />
      </section>

      {/* ---------- 8) ENTDECKE AUCH ---------- */}
      <section className="container mx-auto px-4 pb-14 md:pb-20">
        <SectionHeading>ENTDECKE AUCH</SectionHeading>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {allProducts
            .filter((p) => p.handle !== product.handle)
            .map((p) => (
              <CrossSellCard key={p.handle} p={p} addToCart={addToCart} isAvailable={isAvailable} />
            ))}
        </div>
      </section>

      {/* ---------- 9) ECHTE STIMMEN ---------- */}
      {looxProductId && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <SectionHeading>ECHTE STIMMEN</SectionHeading>
          <div className={`bg-white text-black p-2 md:p-4 ${comicCard}`}>
            <LooxReviews productId={looxProductId} />
          </div>
        </section>
      )}

      <div ref={footerSentinelRef} aria-hidden className="h-px" />
      <Footer />


      {/* Sticky Bottom-Bar (mobil) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-[9000] bg-white border-t-[3px] border-black px-4 py-3 flex items-center gap-3"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            <div className="shrink-0">
              <div className="text-[10px] font-bold uppercase text-black/50 leading-none">
                {option === "bundle" ? "Power Bundle" : "1 Dose"}
              </div>
              <div className="font-black text-lg leading-tight">{formatPrice(selectedPrice)}</div>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="comic-btn flex-1 text-sm py-3 px-4 font-black"
              style={{ backgroundColor: YELLOW, color: "#000", borderWidth: 3 }}
            >
              IN DEN WARENKORB
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bundle suggestion banner - only on non-bundle pages */}
      {!product?.isBundle && <BundleBanner />}
    </div>
  );
};

export default ProductDetail;
