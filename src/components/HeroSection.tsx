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
        <div className="hidden lg:block relative w-full overflow-hidden" style={{ aspectRatio: '2.5 / 1' }}>
          {/* SVG background fills container */}
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />

          {/* Products – fluid safe area for large desktop screens */}
          <div
            className="absolute z-20 flex items-end justify-center pointer-events-none"
            style={{
              top: "clamp(6rem, 7vw, 9.5rem)",
              left: "47%",
              bottom: "clamp(0.75rem, 1.6vw, 1.75rem)",
              width: "clamp(31rem, 40vw, 56rem)",
            }}
          >
            <img
              src={heroJars}
              alt="FOQUZ Produkte – Watermelon Flex, Thai Style und Lemon Breezy"
              fetchPriority="high"
              className="w-full max-h-full h-auto object-contain origin-bottom animate-[breathe_3s_ease-in-out_infinite]"
            />
          </div>

          {/* Text overlay – vertically centered in container */}
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="pl-[6%]">
              <h1 className="text-[clamp(2.5rem,4.2vw,4.5rem)] leading-[0.95] mb-[0.8vw] text-primary-foreground text-pop whitespace-nowrap">
                <span className="block">KURZ RIECHEN.</span>
                <span className="block text-secondary">AB AUF WOLKE 7.</span>
              </h1>
              <p className="text-[clamp(0.9rem,1.4vw,1.4rem)] font-extrabold uppercase tracking-tight text-primary-foreground text-pop-sm mb-[1.2vw] whitespace-nowrap">
                DU ENTSCHEIDEST WAS DU RIECHST
              </p>
              <div className="flex flex-row gap-[clamp(0.75rem,1.2vw,1.5rem)]">
                <a href="#bundle" className="comic-btn !text-[clamp(0.7rem,0.9vw,1rem)] !py-[clamp(0.4rem,0.7vw,0.75rem)] !px-[clamp(0.8rem,1.5vw,1.75rem)] font-black bg-secondary text-secondary-foreground w-fit whitespace-nowrap">
                  SPAR-BUNDLE HOLEN
                </a>
                <a href="#sorten" className="comic-btn !text-[clamp(0.7rem,0.9vw,1rem)] !py-[clamp(0.4rem,0.7vw,0.75rem)] !px-[clamp(0.8rem,1.5vw,1.75rem)] font-black bg-card text-foreground w-fit whitespace-nowrap">
                  EINZELN KAUFEN
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
