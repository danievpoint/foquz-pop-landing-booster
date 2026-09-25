import { useState, useEffect, useRef } from "react";
import { scrollToSection } from "@/lib/scrollToSection";
import "./HeroSection.css";

const heroBgDesktop = "/images/hero/foquz-desktop.png";
const heroBgMobile = "/images/hero/foquz-mobile.png";

const heroImagePromise = Promise.all(
  [heroBgDesktop, heroBgMobile].map(
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
        document.fonts.load("400 1em Barlow"),
        document.fonts.load("600 1em Barlow"),
        document.fonts.load("700 1em Barlow"),
        document.fonts.load("800 1em Barlow"),
        document.fonts.load("900 1em Barlow"),
        document.fonts.load("400 1em Bangers"),
        document.fonts.ready,
      ]).catch(() => undefined)
    : Promise.resolve();

export const heroReadyPromise = Promise.all([heroImagePromise, heroFontsPromise]);

export const useHeroReady = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    heroReadyPromise.then(() => setReady(true));
  }, []);
  return ready;
};

const HeroSection = () => {
  const ready = useHeroReady();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const navbar = document.getElementById("site-navbar");
    const hero = heroRef.current;
    if (!navbar || !hero) return;
    // The marquee already reserves its own space above the hero.
    // Follow the real navbar height, including font loading and browser zoom.
    const updateOffset = () => hero.style.setProperty("--hero-nav-height", `${navbar.getBoundingClientRect().height}px`);
    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(navbar);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="foquz-hero bg-background" aria-label="FOQUZ Riechdosen">
      <div className="foquz-hero-scene" style={{ opacity: ready ? 1 : 0 }}>
        {/* One composed scene keeps the products, background and clouds in proportion. */}
        <picture>
          <source media="(min-width: 768px)" srcSet={heroBgDesktop} />
          <img className="foquz-hero-art" src={heroBgMobile} width="390" height="800"
            alt="FOQUZ Riechdosen: Watermelon Flex, Blueberry Flow, Thai Style, Lemon Breezy und Peach Party"
            loading="eager" fetchPriority="high" decoding="async" />
        </picture>
        <div className="foquz-hero-copy">
          <p className="foquz-hero-shipping-mobile"><strong>Versandkostenfrei</strong> ab 29€ nach DE &amp; AT</p>
          <h1 className="foquz-hero-title text-primary-foreground text-pop">
            <span>KURZ RIECHEN.</span>
            <span className="text-secondary">AB AUF WOLKE 7.</span>
          </h1>
          <p className="foquz-hero-subtitle text-primary-foreground">
            Deine Riechdose für den Frischekick mit<br />echten Kräutern &amp; Menthol.
          </p>
          <div className="foquz-hero-actions">
            <a href="#bundle" onClick={(e) => { e.preventDefault(); scrollToSection("#bundle"); }}
              className="comic-btn bg-secondary text-secondary-foreground">POWER-BUNDLE HOLEN</a>
            <a href="#sorten" onClick={(e) => { e.preventDefault(); scrollToSection("#sorten"); }}
              className="comic-btn bg-card text-foreground">EINZELN KAUFEN</a>
          </div>
          <p className="foquz-hero-shipping-desktop"><strong>Versandkostenfrei</strong> ab 29€ nach DE &amp; AT</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
