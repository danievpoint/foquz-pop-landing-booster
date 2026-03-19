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
  const repeated = [...items, ...items];

  return (
    <section className="fixed top-0 left-0 right-0 z-[10000] bg-secondary py-1.5 md:py-2 overflow-hidden border-b-2 border-foreground">
      <div className="marquee-track flex whitespace-nowrap gap-8 md:gap-12">
        {repeated.map((text, i) => (
          <span
            key={i}
            className="text-xs md:text-sm font-extrabold text-secondary-foreground tracking-wider flex items-center gap-3"
          >
            {text}
            <span className="text-primary">★</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBanner;
