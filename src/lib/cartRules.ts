import type { CartItem } from "@/contexts/CartContext";
import { VARIANT_GID_BY_ID } from "@/lib/shopify";
import { isSoldOutSingleItem } from "@/lib/singleSalePolicy";

export const CART_STORAGE_KEY = "foquz_cart_v1";
export const CHECKOUT_PENDING_KEY = "foquz_checkout_snapshot_v1";
const FLAVORS = ["PEACH PARTY", "THAI STYLE", "LEMON BREEZY", "WATERMELON FLEX", "BLUEBERRY FLOW"];
const LEGACY_SETS: Record<string, number> = { bundle: 3, "starter-bundle": 3, "squad-bundle": 5, "vorrats-bundle": 10 };
const giftIds = ["gift-nasenstripes", "gift-sticker"];

export function legacySetSize(id: string): number | undefined {
  if (LEGACY_SETS[id]) return LEGACY_SETS[id];
  return Object.entries(LEGACY_SETS).find(([key]) => {
    const gid = VARIANT_GID_BY_ID[key];
    return gid && (id === gid || id === gid.split("/").pop());
  })?.[1];
}

export function isSetCan(item: CartItem): boolean {
  return [3, 5, 10].includes(item.setSize ?? 0) && FLAVORS.includes(item.flavor ?? "") && item.id === `set${item.setSize}:${item.flavor}`;
}

/** A partial group never retains the benefits of its original set size. */
export function completeSetSizes(items: CartItem[]): number[] {
  const counts = new Map<number, number>();
  const complete = new Set<number>();
  for (const item of items) {
    const legacy = legacySetSize(item.id);
    if (legacy && item.qty > 0) complete.add(legacy);
    if (isSetCan(item) && item.setSize !== undefined) counts.set(item.setSize, (counts.get(item.setSize) ?? 0) + item.qty);
  }
  counts.forEach((qty, size) => { if (qty >= size) complete.add(size); });
  return [...complete];
}

export const hasEligibleGiftSet = (items: CartItem[]) => completeSetSizes(items).some((size) => size === 5 || size === 10);
export const hasGuaranteedFreeShipping = hasEligibleGiftSet;

export function reconcileCart(items: CartItem[], gifts: Omit<CartItem, "qty">[], enabled: boolean): CartItem[] {
  const paid = items.filter((item) => !giftIds.includes(item.id) && (isSetCan(item) || !isSoldOutSingleItem(item.id)));
  return enabled && hasEligibleGiftSet(paid) ? [...paid, ...gifts.map((gift) => ({ ...gift, qty: 1 }))] : paid;
}

export function replaceWithSet(items: CartItem[], cans: CartItem[]): CartItem[] {
  return [...items.filter((item) => !isSetCan(item) && !legacySetSize(item.id) && !FLAVORS.includes(item.id) && !Object.entries(VARIANT_GID_BY_ID).some(([name, gid]) => FLAVORS.includes(name) && (item.id === gid || item.id === gid.split("/").pop()))), ...cans];
}

export function cartFingerprint(items: CartItem[], prioShipping = false): string {
  return JSON.stringify([items.map(({ id, qty, price, setSize, flavor }) => [id, qty, price, setSize ?? null, flavor ?? null]).sort((a, b) => String(a[0]).localeCompare(String(b[0]))), prioShipping]);
}

export function readStoredCart(): { items: CartItem[]; prioShipping: boolean } {
  const empty = { items: [], prioShipping: false };
  try {
    const raw = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "null");
    if (!raw || raw.version !== 1 || !Array.isArray(raw.items)) return empty;
    const items: CartItem[] = [];
    for (const value of raw.items) {
      if (!value || typeof value.id !== "string" || typeof value.name !== "string" || typeof value.image !== "string" || !Number.isInteger(value.qty) || value.qty <= 0 || value.qty > 999 || !Number.isFinite(value.price) || value.price < 0) continue;
      if (value.image && !/^(https?:\/\/|\/|data:image\/)/.test(value.image)) continue;
      const candidate: CartItem = { id: value.id, name: value.name, image: value.image, qty: value.qty, price: value.price };
      if (value.setSize !== undefined || value.flavor !== undefined) {
        candidate.setSize = value.setSize; candidate.flavor = value.flavor;
        if (!isSetCan(candidate)) continue;
        candidate.price = 7.49;
      } else {
        const legacy = legacySetSize(candidate.id);
        const singleName = FLAVORS.find((name) => candidate.id === name || candidate.id === VARIANT_GID_BY_ID[name] || candidate.id === VARIANT_GID_BY_ID[name]?.split("/").pop());
        if (legacy) {
          candidate.id = legacy === 3 ? "starter-bundle" : legacy === 5 ? "squad-bundle" : "vorrats-bundle";
          candidate.price = legacy === 3 ? 21.9 : legacy === 5 ? 34.9 : 59.9;
        } else if (singleName) { candidate.id = singleName; candidate.price = 7.49; }
        else if (giftIds.includes(candidate.id)) { continue; }
        else if (candidate.id.startsWith("free:") && FLAVORS.includes(candidate.id.slice(5))) { candidate.price = 0; candidate.qty = 1; }
        else continue;
      }
      if (!isSetCan(candidate) && isSoldOutSingleItem(candidate.id)) continue;
      const existing = items.find((item) => item.id === candidate.id);
      if (existing) existing.qty = Math.min(999, existing.qty + candidate.qty);
      else items.push(candidate);
    }
    return { items, prioShipping: raw.prioShipping === true };
  } catch { return empty; }
}

export function saveStoredCart(items: CartItem[], prioShipping: boolean): void {
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, items, prioShipping })); } catch { /* Storage can be disabled. */ }
}