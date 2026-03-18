import { motion } from "framer-motion";
import heroJars from "@/assets/hero-products.png";
import heroBg from "@/assets/hero-bg.svg";

const HeroSection = () => {
  return (
    <section className="relative overflow-visible">
      {/* === MOBILE / TABLET (< lg) === */}
      <div className="lg:hidden relative w-full" style={{ minHeight: 'max(700px, 75vh)' }}>
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 pt-28 sm:pt-32 md:pt-36 pb-4 sm:pb-0">
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="pb-4 sm:pb-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-3 sm:mb-5 md:mb-6 text-primary-foreground text-pop">
                DEIN FOKUS-<br /><span className="text-secondary">UPGRADE.</span>
                <br />
                <span className="text-3xl sm:text-4xl md:text-5xl">JEDERZEIT BEREIT.</span>
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
            <div className="md:flex md:justify-center">
              <img
                src={heroJars}
                alt="FOQUZ Produkte – Watermelon Flex, Thai Style und Lemon Breezy"
                className="w-[115%] sm:w-[98%] md:w-[70%] h-auto animate-[breathe_3s_ease-in-out_infinite]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* === DESKTOP (lg+) – fixed height, BG covers === */}
      <div className="hidden lg:block relative w-full h-[100vh] min-h-[700px] max-h-[1000px] -mt-[60px] pt-[60px]">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Product image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute z-20 right-[8%] top-1/2 -translate-y-[45%] w-[32%] max-w-[550px]"
        >
          <img
            src={heroJars}
            alt="FOQUZ Produkte – Watermelon Flex, Thai Style und Lemon Breezy"
            className="w-full h-auto animate-[breathe_3s_ease-in-out_infinite]"
          />
        </motion.div>

        {/* Text content */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="w-full max-w-[1800px] mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="w-[45%] xl:w-[40%]"
            >
              <h1 className="text-[clamp(3rem,5vw,5rem)] leading-[0.95] mb-6 text-primary-foreground text-pop">
                DEIN FOKUS-<br /><span className="text-secondary">UPGRADE.</span>
                <br />
                <span className="text-[clamp(2.5rem,4vw,3.75rem)]">JEDERZEIT BEREIT.</span>
              </h1>
              <div className="flex flex-row gap-[clamp(0.75rem,1.5vw,1.5rem)]">
                <a
                  href="#bundle"
                  className="comic-btn !text-[clamp(0.75rem,1.1vw,1.125rem)] !py-[clamp(0.5rem,1vw,0.875rem)] !px-[clamp(1rem,2vw,2rem)] font-black bg-secondary text-secondary-foreground w-fit whitespace-nowrap"
                >
                  SPAR-BUNDLE HOLEN
                </a>
                <a
                  href="#sorten"
                  className="comic-btn !text-[clamp(0.75rem,1.1vw,1.125rem)] !py-[clamp(0.5rem,1vw,0.875rem)] !px-[clamp(1rem,2vw,2rem)] font-black bg-card text-foreground w-fit whitespace-nowrap"
                >
                  EINZELN KAUFEN
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
