import { useEffect, useRef } from "react";
import MarqueeBar from "@/components/MarqueeBar";

/**
 * Globale Marquee-Leiste ganz oben im Layout (über dem Header).
 * Läuft im normalen Fluss mit und scrollt sauber nach oben weg.
 * Hält dabei die CSS-Variable --marquee-height aktuell, damit die
 * fixierte Navbar sauber nachrutscht und nichts überlappt.
 */
const GlobalMarquee = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      const h = ref.current?.offsetHeight ?? 0;
      const remaining = Math.max(0, h - window.scrollY);
      root.style.setProperty("--marquee-height", `${remaining}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.style.removeProperty("--marquee-height");
    };
  }, []);

  return (
    <div ref={ref} className="relative z-[9998]" style={{ paddingTop: "var(--safe-area-top)" }}>
      <MarqueeBar />
    </div>
  );
};

export default GlobalMarquee;
