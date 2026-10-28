import { useLocation } from "react-router-dom";
import { BUNDLE_PRICING_PENDING } from "@/data/products";

/** Solange Bundle-Preise offen sind, startet die Auswahl auf der kaufbaren Einzeldose. */
const DEFAULT_SET = BUNDLE_PRICING_PENDING ? "1 DOSE" : "4 DOSEN – FRESH FLASH";

/**
 * Beim Sortenwechsel wird die gewählte Set-Größe über den Navigations-State
 * mitgegeben, damit sie auf der neuen Sortenseite erhalten bleibt.
 */
export function useInitialSetSize(fallback = DEFAULT_SET): string {
  const { state } = useLocation();
  const setSize = (state as { setSize?: string } | null)?.setSize;
  return setSize ?? fallback;
}

/**
 * Liefert zusätzlich einen Schlüssel, der sich bei jeder Navigation ändert,
 * damit die Produktseite ihren Auswahl-Zustand zuverlässig synchronisieren kann.
 */
export function useSetSelection(fallback = DEFAULT_SET) {
  const { state, key } = useLocation();
  const setSize = (state as { setSize?: string } | null)?.setSize ?? fallback;
  return { setSize, navigationKey: key };
}
