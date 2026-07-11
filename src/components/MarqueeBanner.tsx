const items = [
  "100% ÄTHERISCHE ÖLE",
  "INSTANT-FRISCHE",
  "KEIN KOFFEIN",
  "100% LEGAL",
  "VERSAND IN 24H",
  "100% VEGAN",
  "MADE IN GERMANY",
  "WOLKE 7 FEELING",
  "MADE WITH LOVE",
];

const MarqueeBanner = () => {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <section
      className="fixed left-0 right-0 z-[10000] bg-background overflow-hidden border-b border-foreground/30 h-[var(--marquee-height)]"
      data-banner
      style={{ top: "var(--safe-area-top)" }}
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
