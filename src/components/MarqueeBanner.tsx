import { useLayoutEffect } from "react";
import { useHeroReady } from "@/components/HeroSection";

const items = [
  "100% ÄTHERISCHE ÖLE",
  "INSTANT-FRISCHE",
  "KEIN KOFFEIN",
  "100% LEGAL",
  "VERSAND IN 24H",
  "100% VEGAN",
  "WOLKE 7 FEELING",
  "MADE WITH LOVE",
];

const MarqueeBanner = () => {
  const ready = useHeroReady();
  const repeated = [...items, ...items, ...items, ...items];


  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-marquee-page", "true");
    return () => {
      document.documentElement.removeAttribute("data-marquee-page");
    };
  }, []);

  return (
    <section
      className="fixed left-0 right-0 z-[10000] bg-background overflow-hidden border-b border-foreground/30 h-6 md:h-7"
      data-banner
      style={{
        top: 0,
        height: "calc(var(--safe-area-top) + var(--marquee-height))",
        paddingTop: "var(--safe-area-top)",
        transform: "translate3d(0, 0, 0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        contain: "paint",
        opacity: ready ? 1 : 0,
        transition: "opacity 500ms ease",
        pointerEvents: ready ? "auto" : "none",
      }}

    >
      <div className="marquee-track flex whitespace-nowrap gap-6 md:gap-12 h-full items-center">
        {repeated.map((text, i) => (
          <span
            key={i}
            className="text-[10px] md:text-xs font-bold text-secondary-foreground/70 tracking-wider flex items-center gap-2"
          >
            <span className="text-primary/50">★</span>
            {text}
            <span className="text-primary/50">★</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBanner;
