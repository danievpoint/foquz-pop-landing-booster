import { useProductPage } from "@/hooks/useProductPage";
import { useSetSelection } from "@/hooks/useInitialSetSize";
import { useViewContentPixel } from "@/hooks/useViewContentPixel";
import { FreeShippingStatus, ProductPageMeta, ProductPageMedia, ProductPageSticky, ProductPromise } from "@/components/product-pages/ShopIntegration";
import { BundleSelector } from "@/components/product-pages/BundleSelector";
import LooxRating from "@/components/LooxRating";
import LooxReviews from "@/components/LooxReviews";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, X, ChevronDown } from "lucide-react";
import PaymentLogos from "@/components/PaymentLogos";
import { productImages } from "@/lib/redesignProductImages";

const peachKickBanner = { url: "/images/product-pages/peach-kick-banner-16zu9.jpg" };
const doseFoquz = { url: "/images/product-pages/dose-vergleich.png" };
const doseIncognito = { url: "/images/product-pages/dose-vergleich-incognito.png" };
const lifestyleNase = { url: "/images/product-pages/lifestyle-nase.png" };
const comparisonNasenspray = { url: "/images/product-pages/comparison-nasenspray.png" };
const comparisonEnergy = { url: "/images/product-pages/comparison-energydrink.png" };
const peachIngredients = { url: "/images/product-pages/peach-ingredients.png" };
const howToStep1 = { url: "/images/product-pages/how-to-step-1.svg" };
const howToStep2 = { url: "/images/product-pages/how-to-step-2.svg" };
const howToStep3 = { url: "/images/product-pages/how-to-step-3.svg" };

const ORANGE = "#f6871f";
const LIGHTBLUE = "#c5e6f2";




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
    foquzFootnote: "*FOQUZ ist nicht zur Behandlung einer verstopften Nase, Erkältung oder Allergie bestimmt.",
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
    foquzTitle: "FOQUZ",
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
      "Koffein kann deinen Schlaf beeinträchtigen.",
      "Koffein kann länger nachwirken, als du möchtest.",
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

const PeachPartyInner = () => {
  const shop = useProductPage("peach-party");
  const { product, bundles, addSingle, addSelection, isAvailable } = shop;
  const touchStart = useRef<number | null>(null);
  const [activeCompare, setActiveCompare] = useState(0);
  const compareSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [compareSlideHeight, setCompareSlideHeight] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    const el = compareSlideRefs.current[activeCompare];
    if (!el) return;
    const update = () => setCompareSlideHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeCompare]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { setSize: initialSetSize, navigationKey } = useSetSelection();
  const [sorte, setSorte] = useState(product.name);
  const [bundle, setBundle] = useState(initialSetSize);
  useEffect(() => {
    setSorte(product.name);
    setBundle(initialSetSize);
  }, [navigationKey, product.name, initialSetSize]);
  const [storyOpen, setStoryOpen] = useState(false);
  const selectedOption = bundles.find((b) => b.label === bundle) ?? bundles[2];
  const selectedBundle = selectedOption.dosen === 1 ? { ...selectedOption, productName: sorte, id: sorte } : selectedOption;
  useViewContentPixel(selectedBundle.id, selectedBundle.productName, selectedBundle.price);

  return (
    <div className="min-h-screen" style={{ backgroundColor: LIGHTBLUE }}>
      <ProductPageMeta shop={shop} />
      <Navbar />

      <main className="product-page-design pt-24 md:pt-28 lg:pt-32">
        {/* ===== Product Hero: Gallery + Buy Panel ===== */}
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 lg:items-stretch">
          {/* Gallery – alle Produktbilder ohne Slider */}
          <div className="flex flex-col">
            <ProductPageMedia product={product} />
          </div>

          {/* Buy Panel */}
          <div className="flex flex-col h-full">
            {/* Titel + Subline */}
            <div className="text-left">
              <h1 className="font-barlow font-extrabold leading-[0.95] text-pop text-primary-foreground text-4xl sm:text-5xl lg:text-6xl mb-4">
                <span style={{ color: ORANGE }}>PEACH</span>{" "}
                <span style={{ color: "#ffd618" }}>PARTY</span>
              </h1>
              <p className="text-foreground/90 text-base md:text-lg font-bold leading-relaxed">
                Auch Mario wollte nur Peach. <br />Fruchtige Frische, einfach durchgespielt.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-6 justify-start">
              {["ohne Nikotin", "ohne Koffein", "echte Kräuter", "deutsche Marke"].map((b) => (
                <span key={b} className="bg-white border-2 border-black rounded-full px-2.5 py-1 text-[11px] font-bold shadow-[2px_2px_0_0_#000]">
                  {b}
                </span>
              ))}
            </div>

            {/* Bewertung */}
            <div className="flex items-center justify-start gap-2 mt-4">
              <LooxRating productId="10276796498262" />
            </div>

            <h2 className="font-barlow font-extrabold text-base mb-3">DEIN SET WÄHLEN</h2>
            <BundleSelector bundles={bundles} selected={bundle} onSelect={setBundle} selectedFlavor={sorte} onFlavorSelect={setSorte} className="mb-8" />

            <p className="text-xs font-bold leading-relaxed mb-4">
              {isAvailable(selectedBundle.productName) === false ? "Aktuell ausverkauft" : isAvailable(selectedBundle.productName) === true ? "Verfügbar ⚡ · AUF LAGER — in 2 bis 5 Werktagen bei dir" : "Lieferzeit: 2 bis 5 Werktage"} <span className="font-semibold text-muted-foreground">· inkl. MwSt.</span>
            </p>
            <button
              onClick={() => addSelection(selectedBundle)}
              ref={shop.ctaRef}
              disabled={isAvailable(selectedBundle.productName) === false}
              className="comic-btn w-full min-h-12 text-center py-3 font-extrabold text-sm sm:text-base"
              style={{ backgroundColor: "#ffd618", color: "#000" }}
            >
              IN DEN WARENKORB – {selectedBundle.price.toFixed(2).replace(".", ",")} €
            </button>
            <FreeShippingStatus selectedPrice={selectedBundle.price} />

            {/* Trust */}
            <ul className="pt-4 space-y-2 text-xs font-semibold">
              {["Versand mit DHL nach DE, AT und CH", "14 Tage Widerrufsrecht", "Sichere Zahlung mit PayPal, Klarna und Kreditkarte"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-3">
              <PaymentLogos compact size="md" />
            </div>
            <ProductPromise />

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
              WAS IST PEACH PARTY?
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
                    <p>Dose öffnen. Kurz riechen. AB AUF WOLKE 7. Wieder verschließen. Bei Bedarf wiederholen.</p>
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold uppercase tracking-wide text-foreground mb-1">Dein Moment</p>
                    <p>Beim Gaming für die nächste Runde. Beim Sport für den Moment zwischen zwei Sätzen. Am Schreibtisch, beim Streamen, unterwegs oder einfach zwischendurch, wenn du kurz einen neuen Refresh-Moment willst.</p>
                  </div>
                </div>
              </div>
              {/* Weiße Fläche 2: Was drin ist */}
              <ComicBox title="WAS DRIN IST" className="flex flex-col justify-center">
                <ul className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm sm:grid-cols-3 sm:gap-x-4">
                  {["Zitronengras", "Gewürznelke", "Weißdorn", "Süßholz", "Knöterichwurzel", "Osmanthusblüte", "Jasminblüte", "Menthol", "Pfirsicharoma"].map(
                    (ing, index, ingredients) => (
                      <li key={ing} className={`flex items-center gap-2 leading-snug ${ingredients.length % 2 === 1 && index === ingredients.length - 1 ? "col-span-2 justify-center sm:col-span-1 sm:justify-start" : ""}`}>
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
            <div className="max-w-3xl mx-auto mt-6 md:mt-8 text-center text-sm md:text-base text-foreground/80 leading-relaxed space-y-3">
              <p>Wenn du nur einen kurzen Refresh-Moment suchst, brauchst du dafür keinen Koffein-Drink.</p>
              <p className="font-bold text-foreground">Kein Energy Drink. Kein Kaffee. Kein Nikotin. Kein Getränk nötig.</p>
              <p>FOQUZ enthält kein Koffein – du entscheidest selbst, wann dein Moment beginnt und wann er vorbei ist.</p>
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
                  Die Idee von FOQUZ ist von Ya Dom – auch Yadom genannt – inspiriert, einem bekannten thailändischen Riechprodukt. In Thailand gehört Ya Dom für viele Menschen zum Alltag und ist klein genug, um überall dabei zu sein.
                </p>
              </div>
              <div className="text-center md:px-6">
                <p className="font-extrabold uppercase tracking-wide text-foreground mb-1">Neu interpretiert</p>
                <p>
                  Wir haben diese Idee neu interpretiert und auf Wolke 7 geschickt: mit fruchtigen Duftwelten, starken Designs und einem modernen Riech-Ritual für heute.
                </p>
              </div>
              <div className="text-center md:px-6">
                <p className="font-extrabold uppercase tracking-wide text-foreground mb-1">FOQUZ heute</p>
                <p>
                  Klassische Kräuter- und Mentholprofile treffen bei FOQUZ auf Sorten wie Peach Party, Lemon Breezy und Thai Style.
                </p>
              </div>
            </div>
            <p className="text-center font-bold text-foreground mt-6 md:mt-8">Keine Vape. Kein Nasenspray. Kein Arzneimittel.</p>
            <p className="text-center mt-3">
              FOQUZ ist ein Erfrischungsprodukt zum Riechen – ohne Nikotin und ohne Koffein. Ein neues Ritual für die nächste Runde, den nächsten Satz oder den kurzen Moment dazwischen.
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
                    Der Begriff setzt sich sinngemäß aus „ya“ für Medizin und „dom“ für riechen zusammen.
                  </p>
                  <p>
                    Bei unseren eigenen Straßeninterviews in Thailand kamen die fruchtigen FOQUZ-Düfte bei mehreren Befragten besonders gut an – gerade weil sie die klassische Duftwelt um moderne, fruchtige Noten erweitern.
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
        <section className="flex flex-col justify-center py-8 md:py-16 lg:py-20 overflow-hidden" style={{ backgroundColor: ORANGE }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
            <div className="pb-3">
            <div className="overflow-hidden transition-[height] duration-300 ease-out" style={{ height: compareSlideHeight }}>
            <div onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }} onTouchEnd={(e) => {
              if (touchStart.current === null) return;
              const distance = touchStart.current - e.changedTouches[0].clientX;
              if (Math.abs(distance) > 40) setActiveCompare((current) => (current + (distance > 0 ? 1 : -1) + comparisons.length) % comparisons.length);
              touchStart.current = null;
            }} className="flex items-start transition-transform duration-300 ease-out" style={{ transform: `translateX(-${activeCompare * 100}%)` }}>
              {comparisons.map((c, i) => (
                <div key={i} ref={(el) => { compareSlideRefs.current[i] = el; }} className="w-full shrink-0 px-2">
                   <h2 className="font-barlow font-extrabold text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl text-center text-black mb-5 md:mb-8 leading-none whitespace-nowrap">
                    {c.heading[0]}
                    {c.heading[1] && (
                      <>
                        <br />
                        {c.heading[1]}
                      </>
                    )}
                  </h2>
                   <div className="relative grid gap-4 lg:grid-cols-2 lg:gap-8 items-stretch">
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
                              <span className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0" style={{ backgroundColor: "#c9e8fb" }}>
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
                  {c.foquzFootnote && (
                    <p className="text-[11px] md:text-xs text-black/80 text-center mt-3 md:mt-4 leading-relaxed max-w-4xl mx-auto">
                      {c.foquzFootnote}
                    </p>
                  )}
                  {c.footnote && (
                    <p className="max-w-3xl mx-auto mt-3 md:mt-6 text-center text-[11px] md:text-xs font-semibold text-black/80 leading-snug">
                      {c.footnote}
                    </p>
                  )}
                </div>
              ))}
            </div>
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
            AB AUF WOLKE 7
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
                DEIN REFRESH-MOMENT. DIREKT BEIM RIECHEN.
              </h3>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-4">
                Dose auf. Kurz riechen. Ab auf Wolke 7.
              </p>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-4">
                FOQUZ ist eine Riechdose – kein Energy Drink, keine Vape und kein Nasenspray. Einfach vorsichtig unter die Nase halten, kurz riechen und wieder verschließen.
              </p>
              <ul className="space-y-3 text-sm md:text-base font-semibold">
                {["Schnell zur Hand", "Wiederverschließbar", "Passt in deine Hosentasche", "Ohne Nikotin. Ohne Koffein.", "Hält bis zu 4 Wochen", "Pflanzen und Aromen Mix*"].map((t) => (
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
                style={{ backgroundColor: ORANGE }}
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
                    "Natürliche Kräuter und ätherische Öle* – sonst nichts.",
                    "Mobil, wiederverschließbar & jederzeit griffbereit",
                    "Deutsche Marke, deutscher Versand & Support",
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
            <LooxReviews productId={shop.productId} embedded />
            <div className="text-center">
              <button
                onClick={addSingle}
                disabled={isAvailable(product.name) === false}
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
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
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
          <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              { name: "THAI STYLE", image: productImages.thai, href: "/produkte/thai-style" },
              { name: "LEMON BREEZY", image: productImages.lemon, href: "/produkte/lemon-breezy" },
            ].map((p) => (
              <div key={p.name} className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0_0_#000] overflow-hidden">
                <Link to={p.href} className="block overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="p-3 md:p-4 text-center">
                  <Link to={p.href}><h3 className="font-barlow font-extrabold mb-1 text-sm">{p.name}</h3></Link>
                  <p className="text-[11px] text-muted-foreground mb-2">{shop.priceFor(p.name)}</p>
                  <Link to={p.href}>
                    <button className="comic-btn w-full text-[10px] sm:text-[11px] py-2 px-2 font-extrabold" style={{ backgroundColor: "#ffd618", color: "#000" }}>
                      JETZT ENTDECKEN
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div ref={shop.footerRef}><Footer /></div>
      <ProductPageSticky shop={shop} selectedBundle={selectedBundle} />
    </div>
  );
};

const PeachParty = () => <PeachPartyInner />;

export default PeachParty;
