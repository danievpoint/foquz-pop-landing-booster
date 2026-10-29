import { useSyncExternalStore } from "react";
import { storefrontApiRequest, VARIANT_GID_BY_ID } from "@/lib/shopify";
import { FIXED_BUNDLES, BUNDLE_PRICES, BUNDLE_COMPARE_AT } from "@/data/products";

/**
 * Feste Bundles 3/4/8 sind native Shopify-Komponentenbundles, die nur im Onlineshop
 * verkauft werden können (Lovable-Kanal unterstützt keine Bundles). Ein Bundle gilt erst
 * als bestellbar, wenn das öffentliche Produkt-JSON des Onlineshops genau diese Variante
 * mit dem neuen Titel, dem freigegebenen Preis und Vergleichspreis zeigt.
 */
export const ONLINE_STORE_ORIGIN = "https://checkout.foquz.de";

export interface OnlineBundle {
  size: number;
  cartId: string;
  variantId: string;
  handle: string;
  title: string;
}
const SHOP: Record<number, { variantId: string; handle: string }> = {
  3: { variantId: "55628113117526", handle: "3er-starter-bundle" },
  4: { variantId: "55628142707030", handle: "5er-squad-bundle-1" },
  8: { variantId: "55628181274966", handle: "10er-vorrats-bundle-1" },
};
export const ONLINE_BUNDLES: OnlineBundle[] = FIXED_BUNDLES.map((b) => ({
  size: b.size,
  cartId: b.handle,
  title: b.name,
  ...SHOP[b.size],
}));
export const onlineBundleByCartId = (id: string) => ONLINE_BUNDLES.find((b) => b.cartId === id);

/** ready = verifiziert + lieferbar, soldout = verifiziert + ausverkauft, unverified = Shopify-Daten passen (noch) nicht. */
export type OnlineStatus = "ready" | "soldout" | "unverified";
const cents = (v: number) => Math.round(v * 100);
const parseEuro = (s: string) => Number(s.replace(/[^\d,]/g, "").replace(",", "."));

interface ProductJs {
  title?: string;
  variants?: Array<{ id: number; price: number; compare_at_price: number | null; available: boolean }>;
}
export function verifyOnlineBundle(size: number, json: ProductJs | null | undefined): OnlineStatus {
  const b = ONLINE_BUNDLES.find((x) => x.size === size);
  if (!b || !json?.title || !json.title.toUpperCase().includes(b.title)) return "unverified";
  const v = json.variants?.find((x) => String(x.id) === b.variantId);
  if (!v || json.variants!.length !== 1) return "unverified";
  if (v.price !== cents(BUNDLE_PRICES[size]) || v.compare_at_price !== cents(parseEuro(BUNDLE_COMPARE_AT[size])))
    return "unverified";
  return v.available ? "ready" : "soldout";
}

let state: Record<number, OnlineStatus> | null = null;
let version = 0;
const listeners = new Set<() => void>();
let inflight: Promise<Record<number, OnlineStatus> | null> | null = null;

/** Frische Abfrage aller drei Bundles. null = Onlineshop nicht erreichbar (nichts wird freigegeben). */
export function refreshOnlineBundles(): Promise<Record<number, OnlineStatus> | null> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const entries = await Promise.all(
        ONLINE_BUNDLES.map(async (b) => {
          const res = await fetch(`${ONLINE_STORE_ORIGIN}/products/${b.handle}.js?availability=${Date.now()}`, {
            cache: "no-store",
          });
          if (!res.ok) throw new Error(String(res.status));
          let status = verifyOnlineBundle(b.size, await res.json());
          // Native bundle availability can lag behind a component update in Shopify.
          // Only override that stale flag with fresh component availability; Shopify validates quantities at checkout.
          if (status === "soldout") {
            const mix = FIXED_BUNDLES.find((bundle) => bundle.size === b.size)?.mix;
            const components = Object.entries(mix ?? {});
            const ids = components.map(([name]) => VARIANT_GID_BY_ID[name]);
            if (components.length > 0 && ids.every(Boolean)) {
              try {
                const result = await storefrontApiRequest(
                  "query BundleComponentStock($ids: [ID!]!) { nodes(ids: $ids) { ... on ProductVariant { id availableForSale } } }",
                  { ids },
                );
                const nodes = result?.data?.nodes;
                if (
                  Array.isArray(nodes) &&
                  nodes.length === components.length &&
                  nodes.every((node, i) => node?.id === ids[i] && node.availableForSale === true)
                ) {
                  status = "ready";
                }
              } catch {
                /* Keep the unavailable status when fresh stock cannot be verified. */
              }
            }
          }
          return [b.size, status] as const;
        }),
      );
      state = Object.fromEntries(entries);
      version++;
      listeners.forEach((l) => l());
      return state;
    } catch {
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
export const getOnlineBundleStatus = (size: number): OnlineStatus | null => state?.[size] ?? null;
export function useOnlineBundles() {
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => version,
  );
  return state;
}
/** Nur für Tests. */
export function __setOnlineBundlesForTest(s: Record<number, OnlineStatus> | null) {
  state = s;
  version++;
  listeners.forEach((l) => l());
}
