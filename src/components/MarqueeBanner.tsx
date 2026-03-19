const items = [
  "100% ÄTHERISCHE ÖLE",
  "⚡ INSTANT-WIRKUNG",
  "KEIN KOFFEIN",
  "100% LEGAL",
  "VERSAND IN 24H",
  "100% VEGAN",
  "WOLKE 7 FEELING",
  "MADE WITH LOVE",
];

const MarqueeBanner = () => {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <section className="fixed top-0 left-0 right-0 z-[10000] bg-secondary/80 py-1 overflow-hidden border-b border-foreground/30">
      <div className="marquee-track flex whitespace-nowrap gap-6 md:gap-10">
        {repeated.map((text, i) => (
          <span
            key={i}
            className="text-[10px] md:text-xs font-bold text-secondary-foreground/70 tracking-wider flex items-center gap-2"
          >
            {text}
            <span className="text-primary/50">★</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBanner;
