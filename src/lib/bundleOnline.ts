import { useSyncExternalStore } from "react";
import { ALL_FIXED_BUNDLES as FIXED_BUNDLES, BUNDLE_PRICES, BUNDLE_COMPARE_AT } from "@/data/products";

/**
 * Beide festen Bundle-Familien sind native Shopify-Komponentenbundles, die nur im Onlineshop
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
const SHOP: Record<string, { variantId: string; handle: string }> = {
  "classic-vorrat": { variantId: "56418685976918", handle: "10er-vorrats-bundle-2" },
  "fruit-punch": { variantId: "55628113117526", handle: "3er-starter-bundle" },
  "fresh-flash": { variantId: "55628142707030", handle: "5er-squad-bundle-1" },
  "family-first": { variantId: "55628181274966", handle: "10er-vorrats-bundle-1" },
  "classic-squad": { variantId: "56418657173846", handle: "5er-squad-bundle-2" },
  "classic-starter": { variantId: "56418593505622", handle: "3er-starter-bundle-1" },
};
export const ONLINE_BUNDLES: OnlineBundle[] = FIXED_BUNDLES.map((b) => ({
  size: b.size,
  cartId: b.handle,
  title: b.name,
  ...SHOP[b.handle],
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
export function verifyOnlineBundle(size: number | string, json: ProductJs | null | undefined): OnlineStatus {
  const b = ONLINE_BUNDLES.find((x) => typeof size === "string" ? x.cartId === size : x.size === size);
  if (!b || !json?.title || !json.title.toUpperCase().includes(b.title)) return "unverified";
  const v = json.variants?.find((x) => String(x.id) === b.variantId);
  if (!v || json.variants!.length !== 1) return "unverified";
  if (v.price !== cents(BUNDLE_PRICES[b.size]) || v.compare_at_price !== cents(parseEuro(BUNDLE_COMPARE_AT[b.size])))
    return "unverified";
  return v.available ? "ready" : "soldout";
}

let state: Record<string, OnlineStatus> | null = null;
let version = 0;
const listeners = new Set<() => void>();
let inflight: Promise<Record<string, OnlineStatus> | null> | null = null;

/** Frische Abfrage aller sechs Bundles. null = Onlineshop nicht erreichbar (nichts wird freigegeben). */
export function refreshOnlineBundles(): Promise<Record<string, OnlineStatus> | null> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      // Lazy import breaks the Shopify/catalog initialization cycle.
      const { storefrontApiRequest, VARIANT_GID_BY_ID } = await import("@/lib/shopify");
      const entries = await Promise.all(
        ONLINE_BUNDLES.map(async (b) => {
          try {
          const res = await fetch(`${ONLINE_STORE_ORIGIN}/products/${b.handle}.js?availability=${Date.now()}`, {
            cache: "no-store",
          });
          if (!res.ok) throw new Error(String(res.status));
          let status = verifyOnlineBundle(b.cartId, await res.json());
          // Native bundle availability can lag behind a component update in Shopify.
          // Only override that stale flag with fresh component availability; Shopify validates quantities at checkout.
          if (status !== "unverified") {
            const mix = FIXED_BUNDLES.find((bundle) => bundle.handle === b.cartId)?.mix;
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
                } else {
                  status = "soldout";
                }
              } catch {
                status = "unverified"; // A failed read cannot confirm a sale.
              }
            }
          }
          return [b.cartId, status] as const;
          } catch {
            return [b.cartId, "unverified"] as const;
          }
        }),
      );
      state = Object.fromEntries(entries);
      version++;
      listeners.forEach((l) => l());
      return state;
    } catch {
      state = null;
      version++;
      listeners.forEach((l) => l());
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
export const getOnlineBundleStatus = (size: number | string): OnlineStatus | null => state?.[typeof size === "string" ? size : ONLINE_BUNDLES.find((b) => b.size === size)?.cartId ?? ""] ?? null;
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
export function __setOnlineBundlesForTest(s: Record<string, OnlineStatus> | null) {
  state = s ? Object.fromEntries(Object.entries(s).map(([key, value]) => [ONLINE_BUNDLES.find((b) => b.size === Number(key))?.cartId ?? key, value])) : null;
  version++;
  listeners.forEach((l) => l());
}
