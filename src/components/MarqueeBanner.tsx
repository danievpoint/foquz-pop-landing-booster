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
    <section className="bg-secondary py-3 md:py-4 overflow-hidden border-y-2 border-foreground">
      <div className="marquee-track flex whitespace-nowrap gap-8 md:gap-12">
        {repeated.map((text, i) => (
          <span
            key={i}
            className="text-sm md:text-base font-extrabold text-secondary-foreground tracking-wider flex items-center gap-3"
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
