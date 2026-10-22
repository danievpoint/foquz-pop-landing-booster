import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("canvas-confetti", () => ({ default: { create: () => vi.fn() } }));
vi.mock("@/lib/tracking", () => ({ trackPixelAddToCart: vi.fn(), syncShopifyConsentWithTimeout: vi.fn() }));
vi.mock("@/lib/klaviyo", () => ({ trackAddedToCart: vi.fn(), variantIdFor: () => null }));
vi.mock("@/lib/shopify", async (original) => ({ ...await original<typeof import("@/lib/shopify")>(), createShopifyCheckout: vi.fn(async () => null), isShopifyCartCompleted: vi.fn(async () => false), storefrontApiRequest: vi.fn() }));

import { storefrontApiRequest } from "@/lib/shopify";
import { CartProvider, useCart, type CartItem } from "@/contexts/CartContext";
import { FIXED_SET_MIX, getSetMix, getSetMode, refreshFlavorStock, setModeFor, setSetMix, validateSetMix } from "@/lib/setMix";
import { saveStoredCart } from "@/lib/cartRules";

const ORDER = ["PEACH PARTY", "THAI STYLE", "LEMON BREEZY", "WATERMELON FLEX", "BLUEBERRY FLOW"];
const all = (qty: number | null = 40) => Object.fromEntries(ORDER.map((f) => [f, { available: true, qty }]));
/** Shopify-Antwort in der Reihenfolge der Sorten; overrides je Sorte. */
const shopify = (over: Record<string, { availableForSale: boolean; quantityAvailable: number | null }> = {}) =>
  ({ data: { nodes: ORDER.map((f) => over[f] ?? { availableForSale: true, quantityAvailable: 40 }) } });
const respond = (r: unknown) => vi.mocked(storefrontApiRequest).mockResolvedValue(r as never);

let cart: ReturnType<typeof useCart>;
function Probe() { cart = useCart(); return null; }
const mount = () => render(<CartProvider><Probe /></CartProvider>);
const setProduct = (size: number) => ({ id: size === 3 ? "starter-bundle" : size === 5 ? "squad-bundle" : "vorrats-bundle", name: `${size}er`, price: 1, image: "" });
const cans = () => Object.fromEntries(cart.items.filter((i) => i.setSize).map((i) => [i.flavor, i.qty]));

beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
afterEach(cleanup);

describe("Bestandsabhängiger Set-Modus (Regel)", () => {
  it("alle fünf lieferbar → fest", () => { expect(setModeFor(all())).toBe("fixed"); });
  it("Thai 0 → frei", () => { expect(setModeFor({ ...all(), "THAI STYLE": { available: false, qty: 0 } })).toBe("free"); });
  it("andere Sorte 0 → frei", () => { expect(setModeFor({ ...all(), "BLUEBERRY FLOW": { available: false, qty: 0 } })).toBe("free"); });
  it("fehlender / unbekannter Bestand → nie fest", () => {
    expect(setModeFor(null)).toBe("unknown");
    const partial = all(); delete (partial as Record<string, unknown>)["LEMON BREEZY"];
    expect(setModeFor(partial)).toBe("unknown");
  });
  it("geringer Bestand: unter 2 Stück einer Sorte reicht nicht für das feste 10er → frei", () => {
    expect(setModeFor({ ...all(), "PEACH PARTY": { available: true, qty: 1 } })).toBe("free");
    expect(setModeFor({ ...all(), "PEACH PARTY": { available: true, qty: 2 } })).toBe("fixed");
  });
  it("feste Inhalte: 3er Thai+Lemon+Peach, 5er je 1, 10er je 2", () => {
    expect(FIXED_SET_MIX[3]).toEqual({ "THAI STYLE": 1, "LEMON BREEZY": 1, "PEACH PARTY": 1 });
    expect(FIXED_SET_MIX[5]).toEqual(Object.fromEntries(ORDER.map((f) => [f, 1])));
    expect(FIXED_SET_MIX[10]).toEqual(Object.fromEntries(ORDER.map((f) => [f, 2])));
  });
  it("Mengenprüfung verhindert Überverkauf inkl. bereits vorhandener Dosen", () => {
    const low = { ...all(), "PEACH PARTY": { available: true, qty: 2 } };
    expect(validateSetMix(10, FIXED_SET_MIX[10], low)).toBeNull();
    expect(validateSetMix(10, FIXED_SET_MIX[10], low, { "PEACH PARTY": 1 })).not.toBeNull();
    expect(validateSetMix(10, FIXED_SET_MIX[10], low, {}, 2)).not.toBeNull();
  });
});

describe("Modus live aus Shopify, Erholung und Warenkorb", () => {
  it("Ausverkauf → frei, Erholung → wieder fest, ohne Deploy", async () => {
    respond(shopify()); await refreshFlavorStock(); expect(getSetMode()).toBe("fixed");
    expect(getSetMix(5)).toEqual(FIXED_SET_MIX[5]);
    respond(shopify({ "THAI STYLE": { availableForSale: false, quantityAvailable: 0 } })); await refreshFlavorStock();
    expect(getSetMode()).toBe("free");
    expect(getSetMix(5)["THAI STYLE"] ?? 0).toBe(0);
    respond(shopify()); await refreshFlavorStock(); expect(getSetMode()).toBe("fixed");
  });
  it("fehlgeschlagene Abfrage → unbekannt statt fest", async () => {
    respond(shopify()); await refreshFlavorStock();
    respond(null); await refreshFlavorStock();
    expect(getSetMode()).toBe("unknown");
  });
  it("festes 5er/10er/3er landet mit exakter Zusammenstellung im Warenkorb", async () => {
    for (const size of [3, 5, 10]) {
      respond(shopify()); await refreshFlavorStock(); localStorage.clear(); cleanup(); mount();
      act(() => cart.addToCart(1, setProduct(size)));
      await waitFor(() => expect(cans()).toEqual(FIXED_SET_MIX[size]));
    }
  });
  it("stale Picker: im festen Modus geklickt, frisch ausverkauft → nichts gekauft", async () => {
    respond(shopify()); await refreshFlavorStock(); mount();
    respond(shopify({ "LEMON BREEZY": { availableForSale: false, quantityAvailable: 0 } }));
    await act(async () => { cart.addToCart(1, setProduct(5)); await new Promise((r) => setTimeout(r, 20)); });
    expect(cart.items).toEqual([]);
    expect(getSetMode()).toBe("free");
  });
  it("stale Picker: im freien Modus geklickt, frisch erholt → keine stille feste Mischung", async () => {
    respond(shopify({ "THAI STYLE": { availableForSale: false, quantityAvailable: 0 } })); await refreshFlavorStock();
    setSetMix(5, { "WATERMELON FLEX": 5 }); mount();
    respond(shopify());
    await act(async () => { cart.addToCart(1, setProduct(5)); await new Promise((r) => setTimeout(r, 20)); });
    expect(cart.items).toEqual([]);
    expect(getSetMode()).toBe("fixed");
  });
  it("10er fest wird abgelehnt, wenn die Menge je Sorte inkl. Warenkorb nicht reicht", async () => {
    respond(shopify({ "PEACH PARTY": { availableForSale: true, quantityAvailable: 2 } })); await refreshFlavorStock();
    saveStoredCart([{ id: "PEACH PARTY", name: "PEACH PARTY", price: 7.49, qty: 1, image: "" }], false); mount();
    await act(async () => { cart.addToCart(1, setProduct(10)); await new Promise((r) => setTimeout(r, 20)); });
    expect(cart.items.filter((i) => i.setSize)).toEqual([]);
  });
  it("bestehender freier Warenkorb wird bei Bestandserholung nicht umgemischt", async () => {
    const free: CartItem[] = [{ id: "set5:WATERMELON FLEX", name: "x", price: 7.49, qty: 5, image: "", setSize: 5, flavor: "WATERMELON FLEX" }];
    respond(shopify()); saveStoredCart(free, false); mount();
    await act(async () => { await refreshFlavorStock(); });
    expect(cans()).toEqual({ "WATERMELON FLEX": 5 });
  });
});
