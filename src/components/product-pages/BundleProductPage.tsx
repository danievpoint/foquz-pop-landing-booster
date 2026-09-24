import { useState } from "react";
import { useViewContentPixel } from "@/hooks/useViewContentPixel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProductPage } from "@/hooks/useProductPage";
import { FreeShippingStatus, ProductPageMedia, ProductPageMeta, ProductPageSticky, ProductPromise } from "@/components/product-pages/ShopIntegration";
import { BundleSelector } from "@/components/product-pages/BundleSelector";
import LooxRating from "@/components/LooxRating";
import LooxReviews from "@/components/LooxReviews";
import { Check, ChevronDown } from "lucide-react";
import PaymentLogos from "@/components/PaymentLogos";
const howToStep1 = { url: "/images/product-pages/how-to-step-1.svg" };
const howToStep2 = { url: "/images/product-pages/how-to-step-2.svg" };
const howToStep3 = { url: "/images/product-pages/how-to-step-3.svg" };

export interface BundleProductConfig {
  titleTop: string;
  titleBottom: string;
  titleTopColor: string;
  titleBottomColor: string;
  bgColor: string;
  cardColor: string;
  reviewsBgColor?: string;
  tagline: string;
  description: string;
  introBannerImage?: string;
  introBannerImageAlt?: string;
  introImage?: string;
  introImageAlt?: string;
  introHeadline?: string;
  introText?: string;
  contents: { name: string; desc: string; img: string }[];
  checks: string[];
  faqs: { q: string; a: string }[];
}


const BundleProductInner = ({ config }: { config: BundleProductConfig }) => {
  const shop = useProductPage("starter-bundle");
  const { product, bundles, addSelection, isAvailable } = shop;
  const [bundle, setBundle] = useState("6 DOSEN");
  const [sorte, setSorte] = useState("PEACH PARTY");
  const selectedOption = bundles.find((option) => option.label === bundle) ?? bundles[2];
  const selectedBundle = selectedOption.dosen === 1 ? { ...selectedOption, productName: sorte, id: sorte } : selectedOption;
  useViewContentPixel(selectedBundle.id, selectedBundle.productName, selectedBundle.price);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.bgColor }}>
      <ProductPageMeta shop={shop} />
      <Navbar />

      <main className="product-page-design pt-24 md:pt-28 lg:pt-32">
        {/* ===== Product Hero: Gallery + Buy Panel ===== */}
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 lg:items-stretch">
            {/* Gallery */}
            <div className="flex flex-col">
              <ProductPageMedia product={product} includeProductImage maxImages={Infinity} />
            </div>

            {/* Buy Panel */}
            <div className="flex flex-col h-full">
              {/* Titel + Subline */}
              <div className="text-left">
                <h1 className="font-barlow font-extrabold leading-[0.95] text-pop text-primary-foreground text-4xl sm:text-5xl lg:text-6xl mb-4">
                  <span style={{ color: config.titleTopColor }}>{config.titleTop}</span>{" "}
                  <span style={{ color: config.titleBottomColor }}>{config.titleBottom}</span>
                </h1>
                <p className="text-foreground/90 text-base md:text-lg font-bold leading-relaxed">
                  {config.tagline}
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
                <LooxRating productId={shop.productId} />
              </div>

              <h2 className="font-barlow font-extrabold text-base mb-3">DEIN SET WÄHLEN</h2>
              <BundleSelector bundles={bundles} selected={bundle} onSelect={setBundle} selectedFlavor={sorte} onFlavorSelect={setSorte} className="mb-6" />

              {/* Checkpoints */}
              <ul className="space-y-2 mb-5">
                {config.checks.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-sm md:text-base font-bold">
                    <span className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shrink-0" style={{ backgroundColor: "#ffd618" }}>
                      <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>

              <p className="text-xs font-bold leading-relaxed mb-4">
                {isAvailable(product.name) === false ? "Aktuell ausverkauft" : isAvailable(product.name) === true ? "Verfügbar ⚡ · AUF LAGER — in 2 bis 5 Werktagen bei dir" : "Lieferzeit: 2 bis 5 Werktage"} <span className="font-semibold text-muted-foreground">· inkl. MwSt.</span>
              </p>
              <button
                ref={shop.ctaRef}
                disabled={isAvailable(selectedBundle.productName) === false}
                onClick={() => addSelection(selectedBundle)}
                className="comic-btn w-full min-h-12 text-center py-3 font-extrabold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#ffd618", color: "#000" }}
              >
                IN DEN WARENKORB – {selectedBundle.price.toFixed(2).replace(".", ",")} €
              </button>
              <FreeShippingStatus selectedPrice={selectedBundle.price} />

              {/* Trust */}
              <ul className="pt-4 space-y-2 text-xs font-semibold">
                {["Versand mit DHL nach DE, AT und CH", "14 Tage Widerrufsrecht", "Sichere Zahlung mit PayPal, Google Pay und Kreditkarte"].map((t) => (
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

        {/* ===== Intro Banner ===== */}
        {config.introBannerImage && (
          <section className="w-full">
            <img
              src={config.introBannerImage}
              alt={config.introBannerImageAlt ?? "Bundle Banner"}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </section>
        )}

        {/* ===== Intro Image + Text ===== */}
        {(config.introImage || config.introHeadline || config.introText) && (
          <section className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 pt-10 md:pt-14 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
              {config.introImage && (
                <div className="rounded-3xl border-4 border-black shadow-[8px_8px_0_0_#000] overflow-hidden">
                  <img
                    src={config.introImage}
                    alt={config.introImageAlt ?? "Bundle Inhalt"}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              {(config.introHeadline || config.introText) && (
                <div>
                  {config.introHeadline && (
                    <h2 className="font-barlow font-extrabold section-title mb-4 md:mb-6 leading-none">
                      {config.introHeadline}
                    </h2>
                  )}
                  {config.introText && (
                    <p className="text-sm sm:text-base md:text-lg font-bold leading-relaxed whitespace-pre-line text-foreground text-left">
                      {config.introText}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ===== Was ist drin ===== */}
        <section className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 py-12 md:py-16 lg:py-20">
          <div className="rounded-3xl border-4 border-black shadow-[8px_8px_0_0_#000] p-5 sm:p-8 lg:p-10" style={{ backgroundColor: config.cardColor }}>
            <h2 className="font-barlow font-extrabold section-title text-center mb-6 md:mb-8 leading-none">
              WAS IST DRIN
            </h2>
            <p className="text-center text-sm md:text-base text-foreground/80 leading-relaxed mb-6 md:mb-8">
              {config.description}
            </p>
            <div className={`grid gap-4 md:gap-6 ${config.contents.length > 3 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-3"}`}>
              {config.contents.map((c) => (
                <div key={c.name} className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0_0_#000] p-4 flex flex-col items-center text-center">
                  <img src={c.img} alt={c.name} className="w-full aspect-square object-cover rounded-xl border-2 border-black mb-3" loading="lazy" />
                  <span className="font-barlow font-extrabold text-sm leading-tight">{c.name}</span>
                  <span className="text-xs text-muted-foreground font-semibold mt-1">{c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== How to ===== */}
        <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
          <h2 className="font-barlow font-extrabold section-title text-center mb-6 md:mb-8 leading-none">HOW TO FOQUZ</h2>
          <ul className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 items-start justify-items-center max-w-xl mx-auto">
            {[
              { title: "1. DOSE AUF", icon: howToStep1 },
              { title: "2. NASE DRAUF", icon: howToStep2 },
              { title: "3. AB AUF WOLKE 7", icon: howToStep3 },
            ].map((s) => (
              <li key={s.title} className="flex flex-col items-center gap-2 text-sm sm:text-base font-semibold leading-snug">
                <img src={s.icon.url} alt={s.title} className="w-16 h-16 md:w-24 md:h-24 shrink-0 object-contain" loading="lazy" />
                <span className="block font-extrabold">{s.title}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Reviews ===== */}
        <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: config.reviewsBgColor ?? config.cardColor }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-barlow font-extrabold section-title text-center text-black mb-8 leading-none">
              DAS SAGEN UNSERE KUNDEN
            </h2>
            <LooxReviews productId={shop.productId} embedded />
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <h2 className="font-barlow font-extrabold section-title text-center mb-8 leading-none">FAQ</h2>
          <div className="space-y-3">
            {config.faqs.map((f, i) => (
              <div key={i} className="rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000]">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 font-barlow font-extrabold text-left text-sm md:text-base"
                >
                  {f.q}
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="px-4 pb-4 text-sm md:text-base text-foreground/80 leading-relaxed">{f.a}</p>
                )}
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

const BundleProductPage = ({ config }: { config: BundleProductConfig }) => (
  <BundleProductInner config={config} />
);

export default BundleProductPage;
