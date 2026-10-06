import { useProductPage } from "@/hooks/useProductPage";
import { Sparkles } from "lucide-react";
import { ProductFlavorSelector } from "@/components/product-pages/ProductFlavorSelector";

const price = (value: number) => value.toFixed(2).replace(".", ",");

type Bundle = ReturnType<typeof useProductPage>["bundles"][number];

/** Ersparnis in Euro aus durchgestrichenem Preis und Bundle-Preis. */
const savings = (b: Bundle) => {
  if (!b.oldPrice) return null;
  const old = parseFloat(b.oldPrice.replace("€", "").replace(/\./g, "").replace(",", "."));
  const diff = old - b.price;
  return Number.isFinite(diff) && diff > 0.009 ? diff : null;
};

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
        const save = savings(b);
        // Farbcode: 1 + 3 Dosen weiß, 5 Dosen lila, 10 Dosen gelb (#FFD11A)
        const highlight = b.dosen >= 10 ? "yellow" : b.dosen >= 5 ? "violet" : null;

        if (highlight) {
          const yellow = highlight === "yellow";
          return (
            <div key={b.label} className="relative">
              <button
                type="button"
                onClick={() => onSelect(b.label)}
                aria-pressed={isSelected}
                className={[
                  "group relative w-full overflow-hidden rounded-2xl border-4 border-black p-3 text-left transition-all duration-300",
                  yellow ? "bg-[#FFD11A] text-black" : "bg-violet-600 text-white",
                  isSelected
                    ? `shadow-[6px_6px_0_0_#000] -translate-y-0.5 ring-4 ${yellow ? "ring-[#FFD11A]/70" : "ring-violet-400/50"}`
                    : "shadow-[4px_4px_0_0_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]",
                ].join(" ")}
              >
                {/* Outer glow (only when selected) */}
                <span
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-xl transition-opacity duration-500",
                    yellow ? "bg-[#FFD11A]" : "bg-violet-400",
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
                    {isSelected && <span className={`h-3 w-3 rounded-full border border-black ${yellow ? "bg-black" : "bg-[#FFD11A]"}`} />}
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="block font-barlow text-sm font-extrabold leading-tight sm:text-base">
                        {b.label}
                      </span>
                      <Sparkles className={`h-3.5 w-3.5 animate-pulse ${yellow ? "text-black" : "text-[#FFD11A]"}`} />
                      {save && (
                        <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-black leading-none ${yellow ? "border-black bg-black text-[#FFD11A]" : "border-black bg-[#FFD11A] text-black"}`}>
                          Du sparst {price(save)} €
                        </span>
                      )}
                      <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-black leading-none ${yellow ? "border-black/70 text-black" : "border-white/50 text-white"}`}>
                        GRATIS VERSAND
                      </span>
                      <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-black leading-none ${yellow ? "border-black/70 text-black" : "border-white/50 text-white"}`}>
                        + Sticker & Nasen-Stripes gratis
                      </span>
                    </span>
                    <span className={`block text-[10px] font-semibold leading-tight sm:text-xs ${yellow ? "text-black/80" : "text-white/90"}`}>
                      {b.desc}
                    </span>
                  </span>

                  <span className="text-right shrink-0">
                    {b.oldPrice && (
                      <span className={`block text-[10px] font-semibold leading-tight ${yellow ? "text-black/60" : "text-white/75"}`}>
                        statt <span className="line-through decoration-2">{b.oldPrice}</span> einzeln
                      </span>
                    )}
                    <span className="block font-barlow text-base font-extrabold sm:text-lg">
                      {price(b.price)} €
                    </span>
                    <span className={`block text-[11px] font-semibold ${yellow ? "text-black/70" : "text-white/80"}`}>
                      {b.perDose} € / Dose · {b.perKg} €/kg
                    </span>
                  </span>
                </span>
              </button>

              {/* Badge über der Karte */}
              {b.dosen === 5 && (
                <span className="absolute -top-2.5 right-3 z-20 inline-flex items-center rounded-full border-2 border-black bg-[#FFD11A] px-2 py-0.5 text-[9px] font-black uppercase leading-none text-black shadow-[2px_2px_0_0_#000] sm:px-2.5 sm:text-[10px]">
                  <Sparkles className="mr-1 h-3 w-3" />
                  BELIEBTESTE WAHL
                </span>
              )}
              {b.dosen === 10 && (
                <span className="absolute -top-2.5 right-3 z-20 inline-flex items-center rounded-full border-2 border-black bg-black px-2 py-0.5 text-[9px] font-black uppercase leading-none text-[#FFD11A] shadow-[2px_2px_0_0_rgba(0,0,0,0.35)] sm:px-2.5 sm:text-[10px]">
                  <Sparkles className="mr-1 h-3 w-3" />
                  BESTER PREIS
                </span>
              )}
            </div>
          );
        }

        // Einzeldose und Starter Set: schlichtes Weiß
        return (
          <div key={b.label}>
            <button type="button" onClick={() => onSelect(b.label)} aria-pressed={isSelected} className={[
                "relative w-full min-h-[64px] flex items-center gap-2 rounded-2xl border-2 border-black bg-white p-2 text-left text-black transition-all duration-200",
                isSelected ? "shadow-[5px_5px_0_0_#000]" : "shadow-[3px_3px_0_0_rgba(0,0,0,0.25)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.4)]",
              ].join(" ")}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white">
              {isSelected && <span className="h-3 w-3 rounded-full bg-black" />}
            </span>
            <span className="flex-1 min-w-0">
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="block font-barlow text-sm font-extrabold leading-tight sm:text-base">{b.label}</span>
                {save && (
                  <span className="rounded-full border border-black bg-[#FFD11A] px-1.5 py-0.5 text-[9px] font-black leading-none">
                    Du sparst {price(save)} €
                  </span>
                )}
              </span>
              <span className="block text-[10px] font-semibold leading-tight text-muted-foreground sm:text-xs">
                {b.desc}
              </span>
            </span>
            <span className="text-right shrink-0">
              {b.oldPrice && (
                <span className="block text-[10px] font-semibold leading-tight text-muted-foreground">
                  statt <span className="line-through">{b.oldPrice}</span> einzeln
                </span>
              )}
              <span className="block font-barlow text-base font-extrabold sm:text-lg">
                {price(b.price)} €
              </span>
              <span className="block text-[11px] font-semibold text-muted-foreground">
                {b.perDose} € / Dose{b.perKg ? ` · ${b.perKg} €/kg` : ""}
              </span>
            </span>
            </button>
            {isSelected && b.dosen === 1 && <div className="mt-4 pl-2"><ProductFlavorSelector selected={selectedFlavor} setSize={b.label} /></div>}
          </div>
        );
      })}
    </div>
  );
}
