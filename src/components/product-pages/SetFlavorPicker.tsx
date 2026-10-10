import { useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { ensureFlavorStock, isFlavorAvailable, mixCount, SET_FLAVORS, setSetMix, useSetMix } from "@/lib/setMix";

const short = (name: string) => name.charAt(0) + name.slice(1).toLowerCase().replace(/ (\w)/g, (_, c) => " " + c.toUpperCase());

export function SetFlavorPicker({ size }: { size: number }) {
  useEffect(() => { ensureFlavorStock(); }, []);
  const mix = useSetMix(size);
  const total = mixCount(mix);
  const left = size - total;

  const change = (name: string, delta: number) => {
    const next = { ...mix, [name]: Math.max(0, (mix[name] ?? 0) + delta) };
    if (mixCount(next) > size) return;
    setSetMix(size, next);
  };

  return (
    <div className="rounded-2xl border-2 border-black bg-white p-3 text-black shadow-[3px_3px_0_0_#000]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-barlow text-sm font-extrabold">Sorten frei wählbar</span>
        <span className={`rounded-full border-2 border-black px-2 py-0.5 text-[11px] font-black ${left === 0 ? "bg-[#FFD11A]" : "bg-white"}`}>
          {total}/{size} gewählt
        </span>
      </div>
      <ul className="space-y-1.5">
        {SET_FLAVORS.map((f) => {
          const available = isFlavorAvailable(f.name);
          const qty = mix[f.name] ?? 0;
          return (
            <li key={f.name} className={`flex items-center gap-2 ${available ? "" : "opacity-50"}`}>
              <img src={f.image} alt={f.name} className={`h-9 w-9 shrink-0 rounded-lg border-2 border-black object-cover ${available ? "" : "grayscale"}`} loading="lazy" />
              <span className="flex-1 min-w-0 text-sm font-extrabold leading-tight">
                {short(f.name)}
                {!available && <span className="ml-1.5 rounded-full bg-[#e94362] px-1.5 py-0.5 text-[9px] font-black text-white">AUSVERKAUFT</span>}
              </span>
              <span className="flex items-center gap-1">
                <button type="button" aria-label={`${f.name} weniger`} disabled={qty === 0} onClick={() => change(f.name, -1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white disabled:opacity-30">
                  <Minus className="h-4 w-4" strokeWidth={3} />
                </button>
                <span className="w-6 text-center font-barlow text-base font-extrabold" aria-live="polite">{qty}</span>
                <button type="button" aria-label={`${f.name} mehr`} disabled={!available || left === 0} onClick={() => change(f.name, 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-[#FFD11A] disabled:opacity-30">
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      {left > 0 && <p className="mt-2 text-xs font-bold text-[#e94362]">Noch {left} {left === 1 ? "Dose" : "Dosen"} wählen</p>}
    </div>
  );
}
