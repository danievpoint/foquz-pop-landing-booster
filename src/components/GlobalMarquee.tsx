import { useLayoutEffect, useRef } from "react";
import MarqueeBar from "@/components/MarqueeBar";

/**
 * Globale Marquee-Leiste ganz oben (über dem Header).
 * Laufband und Navbar sind beide fixiert und werden beim Scrollen mit
 * demselben Transform nach oben geschoben – so entsteht nie eine Lücke,
 * durch die der Seiteninhalt durchscheint.
 *
 * CSS-Variablen:
 *  --marquee-full   = Höhe des Laufbands
 *  --marquee-height = aktuell noch sichtbarer Teil (für Anker-Offsets)
 */
const GlobalMarquee = () => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    let full = 0;

    const measure = () => {
      full = ref.current?.offsetHeight ?? 0;
      root.style.setProperty("--marquee-full", `${full}px`);
      update();
    };
    const update = () => {
      const remaining = Math.max(0, full - Math.max(0, window.scrollY));
      root.style.setProperty("--marquee-height", `${remaining}px`);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      root.style.removeProperty("--marquee-height");
      root.style.removeProperty("--marquee-full");
    };
  }, []);

  return (
    <>
      {/* Platzhalter im Seitenfluss, damit der Inhalt unter dem Laufband beginnt. */}
      <div aria-hidden="true" style={{ height: "calc(var(--safe-area-top) + var(--marquee-full))" }} />
      <div
        ref={ref}
        data-chrome
        className="fixed left-0 right-0 z-[9998]"
        style={{
          top: "var(--safe-area-top)",
          transform: "translate3d(0, calc(var(--marquee-height) - var(--marquee-full)), 0)",
          willChange: "transform",
        }}
      >
        <MarqueeBar />
      </div>
    </>
  );
};

export default GlobalMarquee;
