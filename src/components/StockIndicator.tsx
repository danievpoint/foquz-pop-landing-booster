import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import blitzIcon from "@/assets/icon-blitz-stock.svg";

interface StockIndicatorProps {
  variant?: "dark" | "light";
}

const StockIndicator = ({ variant = "dark" }: StockIndicatorProps) => {
  const [stock] = useState(() => Math.floor(Math.random() * 15) + 5); // 5–19
  const percent = Math.min((stock / 30) * 100, 100);

  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  const isLight = variant === "light";

  return (
    <div className="flex items-center gap-2 mt-3">
      <motion.div
        animate={{ scale: pulse ? 1.2 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <img src={blitzIcon} alt="Blitz" className="w-5 h-5" />
      </motion.div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-bold ${isLight ? "text-white" : "text-foreground"}`}>
            Nur noch {stock} Stück!
          </span>
          <span className={`text-[10px] font-semibold ${isLight ? "text-white/60" : "text-muted-foreground"}`}>
            Fast ausverkauft
          </span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? "bg-white/20" : "bg-muted"}`}>
          <motion.div
            className="h-full rounded-full bg-[#e94362]"
            initial={{ width: 0 }}
            whileInView={{ width: `${percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StockIndicator;
