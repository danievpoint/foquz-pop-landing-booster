import { useLocation } from "react-router-dom";

/**
 * Beim Sortenwechsel wird die gewählte Set-Größe über den Navigations-State
 * mitgegeben, damit sie auf der neuen Sortenseite erhalten bleibt.
 */
export function useInitialSetSize(fallback = "6 DOSEN"): string {
  const { state } = useLocation();
  const setSize = (state as { setSize?: string } | null)?.setSize;
  return setSize ?? fallback;
}
