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
      }),
  ),
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

  /*
    SVG COORDINATE MAPPING (from user-tuned values):
    - top: 6%  of 772  = 46px  → SVG y=46
    - right: 12% → right edge at 1920×0.88 = 1690 → SVG x = 1690 - 691 = 999
    - width: 36% of 1920 = 691px → SVG width=691

    Both the background SVG and this overlay SVG share
    viewBox="0 0 1920 772", so these coordinates are LOCKED
    to the same space. Impossible to drift apart.
  */

  return (
    <section className="relative overflow-hidden bg-background" style={{ zIndex: 1 }}>
      {!ready && <div className="w-full bg-background" style={{ minHeight: "max(700px, 75vh)" }} />}

      <div
        className="transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? "auto" : "none" }}
      >
        {/* === MOBILE / TABLET (< lg) === */}
        <div className="lg:hidden relative w-full" style={{ minHeight: "max(700px, 75vh)" }}>
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

        {/* === DESKTOP (lg+) ===
          NUCLEAR FIX: The product image is placed inside an SVG overlay
          that shares the EXACT SAME viewBox as the background SVG.
          Since both SVGs map to the same 1920×772 coordinate space,
          the product image is LOCKED to the ray burst position.
          This is mathematically guaranteed to look identical
          at 1024px, 1440px, 1920px, 2560px, and any other width.
        */}
        <div
          className="hidden lg:block relative w-full overflow-hidden"
          style={{
            aspectRatio: "1920 / 772",
            containerType: "inline-size",
          }}
        >
          <style>{`
            @keyframes hero-float {
              0%, 100% { transform: translateY(-8px); }
              50% { transform: translateY(8px); }
            }
            .hero-title {
              font-size: 4.2cqw;
              line-height: 1.1;
              margin-bottom: 0.8cqw;
            }
            .hero-subtitle {
              font-size: 1.3cqw;
              margin-bottom: 1.2cqw;
            }
            .hero-btn {
              font-size: 0.9cqw !important;
              padding: 0.65cqw 1.5cqw !important;
            }
            .hero-btn-row {
              gap: 1.2cqw;
            }
            .hero-product-svg {
              animation: hero-float 3.4s ease-in-out infinite;
              will-change: transform;
            }
          `}</style>

          {/* Layer 1: SVG background */}
          <img src={heroBg} alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 w-full h-full" />

          {/* Layer 2: Product image inside SVG overlay.
              Same viewBox as background = same coordinate system.
              x=999, y=46, width=691 are the user-tuned positions
              converted from percentages to SVG coordinates. */}
          <svg
            viewBox="0 0 1920 772"
            className="absolute inset-0 w-full h-full hero-product-svg"
            xmlns="http://www.w3.org/2000/svg"
            style={{ pointerEvents: "none" }}
          >
            <image href={heroJars} x="999" y="46" width="691" height="691" preserveAspectRatio="xMidYMid meet" />
          </svg>

          {/* Layer 3: Text + CTAs */}
          <div className="absolute inset-0 z-10">
            <div className="h-full flex items-center">
              <div style={{ paddingLeft: "4%" }}>
                <h1 className="hero-title text-primary-foreground text-pop whitespace-nowrap font-extrabold uppercase tracking-tight">
                  <span className="block">KURZ RIECHEN.</span>
                  <span className="block text-secondary">AB AUF WOLKE 7.</span>
                </h1>
                <p className="hero-subtitle font-extrabold uppercase tracking-tight text-primary-foreground text-pop-sm whitespace-nowrap">
                  DU ENTSCHEIDEST WAS DU RIECHST
                </p>
                <div className="flex flex-row hero-btn-row">
                  <a
                    href="#bundle"
                    className="comic-btn hero-btn font-black bg-secondary text-secondary-foreground w-fit whitespace-nowrap"
                  >
                    SPAR-BUNDLE HOLEN
                  </a>
                  <a
                    href="#sorten"
                    className="comic-btn hero-btn font-black bg-card text-foreground w-fit whitespace-nowrap"
                  >
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
