/**
 * Klaviyo Onsite-Tracking (Public API Key / Company ID: WE63iq)
 *
 * Alle Aufrufe sind bewusst "fail-safe": wenn klaviyo.js durch einen Adblocker
 * geblockt wird oder window nicht existiert, passiert schlicht nichts.
 */
import { SHOPIFY_STORE_PERMANENT_DOMAIN, VARIANT_GID_BY_ID } from "@/lib/shopify";
import { allProducts } from "@/data/products";

type KlaviyoQueue = unknown[] & { push: (args: unknown) => void };

declare global {
  interface Window {
    klaviyo?: KlaviyoQueue;
  }
}

const getQueue = (): KlaviyoQueue | null => {
  if (typeof window === "undefined") return null;
  window.klaviyo = window.klaviyo || ([] as unknown as KlaviyoQueue);
  return window.klaviyo;
};

export const klaviyoTrack = (event: string, props: Record<string, unknown> = {}) => {
  try {
    getQueue()?.push(["track", event, props]);
  } catch (e) {
    console.warn("Klaviyo track failed:", e);
  }
};

export const klaviyoIdentify = (props: Record<string, unknown>) => {
  try {
    getQueue()?.push(["identify", props]);
  } catch (e) {
    console.warn("Klaviyo identify failed:", e);
  }
};

/** Macht aus einem relativen Asset-Pfad eine absolute URL. */
export const absoluteUrl = (url: string): string => {
  try {
    if (!url) return "";
    return new URL(url, window.location.origin).href;
  } catch {
    return url;
  }
};

/** gid://shopify/ProductVariant/123 -> "123" */
const numericVariantId = (gid?: string): string | null => {
  if (!gid) return null;
  const match = gid.match(/(\d+)$/);
  return match ? match[1] : null;
};

export const variantIdFor = (cartItemId: string): string | null =>
  numericVariantId(VARIANT_GID_BY_ID[cartItemId]);

const productUrlFor = (cartItemId: string, name: string): string => {
  const p =
    allProducts.find((x) => x.handle === cartItemId) ??
    allProducts.find((x) => x.name === cartItemId) ??
    allProducts.find((x) => x.name === name);
  return p ? absoluteUrl(`/produkt/${p.handle}`) : absoluteUrl("/");
};

export interface KlaviyoCartLine {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

/**
 * Shopify Cart-Permalink zur Wiederherstellung des Warenkorbs:
 * https://<shop>.myshopify.com/cart/<variantId>:<qty>,<variantId>:<qty>?channel=online_store
 */
export const buildCheckoutUrl = (items: KlaviyoCartLine[]): string => {
  const parts = items
    .map((i) => {
      const vid = variantIdFor(i.id);
      return vid ? `${vid}:${i.qty}` : null;
    })
    .filter(Boolean) as string[];

  if (parts.length === 0) return absoluteUrl("/produkt/starter-bundle");
  return `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/cart/${parts.join(",")}?channel=online_store`;
};

export const buildKlaviyoItems = (items: KlaviyoCartLine[]) =>
  items.map((i) => ({
    ProductID: variantIdFor(i.id) ?? i.id,
    ProductName: i.name,
    Quantity: i.qty,
    ItemPrice: i.price,
    RowTotal: Number((i.price * i.qty).toFixed(2)),
    ImageURL: absoluteUrl(i.image),
    ProductURL: productUrlFor(i.id, i.name),
  }));

/** "Added to Cart" mit dem kompletten Warenkorb NACH dem Hinzufügen. */
export const trackAddedToCart = (added: KlaviyoCartLine, cartAfter: KlaviyoCartLine[]) => {
  try {
    const value = Number(
      cartAfter.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2)
    );
    klaviyoTrack("Added to Cart", {
      $value: value,
      AddedItemProductName: added.name,
      AddedItemProductID: variantIdFor(added.id) ?? added.id,
      AddedItemImageURL: absoluteUrl(added.image),
      AddedItemPrice: added.price,
      AddedItemQuantity: added.qty,
      ItemNames: cartAfter.map((i) => i.name),
      Items: buildKlaviyoItems(cartAfter),
      CheckoutURL: buildCheckoutUrl(cartAfter),
    });
  } catch (e) {
    console.warn("Klaviyo Added to Cart failed:", e);
  }
};

export const trackViewedProduct = (p: {
  id: string;
  name: string;
  image: string;
  price: number;
  url?: string;
}) => {
  try {
    klaviyoTrack("Viewed Product", {
      ProductName: p.name,
      ProductID: variantIdFor(p.id) ?? p.id,
      ImageURL: absoluteUrl(p.image),
      URL: p.url ? absoluteUrl(p.url) : window.location.href,
      Price: p.price,
    });
  } catch (e) {
    console.warn("Klaviyo Viewed Product failed:", e);
  }
};
