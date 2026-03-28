import { motion } from "framer-motion";
import foquzBox from "@/assets/foquz-box.png";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import bundleBg from "@/assets/bundle-bg.png";

const checks = [
  "Alle Sorten testen",
  "Exklusive Box",
  "28% Sparen",
  "Nasen Stripes und Sticker for free",
];

const BundleSection = () => {
  const { addToCart } = useCart();

  return (
    <section id="bundle"
      className="section-padding py-10 md:py-16 lg:py-32 relative overflow-hidden scroll-mt-20"
      style={{ backgroundColor: "#75559f", containerType: 'inline-size' }}
    >
      <style>{`
        @container (min-width: 1024px) {
          .bundle-headline { font-size: clamp(2.5rem, 3.5cqw, 3.5rem); line-height: 0.95; margin-bottom: clamp(0.5rem, 0.8cqw, 0.875rem); }
          .bundle-subtitle { font-size: clamp(1rem, 1.3cqw, 1.25rem); margin-bottom: clamp(0.25rem, 0.4cqw, 0.5rem); }
          .bundle-body { font-size: clamp(0.875rem, 1.1cqw, 1.125rem); margin-bottom: clamp(1rem, 1.5cqw, 1.5rem); }
          .bundle-checks { gap: clamp(0.375rem, 0.6cqw, 0.625rem); margin-bottom: clamp(1rem, 1.5cqw, 1.5rem); }
          .bundle-check-icon { width: clamp(1.125rem, 1.5cqw, 1.5rem); height: clamp(1.125rem, 1.5cqw, 1.5rem); font-size: clamp(0.5rem, 0.7cqw, 0.75rem); }
          .bundle-check-text { font-size: clamp(0.8rem, 0.95cqw, 1rem); }
          .bundle-price { font-size: clamp(1.75rem, 2.5cqw, 2.5rem); }
          .bundle-price-old { font-size: clamp(0.875rem, 1.1cqw, 1.125rem); }
          .bundle-price-row { gap: clamp(0.625rem, 1cqw, 1rem); margin-bottom: clamp(0.75rem, 1.2cqw, 1.25rem); }
          .bundle-btn { font-size: clamp(0.8rem, 1cqw, 1rem) !important; padding: clamp(0.4rem, 0.65cqw, 0.65rem) clamp(1.25rem, 2cqw, 2rem) !important; }
          .bundle-grid { gap: clamp(1.5rem, 2.5cqw, 2.5rem); }
        }
      `}</style>
      <img src={bundleBg} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="container mx-auto relative z-10">
        {/* Mobile: scarcity banner on top */}
        <div className="md:hidden flex items-center justify-center gap-1.5 mb-3">
          <span className="text-[#ffd618] text-sm">🔥</span>
          <span className="text-[#ffd618] font-black text-xs tracking-wide uppercase">
            Limitiert – Nur solange der Vorrat reicht!
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-4 lg:gap-12 items-center bundle-grid">
          {/* Left: Bundle visual */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
              <Link to="/produkt/starter-bundle">
                <img
                  src={foquzBox}
                  alt="FOQUZ Power Bundle Box"
                  loading="lazy"
                  className="w-full max-w-[80vw] md:max-w-[75vw] lg:max-w-[38cqw] mx-auto md:scale-130 lg:scale-100 hover:scale-[1.05] md:hover:scale-[1.35] lg:hover:scale-[1.05] transition-transform duration-300 drop-shadow-2xl"
                />
              </Link>
          </motion.div>

          {/* Right: Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-[50px] md:leading-[0.95] text-white mb-1 md:mb-4 bundle-headline">
              FOQUZ POWER BUNDLE
            </h2>
            <p className="text-white font-black text-base lg:text-xl mb-1 md:mb-2 bundle-subtitle">
              Eine Box. Voller Fokus.
            </p>
            <p className="text-white/80 text-sm lg:text-lg mb-2 lg:mb-8 max-w-lg bundle-body">
              Alle 3 Sorten in einer Box. Spare ganze <span className="font-black text-white">28%</span> und finde heraus, welcher FOQUZ dich am meisten auf Wolke 7 bringt.
            </p>

            {/* Checkpoints - 2 columns on mobile */}
            <div className="grid grid-cols-2 md:flex md:flex-col gap-1 lg:gap-3 mb-2 lg:mb-8 bundle-checks">
              {checks.map((c) => (
                <div key={c} className="flex items-center gap-1.5 lg:gap-3">
                  <span className="w-4 h-4 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-[10px] lg:text-sm font-black shrink-0 bundle-check-icon"
                    style={{ backgroundColor: "#ffd618" }}>
                    ✓
                  </span>
                  <span className="text-white font-semibold text-xs lg:text-base bundle-check-text">{c}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 lg:gap-4 mb-2 lg:mb-6 flex-wrap bundle-price-row">
              <span className="text-xl md:text-4xl font-black text-white bundle-price">Nur 14,99€</span>
              <span className="text-sm lg:text-lg text-white/60 line-through bundle-price-old">23,97€</span>
            </div>

            {/* CTA */}
            <button
              onClick={() =>
                addToCart(1, {
                  id: "starter-bundle",
                  name: "FOQUZ Power Bundle (3 Sorten)",
                  price: 14.99,
                  image: foquzBox,
                })
              }
              className="comic-btn text-xs md:text-lg py-2 px-6 md:py-3 md:px-10 font-black bundle-btn"
              style={{ backgroundColor: "#ffd618", color: "#000" }}
            >
              JETZT SPAR-BUNDLE SICHERN
            </button>
            {/* Scarcity banner - desktop only */}
            <div className="hidden md:inline-flex mt-4 lg:mt-6 items-center gap-2 px-4 py-2 rounded-full border-2 border-[#ffd618]/60" style={{ backgroundColor: 'rgba(255, 214, 24, 0.15)' }}>
              <span className="text-[#ffd618] text-lg">🔥</span>
              <span className="text-[#ffd618] font-black text-sm md:text-base tracking-wide uppercase">
                Limitiert – Nur solange der Vorrat reicht!
              </span>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BundleSection;
