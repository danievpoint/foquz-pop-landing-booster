import { describe, expect, it, vi, afterEach } from "vitest";
import { fixedDiscountAmount, bundleDiscountAmount, hasBundleDiscountRule } from "./discountRules";
import { validateDiscountCode } from "./shopify";

afterEach(() => vi.unstubAllGlobals());
describe("verified fixed campaign", () => {
  it.each([[0, 0], [7.49, 0], [14.98, 0], [14.99, 0], [15, 5], [21.9, 5], [34.9, 5], [59.9, 5], [119.8, 5]])("EUR %s gives EUR %s once per order", (total, amount) => {
    expect(fixedDiscountAmount(" viralvideo ", total)).toBe(amount);
  });
  it("never invents a fixed amount for other codes", () => {
    expect(fixedDiscountAmount("DROP20", 34.9)).toBe(0);
    expect(fixedDiscountAmount(null, 34.9)).toBe(0);
    expect(fixedDiscountAmount("VIRALVIDEO", NaN)).toBe(0);
  });
  it("accepts the known minimum-spend code without a misleading one-can probe", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    expect(await validateDiscountCode(" viralvideo ")).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("still validates other codes with Shopify", async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { cartCreate: { cart: { discountCodes: [{ code: "DROP20", applicable: true }] } } } }) });
    vi.stubGlobal("fetch", fetch);
    expect(await validateDiscountCode("DROP20")).toBe(true);
    expect(fetch).toHaveBeenCalledOnce();
  });
});

 describe("bundle percentage rounding", () => {
   it.each([[7.49, 0.74], [14.98, 1.49], [21.9, 2.19], [27.9, 2.79], [34.9, 3.49], [49.9, 4.99], [59.9, 5.99], [49.88, 4.98]])("CLOUD10 on %s returns %s", (total, expected) => {
     expect(bundleDiscountAmount(" cloud10 ", total)).toBe(expected);
   });
   it("never calculates inactive, unknown or prototype-property codes", () => {
     for (const code of [null, "KEVIN", "FOQUZ20", "OTHER10", "constructor"]) {
       expect(hasBundleDiscountRule(code)).toBe(false);
       expect(bundleDiscountAmount(code, 34.9)).toBe(0);
     }
   });
   it("retains the fixed discount and minimum", () => {
     expect(bundleDiscountAmount("VIRALVIDEO", 14.98)).toBe(0);
     expect(bundleDiscountAmount("VIRALVIDEO", 34.9)).toBe(5);
   });
 });
