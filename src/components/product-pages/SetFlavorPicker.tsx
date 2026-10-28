import { useEffect } from "react";
import { ensureFlavorStock, FIXED_SET_MIX, isFlavorAvailable, SET_FLAVORS, useBundleStatus, useFlavorStock } from "@/lib/setMix";

const short = (name: string) => name.charAt(0) + name.slice(1).toLowerCase().replace(/ (\w)/g, (_, c) => " " + c.toUpperCase());

/** Feste Bundle-Zusammenstellung (keine freie Sortenwahl). Fehlt eine Komponente, ist das Bundle gesperrt. */
export function SetFlavorPicker({ size }: { size: number }) {
  useEffect(() => { ensureFlavorStock(); }, []);
  useFlavorStock();
  const status = useBundleStatus(size);
  const mix = FIXED_SET_MIX[size];
  if (!mix) return null;
  return (
    <div className="rounded-2xl border-2 border-black bg-white p-3 text-black shadow-[3px_3px_0_0_#000]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-barlow text-sm font-extrabold">Feste Zusammenstellung</span>
        <span className="rounded-full border-2 border-black bg-[#FFD11A] px-2 py-0.5 text-[11px] font-black">{size} Dosen</span>
      </div>
      <ul className="space-y-1.5">
        {SET_FLAVORS.filter((f) => (mix[f.name] ?? 0) > 0).map((f) => {
          const available = isFlavorAvailable(f.name);
          return (
            <li key={f.name} className={`flex items-center gap-2 ${available ? "" : "opacity-50"}`}>
              <img src={f.image} alt={f.name} className={`h-9 w-9 shrink-0 rounded-lg border-2 border-black object-cover ${available ? "" : "grayscale"}`} loading="lazy" />
              <span className="flex-1 min-w-0 text-sm font-extrabold leading-tight">
                {short(f.name)}
                {!available && <span className="ml-1.5 rounded-full bg-[#e94362] px-1.5 py-0.5 text-[9px] font-black text-white">AUSVERKAUFT</span>}
              </span>
              <span className="font-barlow text-base font-extrabold">{mix[f.name]}×</span>
            </li>
          );
        })}
        <li className="flex items-center gap-2 pt-1 text-xs font-bold">+ Sticker & Nasen-Stripes</li>
      </ul>
      {status === "unknown" && <p className="mt-2 text-xs font-bold">Bestand wird geprüft …</p>}
      {status === "unavailable" && <p className="mt-2 text-xs font-bold text-[#e94362]">Gerade nicht vollständig lieferbar.</p>}
    </div>
  );
}
