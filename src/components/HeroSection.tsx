import { useState, useEffect } from "react";
import heroJars from "@/assets/hero-products.png";
import heroBg from "@/assets/hero-bg.svg";

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

/*
  WHY PREVIOUS APPROACHES FAILED:

  The nav is ~107px tall in FIXED PIXELS. The hero scales with screen width.
  At 1440px wide → hero is 579px tall → nav covers 18.5% = 143 SVG units
  At 1920px wide → hero is 772px tall → nav covers 13.9% = 107 SVG units
  At 2560px wide → hero is 1029px tall → nav covers 10.4% = 80 SVG units

  No single SVG y-coordinate can compensate for all three because the nav
  eats a DIFFERENT percentage on each screen. This is mathematically unsolvable
  with a fixed y-value.

  THE FIX: Push the hero below the nav with a spacer. Now the nav covers 0%
  on every screen, and y=55 means y=55 everywhere — truly universal.
*/

const HeroSection = () => {
  const ready = useHeroReady();

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
                <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.15] mb-2 sm:mb-4 md:mb-5 text-primary-foreground text-pop whitespace-nowrap">
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
          Spacer pushes hero below the fixed navbar+marquee (~107px).
          The nav has its own bg-[hsl(var(--foquz-lightblue))] background
          which matches the hero, so the visual transition is seamless.
          Now the ENTIRE hero is visible → SVG coordinates work universally. */}
        <div className="hidden lg:block">
          {/* Spacer: MarqueeBanner(~32px) + Navbar(~78px) = ~110px */}
          <div style={{ height: "110px" }} aria-hidden="true" />

          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "1920 / 772",
              containerType: "inline-size",
            }}
          >
            <style>{`
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
            `}</style>

            {/* Layer 1: Background SVG */}
            <img
              src={heroBg}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full"
            />

            {/* Layer 2: Product image in SVG overlay.
                Same viewBox as background = locked coordinates.
                Now that the hero starts below the nav, y=55 is truly
                55 SVG units from the TOP OF THE VISIBLE AREA on every screen.
                Float ±12: range 43–67 at top, 703–727 at bottom. All inside 0–772. */}
            <svg
              viewBox="0 0 1920 772"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              style={{ pointerEvents: "none" }}
            >
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0 -12; 0 12; 0 -12"
                  dur="3.4s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                />
                <image href={heroJars} x="1010" y="55" width="660" height="660" preserveAspectRatio="xMidYMid meet" />
              </g>
            </svg>

            {/* Layer 3: Text + CTAs — pb pushes the vertical center upward */}
            <div className="absolute inset-0 z-10">
              <div className="h-full flex items-center" style={{ paddingBottom: "15%" }}>
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
      </div>
    </section>
  );
};

export default HeroSection;
