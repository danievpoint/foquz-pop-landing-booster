import { afterEach, expect, it, vi } from "vitest";
import { isShopifyCartCompleted } from "./shopify";

afterEach(() => vi.unstubAllGlobals());
it("does not mistake an expired/missing Shopify cart for a completed order", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: { cart: null } }) })));
  expect(await isShopifyCartCompleted("pending-cart")).toBe(false);
});
it("accepts an explicitly empty previously launched Shopify cart", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: { cart: { id: "pending-cart", totalQuantity: 0 } } }) })));
  expect(await isShopifyCartCompleted("pending-cart")).toBe(true);
});
it("keeps abandoned nonempty checkouts", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: { cart: { id: "pending-cart", totalQuantity: 5 } } }) })));
  expect(await isShopifyCartCompleted("pending-cart")).toBe(false);
});