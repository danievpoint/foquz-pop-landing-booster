import { useLocation } from "react-router-dom";

/**
 * Beim Sortenwechsel wird die gewählte Set-Größe über den Navigations-State
 * mitgegeben, damit sie auf der neuen Sortenseite erhalten bleibt.
 */
export function useInitialSetSize(fallback = "5 DOSEN"): string {
  const { state } = useLocation();
  const setSize = (state as { setSize?: string } | null)?.setSize;
  return setSize ?? fallback;
}

/**
 * Liefert zusätzlich einen Schlüssel, der sich bei jeder Navigation ändert,
 * damit die Produktseite ihren Auswahl-Zustand zuverlässig synchronisieren kann.
 */
export function useSetSelection(fallback = "5 DOSEN") {
  const { state, key } = useLocation();
  const setSize = (state as { setSize?: string } | null)?.setSize ?? fallback;
  return { setSize, navigationKey: key };
}
