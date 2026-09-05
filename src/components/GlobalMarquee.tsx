import { useEffect, useRef } from "react";
import MarqueeBar from "@/components/MarqueeBar";
import { useHeroReady } from "@/components/HeroSection";

/**
 * Globale Marquee-Leiste ganz oben im Layout (über dem Header).
 * Erscheint erst, wenn der Rest der Seite bereit ist (gleicher Zeitpunkt wie
 * die Navbar), damit sie nicht vorab allein oben auftaucht.
 */
const GlobalMarquee = () => {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useHeroReady();

  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      const h = ref.current?.offsetHeight ?? 0;
      const remaining = Math.max(0, h - window.scrollY);
      root.style.setProperty("--marquee-height", `${remaining}px`);
    };

    update();
    // Synchron (ohne rAF), damit die Navbar beim Scrollen ohne Lücke nachrückt.
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.style.removeProperty("--marquee-height");
    };
  }, [ready]);

  return (
    <>
      {/* Deckt den Bereich hinter Safe-Area + Laufband ab, damit beim Wegscrollen
          nie der Seiteninhalt durchscheint. */}
      <div
        className="fixed left-0 right-0 top-0 z-[9997] pointer-events-none bg-[hsl(var(--foquz-lightblue))]"
        style={{ height: "calc(var(--safe-area-top) + var(--marquee-height))" }}
        aria-hidden="true"
      />
      <div
        ref={ref}
        className="relative z-[9998] bg-[hsl(var(--foquz-lightblue))]"
        style={{
          paddingTop: "var(--safe-area-top)",
          opacity: ready ? 1 : 0,
          transition: "opacity 500ms ease",
        }}
      >
        <MarqueeBar />
      </div>
    </>
  );
};

export default GlobalMarquee;
