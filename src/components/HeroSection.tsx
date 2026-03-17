import { motion } from "framer-motion";
import heroJars from "@/assets/hero-products.png";
import heroBg from "@/assets/hero-bg.svg";

const HeroSection = () => {
  return (
    <section className="relative overflow-visible">
      {/* Wrapper that lets the BG image define aspect ratio so product stays aligned to rays */}
      <div className="relative w-full">
        {/* BG image drives the container height naturally – no object-cover cropping */}
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="w-full h-auto block"
          style={{ minHeight: 'max(700px, 75vh)' }}
        />

        {/* Product image – positioned in same coordinate space as BG */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block absolute z-20"
          style={{ top: '13%', left: '52%', width: '30%' }}
        >
          <img
            src={heroJars}
            alt="FOQUZ Produkte – Watermelon Flex, Thai Style und Lemon Breezy"
            className="w-full h-auto animate-[breathe_3s_ease-in-out_infinite]"
          />
        </motion.div>

        {/* Text content – overlaid on the BG */}
        <div className="absolute inset-0 z-10 w-full">
          <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '12%' }}>
            <div className="flex flex-col lg:flex-row lg:items-start">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="lg:w-[40%] xl:w-[36%] pb-4 sm:pb-8"
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

              {/* Mobile product image */}
              <div className="lg:hidden">
                <img
                  src={heroJars}
                  alt="FOQUZ Produkte – Watermelon Flex, Thai Style und Lemon Breezy"
                  className="w-[115%] sm:w-[98%] md:w-[80%] h-auto animate-[breathe_3s_ease-in-out_infinite]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
