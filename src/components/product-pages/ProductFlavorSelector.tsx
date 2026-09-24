import { productImages } from "@/lib/redesignProductImages";
import { useNavigate } from "react-router-dom";

const choices = [
  { name: "PEACH PARTY", desc: "Pfirsich & Kräuter", img: productImages.peach, handle: "peach-party" },
  { name: "LEMON BREEZY", desc: "Zitrone & Kräuter", img: productImages.lemon, handle: "lemon-breezy" },
  { name: "THAI STYLE", desc: "Kräuter & Menthol", img: productImages.thai, handle: "thai-style" },
  { name: "WATERMELON FLEX", desc: "Wassermelone & Kräuter", img: productImages.watermelon, handle: "watermelon-flex" },
  { name: "BLUEBERRY FLOW", desc: "Blaubeere & Kräuter", img: productImages.blueberry, handle: "blueberry-flow" },
];

interface ProductFlavorSelectorProps {
  selected: string;
  /** Aktuell gewählte Set-Größe, bleibt beim Sortenwechsel erhalten. */
  setSize?: string;
}

export function ProductFlavorSelector({ selected, setSize }: ProductFlavorSelectorProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mb-8">
      {choices.map((choice) => {
        const isSelected = selected === choice.name;
        return (
          <div key={choice.name} className="relative">
            <button
              type="button"
              onClick={() =>
                navigate(`/produkt/${choice.handle}`, {
                  state: { keepScroll: true, setSize, flavor: choice.name },
                })
              }
              aria-pressed={isSelected}
              className={[
                "relative w-full min-h-[72px] flex items-center gap-3 rounded-2xl border-2 border-black p-3 text-left transition-all",
                isSelected
                    ? "bg-yellow-400 shadow-[5px_5px_0_0_#000]"
                    : "bg-white shadow-[3px_3px_0_0_rgba(0,0,0,0.25)]",
              ].join(" ")}
            >
              <img src={choice.img} alt={choice.name} className="w-12 h-12 rounded-xl border-2 border-black object-cover shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5 font-barlow font-extrabold leading-tight">
                  {choice.name}
                </span>
                <span className="block text-xs font-semibold text-muted-foreground">
                  {choice.desc}
                </span>
              </span>
              <span className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shrink-0 bg-white">
                {isSelected && <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black" />}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
