import type { CartItem } from "@/contexts/CartContext";
import { VARIANT_GID_BY_ID } from "@/lib/shopify";
import { isSoldOutSingleItem } from "@/lib/singleSalePolicy";

export const CART_STORAGE_KEY = "foquz_cart_v1";
export const CHECKOUT_PENDING_KEY = "foquz_checkout_snapshot_v1";
const FLAVORS = ["PEACH PARTY", "THAI STYLE", "LEMON BREEZY", "WATERMELON FLEX", "BLUEBERRY FLOW"];
const LEGACY_SETS: Record<string, number> = { bundle: 3, "starter-bundle": 3, "squad-bundle": 5, "vorrats-bundle": 10 };
const giftIds = ["gift-nasenstripes", "gift-sticker"];
/** Neue feste Bundles: Warenkorb-ID = Bundle-Handle, eine Zeile = ein echtes Shopify-Bundle. */
export const BUNDLE_CART_SIZES: Record<string, number> = { "fruit-punch": 3, "fresh-flash": 4, "family-first": 8 };
const BUNDLE_CART_PRICES: Record<string, number> = { "fruit-punch": 21.9, "fresh-flash": 27.9, "family-first": 49.9 };
export const isFixedBundleItem = (item: Pick<CartItem, "id">) => item.id in BUNDLE_CART_SIZES;
/** Alte 3/5/10-Bundles: bleiben im Warenkorb sichtbar, werden aber nie still auf neue Bundles umgedeutet. */
export const isRetiredSetItem = (item: Pick<CartItem, "id">) => !isFixedBundleItem(item) && legacySetSize(item.id) !== undefined;

export function legacySetSize(id: string): number | undefined {
  if (LEGACY_SETS[id]) return LEGACY_SETS[id];
  return Object.entries(LEGACY_SETS).find(([key]) => {
    const gid = VARIANT_GID_BY_ID[key];
    return gid && (id === gid || id === gid.split("/").pop());
  })?.[1];
}

export function isSetCan(item: CartItem): boolean {
  return [3, 4, 5, 8, 10].includes(item.setSize ?? 0) && FLAVORS.includes(item.flavor ?? "") && item.id === `set${item.setSize}:${item.flavor}`;
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
  const legacyCans = items.reduce((sum, item) => sum + (legacySetSize(item.id) ?? 0) * item.qty, 0);
  counts.forEach((qty, size) => { if (qty + legacyCans >= size) complete.add(size); });
  return [...complete];
}

export const hasEligibleGiftSet = (items: CartItem[]) =>
  items.some((item) => item.qty > 0 && isFixedBundleItem(item)) || completeSetSizes(items).some((size) => size === 5 || size === 10);
export const hasGuaranteedFreeShipping = hasEligibleGiftSet;

/**
 * Shopify setzt den Gratisversand unabhängig vom Warenwert aktuell nur für die
 * echten Bundle-Produkte (eigenes Versandprofil) um. Freie Sets aus Einzeldosen
 * liegen im allgemeinen Profil – erst wenn Shopify dafür einen Mechanismus hat,
 * darf dieses Flag auf true gehen. Sonst zeigt der Warenkorb "Gratis", die Kasse nicht.
 */
export const SHOPIFY_FREE_SHIPPING_FOR_CAN_SETS = false;
const FREE_SHIPPING_LEGACY = ["squad-bundle", "vorrats-bundle"];

/** Nur was Shopify an der Kasse tatsächlich versandfrei stellt (ohne Warenwertschwelle). */
export function hasCheckoutFreeShipping(items: CartItem[]): boolean {
  // Family First (8er) ist laut Freigabe versandfrei (DE); Fruit Punch / Fresh Flash nicht pauschal.
  if (items.some((item) => item.qty > 0 && item.id === "family-first")) return true;
  if (items.some((item) => item.qty > 0 && FREE_SHIPPING_LEGACY.some((key) => {
    const gid = VARIANT_GID_BY_ID[key];
    return item.id === key || item.id === gid || item.id === gid?.split("/").pop();
  }))) return true;
  return SHOPIFY_FREE_SHIPPING_FOR_CAN_SETS && hasEligibleGiftSet(items);
}

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
        const legacy = isFixedBundleItem(candidate) ? undefined : legacySetSize(candidate.id);
        const singleName = FLAVORS.find((name) => candidate.id === name || candidate.id === VARIANT_GID_BY_ID[name] || candidate.id === VARIANT_GID_BY_ID[name]?.split("/").pop());
        if (isFixedBundleItem(candidate)) { candidate.price = BUNDLE_CART_PRICES[candidate.id]; }
        else if (legacy) {
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
const PAID_FLAVOR_OF = (item: CartItem): string | null => {
  if (isSetCan(item)) return item.flavor ?? null;
  if (FLAVORS.includes(item.id)) return item.id;
  const hit = Object.entries(VARIANT_GID_BY_ID).find(([name, gid]) => FLAVORS.includes(name) && (item.id === gid || item.id === gid.split("/").pop()));
  return hit ? hit[0] : null;
};

/** Bezahlte Dosen im Warenkorb: Einzeldosen, Set-Dosen und echte alte Bundles. Ohne Geschenke, Gratisdose, Prio. */
export function paidCanCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (PAID_FLAVOR_OF(item) ? item.qty : (BUNDLE_CART_SIZES[item.id] ?? legacySetSize(item.id) ?? 0) * item.qty), 0);
}

export interface FillStock { [flavor: string]: { available: boolean; qty: number | null } | undefined }
export interface FillPlan { target: number; items: CartItem[]; kept: Record<string, number>; added: Record<string, number> }

/**
 * Auffüllen auf ein Set: vorhandene bezahlte Dosen bleiben (Sorte/Menge), nur fehlende
 * verfügbare Dosen kommen dazu. null = no-op (schon genug Dosen oder Bestand reicht nicht).
 */
export function planFillToSet(items: CartItem[], target: number, stock: FillStock | null, flavorImages: Record<string, string>, canPrice: number, fixedMix?: Record<number, Record<string, number>> | null): FillPlan | null {
  const legacyCans = items.reduce((s, i) => s + (legacySetSize(i.id) ?? 0) * i.qty, 0);
  const kept: Record<string, number> = {};
  for (const item of items) {
    const flavor = PAID_FLAVOR_OF(item);
    if (flavor) kept[flavor] = (kept[flavor] ?? 0) + item.qty;
  }
  const current = legacyCans + Object.values(kept).reduce((s, q) => s + q, 0);
  // Alte Bundle-Produkte + freie Dosen: Preis/Tracking in Shopify nicht belegt → kein Auffüllen.
  if (legacyCans > 0) return null;
  const allowed = fixedMix ? Object.keys(fixedMix).map(Number) : [3, 5, 10];
  if (!allowed.includes(target) || current >= target) return null;
  const missing = target - current;
  const others = items.filter((item) => !PAID_FLAVOR_OF(item) && !giftIds.includes(item.id));
  const build = (added: Record<string, number>): FillPlan => ({ target, kept, added, items: [...others, ...FLAVORS.filter((f) => (kept[f] ?? 0) + (added[f] ?? 0) > 0).map((f) => ({
    id: `set${target}:${f}`, name: `${f} · ${target}er Set`, price: canPrice, image: flavorImages[f] ?? "",
    setSize: target, flavor: f, qty: (kept[f] ?? 0) + (added[f] ?? 0),
  }))] });
  // Fester Modus: exakt auf die feste Zielmischung auffüllen; inkompatible Carts bekommen keine Karte.
  const fixed = fixedMix?.[target];
  if (fixed) {
    if (Object.entries(kept).some(([f, q]) => q > (fixed[f] ?? 0))) return null;
    const added: Record<string, number> = {};
    for (const f of FLAVORS) {
      const need = (fixed[f] ?? 0) - (kept[f] ?? 0);
      if (need <= 0) continue;
      const info = stock?.[f];
      if (!info?.available || (info.qty != null && info.qty < (fixed[f] ?? 0))) return null;
      added[f] = need;
    }
    return build(added);
  }
  const ranked = FLAVORS
    .map((name, i) => ({ name, i, info: stock?.[name] }))
    // Ohne Bestandsdaten nur Sorten, die nicht als ausverkauft gesperrt sind.
    .filter((f) => (stock ? f.info?.available === true : !isSoldOutSingleItem(f.name)))
    .sort((a, b) => ((b.info?.qty ?? 0) - (a.info?.qty ?? 0)) || a.i - b.i);
  const added: Record<string, number> = {};
  let left = missing, guard = 0;
  while (left > 0 && ranked.length > 0 && guard++ < 1000) {
    let progressed = false;
    for (const f of ranked) {
      if (left === 0) break;
      const cap = f.info?.qty;
      if (cap != null && (kept[f.name] ?? 0) + (added[f.name] ?? 0) >= cap) continue;
      added[f.name] = (added[f.name] ?? 0) + 1; left--; progressed = true;
    }
    if (!progressed) break;
  }
  if (left > 0) return null;
  return build(added);
}
