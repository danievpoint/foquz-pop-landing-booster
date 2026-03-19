import { useState, useEffect } from "react";
import heroJars from "@/assets/hero-products.png";
import heroBg from "@/assets/hero-bg.svg";

// Preload hero images as early as possible
const heroImagePromise = Promise.all(
  [heroBg, heroJars].map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      })
  )
);

export const useHeroReady = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    heroImagePromise.then(() => setReady(true));
  }, []);
  return ready;
};

const HeroSection = () => {
  const ready = useHeroReady();

  return (
    <section className="relative overflow-visible -mt-0 pt-0" style={{ marginTop: 0, paddingTop: 0 }}>
      {!ready && (
        <div className="w-full bg-background" style={{ minHeight: 'max(700px, 75vh)' }} />
      )}

      <div
        className="transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? "auto" : "none" }}
      >
        {/* === MOBILE / TABLET (< lg) === */}
        <div className="lg:hidden relative w-full" style={{ minHeight: 'max(700px, 75vh)' }}>
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 pt-28 sm:pt-32 md:pt-36 pb-4 sm:pb-0">
            <div className="flex flex-col">
              <div className="pb-4 sm:pb-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-2 sm:mb-4 md:mb-5 text-primary-foreground text-pop whitespace-nowrap">
                  <span className="block">KURZ RIECHEN.</span>
                  <span className="block text-secondary">AB AUF WOLKE 7.</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl font-extrabold uppercase tracking-tight text-primary-foreground text-pop-sm mb-3 sm:mb-5 md:mb-6 whitespace-nowrap">
                  DU ENTSCHEIDEST WAS DU RIECHST
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <a href="#bundle" className="comic-btn !text-sm !py-2.5 !px-6 sm:!text-base sm:!py-3 sm:!px-8 md:!text-lg font-black bg-secondary text-secondary-foreground w-fit">
                    SPAR-BUNDLE HOLEN
                  </a>
                  <a href="#sorten" className="comic-btn !text-sm !py-2.5 !px-6 sm:!text-base sm:!py-3 sm:!px-8 md:!text-lg font-black bg-card text-foreground w-fit">
                    EINZELN KAUFEN
                  </a>
                </div>
              </div>
              <div className="md:flex md:justify-center">
                <img
                  src={heroJars}
                  alt="FOQUZ Produkte – Watermelon Flex, Thai Style und Lemon Breezy"
                  fetchPriority="high"
                  className="w-[115%] sm:w-[98%] md:w-[70%] h-auto animate-[breathe_3s_ease-in-out_infinite]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* === DESKTOP (lg+) === */}
        <div className="hidden lg:block relative w-full overflow-visible">
          {/* SVG defines the natural height */}
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="w-full h-auto block"
          />

          {/* Products – locked to SVG via matching percentages */}
          <div className="absolute z-20 hero-product-img">
            <img
              src={heroJars}
              alt="FOQUZ Produkte – Watermelon Flex, Thai Style und Lemon Breezy"
              fetchPriority="high"
              className="w-full h-auto animate-[breathe_3s_ease-in-out_infinite]"
            />
          </div>

          {/* Text overlay */}
          <div className="absolute inset-0 z-10 w-full">
            <div className="w-full max-w-[1800px] mx-auto px-8" style={{ paddingTop: '8%' }}>
              <div className="w-[40%] xl:w-[36%]">
                <h1 className="text-[clamp(3rem,5vw,5rem)] leading-[0.95] mb-4 text-primary-foreground text-pop whitespace-nowrap">
                  <span className="block">KURZ RIECHEN.</span>
                  <span className="block text-secondary">AB AUF WOLKE 7.</span>
                </h1>
                <p className="text-[clamp(0.9rem,1.6vw,1.35rem)] text-primary-foreground text-pop mb-6 whitespace-nowrap">
                  DU ENTSCHEIDEST WAS DU RIECHST
                </p>
                <div className="flex flex-row gap-[clamp(0.75rem,1.5vw,1.5rem)]">
                  <a href="#bundle" className="comic-btn !text-[clamp(0.75rem,1.1vw,1.125rem)] !py-[clamp(0.5rem,1vw,0.875rem)] !px-[clamp(1rem,2vw,2rem)] font-black bg-secondary text-secondary-foreground w-fit whitespace-nowrap">
                    SPAR-BUNDLE HOLEN
                  </a>
                  <a href="#sorten" className="comic-btn !text-[clamp(0.75rem,1.1vw,1.125rem)] !py-[clamp(0.5rem,1vw,0.875rem)] !px-[clamp(1rem,2vw,2rem)] font-black bg-card text-foreground w-fit whitespace-nowrap">
                    EINZELN KAUFEN
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
