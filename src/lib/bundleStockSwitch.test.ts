import { describe, it, expect, afterEach, vi } from "vitest";
import { activeBundlesFor } from "./setMix";
import { CLASSIC_BUNDLES, FIXED_BUNDLES, ALL_FIXED_BUNDLES, BUNDLE_PRICES } from "@/data/products";
import { CART_STORAGE_KEY, readStoredCart, reconcileCart } from "./cartRules";
import { ONLINE_BUNDLES, verifyOnlineBundle, refreshOnlineBundles, getOnlineBundleStatus } from "./bundleOnline";
import { storefrontApiRequest, VARIANT_GID_BY_ID } from "./shopify";
vi.mock("./shopify", async original => ({ ...await original<typeof import("./shopify")>(), storefrontApiRequest: vi.fn() }));

afterEach(() => { vi.unstubAllGlobals(); localStorage.clear(); });

describe("Automatic fixed bundle family", () => {
  it("restores classics with Thai in stock and switches both ways without changing a mix", () => {
    expect(activeBundlesFor({ "THAI STYLE": { available: true, qty: 27 } })).toBe(CLASSIC_BUNDLES);
    expect(activeBundlesFor({ "THAI STYLE": { available: false, qty: 0 } })).toBe(FIXED_BUNDLES);
    expect(activeBundlesFor({ "THAI STYLE": { available: true, qty: 1 } })).toBe(CLASSIC_BUNDLES);
    expect(CLASSIC_BUNDLES.map(b => Object.values(b.mix).reduce((a, q) => a + q, 0))).toEqual([3, 5, 10]);
    expect(CLASSIC_BUNDLES[0].mix).toEqual({ "PEACH PARTY": 1, "THAI STYLE": 1, "LEMON BREEZY": 1 });
    expect(CLASSIC_BUNDLES.map(b => BUNDLE_PRICES[b.size])).toEqual([21.9, 34.9, 59.9]);
    expect(new Set(ALL_FIXED_BUNDLES.map(b => b.handle)).size).toBe(6);
  });
  it("does not interpret missing stock as a sold-out signal", () => {
    expect(activeBundlesFor(null)).toBe(CLASSIC_BUNDLES);
    expect(activeBundlesFor({})).toBe(CLASSIC_BUNDLES);
  });
  it("keeps both three-can identities and quantities when restoring a mixed saved cart", () => {
    const items = ["classic-starter", "fruit-punch", "classic-squad", "fresh-flash", "classic-vorrat", "family-first"].map(id => ({ id, name: id, qty: 2, price: 1, image: "" }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, items }));
    const restored = readStoredCart().items;
    expect(restored.map(i => [i.id, i.qty, i.price])).toEqual(items.map(i => [i.id, 2, BUNDLE_PRICES[ALL_FIXED_BUNDLES.find(b => b.handle === i.id)!.size]]));
    const gifts = [{ id: "gift-sticker", name: "Sticker", image: "", price: 0 }, { id: "gift-nasenstripes", name: "Stripes", image: "", price: 0 }];
    expect(reconcileCart(restored, gifts, true).filter(i => i.id.startsWith("gift-")).map(i => i.qty)).toEqual([1, 1]);
  });
  it("never confuses the two three-can Shopify variants", () => {
    const fruit = ONLINE_BUNDLES.find(b => b.cartId === "fruit-punch")!;
    const json = { title: fruit.title, variants: [{ id: Number(fruit.variantId), price: 2190, compare_at_price: 2247, available: true }] };
    expect(verifyOnlineBundle("fruit-punch", json)).toBe("ready");
    expect(verifyOnlineBundle("classic-starter", json)).toBe("unverified");
  });
  it("blocks stale parent availability after Thai sells out, but retains all fallback bundles", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string, options?: RequestInit) => {
      if (options?.method === "POST") return { ok: true, json: async () => ({ data: { nodes: JSON.parse(String(options.body)).variables.ids.map((id: string) => ({ id, availableForSale: id !== VARIANT_GID_BY_ID["THAI STYLE"] })) } }) };
      const b = ONLINE_BUNDLES.find(b => new URL(url).pathname === `/products/${b.handle}.js`)!;
      return { ok: true, json: async () => ({ title: b.title, variants: [{ id: Number(b.variantId), price: Math.round(BUNDLE_PRICES[b.size] * 100), compare_at_price: b.size * 749, available: true }] }) };
    }));
    vi.mocked(storefrontApiRequest).mockImplementation(async (_query, variables) => ({ data: { nodes: (variables.ids as string[]).map(id => ({ id, availableForSale: id !== VARIANT_GID_BY_ID["THAI STYLE"] })) } }));
    await refreshOnlineBundles();
    for (const b of CLASSIC_BUNDLES) expect(getOnlineBundleStatus(b.handle)).toBe("soldout");
    for (const b of FIXED_BUNDLES) expect(getOnlineBundleStatus(b.handle)).toBe("ready");
  });
  it("revokes previously confirmed availability on network failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    await refreshOnlineBundles();
    for (const b of ALL_FIXED_BUNDLES) expect(getOnlineBundleStatus(b.handle)).toBe("unverified");
  });
});
