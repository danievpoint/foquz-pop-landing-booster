import { useState, useEffect } from "react";

import heroBgAsset from "@/assets/hero-bg-v1.png.asset.json";
import heroMobileAsset from "@/assets/hero-mobile.png.asset.json";
import heroClouds from "@/assets/hero-clouds.svg";
import heroScene from "@/assets/hero-bg.svg";

const heroBg = heroBgAsset.url;
const heroMobile = heroMobileAsset.url;

const heroImagePromise = Promise.all(
  [heroBg, heroMobile].map(
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
      {!ready && <div className="w-full bg-background" style={{ aspectRatio: "1920 / 772" }} />}

      <div
        className="transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? "auto" : "none" }}
      >
        {/* === MOBILE / TABLET (< lg) — portrait hero using mobile PNG === */}
        <div className="lg:hidden relative w-full overflow-hidden" style={{ aspectRatio: "850 / 1500" }}>
          {/* Layer 1: Mobile PNG (contains cans + character) */}
          <img
            src={heroMobile}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* Layer 2: Clouds overlay at bottom */}
          <img
            src={heroClouds}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="absolute inset-x-0 bottom-0 w-full pointer-events-none"
          />
          <div className="relative z-10 w-full mx-auto px-4 sm:px-6 pt-20 sm:pt-24">
            <div className="flex flex-col">
              <h1 className="flex flex-col gap-[0.18em] sm:gap-[0.2em] text-4xl sm:text-5xl leading-[1.05] mb-2 sm:mb-4 text-primary-foreground text-pop whitespace-nowrap">
                <span className="block">KURZ RIECHEN.</span>
                <span className="block text-secondary">AB AUF WOLKE 7.</span>
              </h1>
              <p className="text-base sm:text-xl font-extrabold uppercase tracking-tight text-primary-foreground text-pop-sm mb-4 sm:mb-6 whitespace-nowrap">
                DU ENTSCHEIDEST WAS DU RIECHST
              </p>
              <div className="flex flex-col gap-2 sm:gap-3">
                <a
                  href="#bundle"
                  className="comic-btn !text-sm !py-2.5 !px-6 sm:!text-base sm:!py-3 sm:!px-8 font-black bg-secondary text-secondary-foreground w-fit"
                >
                  SPAR-BUNDLE HOLEN
                </a>
                <a
                  href="#sorten"
                  className="comic-btn !text-sm !py-2.5 !px-6 sm:!text-base sm:!py-3 sm:!px-8 font-black bg-card text-foreground w-fit"
                >
                  EINZELN KAUFEN
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* === DESKTOP (lg+) ===
          Spacer pushes hero below the fixed navbar+marquee (~124px).
          The nav has its own bg-[hsl(var(--foquz-lightblue))] background
          which matches the hero, so the visual transition is seamless.
          Now the ENTIRE hero is visible → SVG coordinates work universally. */}
        <div className="hidden lg:block">
          {/* Spacer: MarqueeBanner(28px) + Navbar(~72px) */}
          <div style={{ height: "100px" }} aria-hidden="true" />

          <div
            className="relative w-full overflow-hidden -mt-[2px]"
            style={{
              aspectRatio: "1920 / 772",
              containerType: "inline-size",
            }}
          >
            <style>{`
              @keyframes hero-float {
                0%, 100% { transform: translateY(-6px); }
                50% { transform: translateY(6px); }
              }
              .hero-title {
                display: flex;
                flex-direction: column;
                gap: 0.22em;
                font-size: 4.2cqw;
                line-height: 1.08;
                margin-bottom: 1cqw;
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

            {/* Layer 0: Original SVG scene (visible through transparent areas of PNG) */}
            <img
              src={heroScene}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />

            {/* Layer 1: Foreground PNG (has transparent regions) — floats gently */}
            <img
              src={heroBg}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top animate-[hero-float_3.4s_ease-in-out_infinite]"
            />


            {/* Layer 2: Clouds overlay */}
            <img
              src={heroClouds}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full pointer-events-none"
            />


            {/* Layer 3: Text + CTAs — pb pushes the vertical center upward */}
            <div className="absolute inset-0 z-10">
              <div className="h-full flex items-center" style={{ paddingBottom: "15%" }}>
                <div style={{ paddingLeft: "4%" }}>
                  <div aria-hidden="true" className="hero-title text-primary-foreground text-pop whitespace-nowrap font-extrabold uppercase tracking-tight">
                    <span className="block">KURZ RIECHEN.</span>
                    <span className="block text-secondary">AB AUF WOLKE 7.</span>
                  </div>
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
