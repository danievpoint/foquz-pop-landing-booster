import { motion } from "framer-motion";
import foquzBox from "@/assets/foquz-box.png";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import StockBadge from "@/components/StockBadge";
import bundleBg from "@/assets/bundle-bg.png";
import { useProductAvailability } from "@/hooks/useProductAvailability";

const checks = [
  "Alle Sorten testen",
  "Exklusive Box",
  "28% Sparen",
  "Nasen Stripes und Sticker for free",
];

const BundleSection = () => {
  const { addToCart } = useCart();
  const { isAvailable } = useProductAvailability();

  return (
    <section id="bundle"
      className="section-padding py-10 md:py-16 lg:py-32 relative overflow-hidden scroll-mt-20"
      style={{ backgroundColor: "#75559f" }}
    >
      <img src={bundleBg} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-4 lg:gap-12 items-center">
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
                  alt="FOQUZ Starter Bundle Box"
                  loading="lazy"
                  className="w-full lg:w-full max-w-md lg:max-w-2xl mx-auto hover:scale-105 transition-transform duration-300 drop-shadow-2xl md:scale-110 lg:scale-125"
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
            <h2 className="text-3xl md:text-[50px] md:leading-[0.95] text-white mb-2 md:mb-4">
              FOQUZ POWER BUNDLE
            </h2>
            <p className="text-white font-black text-lg lg:text-xl mb-2">
              Eine Box. Voller Fokus.
            </p>
            <p className="text-white/80 text-base lg:text-lg mb-4 lg:mb-8 max-w-lg">
              Alle 3 Sorten in einer Box. Spare ganze 28% und finde heraus, welcher FOQUZ dich am meisten auf Wolke 7 bringt.
            </p>

            {/* Checkpoints */}
            <div className="flex flex-col gap-2 lg:gap-3 mb-4 lg:mb-8">
              {checks.map((c) => (
                <div key={c} className="flex items-center gap-2 lg:gap-3">
                  <span className="w-5 h-5 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-xs lg:text-sm font-black shrink-0"
                    style={{ backgroundColor: "#ffd618" }}>
                    ✓
                  </span>
                  <span className="text-white font-semibold text-sm lg:text-base">{c}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6 flex-wrap">
              <span className="text-2xl md:text-4xl font-black text-white">Nur 14,99€</span>
              <span className="text-base lg:text-lg text-white/60 line-through">23,97€</span>
              <StockBadge variant="light" available={isAvailable("Starter Bundle") ?? true} />
            </div>

            {/* CTA */}
            <button
              onClick={() =>
                addToCart(1, {
                  id: "starter-bundle",
                  name: "Starter Bundle (3 Sorten)",
                  price: 14.99,
                  image: foquzBox,
                })
              }
              className="comic-btn text-sm md:text-lg py-2.5 px-8 md:py-3 md:px-10 font-black"
              style={{ backgroundColor: "#ffd618", color: "#000" }}
            >
              JETZT SPAR-BUNDLE SICHERN
            </button>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BundleSection;
