import { useProductPage } from "@/hooks/useProductPage";
import { Sparkles } from "lucide-react";
import { ProductFlavorSelector } from "@/components/product-pages/ProductFlavorSelector";

const price = (value: number) => value.toFixed(2).replace(".", ",");

type Bundle = ReturnType<typeof useProductPage>["bundles"][number];

interface BundleSelectorProps {
  bundles: Bundle[];
  selected: string;
  onSelect: (label: string) => void;
  selectedFlavor: string;
  /** Wird nicht mehr benötigt – Sortenwechsel navigiert auf die Sortenseite. */
  onFlavorSelect?: (name: string) => void;
  className?: string;
}

export function BundleSelector({ bundles, selected, onSelect, selectedFlavor, onFlavorSelect, className = "" }: BundleSelectorProps) {
  return (
    <div className={`space-y-4 pt-2 ${className}`}>
      {bundles.map((b) => {
        const isSelected = selected === b.label;
        const isBundle = b.dosen > 1;

        if (isBundle) {
          return (
            <div key={b.label} className="relative">
              <button
                type="button"
                onClick={() => onSelect(b.label)}
                aria-pressed={isSelected}
                className={[
                  "group relative w-full overflow-hidden rounded-2xl border-4 border-black p-3 text-left transition-all duration-300",
                  "bg-violet-600 text-white",
                  isSelected
                    ? "shadow-[6px_6px_0_0_#000] -translate-y-0.5 ring-4 ring-violet-400/50"
                    : "shadow-[4px_4px_0_0_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]",
                ].join(" ")}
              >
                {/* Outer glow (only when selected) */}
                <span
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-violet-400 blur-xl transition-opacity duration-500",
                    isSelected ? "opacity-40" : "opacity-0",
                  ].join(" ")}
                />

                {/* Shimmer sweep */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />

                <span className="relative z-10 flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white">
                    {isSelected && <span className="h-3 w-3 rounded-full bg-yellow-400 border border-black" />}
                  </span>

                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="block font-barlow text-sm font-extrabold leading-tight sm:text-base">
                        {b.label}
                      </span>
                      <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
                      {b.tag && <span className="rounded-full border border-black bg-yellow-400 px-1.5 py-0.5 text-[9px] font-black text-black">{b.tag}</span>}
                      {b.dosen === 6 && <span className="rounded-full border border-black bg-yellow-400 px-1.5 py-0.5 text-[9px] font-black text-black">GRATIS VERSAND</span>}
                    </span>
                    <span className="block text-[10px] font-semibold leading-tight text-white/90 sm:text-xs">
                      {b.desc}
                    </span>
                  </span>

                  <span className="text-right">
                    <span className="block font-barlow text-base font-extrabold sm:text-lg">
                      {b.oldPrice && (
                        <span className="mr-1.5 inline-block rounded bg-yellow-400 px-1 py-0.5 text-xs font-black text-black line-through decoration-black decoration-2">
                          {b.oldPrice}
                        </span>
                      )}
                      {price(b.price)} €
                    </span>
                    <span className="block text-[11px] font-semibold text-white/80">{b.perDose} € / Dose</span>
                  </span>
                </span>
              </button>

              {/* Best value badge - outside button so it isn't clipped */}
              {b.dosen === 6 && (
                <span className="absolute -top-2.5 right-3 z-20 inline-flex items-center rounded-full border-2 border-black bg-yellow-400 px-2 py-0.5 text-[9px] font-black uppercase leading-none text-black shadow-[2px_2px_0_0_#000] sm:px-2.5 sm:text-[10px]">
                  <Sparkles className="mr-1 h-3 w-3" />
                  BELIEBTESTE WAHL
                </span>
              )}
            </div>
          );
        }

        // Single can option: plain white, no yellow highlight when selected
        return (
          <div key={b.label}>
            <button type="button" onClick={() => onSelect(b.label)} aria-pressed={isSelected} className={[
                "relative w-full min-h-[64px] flex items-center gap-2 rounded-2xl border-2 border-black bg-white p-2 text-left text-black transition-all duration-200",
                isSelected ? "shadow-[5px_5px_0_0_#000]" : "shadow-[3px_3px_0_0_rgba(0,0,0,0.25)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.4)]",
              ].join(" ")}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white">
              {isSelected && <span className="h-3 w-3 rounded-full bg-black" />}
            </span>
            <span className="flex-1">
              <span className="block font-barlow text-sm font-extrabold leading-tight sm:text-base">{b.label}</span>
              <span className="block text-[10px] font-semibold leading-tight text-muted-foreground sm:text-xs">
                {b.desc}
              </span>
            </span>
            <span className="text-right">
              <span className="block font-barlow text-base font-extrabold sm:text-lg">{price(b.price)} €</span>
              <span className="block text-[11px] font-semibold text-muted-foreground">{b.perDose} € / Dose</span>
            </span>
            </button>
            {isSelected && <div className="mt-4 pl-2"><ProductFlavorSelector selected={selectedFlavor} setSize={b.label} /></div>}
          </div>
        );
      })}
    </div>
  );
}
