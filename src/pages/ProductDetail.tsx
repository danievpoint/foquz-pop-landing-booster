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
import MarqueeBar from "@/components/MarqueeBar";
import LooxRating from "@/components/LooxRating";
import PaymentLogos from "@/components/PaymentLogos";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { ChevronLeft, ChevronDown, X, ShoppingBag, Ban, ZapOff, Leaf, Flag, Check } from "lucide-react";
import foquzBox from "@/assets/foquz-box.png";
import { fetchProductGalleryImages, shopifyImageUrl, shopifyImageSrcSet, SHOPIFY_PRODUCT_ID_BY_HANDLE, type ShopifyImage } from "@/lib/shopify";
import { trackViewedProduct } from "@/lib/klaviyo";
import LooxReviews from "@/components/LooxReviews";


// Preload all product images on module load
allProducts.forEach((p) => {
  const img = new Image();
  img.src = p.image;
});

const PAGE_BG = "#C9E9FD";
const YELLOW = "#FFD11A";

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
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
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

      <div className="pt-[6.5rem] md:pt-32">
        <MarqueeBar />
      </div>

      <div className="container mx-auto px-4 pt-4">
        <Link
          to="/#sorten"
          className="inline-flex items-center gap-1 text-sm font-bold text-black/70 hover:text-black transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Alle Sorten
        </Link>
      </div>

      <section className="container mx-auto px-4 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* ---------- Galerie ---------- */}
          <div className="lg:sticky lg:top-28">
            {/* Mobil: swipebar */}
            <div className="lg:hidden">
              <div
                ref={mobileTrackRef}
                onScroll={onMobileScroll}
                className={`flex overflow-x-auto snap-x snap-mandatory bg-white overflow-hidden ${comicCard}`}
                style={{ scrollbarWidth: "none" }}
              >
                {slides.map((s, i) => (
                  <div key={`${s.url}-${i}`} className="min-w-full snap-center">
                    {i === 0 && product.video && !s.shopify ? (
                      <AutoVideo
                        src={product.video}
                        poster={product.videoPoster ?? product.image}
                        className="w-full aspect-square object-cover"
                      />
                    ) : (
                      <img
                        src={s.shopify ? shopifyImageUrl(s.url, 900) : s.url}
                        srcSet={s.shopify ? shopifyImageSrcSet(s.url, [600, 800, 1200]) : undefined}
                        sizes="90vw"
                        alt={s.alt}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full aspect-square object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
              {slides.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Bild ${i + 1}`}
                      onClick={() => goToSlide(i)}
                      className={`h-2.5 rounded-full border-2 border-black transition-all ${
                        activeSlide === i ? "w-6" : "w-2.5"
                      }`}
                      style={{ backgroundColor: activeSlide === i ? YELLOW : "#fff" }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Hauptbild + Thumbnails */}
            <div className="hidden lg:block">
              <div className={`bg-white overflow-hidden ${comicCard}`}>
                {selectedImage ? (
                  <img
                    src={shopifyImageUrl(selectedImage, 1000)}
                    srcSet={shopifyImageSrcSet(selectedImage, [600, 800, 1200])}
                    sizes="600px"
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    className="w-full aspect-square object-cover"
                  />
                ) : product.video ? (
                  <AutoVideo
                    src={product.video}
                    poster={product.videoPoster ?? product.image}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    className="w-full aspect-square object-cover"
                  />
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
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
          <div className={`bg-white text-black p-5 md:p-7 ${comicCard}`}>
            <h1 className="text-3xl lg:text-5xl font-black uppercase leading-none inline-block relative">
              <span className="relative z-10">{product.name}</span>
              <span
                className="absolute left-0 right-0 bottom-0 h-2 lg:h-3 z-0"
                style={{ backgroundColor: YELLOW }}
              />
            </h1>

            <p className="whitespace-pre-line text-sm lg:text-base font-semibold text-black/70 mt-4">
              {product.desc}
            </p>

            {looxProductId && <LooxRating productId={looxProductId} className="mt-3" />}

            <div className="flex flex-wrap gap-2 mt-5">
              {trustPills.map((pill) => (
                <span
                  key={pill}
                  className="text-[10px] lg:text-xs font-black uppercase px-3 py-1.5 rounded-full border-[3px] border-black bg-white"
                >
                  {pill}
                </span>
              ))}
            </div>

            {!product.isBundle && (
            <>
            {/* Sorte wählen */}
            <div className="mt-7">
              <h2 className="text-base lg:text-lg font-black uppercase mb-3">SORTE WÄHLEN</h2>
              <div className="space-y-2.5">
                {variants.map((v) => {
                  const active = v.handle === (product.isBundle ? undefined : product.handle);
                  return (
                    <button
                      key={v.handle}
                      type="button"
                      onClick={() => navigate(`/produkt/${v.handle}`)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all ${
                        active ? "border-[4px] border-black" : "border-[3px] border-black/30 hover:border-black bg-white"
                      }`}
                      style={active ? { backgroundColor: YELLOW } : undefined}
                    >
                      <img src={v.image} alt={v.name} className="w-12 h-12 rounded-xl object-cover border-2 border-black bg-white" />
                      <span className="flex-1 min-w-0">
                        <span className="block font-black uppercase text-sm">{v.name}</span>
                        <span className="block text-xs text-black/60 font-semibold">
                          {VARIANT_SUBTITLES[v.handle]}
                        </span>
                      </span>
                      <span
                        className={`w-5 h-5 rounded-full border-[3px] border-black shrink-0 ${
                          active ? "bg-black" : "bg-white"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menge wählen */}
            <div className="mt-7">
              <h2 className="text-base lg:text-lg font-black uppercase mb-1">MENGE WÄHLEN</h2>
              <p className="text-xs font-bold text-black/60 uppercase mb-3">Mehr Dosen, mehr Wolke 7</p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setOption("single")}
                  className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl text-left transition-all ${
                    option === "single" ? "border-[4px] border-black" : "border-[3px] border-black/30 hover:border-black bg-white"
                  }`}
                  style={option === "single" ? { backgroundColor: YELLOW } : undefined}
                >
                  <span>
                    <span className="block font-black uppercase text-sm">1 DOSE</span>
                    <span className="block text-xs text-black/60 font-semibold">Zum Reinschnuppern</span>
                  </span>
                  <span className="text-right shrink-0">
                    <span className="block font-black text-lg">{formatPrice(singleProduct.numericPrice)}</span>
                    <span className="block text-[10px] text-black/60 font-semibold">
                      {formatPrice(singleProduct.numericPrice)} pro Dose
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOption("bundle")}
                  className={`relative w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl text-left transition-all ${
                    option === "bundle" ? "border-[4px] border-black" : "border-[3px] border-black/30 hover:border-black bg-white"
                  }`}
                  style={option === "bundle" ? { backgroundColor: YELLOW } : undefined}
                >
                  <span
                    className="absolute -top-3 right-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border-[3px] border-black"
                    style={{ backgroundColor: YELLOW }}
                  >
                    BELIEBT
                  </span>
                  <span>
                    <span className="block font-black uppercase text-sm">3 DOSEN – POWER BUNDLE</span>
                    <span className="block text-xs text-black/60 font-semibold">
                      Alle 3 Sorten in einer Box, 11 % sparen
                    </span>
                  </span>
                  <span className="text-right shrink-0">
                    <span className="flex items-baseline gap-1.5 justify-end">
                      <span className="font-black text-lg">{formatPrice(bundleProduct.numericPrice)}</span>
                      {bundleProduct.originalPrice && (
                        <span className="text-xs line-through text-black/50 font-semibold">
                          {bundleProduct.originalPrice}
                        </span>
                      )}
                    </span>
                    <span className="block text-[10px] text-black/60 font-semibold">
                      {formatPrice(bundleProduct.numericPrice / 3)} pro Dose
                    </span>
                  </span>
                </button>
              </div>
            </div>
            </>
            )}

            <div className="flex items-center gap-2 mt-5">
              <StockBadge available={isAvailable(selectedProduct.name)} />
              <span className="text-[11px] text-black/50 font-semibold">inkl. MwSt.</span>
            </div>

            {/* CTA */}
            <div ref={ctaRef} className="mt-3">
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

            {/* Trust-Liste */}
            <ul className="mt-6 space-y-2.5">
              {trustList.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm font-semibold">
                  <span
                    className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: YELLOW }}
                  >
                    <Check className="w-3 h-3 text-black" strokeWidth={4} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-5 border-t-[3px] border-black/10">
              <PaymentLogos compact />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 1) WAS IST ... ---------- */}
      {product.longDesc && (
        <section className="container mx-auto px-4 pb-12 md:pb-16">
          <SectionHeading>WAS IST {product.name}</SectionHeading>
          <div className={`bg-white text-black p-5 md:p-8 ${comicCard}`}>
            <h3 className="font-black uppercase text-lg md:text-xl mb-4">{product.longDesc.heading}</h3>
            <div className="space-y-3 text-sm md:text-base font-medium text-black/75 leading-relaxed">
              {product.longDesc.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- 2) SO GEHT'S ---------- */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <SectionHeading>SO GEHT'S</SectionHeading>
        <div className="grid md:grid-cols-3 gap-5">
          {HOW_TO_STEPS.map((step, i) => (
            <div key={step.title} className={`bg-white text-black p-5 md:p-6 ${comicCard}`}>
              <span
                className="w-11 h-11 rounded-full border-[3px] border-black flex items-center justify-center font-black text-lg mb-4"
                style={{ backgroundColor: YELLOW }}
              >
                {i + 1}
              </span>
              <h3 className="font-black uppercase text-base md:text-lg mb-2">{step.title}</h3>
              <p className="text-sm font-medium text-black/70 leading-relaxed">{step.text}</p>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {product.ingredients.map((ing) => (
              <div
                key={ing}
                className="flex items-center gap-2.5 border-[3px] border-black rounded-xl px-3 py-2.5 bg-white"
              >
                <span
                  className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center shrink-0"
                  style={{ backgroundColor: YELLOW }}
                >
                  <Check className="w-3 h-3 text-black" strokeWidth={4} />
                </span>
                <span className="text-sm font-bold">{ing}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px border-[3px] border-black rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#000" }}
          >
            {trustPills.map((spec) => (
              <div
                key={spec}
                className="py-4 px-2 text-center text-[11px] md:text-xs font-black uppercase"
                style={{ backgroundColor: YELLOW }}
              >
                {spec}
              </div>
            ))}
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
          <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl">
            {CLAIM_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm md:text-base font-bold">
                <span
                  className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: YELLOW }}
                >
                  <Check className="w-3 h-3 text-black" strokeWidth={4} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- 5) ECHTE STIMMEN ---------- */}
      {looxProductId && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <SectionHeading>ECHTE STIMMEN</SectionHeading>
          <div className={`bg-white text-black p-2 md:p-4 ${comicCard}`}>
            <LooxReviews productId={looxProductId} />
          </div>
        </section>
      )}

      {/* ---------- 6) Gelber Block ---------- */}
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
