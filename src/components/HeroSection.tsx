import { motion } from "framer-motion";
import heroJars from "@/assets/hero-products.png";
import heroBg from "@/assets/hero-bg.svg";

const HeroSection = () => {
  return (
    <section
      className="relative overflow-visible bg-cover"
      style={{ backgroundImage: `url(${heroBg})`, aspectRatio: '16 / 7', backgroundPosition: 'center 500%' }}
    >
      {/* Text content – absolute so it's always top-left */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="absolute top-[18%] left-[4%] z-20"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] leading-[0.95] mb-3 sm:mb-5 md:mb-6 text-primary-foreground text-pop">
          DEIN FOKUS-
          <br />
          <span className="text-secondary">UPGRADE.</span>
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

      {/* Product image – absolute, centered on the rays, 30% smaller */}
      <motion.img
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        src={heroJars}
        alt="FOQUZ Produkte – Watermelon Flex, Thai Style und Lemon Breezy"
        className="absolute z-10 w-[26.6%] h-auto animate-[breathe_3s_ease-in-out_infinite]"
        style={{ top: '12%', left: '60%', transform: 'translateX(-20%)' }}
      />
    </section>
  );
};

export default HeroSection;
