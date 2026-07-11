const HeroPromoBanner = () => {
  return (
    <div className="relative z-10 w-full flex justify-center px-4 mb-2 sm:mb-3">
      <a
        href="#bundle"
        className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-card/80 border border-foreground/10 px-3 sm:px-4 py-1.5 shadow-sm hover:bg-card transition-colors"
      >
        <span className="font-black text-[10px] sm:text-xs text-primary uppercase tracking-wide">
          <strong>-20%</strong>
        </span>
        <span className="text-[10px] sm:text-xs font-bold text-secondary-foreground whitespace-nowrap">
          auf das FOQUZ Power Bundle
        </span>
        <span className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-wide">
          <strong>Code LAUNCH25</strong>
        </span>
      </a>
    </div>
  );
};

export default HeroPromoBanner;
