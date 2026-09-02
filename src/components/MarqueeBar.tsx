const DEFAULT_ITEMS = [
  "WOLKE 7",
  "DEUTSCHE MARKE",
  "OHNE NIKOTIN",
  "MIT ECHTEN KRÄUTERN",
];

interface MarqueeBarProps {
  items?: string[];
  className?: string;
}

/**
 * Endlos durchlaufende Marquee-Leiste: schwarze Schrift auf Gelb.
 * Wiederverwendbar (Produktseite, Startseite, ...).
 */
const MarqueeBar = ({ items = DEFAULT_ITEMS, className = "" }: MarqueeBarProps) => {
  const repeated = [...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <div
      className={`w-full overflow-hidden border-y-[3px] border-black ${className}`}
      style={{ backgroundColor: "#FFD11A" }}
      aria-hidden="true"
    >
      <div className="marquee-track flex whitespace-nowrap items-center gap-4 md:gap-8 py-1.5 md:py-2">
        {repeated.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="flex items-center gap-4 md:gap-8 text-[11px] md:text-sm font-black uppercase tracking-wider text-black"
          >
            {text}
            <span className="text-black/70">★</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBar;
