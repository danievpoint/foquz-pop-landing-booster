import { bundleProduct } from "@/data/products";
import { productImages } from "@/lib/redesignProductImages";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const choices = [
  { name: "PEACH PARTY", desc: "Pfirsich & Kräuter", img: productImages.peach, handle: "peach-party" },
  { name: "LEMON BREEZY", desc: "Zitrone & Kräuter", img: productImages.lemon, handle: "lemon-breezy" },
  { name: "THAI STYLE", desc: "Kräuter & Menthol", img: productImages.thai, handle: "thai-style" },
  { name: bundleProduct.name, desc: "Alle 3 Sorten in einer Box", img: bundleProduct.image, handle: bundleProduct.handle, isBundle: true },
];

export function ProductFlavorSelector({ selected }: { selected: string }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mb-8">
      {choices.map((choice) => {
        const isSelected = selected === choice.name;
        return (
          <div key={choice.name} className="relative">
            <button
              type="button"
              onClick={() => navigate(`/produkt/${choice.handle}`)}
              aria-pressed={isSelected}
              className={[
                "relative w-full min-h-[72px] flex items-center gap-3 rounded-2xl border-2 border-black p-3 text-left transition-all",
                choice.isBundle
                  ? "bg-violet-600 text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.35)] hover:shadow-[5px_5px_0_0_#000]"
                  : isSelected
                    ? "bg-yellow-400 shadow-[5px_5px_0_0_#000]"
                    : "bg-white shadow-[3px_3px_0_0_rgba(0,0,0,0.25)]",
              ].join(" ")}
            >
              <img src={choice.img} alt={choice.name} className="w-12 h-12 rounded-xl border-2 border-black object-cover shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5 font-barlow font-extrabold leading-tight">
                  {choice.name}
                  {choice.isBundle && <Sparkles aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-yellow-300 animate-pulse" />}
                </span>
                <span className={`block text-xs font-semibold ${choice.isBundle ? "text-white/90" : "text-muted-foreground"}`}>
                  {choice.desc}
                </span>
              </span>
              <span className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shrink-0 bg-white">
                {isSelected && <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black" />}
              </span>
            </button>
            {choice.isBundle && (
              <span className="absolute -top-2.5 right-3 z-10 inline-flex items-center rounded-full border-2 border-black bg-yellow-400 px-2 py-0.5 text-[9px] font-black uppercase leading-none text-black shadow-[2px_2px_0_0_#000] sm:px-2.5 sm:text-[10px]">
                <Sparkles aria-hidden="true" className="mr-1 h-3 w-3" />
                BELIEBT
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}