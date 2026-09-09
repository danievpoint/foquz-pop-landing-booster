import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { products, bundleProduct } from "@/data/products";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import SeoHead from "@/components/SeoHead";
import LooxRating from "@/components/LooxRating";
import LooxReviews from "@/components/LooxReviews";
import { SHOPIFY_PRODUCT_ID_BY_HANDLE, fetchProductGalleryImages, type ShopifyImage } from "@/lib/shopify";
import AutoVideo from "@/components/AutoVideo";
import { trackViewedProduct } from "@/lib/klaviyo";
import { BundleBanner } from "@/pages/ProductDetail";

import { Check, X, ChevronDown } from "lucide-react";
import PaymentLogos from "@/components/PaymentLogos";
import productWatermelon from "@/assets/product-watermelon-new.png";
import productThai from "@/assets/product-thai-new.png";
import productLemon from "@/assets/product-lemon-new.png";
const productBlueberry = { url: "/images/peach-party/product-blueberry.jpg" };
const cardThai = { url: "/images/peach-party/product-thai.jpg" };
const cardLemon = { url: "/images/peach-party/product-lemon.jpg" };
const cardWatermelon = { url: "/images/peach-party/product-watermelon.jpg" };

const peachKickBanner = { url: "/images/peach-party/peach-kick-banner-16zu9.jpg" };
const doseFoquz = { url: "/images/peach-party/dose-vergleich.png" };
const doseIncognito = { url: "/images/peach-party/dose-vergleich-incognito.png" };
const lifestyleNase = { url: "/images/peach-party/lifestyle-nase.png" };
const comparisonNasenspray = { url: "/images/peach-party/comparison-nasenspray.png" };
const comparisonEnergy = { url: "/images/peach-party/comparison-energydrink.png" };
const peachIngredients = { url: "/images/peach-party/peach-ingredients.png" };
const peachHero = { url: "/images/peach-party/peach-hero.jpg" };
const howToStep1 = { url: "/images/peach-party/how-to-step-1.svg" };
const howToStep2 = { url: "/images/peach-party/how-to-step-2.svg" };
const howToStep3 = { url: "/images/peach-party/how-to-step-3.svg" };

const ORANGE = "#f6871f";
const LIGHTBLUE = "#c5e6f2";

const galleryThumbs = [peachHero.url];

const peach = products.find((p) => p.handle === "peach-party")!;

const bundles = [
  { label: "1 DOSE", desc: "Zum Reinschnuppern", price: peach.numericPrice, perDose: "7,49", dosen: 1, tag: null },
  { label: "3 DOSEN – POWER BUNDLE", desc: "Alle 3 Sorten in einer Box, 11 % sparen", price: bundleProduct.numericPrice, oldPrice: "22,47 €", perDose: "6,66", dosen: 3, tag: "BELIEBT" },
  { label: "5 DOSEN – SQUAD BUNDLE", desc: "Aktuell nicht erhältlich", price: 0, perDose: "", dosen: 5, tag: null },
];

const comparisons = [
  {
    heading: ["FOQUZ VS. STANDARD"],
    foquzTitle: "FOQUZ",
    compTitle: "STANDARD",
    foquzImg: doseFoquz.url,
    foquzAlt: "Original FOQUZ Riechdose Peach Party",
    compImg: doseIncognito.url,
    compAlt: "Standard Dose",
    foquz: [
      "Viele verschiedene Sorten",
      "Anwendung & Zutaten auf Deutsch",
      "Deutsche Marke, Versand aus Deutschland",
      "Deutscher Support",
    ],
    comp: [
      "Oft nur Menthol & Kampfer",
      "Oft auf Englisch oder Thailändisch",
      "Oft Importware oder Versand aus dem Ausland",
      "Oft kein Support oder Sitz im Ausland",
    ],
  },
  {
    heading: ["FOQUZ VS. NASENSPRAY"],
    foquzTitle: "FOQUZ*",
    compTitle: "NASENSPRAY",
    foquzImg: doseFoquz.url,
    foquzAlt: "Original FOQUZ Riechdose",
    compImg: comparisonNasenspray.url,
    compAlt: "Nasenspray",
    footnote: "**Gilt nur für bestimmte abschwellende Nasensprays. Anwendung nach Packungsbeilage.",
    foquz: [
      "Kein Sprühstoß, keine Flüssigkeit",
      "Wiederverschließbar & mobil",
      "Kein Arzneimittel und kein Medizinprodukt",
      "Frische-Moment direkt beim Riechen",
    ],
    comp: [
      "Sprühflüssigkeit bzw. Wirkstoff und Anwendung abhängig vom Produkt",
      "Anwendung nach Packungsangabe",
      "Je nach Produkt Arzneimittel oder Medizinprodukt",
      "Möglicher Rebound-Effekt bei zu langer oder zu häufiger Anwendung**",
    ],
  },
  {
    heading: ["FOQUZ VS. ENERGY DRINK"],
    compTitle: "ENERGY DOSE*",
    foquzImg: doseFoquz.url,
    foquzAlt: "Original FOQUZ Riechdose",
    compImg: comparisonEnergy.url,
    compAlt: "Energy Drink",
    footnote: "*Vergleich mit einem zucker- und koffeinhaltigen Energy Drink in einer 500-ml-Dose mit nicht wiederverschließbarem Aufreißverschluss.",
    foquz: [
      "Refreshmoment ohne Koffein",
      "Sofortiger Refresh-Moment",
      "Riechen ohne Zuckeraufnahme",
      "Mobil & wiederverschließbar",
    ],
    comp: [
      "Koffein kann deinen Schlaf beeinträchtigen",
      "Koffein kann länger nachwirken, als du möchtest",
      "Oft zu viel Zucker",
      "Nach dem Öffnen nicht wiederverschließbar",
    ],
  },
];

const faqs = [
  { q: "Wofür ist FOQUZ?", a: "FOQUZ ist deine Frische-Dose für die Nase – für zwischendurch beim Arbeiten, Lernen, Zocken, Sport oder unterwegs. Einfach kurz riechen, tief durchatmen, weiter geht's." },
  { q: "Kann ich FOQUZ bei Asthma, Allergien oder Überempfindlichkeit verwenden?", a: "FOQUZ enthält echte Kräuter und Menthol. Bei Asthma, Allergien oder Überempfindlichkeit gegenüber ätherischen Ölen bitte vorher ärztlichen Rat einholen." },
  { q: "Ist FOQUZ legal?", a: "Ja. FOQUZ ist ein frei verkäufliches Lifestyle-Produkt ohne Nikotin und ohne Koffein. Es wird gerochen, nicht geschnupft." },
  { q: "Wie schnell wird meine Bestellung geliefert?", a: "Versand mit DHL nach Deutschland, Österreich und die Schweiz – in 2 bis 5 Werktagen bei dir." },
];


const ComicBox = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl border-2 border-black shadow-[6px_6px_0_0_#000] p-5 md:p-6 ${className}`}
  >
    <h3 className="font-barlow font-extrabold text-xl md:text-2xl mb-4 leading-tight">
      {title}
    </h3>
    {children}
  </div>
);

const PeachParty = () => {
  const { addToCart, isOpen: cartOpen, popupOpen } = useCart();
  const navigate = useNavigate();
  const { isAvailable, loading } = useProductAvailability();
  const ctaRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<ShopifyImage[]>([]);
  const touchStart = useRef<number | null>(null);
  const [activeCompare, setActiveCompare] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const sorte = "PEACH PARTY";
  const [bundle, setBundle] = useState("3 DOSEN – POWER BUNDLE");
  const [storyOpen, setStoryOpen] = useState(false);
  const selectedBundle = bundles.find((b) => b.label === bundle) ?? bundles[0];

  const selectedProduct = selectedBundle.dosen === 3 ? bundleProduct : peach;
  const available = isAvailable(selectedProduct.name);
  const canBuy = selectedBundle.dosen !== 5 && available !== false;
  const handleAddToCart = () => {
    if (!canBuy) return;
    addToCart(1, {
      id: selectedProduct.isBundle ? "starter-bundle" : selectedProduct.name,
      name: selectedProduct.isBundle ? "FOQUZ Power Bundle (3 Sorten)" : selectedProduct.name,
      price: selectedProduct.numericPrice,
      image: selectedProduct.image,
    });
  };
  useEffect(() => {
    trackViewedProduct({ id: peach.name, name: peach.name, image: peach.image,
      price: peach.numericPrice, url: "/produkt/peach-party" });
  }, []);
  useEffect(() => {
    if (!galleryOpen) return;
    let cancelled = false;
    fetchProductGalleryImages(peach.handle).then((images) => {
      if (!cancelled) setGalleryImages(images);
    }).catch(() => { /* The product video remains available if Shopify cannot load. */ });
    return () => { cancelled = true; };
  }, [galleryOpen]);
  useEffect(() => {
    let ctaOut = false;
    let footerIn = false;
    const update = () => setShowSticky(ctaOut && !footerIn);
    const ctaObserver = new IntersectionObserver(([entry]) => {
      ctaOut = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    const footerObserver = new IntersectionObserver(([entry]) => {
      footerIn = entry.isIntersecting;
      update();
    });
    if (ctaRef.current) ctaObserver.observe(ctaRef.current);
    if (footerRef.current) footerObserver.observe(footerRef.current);
    return () => { ctaObserver.disconnect(); footerObserver.disconnect(); };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: LIGHTBLUE }}>
      <SeoHead title="PEACH PARTY – FOQUZ" description={peach.desc.replace(/\n/g, " ")}
        path="/produkt/peach-party" type="product" image="https://www.foquz.de/images/peach-party/peach-hero.jpg"
        jsonLd={{ "@context": "https://schema.org", "@type": "Product", name: peach.name,
          description: peach.desc.replace(/\n/g, " "), sku: peach.handle,
          image: "https://www.foquz.de/images/peach-party/peach-hero.jpg",
          brand: { "@type": "Brand", name: "FOQUZ" },
          offers: { "@type": "Offer", priceCurrency: "EUR", price: peach.numericPrice.toFixed(2),
            ...(isAvailable(peach.name) === null ? {} : { availability: isAvailable(peach.name) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" }),
            url: "https://www.foquz.de/produkt/peach-party" } }} />
      <Navbar />

      <main className="peach-party-design pt-24 md:pt-28 lg:pt-32">
        {/* ===== Product Hero: Gallery + Buy Panel ===== */}
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 lg:items-stretch">
          {/* Gallery – alle Produktbilder ohne Slider */}
          <div className="flex flex-col">
            <div className={`grid gap-2 mb-4 rounded-2xl border-2 border-black shadow-[6px_6px_0_0_#000] overflow-hidden ${galleryThumbs.length === 1 ? "grid-cols-1" : "grid-cols-2 bg-white p-2"}`}>
              {galleryThumbs.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Peach Party Produktbild ${i + 1}`}
                  className={`w-full ${galleryThumbs.length === 1 ? "aspect-auto" : "aspect-square"} object-cover rounded-xl`}
                />
              ))}
            </div>
            <div>
              <button type="button" aria-expanded={galleryOpen} onClick={() => setGalleryOpen(!galleryOpen)} className="text-xs font-bold underline underline-offset-4">Weitere Produktbilder & Video</button>
              {galleryOpen && <div className="grid grid-cols-2 gap-2 mt-3">
                {peach.video && <AutoVideo src={peach.video} poster={peach.videoPoster} className="w-full aspect-square object-cover rounded-xl border-2 border-black" />}
                {galleryImages.map((image) => <img key={image.url} src={image.url} alt={image.altText || peach.name} loading="lazy" className="w-full aspect-square object-cover rounded-xl border-2 border-black" />)}
              </div>}
            </div>
            {/* Title Block – unter dem Slider */}
            <div className="text-left mt-6 md:mt-8">
              <h1 className="font-barlow font-extrabold leading-[0.95] text-pop text-primary-foreground text-4xl sm:text-5xl lg:text-6xl mb-4">
                <span style={{ color: ORANGE }}>PEACH</span>{" "}
                <span style={{ color: "#ffd618" }}>PARTY</span>
              </h1>
              <p className="text-foreground/90 text-base md:text-lg font-bold leading-relaxed">
                Auch Mario wollte nur Peach. <br />Fruchtige Frische, einfach durchgespielt.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-6 justify-start">
                {["ohne Nikotin", "ohne Koffein", "echte Kräuter", "deutsche Marke"].map((b) => (
                  <span key={b} className="bg-white border-2 border-black rounded-full px-2.5 py-1 text-[11px] font-bold shadow-[2px_2px_0_0_#000]">
                    {b}
                  </span>
                ))}
              </div>

              {/* Bewertung unter den Badges */}
              <div className="flex items-center justify-start gap-2 mt-4">
                <LooxRating productId="10276796498262" />
              </div>
            </div>
          </div>

          {/* Buy Panel */}
          <div className="flex flex-col h-full">
            {/* Sorte wählen */}
            <h2 className="font-barlow font-extrabold text-base mb-3">SORTE WÄHLEN</h2>
            <div className="space-y-4 mb-8">
              {[
                { name: "PEACH PARTY", desc: "Pfirsich & Kräuter", img: productWatermelon },
                { name: "LEMON BREEZY", desc: "Zitrone & Kräuter", img: productLemon },
                { name: "THAI STYLE", desc: "Kräuter & Menthol", img: productThai },
              ].map((s) => {
                const selected = sorte === s.name;
                return (
                  <button
                    key={s.name}
                    aria-pressed={selected}
                    onClick={() => { if (!selected) navigate(`/produkt/${products.find((p) => p.name === s.name)!.handle}`); }}
                    className={`w-full min-h-[72px] flex items-center gap-3 rounded-2xl border-2 border-black bg-white p-3 text-left transition-all ${
                      selected ? "shadow-[5px_5px_0_0_#000]" : "shadow-[3px_3px_0_0_rgba(0,0,0,0.25)] opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img src={s.img} alt={s.name} className="w-12 h-12 rounded-xl border-2 border-black object-cover shrink-0" />
                    <span className="flex-1">
                      <span className="block font-barlow font-extrabold">{s.name}</span>
                      <span className="block text-xs text-muted-foreground font-semibold">{s.desc}</span>
                    </span>
                    <span className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shrink-0 ${selected ? "bg-white" : "bg-white"}`}>
                      {selected && <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bundle wählen */}
            <h2 className="font-barlow font-extrabold text-base mb-3">MENGE WÄHLEN — MEHR DOSEN, MEHR WOLKE 7</h2>
            <div className="space-y-4 mb-8">
              {bundles.map((b) => {
                const selected = bundle === b.label;
                return (
                  <button
                    key={b.label}
                    disabled={b.dosen === 5}
                    aria-pressed={selected}
                    onClick={() => setBundle(b.label)}
                    className={`relative w-full min-h-[80px] flex items-center gap-3 rounded-2xl border-2 border-black p-3 text-left transition-all ${
                      selected
                        ? "bg-violet-600 text-white shadow-[5px_5px_0_0_#000]"
                        : "bg-white shadow-[3px_3px_0_0_rgba(0,0,0,0.25)] opacity-90 hover:opacity-100"
                    }`}
                  >
                    {b.tag && (
                      <span className="absolute -top-3 right-3 max-w-[45%] bg-yellow-400 text-black border-2 border-black rounded-full px-2.5 py-1 text-[10px] leading-none text-center font-black shadow-[2px_2px_0_0_#000] sm:right-4 sm:max-w-none sm:px-3">
                        {b.tag}
                      </span>
                    )}
                    <span className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shrink-0 ${selected ? "bg-white" : "bg-white"}`}>
                      {selected && <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black" />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-barlow font-extrabold">{b.label}</span>
                      <span className={`block text-xs font-semibold ${selected ? "text-yellow-300" : "text-muted-foreground"}`}>
                        {b.desc}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-barlow font-extrabold text-lg">
                        {b.dosen === 5 ? "—" : `${b.price.toFixed(2).replace(".", ",")} €`}
                        {"oldPrice" in b && b.oldPrice && (
                          <span className={`ml-1.5 text-xs line-through ${selected ? "text-white/70" : "text-muted-foreground"}`}>{b.oldPrice}</span>
                        )}
                      </span>
                      <span className={`block text-[11px] font-semibold ${selected ? "text-white/80" : "text-muted-foreground"}`}>
                        {b.dosen === 5 ? "Nicht verfügbar" : `${b.perDose} € / Dose`}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-bold leading-relaxed mb-4">
              {available === true ? "Verfügbar ⚡ · AUF LAGER — in 2 bis 5 Werktagen bei dir" : available === false ? "Aktuell ausverkauft" : loading ? "Verfügbarkeit wird geprüft …" : "Verfügbarkeit wird im Checkout bestätigt"} <span className="font-semibold text-muted-foreground">· inkl. MwSt.</span>
            </p>
            <button
              ref={ctaRef}
              disabled={!canBuy}
              onClick={handleAddToCart}
              className="comic-btn w-full min-h-12 text-center py-3 font-extrabold text-sm sm:text-base"
              style={{ backgroundColor: "#ffd618", color: "#000" }}
            >
              {available === false ? "AUSVERKAUFT" : `IN DEN WARENKORB – ${selectedBundle.price.toFixed(2).replace(".", ",")} €`}
            </button>

            {/* Trust */}
            <ul className="mt-auto pt-6 space-y-3 text-xs font-semibold">
              {["Versand mit DHL nach DE, AT und CH", "14 Tage Widerrufsrecht", "Sichere Zahlung mit PayPal, Klarna und Kreditkarte"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <PaymentLogos />
            </div>
          </div>
          </div>
        </section>

        {/* ===== Peach Kick Banner ===== */}
        <section className="w-full" style={{ backgroundColor: LIGHTBLUE }}>
          <img
            src={peachKickBanner.url}
            alt="Peach Kick. Wach im Blick. Einatmen. Klar bleiben."
            className="w-full h-auto object-cover object-center block"
          />
        </section>

        {/* ===== Was ist Peach Party ===== */}
        <section className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 py-12 md:py-16 lg:py-20">
          <div className="rounded-3xl border-4 border-black shadow-[8px_8px_0_0_#000] p-5 sm:p-8 lg:p-10" style={{ backgroundColor: "#ffd618" }}>
            <h2 className="font-barlow font-extrabold section-title text-center mb-6 md:mb-8 leading-none">
              WAS IST PEACH PARTY
            </h2>
            <p className="text-center text-sm md:text-base text-foreground/80 leading-relaxed mb-6 md:mb-8">
              Peach Party ist FOQUZ – die moderne Riechdose für deinen kurzen Refresh-Moment.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* Weiße Fläche 1: Duft / Anwendung / Dein Moment */}
              <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0_0_#000] p-5 md:p-6 flex flex-col">
                <div className="flex-1 flex flex-col justify-center gap-5 text-sm md:text-base text-foreground/80 leading-relaxed">
                  <div className="text-left">
                    <p className="font-extrabold uppercase tracking-wide text-foreground mb-1">Duft</p>
                    <p>Fruchtiger Pfirsichduft trifft auf Menthol und den FOQUZ Pflanzen- und Aromenmix.</p>
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold uppercase tracking-wide text-foreground mb-1">Anwendung</p>
                    <p>Dose öffnen. Kurz riechen. Ab auf Wolke 7. Wieder verschließen.</p>
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold uppercase tracking-wide text-foreground mb-1">Dein Moment</p>
                    <p>Beim Gaming, beim Sport, am Schreibtisch oder unterwegs.</p>
                  </div>
                </div>
              </div>
              {/* Weiße Fläche 2: Was drin ist */}
              <ComicBox title="WAS DRIN IST" className="flex flex-col justify-center">
                <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  {["Zitronengras", "Gewürznelke", "Weißdorn", "Süßholz", "Knöterichwurzel", "Osmanthusblüte", "Jasminblüte", "Menthol", "Pfirsicharoma"].map(
                    (ing) => (
                      <li key={ing} className="flex items-center gap-2 leading-snug">
                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                        {ing}
                      </li>
                    )
                  )}
                </ul>
                <p className="text-xs font-bold text-muted-foreground mt-3">
                  Echte Kräuter, echtes Menthol. Ohne Nikotin, ohne Koffein.
                </p>
              </ComicBox>
            </div>
          </div>
        </section>


        {/* ===== Thailändische Riechtradition ===== */}
        <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
          <h2 className="font-barlow font-extrabold section-title text-center mb-6 md:mb-8 leading-none">
            THAILÄNDISCHE RIECHTRADITION
            <br />TRIFFT FOQUZ
          </h2>
          <div className="max-w-3xl mx-auto text-sm md:text-base text-foreground/80 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-foreground/20">
              <div className="text-center md:px-6">
                <p className="font-extrabold uppercase tracking-wide text-foreground mb-1">Die Inspiration</p>
                <p>
                  FOQUZ ist von Ya Dom – auch Yadom genannt – inspiriert, einem bekannten thailändischen
                  Riechprodukt. In Thailand gehört Ya Dom für viele Menschen zum Alltag.
                </p>
              </div>
              <div className="text-center md:px-6">
                <p className="font-extrabold uppercase tracking-wide text-foreground mb-1">Neu interpretiert</p>
                <p>
                  Wir haben die Idee neu interpretiert und auf Wolke 7 geschickt: mit fruchtigen Duftwelten,
                  starken Designs und einem modernen Riechritual.
                </p>
              </div>
              <div className="text-center md:px-6">
                <p className="font-extrabold uppercase tracking-wide text-foreground mb-1">FOQUZ heute</p>
                <p>
                  Klassische Kräuter- und Mentholnoten treffen auf Sorten wie Peach Party, Lemon Breezy und
                  Blueberry Flow.
                </p>
              </div>
            </div>
            <p className="text-center font-bold text-foreground mt-6 md:mt-8">Keine Vape. Kein Nasenspray. Kein Arzneimittel.</p>
            <p className="text-center mt-3">
              FOQUZ ist ein Erfrischungsprodukt zum Riechen – ohne Nikotin und ohne Koffein.
            </p>
          </div>

          {/* Aufklappbar: Mehr zur Geschichte */}
          <div className="max-w-3xl mx-auto mt-6 md:mt-8">
            <div className="rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000]">
              <button
                type="button"
                onClick={() => setStoryOpen((v) => !v)}
                aria-expanded={storyOpen}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 font-barlow font-extrabold uppercase tracking-wide text-foreground text-sm md:text-base"
              >
                Mehr zur Geschichte
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${storyOpen ? "rotate-180" : ""}`} />
              </button>
              {storyOpen && (
                <div className="px-4 sm:px-6 pb-5 text-sm md:text-base text-foreground/80 leading-relaxed space-y-4">
                  <p>
                    Der Begriff Ya Dom setzt sich sinngemäß aus „ya“ für Medizin und „dom“ für riechen zusammen.
                    Ya Dom ist klein genug, um überall dabei zu sein.
                  </p>
                  <p>
                    Wir haben diese Idee auf Wolke 7 geschickt. Bei unseren eigenen Straßeninterviews in Thailand
                    kamen die fruchtigen FOQUZ-Düfte bei mehreren Befragten besonders gut an – gerade weil sie die
                    klassische Duftwelt um moderne, fruchtige Noten erweitern. Klassische Kräuter- und
                    Mentholprofile treffen bei FOQUZ auf Sorten wie Peach Party, Lemon Breezy und Blueberry Flow.
                  </p>
                  <p>
                    FOQUZ ist ein Erfrischungsprodukt zum Riechen. Ein neues Ritual für die nächste Runde, den
                    nächsten Satz oder den kurzen Moment dazwischen.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 md:mt-10 text-center">
            <h3 className="font-barlow font-extrabold text-2xl md:text-3xl mb-5 md:mb-6 leading-none">HOW TO FOQUZ</h3>
            <ul className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 items-start justify-items-center max-w-xl mx-auto">
              {[
                { step: "Schritt 1", title: "1. DOSE AUF", icon: howToStep1 },
                { step: "Schritt 2", title: "2. NASE DRAUF", icon: howToStep2 },
                { step: "Schritt 3", title: "3. AB AUF WOLKE 7", icon: howToStep3 },
              ].map((s) => (
                <li key={s.title} className="flex flex-col items-center gap-2 text-sm sm:text-base font-semibold leading-snug">
                  <img
                    src={s.icon.url}
                    alt={s.title}
                    className="w-16 h-16 md:w-24 md:h-24 shrink-0 object-contain"
                    loading="lazy"
                  />
                  <span className="block font-extrabold">{s.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== Vergleichs-Slider: Foquz vs. Thailand-Dose / Nasenspray / Energy Drink ===== */}
        <section className="flex flex-col justify-center py-12 md:py-16 lg:py-20 overflow-hidden" style={{ backgroundColor: ORANGE }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
            <div className="overflow-hidden pb-3" style={{ touchAction: "pan-y" }}
              onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
              onTouchEnd={(event) => {
                if (touchStart.current === null) return;
                const delta = event.changedTouches[0].clientX - touchStart.current;
                if (Math.abs(delta) > 40) setActiveCompare((current) => (current + (delta < 0 ? 1 : -1) + comparisons.length) % comparisons.length);
                touchStart.current = null;
              }}>
            <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${activeCompare * 100}%)` }}>
              {comparisons.map((c, i) => (
                <div key={i} aria-hidden={activeCompare !== i} className="w-full shrink-0 px-2">
                   <h2 className="font-barlow font-extrabold text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl text-center text-black mb-8 leading-none whitespace-nowrap">
                    {c.heading[0]}
                    {c.heading[1] && (
                      <>
                        <br />
                        {c.heading[1]}
                      </>
                    )}
                  </h2>
                   <div className="relative grid gap-6 lg:grid-cols-2 lg:gap-8 items-stretch">
                    {/* VS Badge */}
                    <span className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-black text-yellow-400 items-center justify-center font-barlow font-black text-2xl lg:text-3xl border-4 border-yellow-400 shadow-[4px_4px_0_0_rgba(0,0,0,0.35)] rotate-[-6deg]">
                      VS
                    </span>

                    {/* FOQUZ Karte – gelb */}
                    <div className="relative h-full flex flex-col rounded-2xl md:rounded-3xl border-4 border-black p-4 sm:p-6 lg:p-8 shadow-[8px_8px_0_0_#000]" style={{ backgroundColor: "#ffd618" }}>
                      <h3 className="font-barlow font-black text-2xl md:text-3xl lg:text-4xl text-black leading-none mb-4 md:mb-6 text-center">
                        {c.foquzTitle ?? "DAS ORIGINAL"}
                      </h3>
                      <div className="flex flex-1 min-w-0 flex-col items-center gap-3 sm:flex-row sm:gap-4">
                        <div className="flex h-44 sm:h-56 lg:h-64 w-full max-w-[220px] sm:w-[42%] sm:max-w-[260px] shrink-0 items-center justify-center">
                          <img
                            src={c.foquzImg}
                            alt={c.foquzAlt}
                            loading="lazy"
                            className="h-full w-auto max-w-full object-contain"
                          />
                        </div>
                        <ul className="min-w-0 space-y-3 md:space-y-4 w-full sm:flex-1">
                          {c.foquz.map((t) => (
                            <li key={t} className="flex items-center gap-2 md:gap-3 text-sm md:text-base font-bold text-black">
                              <span className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0" style={{ backgroundColor: "#ffd618" }}>
                                <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-black" strokeWidth={3} />
                              </span>
                              <span className="leading-tight">{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Vergleichsprodukt Karte – weiß */}
                    <div className="relative h-full flex flex-col rounded-2xl md:rounded-3xl border-4 border-black bg-white p-4 sm:p-6 lg:p-8 shadow-[8px_8px_0_0_#000]">
                      <h3 className="font-barlow font-black text-2xl md:text-3xl lg:text-4xl text-black leading-none mb-4 md:mb-6 text-center">
                        {c.compTitle}
                      </h3>
                      <div className="flex flex-1 min-w-0 flex-col items-center gap-3 sm:flex-row sm:gap-4">
                        <div className="flex h-44 sm:h-56 lg:h-64 w-full max-w-[220px] sm:w-[42%] sm:max-w-[260px] shrink-0 items-center justify-center">
                          <img
                            src={c.compImg}
                            alt={c.compAlt}
                            loading="lazy"
                            className="h-full w-auto max-w-full object-contain"
                          />
                        </div>
                        <ul className="min-w-0 space-y-3 md:space-y-4 w-full sm:flex-1">
                          {c.comp.map((t) => (
                            <li key={t} className="flex items-center gap-2 md:gap-3 text-sm md:text-base font-bold text-black">
                              <span className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0" style={{ backgroundColor: "#bdbdbd" }}>
                                <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-black" strokeWidth={3} />
                              </span>
                              <span className="leading-tight">{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {c.footnote && (
                    <p className="max-w-3xl mx-auto mt-4 md:mt-6 text-center text-[11px] md:text-xs font-semibold text-black/80 leading-snug">
                      {c.footnote}
                    </p>
                  )}
                </div>
              ))}
            </div>
            </div>

            {/* Pfeile + Punkte */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setActiveCompare((activeCompare - 1 + comparisons.length) % comparisons.length)}
                aria-label="Vorheriger Vergleich"
                className="w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000] active:translate-y-[1px]"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
              <div className="flex gap-2">
                {comparisons.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCompare(i)}
                    aria-label={`Vergleich ${i + 1}`}
                    className={`h-3 rounded-full border-2 border-black transition-all ${
                      i === activeCompare ? "w-8 bg-yellow-400" : "w-3 bg-white"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveCompare((activeCompare + 1) % comparisons.length)}
                aria-label="Nächster Vergleich"
                className="w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000] active:translate-y-[1px]"
              >
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </button>
            </div>
            <p className="mt-3 text-center font-barlow font-bold text-[11px] md:text-xs tracking-[0.25em] text-white uppercase">
              Swipe für mehr Vergleiche
            </p>
          </div>
        </section>

        {/* ===== Der Moment ===== */}
        <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
          <h2 className="font-barlow font-extrabold section-title text-center mb-8 md:mb-12 leading-none">
            KURZ RIECHEN.
            <br />
            FRISCH WEITER.
          </h2>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-center">
            <div className="rounded-2xl border-2 border-black shadow-[6px_6px_0_0_#000] overflow-hidden">
              <img
                src={lifestyleNase.url}
                alt="FOQUZ Peach Party – Mann riecht an der Dose"
                className="w-full aspect-[6/5] object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <span className="inline-block bg-yellow-400 border-2 border-black rounded-full px-4 py-1 text-sm font-black shadow-[3px_3px_0_0_#000] mb-3">
                FÜR ZWISCHENDURCH
              </span>
              <h3 className="font-barlow font-extrabold text-xl md:text-2xl mb-4 leading-tight">
                DER MOMENT, IN DEM DIE NASE WIEDER AUFGEHT
              </h3>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-4">
                Dose auf, kurz riechen, tief durchatmen. Kein Kaffee, kein Energy Drink, kein Nikotin.
                Passt in die Hosentasche und ist in drei Sekunden erledigt, egal ob am Schreibtisch,
                im Gym oder unterwegs.
              </p>
              <ul className="space-y-3 text-sm md:text-base font-semibold">
                {["In drei Sekunden erledigt", "Passt in jede Hosentasche", "Ohne Nikotin, ohne Koffein"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shrink-0" style={{ backgroundColor: "#ffd618" }}>
                      <Check className="w-4 h-4" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== Kein Tabak. Kein Nikotin. Kein Kater. ===== */}
        <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: LIGHTBLUE }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-12 items-center overflow-hidden">
            <div className="order-2 md:order-1 py-6 md:py-10">
              <img
                src={peachIngredients.url}
                alt="FOQUZ Peach Party – Dosen, Pflanzen- und Aromenmix"
                className="w-full object-contain scale-110 md:scale-[1.15] lg:scale-125"
                loading="lazy"
              />
            </div>
            <div className="order-1 md:order-2 max-w-xl w-full mx-auto md:mx-0">
            <div className="rounded-2xl border-2 border-black shadow-[6px_6px_0_0_#000] overflow-hidden">
              <div
                className="px-6 py-6 md:px-8 md:py-8 text-center"
                style={{ backgroundColor: "#7547b2" }}
              >
                <span
                  className="inline-block text-[11px] md:text-xs font-black uppercase tracking-wide mb-3"
                  style={{ color: "#f2d04c" }}
                >
                  Kurz riechen, ab auf Wolke 7
                </span>
                <h2 className="font-barlow font-extrabold text-white text-2xl md:text-4xl leading-tight">
                  KEIN TABAK.
                  <br />
                  KEIN NIKOTIN.
                  <br />
                  KEIN KOFFEIN.
                </h2>
              </div>
              <div className="bg-white px-6 py-5 md:px-8 md:py-6">
                <ul className="divide-y divide-border">
                  {[
                    "Natürliche Kräuter und Ätherische Öle* – sonst nichts",
                    "Mobil, wiederverschließbar & jederzeit griffbereit",
                    "Deutsche Marke, Deutscher Versand & Support",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-3 py-2.5 text-sm md:text-base font-semibold">
                      <span className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shrink-0" style={{ backgroundColor: "#ffd618" }}>
                        <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] md:text-xs font-semibold text-foreground/70 leading-snug">
                  *Nur zum Riechen. Nicht zum Verzehr geeignet. Netz nicht entfernen.
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* ===== Kundenstimmen ===== */}
        <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: ORANGE }}>
          <div className="container mx-auto px-4">
            <h2 className="font-barlow font-extrabold text-3xl md:text-5xl text-center text-black mb-8 md:mb-12 leading-none">
              DAS SAGEN UNSERE KUNDEN
            </h2>
            <div className="bg-white rounded-xl border-2 border-black shadow-[6px_6px_0_0_#000] p-4 max-w-3xl mx-auto mb-8">
              <LooxReviews embedded productId={SHOPIFY_PRODUCT_ID_BY_HANDLE[peach.handle]} />
            </div>
            <div className="text-center">
              <button
                disabled={isAvailable(peach.name) === false}
                onClick={() => { if (isAvailable(peach.name) !== false) addToCart(1, { id: peach.name, name: peach.name, price: peach.numericPrice, image: peach.image }); }}
                className="comic-btn px-8 py-3 font-extrabold text-sm"
                style={{ backgroundColor: "#ffd618", color: "#000" }}
              >
                KURZ RIECHEN, AB AUF WOLKE 7
              </button>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
          <h2 className="font-barlow font-extrabold text-3xl md:text-5xl text-center mb-8 md:mb-12 leading-none">
            HÄUFIGE FRAGEN
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000] overflow-hidden">
                <button
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full min-h-14 flex items-center justify-between gap-4 p-4 md:p-5 text-left font-bold text-sm md:text-base leading-snug"
                >
                  {faq.q}
                  <span
                    className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shrink-0 transition-transform"
                    style={{ backgroundColor: "#ffd618", transform: openFaq === i ? "rotate(180deg)" : "none" }}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </button>
                {openFaq === i && (
                  <p className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===== Mehr entdecken ===== */}
        <section className="container mx-auto px-4 sm:px-6 pb-16 md:pb-24">
          <h2 className="font-barlow font-extrabold text-3xl md:text-5xl text-center mb-8 md:mb-12 leading-none">
            MEHR ENTDECKEN
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              { name: "BLUEBERRY FLOW", image: productBlueberry.url, href: null },
              { name: "THAI STYLE", image: cardThai.url, href: "/produkt/thai-style" },
              { name: "LEMON BREEZY", image: cardLemon.url, href: "/produkt/lemon-breezy" },
              { name: "WATERMELON FLEX", image: cardWatermelon.url, href: null },
            ].map((p) => (
              <div key={p.name} className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0_0_#000] overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />
                <div className="p-3 md:p-4 text-center">
                  <h3 className="font-barlow font-extrabold mb-1 text-sm">{p.name}</h3>
                  <p className="text-[11px] text-muted-foreground mb-2">{p.href ? `€7,49 · ${isAvailable(p.name) === true ? "Verfügbar ⚡" : isAvailable(p.name) === false ? "Ausverkauft" : "Verfügbarkeit wird geprüft"}` : "Aktuell nicht erhältlich"}</p>
                  {p.href ? <Link to={p.href}>
                    <button className="comic-btn w-full text-[10px] sm:text-[11px] py-2 px-2 font-extrabold" style={{ backgroundColor: "#ffd618", color: "#000" }}>
                      JETZT ENTDECKEN
                    </button>
                  </Link> : <button disabled className="comic-btn w-full text-[10px] sm:text-[11px] py-2 px-2 font-extrabold" style={{ backgroundColor: "#ffd618", color: "#000" }}>NICHT VERFÜGBAR</button>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div ref={footerRef}><Footer /></div>
      {showSticky && !cartOpen && !popupOpen && <div className="lg:hidden fixed bottom-0 inset-x-0 z-[9000] bg-white border-t-[3px] border-black p-3 flex items-center gap-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
        <div className="shrink-0 font-bold text-sm">{selectedBundle.dosen === 3 ? "Power Bundle" : "1 Dose"}<div className="text-lg">{selectedBundle.price.toFixed(2).replace(".", ",")} €</div></div>
        <button disabled={!canBuy} onClick={handleAddToCart} className="comic-btn flex-1 text-sm py-3 px-3 bg-yellow-400">{available === false ? "AUSVERKAUFT" : "IN DEN WARENKORB"}</button>
      </div>}
      <BundleBanner />
    </div>
  );
};


export default PeachParty;
