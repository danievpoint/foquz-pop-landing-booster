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
export function ensureFlavorStock() {
  if (loading || typeof window === "undefined") return;
  const ids = SET_FLAVORS.map((f) => VARIANT_GID_BY_ID[f.name]);
  loading = (async () => {
    let data;
    try { data = await storefrontApiRequest(STOCK_QUERY, { ids }); }
    catch { try { data = await storefrontApiRequest(STOCK_QUERY_BASIC, { ids }); } catch { data = null; } }
    const nodes: Array<{ id: string; availableForSale: boolean; quantityAvailable?: number | null } | null> = data?.data?.nodes ?? [];
    const next: Record<string, StockInfo> = {};
    SET_FLAVORS.forEach((f, i) => {
      const n = nodes[i];
      next[f.name] = { available: n ? n.availableForSale : true, qty: n?.quantityAvailable ?? null };
    });
    stock = next;
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

export const getSetMix = (size: number): SetMix => mixes[size] ?? defaultMix(size);
export const mixCount = (mix: SetMix) => Object.values(mix).reduce((s, q) => s + q, 0);
export function setSetMix(size: number, mix: SetMix) { mixes[size] = mix; emit(); }

export function useSetMix(size: number) {
  useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => version);
  return getSetMix(size);
}
