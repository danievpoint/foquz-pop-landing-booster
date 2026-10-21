import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CartProvider, GIFT_ITEMS, useCart, type CartItem } from "./CartContext";
import { CART_STORAGE_KEY, CHECKOUT_PENDING_KEY, completeSetSizes, hasGuaranteedFreeShipping, readStoredCart, reconcileCart, replaceWithSet, saveStoredCart } from "@/lib/cartRules";
import { createShopifyCheckout, isShopifyCartCompleted, type ShopifyCheckout } from "@/lib/shopify";

vi.mock("canvas-confetti", () => ({ default: { create: () => vi.fn() } }));
vi.mock("@/lib/tracking", () => ({ trackPixelAddToCart: vi.fn(), syncShopifyConsentWithTimeout: vi.fn() }));
vi.mock("@/lib/klaviyo", () => ({ trackAddedToCart: vi.fn(), variantIdFor: () => null }));
vi.mock("@/lib/shopify", async (original) => ({ ...await original<typeof import("@/lib/shopify")>(), createShopifyCheckout: vi.fn(), applyDiscountCodeToCart: vi.fn(), isShopifyCartCompleted: vi.fn(), storefrontApiRequest: vi.fn(async () => null) }));
let cart: ReturnType<typeof useCart>;
function Probe() { cart = useCart(); return null; }
const single = (name = "PEACH PARTY"): CartItem => ({ id: name, name, qty: 1, price: 7.49, image: "" });
const set = (size: number, qty = size, flavor = "WATERMELON FLEX"): CartItem[] => [{ ...single(flavor), id: `set${size}:${flavor}`, name: `${flavor} · ${size}er Set`, setSize: size, flavor, qty }];
const bundle = (size: number) => ({ id: size === 3 ? "starter-bundle" : size === 5 ? "squad-bundle" : "vorrats-bundle", name: "Set", price: 34.9, image: "" });
const result = (amount: number, id = "cart"): ShopifyCheckout => ({ url: `https://example.com/${id}?channel=online_store`, cartId: id, discountedSubtotal: amount, discountApplicable: true, discounts: [] });
function deferred() { let resolve: (value: ShopifyCheckout) => void = () => {}; const promise = new Promise<ShopifyCheckout>((done) => { resolve = done; }); return { promise, resolve }; }
function mount() { return render(<CartProvider><Probe /></CartProvider>); }
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); vi.mocked(createShopifyCheckout).mockResolvedValue(result(7.49)); vi.mocked(isShopifyCartCompleted).mockResolvedValue(false); });
afterEach(cleanup);

describe("Set eligibility and upgrades", () => {
  it("replaces a paid Peach single with exactly five cans, not six", () => {
    const next = reconcileCart(replaceWithSet([single()], set(5)), GIFT_ITEMS, true);
    expect(next.filter((item) => item.price > 0).reduce((sum, item) => sum + item.qty, 0)).toBe(5);
    expect(next.filter((item) => item.price === 0)).toHaveLength(2);
  });
  it.each([[3, 5], [5, 10]])("replaces %s with %s, including legacy bundle IDs", (from, to) => {
    expect(completeSetSizes(replaceWithSet(set(from), set(to)))).toEqual([to]);
    expect(replaceWithSet([{ ...bundle(from), qty: 1 }], set(to))).toEqual(set(to));
  });
  it("keeps product-page adds additive but cart upgrades atomic", () => {
    mount(); act(() => cart.addToCart(1, single()));
    act(() => cart.addToCart(1, bundle(5)));
    expect(cart.items.filter((item) => item.price > 0).reduce((sum, item) => sum + item.qty, 0)).toBe(6);
    act(() => cart.replaceCartWithSet(bundle(10)));
    expect(cart.items.filter((item) => item.price > 0).reduce((sum, item) => sum + item.qty, 0)).toBe(10);
  });
  it.each([5, 10])("only complete %s sets retain gifts and shipping below 29 EUR", (size) => {
    expect(hasGuaranteedFreeShipping(set(size))).toBe(true);
    const full = reconcileCart(set(size), GIFT_ITEMS, true);
    expect(full.filter((item) => item.price === 0).map((item) => item.qty)).toEqual([1, 1]);
    const partial = reconcileCart([...set(size, 1), ...full.filter((item) => item.price === 0)], GIFT_ITEMS, true);
    expect(hasGuaranteedFreeShipping(partial)).toBe(false);
    expect(partial).toHaveLength(1);
    expect(hasGuaranteedFreeShipping(set(size, size - 1))).toBe(false);
    expect(hasGuaranteedFreeShipping(set(size, size * 2 - 1))).toBe(true);
  });
  it("removes gifts immediately on reducing/removing the eligible set", () => {
    saveStoredCart(set(5), false); mount();
    act(() => cart.updateQty("set5:WATERMELON FLEX", 1));
    expect(cart.items).toHaveLength(1);
    act(() => cart.removeFromCart("set5:WATERMELON FLEX"));
    expect(cart.items).toEqual([]);
  });
  it("preserves a second complete group and old bundles", () => {
    expect(hasGuaranteedFreeShipping([...set(5, 1), ...set(10)])).toBe(true);
    expect(hasGuaranteedFreeShipping([{ ...bundle(5), qty: 2 }])).toBe(true);
    expect(reconcileCart([...set(5), ...set(10)], GIFT_ITEMS, true).filter((item) => item.price === 0)).toHaveLength(2);
  });
});

describe("Reload validation", () => {
  it("restores saved cans and gifts without initialization wiping them", () => {
    saveStoredCart(set(5), true); const view = mount();
    expect(cart.items.filter((item) => item.price > 0)).toEqual(set(5));
    expect(cart.prioShipping).toBe(true); view.unmount(); mount();
    expect(cart.items.filter((item) => item.price > 0)).toEqual(set(5));
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "{}").items).toHaveLength(3);
  });
  it("rejects broken/unsupported storage and invalid quantities", () => {
    localStorage.setItem(CART_STORAGE_KEY, "broken"); expect(readStoredCart().items).toEqual([]);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 99, items: [single()] })); expect(readStoredCart().items).toEqual([]);
    saveStoredCart([{ ...single(), qty: -1 }, { ...single(), id: "unknown" }], false); expect(readStoredCart().items).toEqual([]);
  });
  it("removes Thai standalone but never a Thai set component", () => {
    saveStoredCart([single("THAI STYLE"), ...set(5, 5, "THAI STYLE")], false);
    expect(readStoredCart().items).toEqual(set(5, 5, "THAI STYLE"));
  });
  it("keeps pending abandoned checkouts over reload and clears only matching completed snapshots", async () => {
    saveStoredCart([single()], false); mount(); await waitFor(() => expect(cart.checkoutUrl).not.toBeNull());
    act(() => cart.markCheckoutPending());
    expect(localStorage.getItem(CHECKOUT_PENDING_KEY)).not.toBeNull();
    cleanup(); mount(); await waitFor(() => expect(isShopifyCartCompleted).toHaveBeenCalled());
    expect(cart.items).toHaveLength(1);
    vi.mocked(isShopifyCartCompleted).mockResolvedValue(true);
    await act(async () => { window.dispatchEvent(new Event("focus")); });
    expect(cart.items).toEqual([]);
    expect(readStoredCart().items).toEqual([]);
  });
  it("does not clear newly changed items after completion of an old checkout", async () => {
    saveStoredCart([single()], false); mount(); await waitFor(() => expect(cart.checkoutUrl).not.toBeNull());
    act(() => cart.markCheckoutPending()); act(() => cart.addToCart(1, single("BLUEBERRY FLOW")));
    vi.mocked(isShopifyCartCompleted).mockResolvedValue(true);
    await act(async () => { window.dispatchEvent(new Event("focus")); });
    expect(cart.items).toHaveLength(2);
  });
});

describe("Current-only Shopify prices and links", () => {
  it("never combines a previous sum/link with new items", async () => {
    const next = deferred(); mount(); act(() => cart.addToCart(1, single()));
    await waitFor(() => expect(cart.discountedTotal).toBe(7.49));
    await waitFor(() => expect(cart.checkoutUrl).not.toBeNull());
    vi.mocked(createShopifyCheckout).mockReturnValueOnce(next.promise);
    act(() => cart.addToCart(1, single("BLUEBERRY FLOW")));
    expect(cart.discountedTotal).toBe(14.98); expect(cart.checkoutUrl).toBeNull(); expect(cart.isCheckingOut).toBe(true);
    await act(async () => next.resolve(result(14.98, "new")));
    expect(cart.checkoutUrl).toContain("/new?");
  });
  it("ignores out-of-order item and discount responses, including invalid old codes", async () => {
    const first = deferred(), second = deferred(), third = deferred();
    vi.mocked(createShopifyCheckout).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise).mockReturnValueOnce(third.promise);
    mount(); act(() => cart.addToCart(1, single()));
    act(() => cart.applyManualDiscountCode("DROP20"));
    act(() => cart.applyManualDiscountCode("CLOUD10"));
    await act(async () => third.resolve(result(6.75, "cloud")));
    await act(async () => second.resolve({ ...result(5.99, "drop"), discountApplicable: false }));
    await act(async () => first.resolve(result(7.49, "initial")));
    expect(cart.discountCode).toBe("CLOUD10"); expect(cart.discountedTotal).toBe(6.75); expect(cart.checkoutUrl).toContain("/cloud?");
  });
  it("keeps full five-can shipping entitlement even with DROP20 below 29", async () => {
    vi.mocked(createShopifyCheckout).mockResolvedValue(result(27.41)); saveStoredCart(set(5), false); mount();
    act(() => cart.applyManualDiscountCode("DROP20")); await waitFor(() => expect(cart.discountedTotal).toBe(27.41));
    expect(hasGuaranteedFreeShipping(cart.items)).toBe(true);
  });
});
import { parseDiscountAllocations } from "@/lib/shopify";
import { hasCheckoutFreeShipping } from "@/lib/cartRules";

describe("Shopify-Rabattdarstellung", () => {
  it("trennt 5er-Set-Produktrabatt und DROP20-Bestellrabatt (37,45 − 2,55 − 6,98)", () => {
    const lines = parseDiscountAllocations({
      discountAllocations: [{ discountedAmount: { amount: "6.98" }, code: "drop20" }],
      lines: { edges: [
        { node: { discountAllocations: [{ discountedAmount: { amount: "1.50" }, title: "5er Set" }] } },
        { node: { discountAllocations: [{ discountedAmount: { amount: "1.05" }, title: "5er Set" }] } },
      ] },
    });
    expect(lines).toEqual([
      { kind: "automatic", label: "5er Set", amount: 2.55 },
      { kind: "code", label: "DROP20", amount: 6.98 },
    ]);
  });
  it("zeigt unbekannte Codes mit Shopify-Betrag", () => {
    expect(parseDiscountAllocations({ discountAllocations: [{ discountedAmount: { amount: "3.00" }, code: "NEU5" }] }))
      .toEqual([{ kind: "code", label: "NEU5", amount: 3 }]);
  });
  it("freie Dosen-Sets gelten an der Kasse nicht als versandfrei, echte Bundle-Produkte schon", () => {
    const cans = ["PEACH PARTY", "THAI STYLE", "LEMON BREEZY", "WATERMELON FLEX", "BLUEBERRY FLOW"].map((f) => ({ id: `set5:${f}`, name: f, price: 7.49, qty: 1, setSize: 5, flavor: f, image: "" }));
    expect(hasCheckoutFreeShipping(cans)).toBe(false);
    expect(hasCheckoutFreeShipping([{ id: "squad-bundle", name: "5er", price: 34.9, qty: 1, image: "" }])).toBe(true);
  });
});
