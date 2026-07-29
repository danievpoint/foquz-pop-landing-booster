import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

import HeroPromoBanner from "@/components/HeroPromoBanner";
import heroBgAsset from "@/assets/hero-bg-v1.png.asset.json";
import heroProducts from "@/assets/hero-products.png";
import heroClouds from "@/assets/hero-clouds.svg";
import heroScene from "@/assets/hero-bg.svg";


// Desktop uses the layered PNG scene; mobile/tablet uses the original SVG background + product jars PNG.
const heroBgDesktop = heroBgAsset.url;
const heroBgMobile = heroScene; // hero-bg.svg
const heroJars = heroProducts; // hero-products.png (3 cans)

const heroImagePromise = Promise.all(
  [heroBgDesktop, heroProducts, heroClouds, heroScene].map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      }),
  ),
);

// Wait for web fonts (Barlow / Bangers) so we never flash a fallback font (FOUT).
const heroFontsPromise: Promise<unknown> =
  typeof document !== "undefined" && "fonts" in document
    ? Promise.all([
        (document as any).fonts.load("400 1em Barlow"),
        (document as any).fonts.load("600 1em Barlow"),
        (document as any).fonts.load("700 1em Barlow"),
        (document as any).fonts.load("800 1em Barlow"),
        (document as any).fonts.load("900 1em Barlow"),
        (document as any).fonts.load("400 1em Bangers"),
        (document as any).fonts.ready,
      ]).catch(() => undefined)
    : Promise.resolve();

const heroReadyPromise = Promise.all([heroImagePromise, heroFontsPromise]);

export const useHeroReady = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    heroReadyPromise.then(() => setReady(true));
  }, []);
  return ready;
};

const HeroSection = () => {
  const ready = useHeroReady();

  return (
    <section className="relative overflow-hidden bg-background" style={{ zIndex: 1 }}>
      {!ready && <div className="w-full bg-background" style={{ minHeight: "max(700px, 75vh)" }} />}

      <div
        className="transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? "auto" : "none" }}
      >
        {/* === MOBILE / TABLET (< lg) — restored to state before "guy" PNG === */}
        <div className="lg:hidden relative w-full" style={{ minHeight: "max(700px, 75vh)" }}>
          <HeroPromoBanner className="absolute left-0 right-0 top-[calc(var(--safe-area-top)+var(--marquee-height)+63px)] sm:top-[calc(var(--safe-area-top)+var(--marquee-height)+71px)]" />
          <img
            src={heroBgMobile}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 pt-40 sm:pt-44 md:pt-48 pb-4 sm:pb-0">
            <div className="flex flex-col">
              <div className="pb-4 sm:pb-8">
                <h1 className="flex flex-col gap-[0.18em] sm:gap-[0.2em] md:gap-[0.22em] text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-2 sm:mb-4 md:mb-5 text-primary-foreground text-pop whitespace-nowrap">
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
              <Link to="/produkt/starter-bundle" className="md:flex md:justify-center">
                <img
                  src={heroJars}
                  alt="FOQUZ Produkte – Watermelon Flex, Thai Style und Lemon Breezy"
                  loading="eager"
                  decoding="async"
                  className="w-[115%] sm:w-[98%] md:w-[70%] h-auto animate-[breathe_3s_ease-in-out_infinite] cursor-pointer"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* === DESKTOP (lg+) — unchanged from today's version === */}
        <div className="hidden lg:block">
          {/* Spacer: MarqueeBanner(28px) + Navbar(~72px) */}
          <div className="relative" style={{ height: "100px" }} aria-hidden="true" />

          <div
            className="relative w-full overflow-hidden -mt-[2px]"
            style={{
              aspectRatio: "1920 / 772",
              containerType: "inline-size",
            }}
          >
            <HeroPromoBanner className="absolute left-0 right-0 top-0" />



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

            {/* Layer 0: Original SVG scene */}
            <img
              src={heroScene}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />

            {/* Layer 1: Foreground PNG (floats gently) */}
            <img
              src={heroBgDesktop}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top animate-[hero-float_3.4s_ease-in-out_infinite]"
              style={{ transform: "scale(0.92)", transformOrigin: "top center" }}
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

            {/* Layer 3: Text + CTAs */}
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
