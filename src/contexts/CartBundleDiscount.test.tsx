import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CartProvider, useCart, type CartItem } from "./CartContext";
import { saveStoredCart } from "@/lib/cartRules";
import { createShopifyCheckout } from "@/lib/shopify";

vi.mock("canvas-confetti", () => ({ default: { create: () => vi.fn() } }));
vi.mock("@/lib/tracking", () => ({ trackPixelAddToCart: vi.fn(), syncShopifyConsentWithTimeout: vi.fn() }));
vi.mock("@/lib/klaviyo", () => ({ trackAddedToCart: vi.fn(), variantIdFor: () => null }));
vi.mock("@/lib/shopify", async original => ({
  ...await original<typeof import("@/lib/shopify")>(),
  createShopifyCheckout: vi.fn(), isShopifyCartCompleted: vi.fn(async () => false),
  storefrontApiRequest: vi.fn(async () => null),
}));
vi.mock("@/lib/bundleOnline", async original => ({
  ...await original<typeof import("@/lib/bundleOnline")>(),
  useOnlineBundles: () => ({ "fruit-punch": "ready", "fresh-flash": "ready", "family-first": "ready", "classic-starter": "ready", "classic-squad": "ready", "classic-vorrat": "ready" }),
}));

let cart: ReturnType<typeof useCart>;
function Probe() { cart = useCart(); return null; }
const single: CartItem = { id: "PEACH PARTY", name: "PEACH PARTY", price: 7.49, qty: 1, image: "" };
const bundle = (id: string, price: number): CartItem => ({ id, name: id, price, qty: 1, image: "" });
const mount = () => render(<CartProvider><Probe /></CartProvider>);
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
afterEach(cleanup);

describe("Native bundle discount codes", () => {
  it.each([["fruit-punch", 21.9], ["fresh-flash", 27.9], ["family-first", 49.9], ["classic-starter", 21.9], ["classic-squad", 34.9], ["classic-vorrat", 59.9]] as const)(
    "%s applies the verified EUR 5 campaign and passes it to Shopify", (id, price) => {
      saveStoredCart([bundle(id, price)], false); mount();
      act(() => cart.applyManualDiscountCode("VIRALVIDEO"));
      expect(cart.discountCode).toBe("VIRALVIDEO");
      expect(cart.discountCalculatedAtCheckout).toBe(false);
      expect(cart.discountLines).toEqual([{ kind: "code", label: "VIRALVIDEO", amount: 5 }]);
      expect(cart.discountedTotal).toBe(price - 5);
      expect(new URL(cart.checkoutUrl ?? "https://invalid.test").searchParams.get("discount")).toBe("VIRALVIDEO");
      expect(createShopifyCheckout).not.toHaveBeenCalled();
    },
  );
  it("keeps mixed-cart quantities and removes the code without stale savings", () => {
    saveStoredCart([bundle("fresh-flash", 27.9), single], false); mount();
    act(() => cart.applyManualDiscountCode("VIRALVIDEO"));
    act(() => cart.updateQty("fresh-flash", 2));
    expect(cart.discountCalculatedAtCheckout).toBe(false);
    expect(cart.discountedTotal).toBeCloseTo(27.9 * 2 + 7.49 - 5);
    expect(new URL(cart.checkoutUrl ?? "https://invalid.test").pathname).toContain("55628142707030:2");
    act(() => cart.clearManualDiscountCode());
    expect(cart.discountCode).toBeNull();
    expect(cart.discountedTotal).toBeCloseTo(27.9 * 2 + 7.49);
    expect(cart.discountLines).toEqual([]);
    expect(cart.discountCalculatedAtCheckout).toBe(false);
    expect(new URL(cart.checkoutUrl ?? "https://invalid.test").searchParams.has("discount")).toBe(false);
  });
  it("does not fabricate savings for a known code on bundles", () => {
    saveStoredCart([bundle("fresh-flash", 27.9)], false); mount();
    act(() => cart.applyManualDiscountCode("DROP20"));
    expect(cart.discountCalculatedAtCheckout).toBe(true);
    expect(cart.discountedTotal).toBe(27.9);
    expect(cart.discountLines).toEqual([]);
  });
  it("single cans retain Shopify-confirmed VIRALVIDEO allocations", async () => {
    vi.mocked(createShopifyCheckout).mockResolvedValue({ url: "https://example.test/checkout", cartId: "cart", discountedSubtotal: 16.90, discountApplicable: true, discounts: [{ kind: "code", label: "VIRALVIDEO", amount: 5 }] });
    saveStoredCart([{ ...single, qty: 3 }], false); mount();
    act(() => cart.applyManualDiscountCode("VIRALVIDEO"));
    await waitFor(() => expect(cart.discountedTotal).toBe(16.90));
    expect(cart.discountCalculatedAtCheckout).toBe(false);
    expect(cart.discountLines).toEqual([{ kind: "code", label: "VIRALVIDEO", amount: 5 }]);
  });
});
 it("retains the code below the minimum and reevaluates after quantities change", async () => {
   vi.mocked(createShopifyCheckout).mockImplementation(async (lines) => {
     const quantity = lines[0].quantity;
     const applies = quantity >= 3;
     return { url: "https://example.test/checkout", cartId: "cart", discountedSubtotal: applies ? 16.9 : quantity * 7.49,
       discountApplicable: applies, discounts: applies ? [{ kind: "code", label: "VIRALVIDEO", amount: 5 }] : [] };
   });
   saveStoredCart([{ ...single, qty: 2 }], false); mount();
   act(() => cart.applyManualDiscountCode("viralvideo"));
   await waitFor(() => expect(cart.isCheckingOut).toBe(false));
   expect(cart.discountCode).toBe("VIRALVIDEO");
   expect(cart.discountMinimumPending).toBe(true);
   expect(cart.discountedTotal).toBe(14.98);
   expect(cart.discountLines).toEqual([]);
   act(() => cart.updateQty(single.id, 3));
   await waitFor(() => expect(cart.discountedTotal).toBe(16.9));
   expect(cart.discountMinimumPending).toBe(false);
   act(() => cart.updateQty(single.id, 1));
   await waitFor(() => expect(cart.isCheckingOut).toBe(false));
   expect(cart.discountMinimumPending).toBe(true);
   expect(cart.discountLines).toEqual([]);
   expect(cart.discountCode).toBe("VIRALVIDEO");
 });
 it("does not replace a manually selected fixed code with a newsletter percentage", () => {
   saveStoredCart([bundle("classic-squad", 34.9)], false); mount();
   act(() => cart.activateNewsletterDiscount());
   act(() => cart.applyManualDiscountCode("VIRALVIDEO"));
   expect(cart.discountCode).toBe("VIRALVIDEO");
   expect(cart.activeDiscountPercent).toBe(0);
   expect(cart.discountedTotal).toBe(29.9);
 });
