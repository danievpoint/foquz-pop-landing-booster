import { useState } from "react";

interface StockBadgeProps {
  variant?: "dark" | "light";
}

const StockBadge = ({ variant = "dark" }: StockBadgeProps) => {
  const [stock] = useState(() => Math.floor(Math.random() * 15) + 5);
  const isLight = variant === "light";

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd618] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd618]" />
      </span>
      <span
        className={`text-[11px] font-bold uppercase tracking-wide font-['Barlow'] ${
          isLight ? "text-white/70" : "text-muted-foreground"
        }`}
      >
        Nur noch {stock} Stück!
      </span>
    </div>
  );
};

export default StockBadge;
