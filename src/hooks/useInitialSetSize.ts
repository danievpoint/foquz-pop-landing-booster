import { useLocation } from "react-router-dom";
import { BUNDLE_CHECKOUT_READY } from "@/data/products";

/** Solange der Bundle-Kauf gesperrt ist, startet die Auswahl auf der kaufbaren Einzeldose. */
const DEFAULT_SET = BUNDLE_CHECKOUT_READY ? "4 DOSEN – FRESH FLASH" : "1 DOSE";

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
