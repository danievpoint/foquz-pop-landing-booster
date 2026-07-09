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
        <div
          className="lg:hidden relative w-full overflow-hidden bg-foquz-lightblue"
          style={{ aspectRatio: "850 / 1500", containerType: "inline-size" }}
        >
          <style>{`
            .hero-m-title { font-size: 10cqw; line-height: 1.02; }
            .hero-m-sub   { font-size: 3.6cqw; }
            .hero-m-btn   { font-size: 3.2cqw !important; padding: 2.2cqw 5cqw !important; }
          `}</style>

          {/* Layer 0: SVG scene visible through transparent PNG regions */}
          <img
            src={heroScene}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="absolute inset-x-0 w-full object-cover object-top"
            style={{ top: "28%", height: "82%" }}
          />
          {/* Layer 1: Mobile PNG — top aligned so 3 cans + face visible, arm cropped at bottom */}
          <img
            src={heroMobile}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="absolute inset-x-0 w-full object-cover object-top"
            style={{ top: "28%", height: "82%" }}
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

          {/* Text + CTAs sit in the top blue band */}
          <div className="absolute inset-x-0 top-0 z-10 px-[5%]" style={{ paddingTop: "8%" }}>
            <h1 className="hero-m-title flex flex-col gap-[0.12em] text-primary-foreground text-pop whitespace-nowrap font-black uppercase">
              <span className="block">KURZ RIECHEN.</span>
              <span className="block text-secondary">AB AUF WOLKE 7.</span>
            </h1>
            <p className="hero-m-sub font-extrabold uppercase tracking-tight text-primary-foreground text-pop-sm whitespace-nowrap" style={{ marginTop: "2cqw", marginBottom: "3cqw" }}>
              DU ENTSCHEIDEST WAS DU RIECHST
            </p>
            <div className="flex flex-col" style={{ gap: "1.8cqw" }}>
              <a href="#bundle" className="comic-btn hero-m-btn font-black bg-secondary text-secondary-foreground w-fit whitespace-nowrap">
                SPAR-BUNDLE HOLEN
              </a>
              <a href="#sorten" className="comic-btn hero-m-btn font-black bg-card text-foreground w-fit whitespace-nowrap">
                EINZELN KAUFEN
              </a>
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
