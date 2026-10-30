import { useSyncExternalStore } from "react";
import { flavorProducts, FIXED_BUNDLES, ALL_FIXED_BUNDLES, CLASSIC_BUNDLES } from "@/data/products";
import { storefrontApiRequest, VARIANT_GID_BY_ID } from "@/lib/shopify";
import { getOnlineBundleStatus, refreshOnlineBundles, useOnlineBundles } from "@/lib/bundleOnline";

/** Feste Bundles (3/4/8). Keine freie Sortenwahl mehr. */
export const SET_SIZE_BY_BUNDLE_ID: Record<string, number> = Object.fromEntries(ALL_FIXED_BUNDLES.map((b) => [b.handle, b.size]));
/** Alte Set-IDs (3/5/10): dürfen nicht mehr neu in den Warenkorb, alte Warenkörbe bleiben unverändert. */
export const RETIRED_SET_IDS = ["bundle", "starter-bundle", "squad-bundle", "vorrats-bundle"];
export const SET_FLAVORS = flavorProducts.map((p) => ({ name: p.name, image: p.image }));
export type SetMix = Record<string, number>;

interface StockInfo { available: boolean; qty: number | null }
let stock: Record<string, StockInfo> | null = null;
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
  void refreshOnlineBundles();
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
    emit();
  })();
}

export const isFlavorAvailable = (name: string) => stock?.[name]?.available ?? true;

/** Feste Zusammenstellungen der Bundles (Quelle: FIXED_BUNDLES). */
export const FIXED_SET_MIX: Record<number, SetMix> = Object.fromEntries(FIXED_BUNDLES.map((b) => [b.size, b.mix]));

export type BundleStatus = "available" | "unavailable" | "unknown" | "unverified";
/**
 * Lieferbarkeit eines festen Bundles aus frisch bestätigtem Bestand:
 * unavailable = eine Komponente ausverkauft oder (bei bekannter Menge) zu knapp; unknown = kein bestätigter Bestand.
 * Kein Rückfall auf freie Auswahl.
 */
export function bundleStatusFor(size: number, s: Record<string, StockInfo | undefined> | null): BundleStatus {
  const mix = FIXED_SET_MIX[size];
  if (!mix || !s) return "unknown";
  const infos = Object.entries(mix).map(([name, q]) => ({ info: s[name], q }));
  if (infos.some(({ info }) => info && !info.available)) return "unavailable";
  if (infos.some(({ info }) => !info)) return "unknown";
  if (infos.some(({ info, q }) => info!.qty !== null && info!.qty < q)) return "unavailable";
  return "available";
}
/** Bestellbarkeit eines festen Bundles ausschließlich aus den Onlineshop-Daten der echten Bundle-Variante. */
export const getBundleStatus = (size: number | string): BundleStatus => {
  const s = getOnlineBundleStatus(size);
  return s === "ready" ? "available" : s === "soldout" ? "unavailable" : s === "unverified" ? "unverified" : "unknown";
};

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

export const getSetMix = (size: number): SetMix => FIXED_SET_MIX[size] ?? {};

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

/** Live-Bestand (Re-Render bei jeder neuen Shopify-Antwort). */
export function useFlavorStock() {
  useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => version);
  return stock;
}

export function useBundleStatus(size: number | string): BundleStatus {
  useOnlineBundles();
  useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => version);
  return getBundleStatus(size);
}

/** Only a confirmed sold-out Thai switches the family. A failed read keeps the previous family. */
export function activeBundlesFor(s: Record<string, StockInfo | undefined> | null) {
  return s?.["THAI STYLE"]?.available === false ? FIXED_BUNDLES : CLASSIC_BUNDLES;
}
export function useActiveBundles() { return activeBundlesFor(useFlavorStock()); }
export function getActiveBundles() { return activeBundlesFor(stock); }

/** Test harness: inject a stock snapshot without changing Shopify inventory. */
export function __setFlavorStockForTest(value: Record<string, StockInfo> | null) { stock = value; emit(); }
