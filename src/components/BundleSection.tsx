import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FIXED_BUNDLES, bundleContentsText, BUNDLE_PRICES, BUNDLE_COMPARE_AT } from "@/data/products";
import StockBadge from "@/components/StockBadge";
import { useBundleStatus, ensureFlavorStock, useActiveBundles } from "@/lib/setMix";
import { useEffect } from "react";
import bundleBg from "@/assets/bundle-bg.webp";

const makeSquads = (items: typeof FIXED_BUNDLES) => items.map((b) => ({
  id: b.handle,
  size: b.size,
  link: `/produkt/${b.handle}`,
  image: b.image,
  imageAlt: `FOQUZ ${b.name} – ${b.size}er Box`,
  imageAspect: "1 / 1",
  imageClass: "hover:scale-105",
  title: b.name.includes("BUNDLE") ? b.name : `${b.size}ER ${b.name}`,
  description: `${bundleContentsText(b)}.`,
  checks: [`${b.size} Dosen · feste Zusammenstellung`, "Sticker & Nasen-Stripes inklusive"],
}));

function BundleStock({ size }: { size: number | string }) {
  const status = useBundleStatus(size);
  return status === "available" ? <StockBadge variant="dark" available={true} /> : status === "unavailable" ? <span className="text-xs font-black text-black/70">Gerade nicht vollständig lieferbar</span> : null;
}

const BundleSection = () => {
  const squads = makeSquads(useActiveBundles());
  useEffect(() => { ensureFlavorStock(); }, []);

  return (
    <section id="bundle"
      className="section-padding py-12 md:py-20 lg:py-24 relative overflow-hidden scroll-mt-20"
      style={{ backgroundColor: "#75559f" }}
    >
      <img src={bundleBg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch -mx-2 sm:mx-0">
          {squads.map((bundle, i) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col w-full max-w-xl mx-auto lg:max-w-none lg:mx-0 rounded-2xl border-2 border-black bg-white/95 p-4 sm:p-6 lg:p-5"
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
                <h2 className="text-2xl md:text-3xl font-black leading-none text-black mb-2 md:mb-3">
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
                <div className="mt-auto flex flex-col gap-1 mb-3 md:mb-5">
                  <div className="flex items-center gap-3 md:gap-4 mb-0 flex-wrap">
                    <span className="text-xl md:text-3xl font-black text-black">{BUNDLE_PRICES[bundle.size].toFixed(2).replace(".", ",")} €</span>
                    <span className="text-sm md:text-base font-semibold text-black/50 line-through">{BUNDLE_COMPARE_AT[bundle.size]}</span>
                    <BundleStock size={bundle.id} />
                  </div>
                </div>

                {/* CTA: führt auf die Bundle-Seite */}
                <Link
                  to={bundle.link}
                  className="comic-btn w-full sm:w-fit text-sm py-3 px-4 font-black text-center"
                  style={{ backgroundColor: "#ffd618", color: "#000" }}
                >
                  BUNDLE ANSEHEN
                </Link>
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
