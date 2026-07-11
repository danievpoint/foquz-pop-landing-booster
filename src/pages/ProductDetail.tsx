import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { allProducts } from "@/data/products";
import { faqs } from "@/data/faqs";
import type { CartItem } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import StockBadge from "@/components/StockBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import AutoVideo from "@/components/AutoVideo";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { ChevronLeft, ChevronDown, X, ShoppingBag, Ban, ZapOff, Leaf, Flag } from "lucide-react";
import foquzBox from "@/assets/foquz-box.png";

// Preload all product images on module load
allProducts.forEach((p) => {
  const img = new Image();
  img.src = p.image;
});

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
              <strong>Spare 25%</strong> zum Launch und teste alle unsere 3 Sorten in einer Box.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-white font-black text-2xl md:text-3xl">14,99€</span>
              <span className="text-white/50 line-through text-base md:text-lg">19,99€</span>
            </div>
            <button
              onClick={() => {
                addToCart(1, { id: "starter-bundle", name: "FOQUZ Power Bundle (3 Sorten)", price: 19.99, image: foquzBox });
                setDismissed(true);
              }}
              className="comic-btn text-base md:text-lg py-3 px-10 md:py-4 md:px-14 font-black flex items-center gap-2 mt-2"
              style={{ backgroundColor: "#ffd618", color: "#000" }}
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

const OtherProductCard = ({ p, addToCart, isAvailable }: { p: typeof allProducts[0]; addToCart: AddToCart; isAvailable: (name: string) => boolean | null }) => (
  <div
    className={`group rounded-xl overflow-hidden border-2 border-foreground/5 hover:border-foreground/20 transition-all duration-300`}
    style={p.isBundle ? { backgroundColor: "#75559f" } : { backgroundColor: "#fff", color: "#000" }}
  >
    <Link to={`/produkt/${p.handle}`}>
      <div className="overflow-hidden">
        <img src={p.image} alt={p.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-2.5 pb-1">
        <h3 className={`font-extrabold text-xs mb-0.5 ${p.isBundle ? "text-white" : ""}`}>{p.name}</h3>
        <div className="flex items-center gap-1.5">
          <span className={`font-black text-sm ${p.isBundle ? "text-white" : ""}`}>{p.price}</span>
          {p.originalPrice && (
            <span className={`line-through text-[10px] ${p.isBundle ? "text-white/60" : "text-muted-foreground/50"}`}>{p.originalPrice}</span>
          )}
          {!p.isBundle && <StockBadge available={isAvailable(p.name)} />}
        </div>
      </div>
    </Link>
    <div className="px-2.5 pb-2.5">
      <button
        onClick={() =>
          addToCart(1, {
            id: p.isBundle ? "starter-bundle" : p.name,
            name: p.isBundle ? "FOQUZ Power Bundle (3 Sorten)" : p.name,
            price: p.numericPrice,
            image: p.image,
          })
        }
        className="comic-btn w-full text-[9px] !py-1 !px-2 font-black"
        style={{ backgroundColor: p.isBundle ? "#ffd618" : p.color, color: "#000" }}
      >
        IN DEN WARENKORB
      </button>
    </div>
  </div>
);

type AccordionKey = "description" | "ingredients" | "usage" | "faq";

const AccordionSections = ({
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
                style={{ backgroundColor: "#ffd618", color: "#000" }}
              >
                ✓
              </span>
              <span>{ing}</span>
            </li>
          ))}
        </ul>
        <p className={`text-xs mt-4 ${mutedCls}`}>
          {product.isBundle ? (
            <>
              <strong className={isBundlePage ? "text-white" : ""}>Spar 25%</strong> gegenüber Einzelkauf.
            </>
          ) : (
            "100% Natur. Ohne Chemie. Ohne Bullshit."
          )}
        </p>
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
            <div className="space-y-5">
              {filtered.map((faq) => (
                <div key={faq.q}>
                  <p className="font-bold mb-1">{faq.q}</p>
                  <p className={mutedCls}>{faq.a}</p>
                </div>
              ))}
            </div>
          );
        })()}
      </Item>
    </div>
  );
};

const ProductDetail = () => {

  const { handle } = useParams<{ handle: string }>();
  const { addToCart } = useCart();
  const { isAvailable } = useProductAvailability();

  const product = allProducts.find((p) => p.handle === handle);
  const otherProducts = allProducts.filter((p) => p.handle !== handle);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [handle]);

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

  const isBundlePage = !!product?.isBundle;

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

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`${product.name} – FOQUZ`}
        description={product.desc.replace(/\n/g, " ").slice(0, 155)}
        path={`/produkt/${product.handle}`}
        type="product"
        jsonLd={productLd}
      />
      <Navbar />

      {/* Purple wrapper for bundle page */}
      <div style={isBundlePage ? { backgroundColor: "#75559f", color: "#fff" } : undefined}>
      {/* Back link */}
      <div className="container mx-auto px-4 pt-[6.5rem] md:pt-32">
        <Link
          to="/#sorten"
          className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors mb-3 md:mb-6 ${isBundlePage ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}
        >
          <ChevronLeft className="w-4 h-4" />
          Alle Sorten
        </Link>
      </div>

      {/* Product detail */}
      <section className="container mx-auto px-4 pb-8 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-16 items-start">
          {/* Image — sticky on desktop */}
          <div className="rounded-2xl overflow-hidden w-[85%] md:w-[65%] lg:w-full mx-auto lg:mx-0 lg:self-start">
            {product.video ? (
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

          {/* Info + Entdecke auch on desktop */}
          <div className="py-0 lg:py-4">
            <h1 className="text-2xl lg:text-5xl font-extrabold mb-1 lg:mb-2">{product.name}</h1>
            <p className={`text-sm lg:text-lg mb-3 lg:mb-6 whitespace-pre-line leading-snug ${isBundlePage ? "text-white/70" : "text-muted-foreground"}`}>
              {product.isBundle ? (
                <>Alle 3 Sorten in einer Box.<br />Mit Code <strong>LAUNCH25</strong> (wird automatisch angewendet) nur 14,99€.</>
              ) : (
                product.desc
              )}
            </p>

            <div className="flex items-center gap-3 mb-0.5 lg:mb-1">
              <span className="text-2xl lg:text-4xl font-black">{product.price}</span>
              {product.originalPrice && (
                <span className={`text-base lg:text-lg line-through ${isBundlePage ? "text-white/50" : "text-muted-foreground"}`}>{product.originalPrice}</span>
              )}
              <StockBadge available={isAvailable(product.name)} variant={isBundlePage ? "light" : "dark"} />
            </div>
            <span className={`text-[10px] lg:text-xs mb-3 lg:mb-4 block ${isBundlePage ? "text-white/50" : "text-muted-foreground"}`}>inkl. MwSt.</span>

            {/* Product benefits icons */}
            <div className="grid grid-cols-2 gap-2 mb-5 lg:mb-8">
              {[
                { icon: Ban, label: "Ohne Nikotin" },
                { icon: ZapOff, label: "Ohne Koffein" },
                { icon: Leaf, label: "Mit echten Kräutern" },
                { icon: Flag, label: "Deutsche Marke" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 text-xs lg:text-sm font-bold ${isBundlePage ? "text-white" : "text-foreground"}`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                addToCart(1, {
                  id: product.isBundle ? "starter-bundle" : product.name,
                  name: product.isBundle ? "FOQUZ Power Bundle (3 Sorten)" : product.name,
                  price: product.numericPrice,
                  image: product.image,
                })
              }
              className="comic-btn text-xs lg:text-base py-2.5 px-8 lg:py-3 lg:px-10 font-black mb-5 lg:mb-8"
              style={{ backgroundColor: product.isBundle ? "#ffd618" : product.color, color: "#000" }}
            >
              {product.isBundle ? "BUNDLE SICHERN" : "IN DEN WARENKORB"}
            </button>

            {/* Collapsible sections: Was steckt drin, Anwendung, FAQ */}
            <AccordionSections product={product} isBundlePage={isBundlePage} />



            {/* Entdecke auch – inline on desktop */}
            <div className={`hidden lg:block border-t-2 pt-6 mt-8 ${isBundlePage ? "border-white/20" : "border-foreground/10"}`}>
              <h3 className="font-extrabold text-lg mb-4">ENTDECKE AUCH</h3>
              <div className="grid grid-cols-3 gap-4">
                {otherProducts.map((p) => (
                  <OtherProductCard key={p.handle} p={p} addToCart={addToCart} isAvailable={isAvailable} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other products – mobile/tablet only */}
      <section id="entdecke-mobile" className="lg:hidden py-4 md:pb-16" style={isBundlePage ? { backgroundColor: "#75559f" } : undefined}>
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-extrabold text-center mb-4">ENTDECKE AUCH</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {otherProducts.map((p, i) => (
              <div key={p.handle} className={otherProducts.length % 2 !== 0 && i === otherProducts.length - 1 ? "col-span-2 sm:col-span-1 max-w-[50%] sm:max-w-full mx-auto" : ""}>
                <OtherProductCard p={p} addToCart={addToCart} isAvailable={isAvailable} />
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>{/* end purple wrapper */}

      <Footer />

      {/* Bundle suggestion banner - only on non-bundle pages */}
      {!product?.isBundle && <BundleBanner />}
    </div>
  );
};

export default ProductDetail;
