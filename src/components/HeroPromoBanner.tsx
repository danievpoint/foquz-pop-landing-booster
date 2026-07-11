import { motion } from "framer-motion";

const HeroPromoBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 w-full flex justify-center px-4 mb-2 sm:mb-3"
    >
      <a
        href="#bundle"
        className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-transparent border-2 border-white/90 px-3 sm:px-4 py-1.5 shadow-sm hover:bg-white/10 transition-colors"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
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
    </motion.div>
  );
};

export default HeroPromoBanner;
