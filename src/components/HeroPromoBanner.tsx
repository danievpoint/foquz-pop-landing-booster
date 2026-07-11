const HeroPromoBanner = () => {
  return (
    <div className="relative z-10 w-full flex justify-center px-4 pt-2 sm:pt-3 md:pt-4 lg:pt-2">
      <a
        href="#bundle"
        className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-card/80 border border-foreground/10 px-3 sm:px-4 py-1.5 shadow-sm hover:bg-card transition-colors"
      >
        <span className="font-black text-[10px] sm:text-xs text-primary uppercase tracking-wide">
          -20%
        </span>
        <span className="text-[10px] sm:text-xs font-bold text-secondary-foreground whitespace-nowrap">
          auf das FOQUZ Power Bundle
        </span>
        <span className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-wide">
          Code LAUNCH25
        </span>
      </a>
    </div>
  );
};

export default HeroPromoBanner;
