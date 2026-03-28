interface StockBadgeProps {
  variant?: "dark" | "light";
  available?: boolean | null;
}

const StockBadge = ({ variant = "dark", available = null }: StockBadgeProps) => {
  const isLight = variant === "light";

  // Loading state
  if (available === null) {
    return (
      <div className="inline-flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground/40" />
        </span>
        <span
          className={`text-[11px] font-bold uppercase tracking-wide font-['Barlow'] ${
            isLight ? "text-white/50" : "text-muted-foreground"
          }`}
        >
          Lade...
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {available && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            available ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </span>
      <span
        className={`text-[11px] font-bold uppercase tracking-wide font-['Barlow'] ${
          isLight ? "text-white/70" : "text-muted-foreground"
        }`}
      >
        {available ? "Verfügbar ⚡" : "Ausverkauft"}
      </span>
    </div>
  );
};

export default StockBadge;
