import { useSyncExternalStore } from "react";
import { flavorProducts } from "@/data/products";
import { storefrontApiRequest, VARIANT_GID_BY_ID } from "@/lib/shopify";

/** Frei wählbare Sets: Einzeldosen mit Line-Attribut `_set`. Preise rechnet Shopify (automatische Rabatte). */
export const SET_SIZE_BY_BUNDLE_ID: Record<string, number> = {
  bundle: 3, "starter-bundle": 3, "squad-bundle": 5, "vorrats-bundle": 10,
};
export const SET_FLAVORS = flavorProducts.map((p) => ({ name: p.name, image: p.image }));
export type SetMix = Record<string, number>;

interface StockInfo { available: boolean; qty: number | null }
let stock: Record<string, StockInfo> | null = null;
const mixes: Record<number, SetMix> = {};
const listeners = new Set<() => void>();
let version = 0;
const emit = () => { version++; listeners.forEach((l) => l()); };

const STOCK_QUERY = `
  query FlavorStock($ids: [ID!]!) {
    nodes(ids: $ids) { ... on ProductVariant { id availableForSale quantityAvailable } }
  }
`;
const STOCK_QUERY_BASIC = `
  query FlavorStockBasic($ids: [ID!]!) {
    nodes(ids: $ids) { ... on ProductVariant { id availableForSale } }
  }
`;

let loading: Promise<void> | null = null;
let lastFetchOk = false;
export const getFlavorStock = () => stock;
/** Bestand vor einer Warenkorbaktion neu bei Shopify abfragen. */
export async function refreshFlavorStock(): Promise<Record<string, StockInfo> | null> {
  if (loading) await loading.catch(() => undefined);
  loading = null;
  ensureFlavorStock();
  await loading;
  // Nur frisch bestätigter Bestand zählt – kein Rückfall auf alten/fehlenden Stand.
  return lastFetchOk ? stock : null;
}
export function ensureFlavorStock() {
  if (loading || typeof window === "undefined") return;
  const ids = SET_FLAVORS.map((f) => VARIANT_GID_BY_ID[f.name]);
  loading = (async () => {
    let data;
    try { data = await storefrontApiRequest(STOCK_QUERY, { ids }); }
    catch { try { data = await storefrontApiRequest(STOCK_QUERY_BASIC, { ids }); } catch { data = null; } }
    if (!data?.data?.nodes) { lastFetchOk = false; emit(); return; } // Fehler: bisherigen Stand behalten, nichts erfinden
    const nodes: Array<{ id: string; availableForSale: boolean; quantityAvailable?: number | null } | null> = data?.data?.nodes ?? [];
    const next: Record<string, StockInfo> = {};
    SET_FLAVORS.forEach((f, i) => {
      const n = nodes[i];
      // Fehlende Variante = unbekannt (nicht als lieferbar erfinden).
      if (n) next[f.name] = { available: n.availableForSale, qty: n.quantityAvailable ?? null };
    });
    stock = next;
    lastFetchOk = true;
    // Unvollständige/ungültige Mischungen nach Bestandsdaten neu aufbauen.
    Object.keys(mixes).forEach((k) => {
      const size = Number(k);
      if (Object.entries(mixes[size]).some(([name, q]) => q > 0 && !next[name]?.available)) delete mixes[size];
    });
    emit();
  })();
}

export const isFlavorAvailable = (name: string) => stock?.[name]?.available ?? true;

/** Vorauswahl: verfügbare Sorten nach Bestand absteigend, reihum verteilt. */
export function defaultMix(size: number): SetMix {
  const ranked = SET_FLAVORS
    .map((f, i) => ({ name: f.name, i, info: stock?.[f.name] }))
    .filter((f) => f.info?.available ?? true)
    .sort((a, b) => ((b.info?.qty ?? 0) - (a.info?.qty ?? 0)) || a.i - b.i);
  const mix: SetMix = {};
  if (ranked.length === 0) return mix;
  for (let n = 0; n < size; n++) {
    const name = ranked[n % ranked.length].name;
    mix[name] = (mix[name] ?? 0) + 1;
  }
  return mix;
}

/** Feste Zusammenstellungen, solange alle fünf Sorten lieferbar sind. */
export const FIXED_SET_MIX: Record<number, SetMix> = {
  3: { "THAI STYLE": 1, "LEMON BREEZY": 1, "PEACH PARTY": 1 },
  5: Object.fromEntries(SET_FLAVORS.map((f) => [f.name, 1])),
  10: Object.fromEntries(SET_FLAVORS.map((f) => [f.name, 2])),
};
/** Größter Bedarf je Sorte über alle festen Sets (10er = 2). */
const FIXED_MIN_PER_FLAVOR = Math.max(...Object.values(FIXED_SET_MIX).flatMap((m) => Object.values(m)));

export type SetMode = "fixed" | "free" | "unknown";
/**
 * Gemeinsame Modusentscheidung für alle Sets:
 * fixed = alle fünf Sorten laut Shopify lieferbar (und, falls Menge bekannt, je ≥ 2 Stück);
 * free = mind. eine Sorte ausverkauft/zu knapp; unknown = kein bestätigter Bestand.
 */
export function setModeFor(s: Record<string, StockInfo | undefined> | null): SetMode {
  if (!s) return "unknown";
  const infos = SET_FLAVORS.map((f) => s[f.name]);
  if (infos.some((i) => !i)) return "unknown";
  if (infos.some((i) => !i!.available || (i!.qty !== null && i!.qty < FIXED_MIN_PER_FLAVOR))) return "free";
  return "fixed";
}
export const getSetMode = (): SetMode => setModeFor(lastFetchOk ? stock : null);

/**
 * Prüft eine Mischung gegen frisch bestätigten Bestand. `inCart` = bereits im Warenkorb liegende
 * bezahlte Dosen je Sorte (Mengenobergrenze). Gibt eine Fehlermeldung oder null zurück.
 */
export function validateSetMix(size: number, mix: SetMix, s: Record<string, StockInfo | undefined>, inCart: Record<string, number> = {}, times = 1): string | null {
  if (mixCount(mix) !== size) return `Bitte genau ${size} Dosen wählen.`;
  for (const [name, q] of Object.entries(mix)) {
    if (q <= 0) continue;
    const info = s[name];
    if (!info || !info.available) return "Eine gewählte Sorte ist gerade ausverkauft. Bitte prüfe deine Auswahl.";
    if (info.qty !== null && (inCart[name] ?? 0) + q * times > info.qty) return "Eine gewählte Sorte ist nicht mehr in dieser Menge lieferbar. Bitte prüfe deine Auswahl.";
  }
  return null;
}

export const getSetMix = (size: number): SetMix =>
  getSetMode() === "fixed" && FIXED_SET_MIX[size] ? FIXED_SET_MIX[size] : mixes[size] ?? defaultMix(size);

/** Bestand bei Fokus, Sichtbarkeit und alle 60 s neu laden, damit der Modus ohne Deploy umschaltet. */
export function startFlavorStockPolling(intervalMs = 60_000): () => void {
  if (typeof window === "undefined") return () => undefined;
  const refresh = () => { if (document.visibilityState !== "hidden") { loading = null; ensureFlavorStock(); } };
  window.addEventListener("focus", refresh);
  document.addEventListener("visibilitychange", refresh);
  const id = window.setInterval(refresh, intervalMs);
  return () => { window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); window.clearInterval(id); };
}
export const mixCount = (mix: SetMix) => Object.values(mix).reduce((s, q) => s + q, 0);
export function setSetMix(size: number, mix: SetMix) { mixes[size] = mix; emit(); }

/** Live-Bestand (Re-Render bei jeder neuen Shopify-Antwort). */
export function useFlavorStock() {
  useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => version);
  return stock;
}

export function useSetMode(): SetMode {
  useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => version);
  return getSetMode();
}

export function useSetMix(size: number) {
  useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => version);
  return getSetMix(size);
}
