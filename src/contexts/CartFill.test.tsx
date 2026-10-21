import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CartProvider, useCart, type CartItem } from "./CartContext";
import { paidCanCount, planFillToSet } from "@/lib/cartRules";
import { createShopifyCheckout, type ShopifyCheckout } from "@/lib/shopify";
import { trackAddedToCart } from "@/lib/klaviyo";

vi.mock("canvas-confetti", () => ({ default: { create: () => vi.fn() } }));
vi.mock("@/lib/tracking", () => ({ trackPixelAddToCart: vi.fn(), syncShopifyConsentWithTimeout: vi.fn() }));
vi.mock("@/lib/klaviyo", () => ({ trackAddedToCart: vi.fn(), variantIdFor: () => null }));
vi.mock("@/lib/shopify", async (original) => ({ ...await original<typeof import("@/lib/shopify")>(), createShopifyCheckout: vi.fn(), isShopifyCartCompleted: vi.fn(async () => false), storefrontApiRequest: vi.fn() }));
import { storefrontApiRequest } from "@/lib/shopify";
import { writeConsent } from "@/lib/consent";
import { refreshFlavorStock } from "@/lib/setMix";

let cart: ReturnType<typeof useCart>;
function Probe() { cart = useCart(); return null; }
const mount = () => render(<CartProvider><Probe /></CartProvider>);
const single = (name: string, qty = 1): CartItem => ({ id: name, name, qty, price: 7.49, image: "" });
const paid = () => paidCanCount(cart.items);
const gifts = () => cart.items.filter((i) => i.id.startsWith("gift-"));
const res = (v: number, id: string): ShopifyCheckout => ({ url: `https://checkout.foquz.de/${id}`, cartId: id, discountedSubtotal: v, discountApplicable: true, discounts: [], merchandiseValue: v });
const stock = { "PEACH PARTY": { available: true, qty: 3 }, "THAI STYLE": { available: false, qty: 0 }, "LEMON BREEZY": { available: true, qty: 2 }, "WATERMELON FLEX": { available: true, qty: 50 }, "BLUEBERRY FLOW": { available: true, qty: 40 } };

const stockOk = async () => ({ data: { nodes: Array.from({ length: 5 }, () => ({ availableForSale: true, quantityAvailable: 50 })) } });
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); vi.mocked(storefrontApiRequest).mockImplementation(stockOk as never); writeConsent({ marketing: true, choiceMade: true }); let n = 0; vi.mocked(createShopifyCheckout).mockImplementation(async () => res(1, `c${++n}`)); });
afterEach(cleanup);

describe("Auffüllen auf Sets (reine Regel)", () => {
  it("leer → 3 nur verfügbare Sorten, Thai ausverkauft nie", () => {
    const plan = planFillToSet([], 3, stock, {}, 7.49)!;
    expect(paidCanCount(plan.items)).toBe(3);
    expect(plan.added["THAI STYLE"]).toBeUndefined();
  });
  it("1 Peach → 3 / → 5 behält Peach und füllt nur auf", () => {
    for (const t of [3, 5]) {
      const plan = planFillToSet([single("PEACH PARTY")], t, stock, {}, 7.49)!;
      expect(paidCanCount(plan.items)).toBe(t);
      expect(plan.kept).toEqual({ "PEACH PARTY": 1 });
      expect(Object.values(plan.added).reduce((a, b) => a + b, 0)).toBe(t - 1);
    }
  });
  it("3 → 5 behält Mischung, 5 → 3 und 10 → 10 no-op", () => {
    const three = [single("LEMON BREEZY", 2), single("PEACH PARTY")];
    const plan = planFillToSet(three, 5, stock, {}, 7.49)!;
    expect(plan.kept).toEqual({ "LEMON BREEZY": 2, "PEACH PARTY": 1 });
    expect(paidCanCount(plan.items)).toBe(5);
    expect(planFillToSet([single("WATERMELON FLEX", 5)], 3, stock, {}, 7.49)).toBeNull();
    expect(planFillToSet([single("WATERMELON FLEX", 10)], 10, stock, {}, 7.49)).toBeNull();
  });
  it("respektiert den Bestand je Sorte; reicht er nicht, no-op", () => {
    const tiny = { ...stock, "WATERMELON FLEX": { available: true, qty: 0 }, "BLUEBERRY FLOW": { available: false, qty: 0 } };
    expect(planFillToSet([], 10, tiny, {}, 7.49)).toBeNull(); // nur 3+2 lieferbar
    const p = planFillToSet([], 5, tiny, {}, 7.49)!;
    expect(p.added).toEqual({ "PEACH PARTY": 3, "LEMON BREEZY": 2 });
  });
  it("altes echtes 5er Bundle zählt 5 Dosen; Auffüllen mit alten Bundles wird nicht angeboten", () => {
    const items: CartItem[] = [{ id: "squad-bundle", name: "5er", qty: 1, price: 34.9, image: "" }, { id: "gift-sticker", name: "g", qty: 1, price: 0, image: "" }, { id: "prio-versand", name: "p", qty: 1, price: 2, image: "" }];
    expect(paidCanCount(items)).toBe(5);
    expect(planFillToSet(items, 10, stock, {}, 7.49)).toBeNull();
  });
});

describe("Auffüllen im Warenkorb", () => {
  it("1 → 5: Sorte bleibt, Zugaben genau einmal, Klaviyo genau einmal mit Shopify-Wert und -Link", async () => {
    mount();
    act(() => cart.addToCart(1, { id: "PEACH PARTY", name: "PEACH PARTY", price: 7.49, image: "" }));
    await waitFor(() => expect(trackAddedToCart).toHaveBeenCalledTimes(1));
    vi.mocked(createShopifyCheckout).mockImplementation(async () => res(34.9, "five"));
    const plan = cart.planFill(5)!;
    let ok = false;
    await act(async () => { ok = await cart.fillCartToSet(5, plan.added); });
    expect(ok).toBe(true);
    expect(paid()).toBe(5);
    expect(cart.items.find((i) => i.flavor === "PEACH PARTY")!.qty).toBeGreaterThanOrEqual(1);
    expect(gifts().map((g) => g.qty)).toEqual([1, 1]);
    await waitFor(() => expect(trackAddedToCart).toHaveBeenCalledTimes(2));
    const [, cartAfter, confirmed] = vi.mocked(trackAddedToCart).mock.calls[1];
    // Vollständiger Warenkorb inkl. Gratis-Positionen (Preis 0)
    expect(cartAfter.filter((l) => l.id.startsWith("gift-")).map((l) => l.price)).toEqual([0, 0]);
    expect(cartAfter.reduce((s, l) => s + (l.id.startsWith("gift-") ? 0 : l.qty), 0)).toBe(5);
    expect(confirmed).toEqual({ value: 34.9, checkoutUrl: expect.stringContaining("checkout.foquz.de/five") });
    // no-op: 5 → 3 und erneutes 5 erzeugen weder Mutation noch Event
    await act(async () => { expect(await cart.fillCartToSet(3, {})).toBe(false); expect(await cart.fillCartToSet(5, {})).toBe(false); });
    await new Promise((r) => setTimeout(r, 20));
    expect(trackAddedToCart).toHaveBeenCalledTimes(2);
    expect(gifts()).toHaveLength(2);
  });
  it("Doppelklick füllt nur einmal auf", async () => {
    mount();
    const plan = cart.planFill(3)!;
    await act(async () => { await Promise.all([cart.fillCartToSet(3, plan.added), cart.fillCartToSet(3, plan.added)]); });
    expect(paid()).toBe(3);
    await waitFor(() => expect(trackAddedToCart).toHaveBeenCalledTimes(1));
  });
  it("kein Event, wenn Shopify Dosen stillschweigend weglässt", async () => {
    vi.mocked(createShopifyCheckout).mockResolvedValue({ ...res(14.98, "drop"), quantityMismatch: true });
    mount();
    const plan = cart.planFill(3)!;
    await act(async () => { await cart.fillCartToSet(3, plan.added); });
    await new Promise((r) => setTimeout(r, 20));
    expect(trackAddedToCart).not.toHaveBeenCalled();
    expect(cart.checkoutUrl).toBeNull();
  });
  it("Bestandsabfrage scheitert: Aktion verweigert, keine Mutation", async () => {
    mount();
    const plan = cart.planFill(3)!;
    vi.mocked(storefrontApiRequest).mockRejectedValue(new Error("offline"));
    let ok = true;
    await act(async () => { ok = await cart.fillCartToSet(3, plan.added); });
    expect(ok).toBe(false);
    expect(cart.items).toHaveLength(0);
  });
  it("nicht lieferbare Sorte im Warenkorb sperrt die Kasse", async () => {
    mount();
    act(() => cart.addToCart(1, { id: "PEACH PARTY", name: "PEACH PARTY", price: 7.49, image: "" }));
    vi.mocked(storefrontApiRequest).mockResolvedValue({ data: { nodes: [{ availableForSale: false, quantityAvailable: 0 }, null, null, null, null] } } as never);
    await act(async () => { await refreshFlavorStock(); });
    await new Promise((r) => setTimeout(r, 20));
    expect(cart.unavailableFlavors.length).toBeGreaterThan(0);
    expect(cart.checkoutUrl).toBeNull();
  });
  it("ohne Marketing-Einwilligung beim Hinzufügen kein Event, auch nach späterer Zustimmung", async () => {
    writeConsent({ marketing: false, choiceMade: true });
    let release!: () => void;
    vi.mocked(createShopifyCheckout).mockImplementation(() => new Promise((r) => { release = () => r(res(7.49, "late")); }));
    mount();
    act(() => cart.addToCart(1, { id: "PEACH PARTY", name: "PEACH PARTY", price: 7.49, image: "" }));
    await waitFor(() => expect(release).toBeDefined());
    act(() => { writeConsent({ marketing: true, choiceMade: true }); });
    await act(async () => { release(); await new Promise((r) => setTimeout(r, 20)); });
    expect(trackAddedToCart).not.toHaveBeenCalled();
  });
});
