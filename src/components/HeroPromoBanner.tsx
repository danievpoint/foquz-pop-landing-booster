import { motion } from "framer-motion";

type HeroPromoBannerProps = {
  className?: string;
};

const HeroPromoBanner = ({ className = "" }: HeroPromoBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -34 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`z-20 flex justify-center px-4 pointer-events-none ${className}`}
    >
      <div className="pointer-events-auto inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white border-2 border-white px-3 sm:px-4 py-1 shadow-md">
        <span className="font-black text-[10px] sm:text-xs text-primary uppercase tracking-wide whitespace-nowrap">
          <strong>Versandkostenfrei</strong>
        </span>
        <span className="text-[10px] sm:text-xs font-bold text-foreground whitespace-nowrap">
          ab 29€ nach DE & AT
        </span>
      </div>
    </motion.div>
  );
};

export default HeroPromoBanner;
