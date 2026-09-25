import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { bundleProduct } from "@/data/products";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import { useCart } from "@/contexts/CartContext";
import StockBadge from "@/components/StockBadge";
import bundleBg from "@/assets/bundle-bg.png";
import foquzBundleClean from "@/assets/foquz-produkt-bundle-clean.webp.asset.json";

const foquzBox = foquzBundleClean.url;
const squadBox = "/images/product-pages/foquz_produkt_bundle_5er_breiter.webp";

const squads = [
  {
    id: "starter-bundle",
    link: "/produkt/starter-bundle",
    name: bundleProduct.name,
    image: foquzBox,
    imageAlt: "FOQUZ 3er Starter Bundle Box",
    // Seitenverhältnis passend zum Bild (1920×1586), damit nichts beschnitten wird.
    imageAspect: "1920 / 1586",
    imageClass: "hover:scale-105",
    title: "3ER STARTER BUNDLE",
    description:
      "Die drei Klassiker Peach Party, Lemon Breezy und Thai Style in einer Box. Finde deinen Lieblingsduft.",
    checks: ["3 Klassiker entdecken", "Exklusive Box", "3 Dosen im Set"],
    price: bundleProduct.price,
    oldPrice: bundleProduct.originalPrice,
    dosen: 1,
    cartPrice: bundleProduct.numericPrice,
    enabled: true,
  },
  {
    id: "squad-bundle",
    link: "/produkt/squad-bundle",
    name: "5ER SQUAD BUNDLE",
    image: squadBox,
    imageAlt: "FOQUZ 5er Squad Bundle",
    // Gleicher Rahmen und engerer Ausschnitt wie beim 3er, damit der Karton gleich groß wirkt.
    imageAspect: "1920 / 1586",
    imageClass: "scale-[1.45] hover:scale-150",
    title: "5ER SQUAD BUNDLE",
    description:
      "Dein Vorrat für die ganze Crew. Fünf Dosen, maximale Auswahl – damit nie einer leer ausgeht.",
    checks: ["5 Dosen voller Power", "Maximale Auswahl", "Nur solange der Vorrat reicht"],
    price: "34,90€",
    oldPrice: "37,45€",
    dosen: 1,
    cartPrice: 34.9,
    enabled: true,
  },
];

const BundleSection = () => {
  const { addToCart } = useCart();
  const { isAvailable } = useProductAvailability();

  return (
    <section id="bundle"
      className="section-padding py-12 md:py-20 lg:py-24 relative overflow-hidden scroll-mt-20"
      style={{ backgroundColor: "#75559f" }}
    >
      <img src={bundleBg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch -mx-2 sm:mx-0">
          {squads.map((bundle, i) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col w-full max-w-xl mx-auto lg:max-w-none lg:mx-0 rounded-2xl border-2 border-black bg-white/95 p-4 sm:p-6 lg:p-8"
              style={{ boxShadow: "8px 8px 0 #000" }}
            >
              {/* Bild oben */}
              {bundle.link ? (
                <Link to={bundle.link} className="flex items-center justify-center mb-4 md:mb-6 rounded-xl border-2 border-black overflow-hidden cursor-pointer" style={{ backgroundColor: "#ffd618", aspectRatio: bundle.imageAspect }}>
                  <img
                    src={bundle.image}
                    loading="lazy"
                    alt={bundle.imageAlt}
                    className={`h-full w-full object-cover transition-transform duration-300 ${bundle.imageClass}`}
                  />
                </Link>
              ) : (
                <div className="flex items-center justify-center mb-4 md:mb-6 rounded-xl border-2 border-black overflow-hidden" style={{ backgroundColor: "#ffd618", aspectRatio: bundle.imageAspect }}>
                  <img
                    src={bundle.image}
                    loading="lazy"
                    alt={bundle.imageAlt}
                    className={`h-full w-full object-cover transition-transform duration-300 ${bundle.imageClass}`}
                  />
                </div>
              )}

              {/* Text unten */}
              <div className="flex flex-col flex-1">
                <h2 className="text-2xl md:text-4xl font-black leading-none text-black mb-2 md:mb-3">
                  {bundle.link ? (
                    <Link to={bundle.link} className="hover:opacity-80 transition-opacity">{bundle.title}</Link>
                  ) : (
                    bundle.title
                  )}
                </h2>
                <p className="text-black/70 text-sm leading-relaxed lg:text-base mb-4 md:mb-6">
                  {bundle.description}
                </p>

                {/* Checkpoints */}
                <div className="flex flex-col gap-2 mb-4 md:mb-6">
                  {bundle.checks.map((c) => (
                    <div key={c} className="flex items-center gap-2 md:gap-3">
                      <span className="w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs md:text-sm font-black shrink-0 border-2 border-black"
                        style={{ backgroundColor: "#ffd618" }}>
                        ✓
                      </span>
                      <span className="text-black font-semibold text-sm lg:text-base">{c}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="mt-auto flex items-center gap-3 md:gap-4 mb-3 md:mb-5 flex-wrap">
                  <span className="text-xl md:text-3xl font-black text-black">{bundle.price ? `Nur ${bundle.price}` : "Bald verfügbar"}</span>
                  {bundle.oldPrice && <span className="text-sm md:text-lg text-black/50 line-through">{bundle.oldPrice}</span>}
                  {bundle.enabled && <StockBadge variant="dark" available={isAvailable(bundle.name)} />}
                </div>

                {/* CTA */}
                <button
                  onClick={() =>
                    bundle.enabled && bundle.cartPrice !== null && isAvailable(bundle.name) !== false && addToCart(1, {
                      id: bundle.id,
                      name: bundle.name,
                      price: bundle.cartPrice,
                      image: bundle.image,
                    })
                  }
                  disabled={!bundle.enabled || isAvailable(bundle.name) === false}
                  className="comic-btn disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-fit text-sm md:text-lg py-3 px-6 md:px-8 font-black text-center"
                  style={{ backgroundColor: "#ffd618", color: "#000" }}
                >
                  {bundle.enabled ? "JETZT SPAR-BUNDLE SICHERN" : "BALD VERFÜGBAR"}
                </button>
                {bundle.link && <Link
                  to={bundle.link}
                  className="mt-3 inline-block text-xs md:text-sm font-black uppercase underline underline-offset-4 text-black/70 hover:text-black"
                >
                  Details zum Bundle
                </Link>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BundleSection;
