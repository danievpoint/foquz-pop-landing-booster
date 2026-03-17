import { motion } from "framer-motion";
import heroJars from "@/assets/hero-products.png";
import heroBg from "@/assets/hero-bg.svg";

const HeroSection = () => {
  return (
    <section
      className="relative overflow-visible bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 lg:pt-40 xl:pt-48 pb-4 sm:pb-0">
        <div className="flex flex-col lg:flex-row lg:items-end">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-[40%] xl:w-[36%] pb-4 sm:pb-8 lg:pb-[28rem]"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] leading-[0.95] mb-3 sm:mb-5 md:mb-6 text-primary-foreground text-pop">
              DEIN FOKUS-<span className="text-secondary">UPGRADE.</span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[60px]">JEDERZEIT BEREIT.</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <a
                href="#bundle"
                className="comic-btn !text-sm !py-2.5 !px-6 sm:!text-base sm:!py-3 sm:!px-8 md:!text-lg font-black bg-secondary text-secondary-foreground w-fit"
              >
                SPAR-BUNDLE HOLEN
              </a>
              <a
                href="#sorten"
                className="comic-btn !text-sm !py-2.5 !px-6 sm:!text-base sm:!py-3 sm:!px-8 md:!text-lg font-black bg-card text-foreground w-fit"
              >
                EINZELN KAUFEN
              </a>
            </div>
          </motion.div>

          {/* Product image – sits at bottom, can overflow */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:w-[60%] xl:w-[64%] flex items-end justify-center lg:justify-end lg:mb-16"
          >
            <img
              src={heroJars}
              alt="FOQUZ Produkte – Watermelon Flex, Thai Style und Lemon Breezy"
              className="w-[115%] sm:w-[98%] md:w-[80%] lg:w-[62%] h-auto lg:-translate-y-72 animate-[breathe_3s_ease-in-out_infinite]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
