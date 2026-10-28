import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("canvas-confetti", () => ({ default: { create: () => vi.fn() } }));
vi.mock("@/lib/tracking", () => ({ trackPixelAddToCart: vi.fn(), syncShopifyConsentWithTimeout: vi.fn() }));
vi.mock("@/lib/klaviyo", () => ({ trackAddedToCart: vi.fn(), variantIdFor: () => null }));
vi.mock("@/lib/shopify", async (original) => ({ ...await original<typeof import("@/lib/shopify")>(), createShopifyCheckout: vi.fn(async () => null), isShopifyCartCompleted: vi.fn(async () => false), storefrontApiRequest: vi.fn() }));

import { storefrontApiRequest } from "@/lib/shopify";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { bundleStatusFor, FIXED_SET_MIX, getBundleStatus, refreshFlavorStock } from "@/lib/setMix";
import { BUNDLE_CHECKOUT_READY, BUNDLE_COMPARE_AT, BUNDLE_PER_DOSE, BUNDLE_PRICES, FIXED_BUNDLES, familyFirstProduct, freshFlashProduct, fruitPunchProduct } from "@/data/products";
import { saveStoredCart } from "@/lib/cartRules";

const ORDER = ["PEACH PARTY", "THAI STYLE", "LEMON BREEZY", "WATERMELON FLEX", "BLUEBERRY FLOW"];
const all = (qty: number | null = 40) => Object.fromEntries(ORDER.map((f) => [f, { available: true, qty }]));
const out = (f: string) => ({ ...all(), [f]: { available: false, qty: 0 } });
const shopify = (over: Record<string, { availableForSale: boolean; quantityAvailable: number | null }> = {}) =>
  ({ data: { nodes: ORDER.map((f) => over[f] ?? { availableForSale: true, quantityAvailable: 40 }) } });
const respond = (r: unknown) => vi.mocked(storefrontApiRequest).mockResolvedValue(r as never);
const FOUR = ["PEACH PARTY", "LEMON BREEZY", "WATERMELON FLEX", "BLUEBERRY FLOW"];

let cart: ReturnType<typeof useCart>;
function Probe() { cart = useCart(); return null; }
const mount = () => render(<CartProvider><Probe /></CartProvider>);

beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
afterEach(cleanup);

describe("Feste Bundles 3/4/8 – Inhalte", () => {
  it("Fruit Punch = 1 Watermelon + 1 Peach + 1 Lemon (kein Blueberry, kein Thai)", () => {
    expect(FIXED_SET_MIX[3]).toEqual({ "WATERMELON FLEX": 1, "PEACH PARTY": 1, "LEMON BREEZY": 1 });
  });
  it("Fresh Flash = je 1 Peach/Lemon/Watermelon/Blueberry", () => {
    expect(FIXED_SET_MIX[4]).toEqual(Object.fromEntries(FOUR.map((f) => [f, 1])));
  });
  it("Family First = je 2 der vier Sorten", () => {
    expect(FIXED_SET_MIX[8]).toEqual(Object.fromEntries(FOUR.map((f) => [f, 2])));
  });
  it("Namen/Handles und keine 5er/10er mehr", () => {
    expect(FIXED_BUNDLES.map((b) => [b.size, b.name, b.handle])).toEqual([[3, "FRUIT PUNCH", "fruit-punch"], [4, "FRESH FLASH", "fresh-flash"], [8, "FAMILY FIRST", "family-first"]]);
    expect(FIXED_SET_MIX[5]).toBeUndefined();
    expect(FIXED_SET_MIX[10]).toBeUndefined();
  });
});

describe("Lieferbarkeit je Bundle (kein Rückfall auf freie Auswahl)", () => {
  it("Thai ausverkauft betrifft kein Bundle", () => {
    for (const s of [3, 4, 8]) expect(bundleStatusFor(s, out("THAI STYLE"))).toBe("available");
  });
  it("fehlende Komponente sperrt genau die betroffenen Bundles", () => {
    expect(bundleStatusFor(3, out("BLUEBERRY FLOW"))).toBe("available");
    expect(bundleStatusFor(4, out("BLUEBERRY FLOW"))).toBe("unavailable");
    expect(bundleStatusFor(8, out("BLUEBERRY FLOW"))).toBe("unavailable");
    for (const s of [3, 4, 8]) expect(bundleStatusFor(s, out("PEACH PARTY"))).toBe("unavailable");
  });
  it("nur 1 Stück einer Sorte reicht nicht für Family First", () => {
    const low = { ...all(), "LEMON BREEZY": { available: true, qty: 1 } };
    expect(bundleStatusFor(4, low)).toBe("available");
    expect(bundleStatusFor(8, low)).toBe("unavailable");
  });
  it("unbekannter Bestand → nie lieferbar behauptet", () => {
    expect(bundleStatusFor(4, null)).toBe("unknown");
    const partial = all(); delete (partial as Record<string, unknown>)["LEMON BREEZY"];
    expect(bundleStatusFor(4, partial)).toBe("unknown");
  });
  it("live aus Shopify: Ausverkauf sperrt, Erholung gibt frei, Fehler = unbekannt", async () => {
    respond(shopify()); await refreshFlavorStock(); expect(getBundleStatus(4)).toBe("available");
    respond(shopify({ "WATERMELON FLEX": { availableForSale: false, quantityAvailable: 0 } })); await refreshFlavorStock();
    expect(getBundleStatus(4)).toBe("unavailable");
    respond(shopify()); await refreshFlavorStock(); expect(getBundleStatus(4)).toBe("available");
    respond(null); await refreshFlavorStock(); expect(getBundleStatus(4)).toBe("unknown");
  });
});

describe("Preise final, Kauf gesperrt", () => {
  it("finale Preise: 21,90 / 27,90 / 49,90", () => {
    expect(BUNDLE_PRICES).toEqual({ 3: 21.9, 4: 27.9, 8: 49.9 });
    expect(fruitPunchProduct.numericPrice).toBe(21.9);
    expect(fruitPunchProduct.price).toBe("€21,90");
    expect(freshFlashProduct.numericPrice).toBe(27.9);
    expect(familyFirstProduct.numericPrice).toBe(49.9);
  });
  it("Vergleich mit 7,49 €/Einzeldose: Ersparnis 0,57 / 2,06 / 10,02", () => {
    expect(BUNDLE_COMPARE_AT).toEqual({ 3: "€22,47", 4: "€29,96", 8: "€59,92" });
    for (const size of [3, 4, 8]) {
      const compare = parseFloat(BUNDLE_COMPARE_AT[size].replace("€", "").replace(",", "."));
      expect(Math.round((compare - BUNDLE_PRICES[size]) * 100) / 100).toBe({ 3: 0.57, 4: 2.06, 8: 10.02 }[size]);
    }
  });
  it("Dosenpreise gerundet: 7,30 / 6,98 / 6,24", () => {
    expect(BUNDLE_PER_DOSE).toEqual({ 3: "7,30", 4: "6,98", 8: "6,24" });
  });
  it("Kauf bleibt gesperrt bis zum Shopify-Abgleich", () => {
    expect(BUNDLE_CHECKOUT_READY).toBe(false);
    expect(fruitPunchProduct.checkoutReady).toBe(false);
    expect(freshFlashProduct.checkoutReady).toBe(false);
    expect(familyFirstProduct.checkoutReady).toBe(false);
  });
  it.each(["fruit-punch", "fresh-flash", "family-first", "starter-bundle", "squad-bundle", "vorrats-bundle", "bundle"])("%s landet nicht im Warenkorb", async (id) => {
    respond(shopify()); mount();
    await act(async () => { cart.addToCart(1, { id, name: id, price: 1, image: "" }); });
    expect(cart.items).toEqual([]);
    expect(storefrontApiRequest).not.toHaveBeenCalledWith(expect.stringContaining("cartCreate"), expect.anything());
  });
  it("Auffüllen ist gesperrt", async () => {
    mount();
    await act(async () => { expect(await cart.fillCartToSet(4, {})).toBe(false); });
    expect(cart.planFill(4)).toBeNull();
  });
  it("alte 5er-Warenkörbe bleiben unverändert (keine Umetikettierung als 4er)", () => {
    const old = ORDER.map((f) => ({ id: `set5:${f}`, name: `${f} · 5er Set`, price: 7.49, image: "", setSize: 5, flavor: f, qty: 1 }));
    saveStoredCart(old, false); mount();
    const paid = cart.items.filter((i) => i.price > 0);
    expect(paid.map((i) => [i.id, i.setSize, i.qty])).toEqual(old.map((i) => [i.id, 5, 1]));
  });
});
