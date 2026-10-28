import { describe, it, expect, beforeEach } from "vitest";
import { verifyOnlineBundle } from "@/lib/bundleOnline";
import { hasCheckoutFreeShipping, isRetiredSetItem, readStoredCart, reconcileCart, CART_STORAGE_KEY } from "@/lib/cartRules";
import { buildOnlineStoreCartPermalink, VARIANT_GID_BY_ID } from "@/lib/shopify";

const js = (title: string, id: number, price: number, compare: number | null, available = true) =>
  ({ title, variants: [{ id, price, compare_at_price: compare, available }] });

describe("Onlineshop-Prüfung der festen Bundles", () => {
  it("Fruit Punch 3er mit 21,90 / 22,47 ist bestellbar", () => {
    expect(verifyOnlineBundle(3, js("FRUIT PUNCH – 3ER BUNDLE", 55628113117526, 2190, 2247))).toBe("ready");
  });
  it("Fresh Flash 4er mit 27,90 / 29,96 ist bestellbar", () => {
    expect(verifyOnlineBundle(4, js("FRESH FLASH – 4ER BUNDLE", 55628142707030, 2790, 2996))).toBe("ready");
  });
  it("8er bleibt gesperrt, solange der Titel noch 10ER VORRATS-BUNDLE lautet", () => {
    expect(verifyOnlineBundle(8, js("10ER VORRATS-BUNDLE", 55628181274966, 4990, 5992))).toBe("unverified");
  });
  it("Family First 8er mit 49,90 / 59,92 ist bestellbar", () => {
    expect(verifyOnlineBundle(8, js("FAMILY FIRST – 8ER BUNDLE", 55628181274966, 4990, 5992))).toBe("ready");
  });
  it("falscher Preis sperrt das Bundle", () => {
    expect(verifyOnlineBundle(4, js("FRESH FLASH – 4ER BUNDLE", 55628142707030, 3490, 3745))).toBe("unverified");
  });
  it("ausverkauft im Onlineshop = nicht lieferbar", () => {
    expect(verifyOnlineBundle(3, js("FRUIT PUNCH – 3ER BUNDLE", 55628113117526, 2190, 2247, false))).toBe("soldout");
  });
});

describe("Warenkorb mit festen Bundles", () => {
  beforeEach(() => localStorage.clear());
  const item = (id: string, qty = 1, price = 0) => ({ id, name: id, image: "", price, qty });

  it("Bundles laufen auf die echten Varianten 55628113117526 / 55628142707030 / 55628181274966", () => {
    expect(VARIANT_GID_BY_ID["fruit-punch"]).toBe("gid://shopify/ProductVariant/55628113117526");
    expect(VARIANT_GID_BY_ID["fresh-flash"]).toBe("gid://shopify/ProductVariant/55628142707030");
    expect(VARIANT_GID_BY_ID["family-first"]).toBe("gid://shopify/ProductVariant/55628181274966");
  });
  it("nur Family First ist pauschal versandfrei, Fresh Flash nicht", () => {
    expect(hasCheckoutFreeShipping([item("family-first")])).toBe(true);
    expect(hasCheckoutFreeShipping([item("fresh-flash")])).toBe(false);
    expect(hasCheckoutFreeShipping([item("fruit-punch")])).toBe(false);
  });
  it("jedes Bundle bekommt Sticker und Nasen-Stripes", () => {
    const gifts = [{ id: "gift-sticker", name: "s", image: "", price: 0 }, { id: "gift-nasenstripes", name: "n", image: "", price: 0 }];
    expect(reconcileCart([item("fruit-punch", 1, 21.9)], gifts, true).map((i) => i.id)).toEqual(["fruit-punch", "gift-sticker", "gift-nasenstripes"]);
  });
  it("alte 3/5/10-Bundles werden nicht als neue Bundles gewertet", () => {
    expect(isRetiredSetItem(item("squad-bundle"))).toBe(true);
    expect(isRetiredSetItem(item("starter-bundle"))).toBe(true);
    expect(isRetiredSetItem(item("fresh-flash"))).toBe(false);
  });
  it("gespeicherte Bundles bleiben nach Neuladen mit freigegebenem Preis erhalten", () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, prioShipping: false, items: [item("fresh-flash", 2, 1), item("squad-bundle", 1, 34.9)] }));
    const { items } = readStoredCart();
    expect(items.find((i) => i.id === "fresh-flash")).toMatchObject({ qty: 2, price: 27.9 });
    expect(items.find((i) => i.id === "squad-bundle")).toMatchObject({ price: 34.9 });
  });
  it("gemischter Warenkorb geht komplett in den Onlineshop-Link", () => {
    const url = buildOnlineStoreCartPermalink([
      { variantId: VARIANT_GID_BY_ID["fresh-flash"], quantity: 2 },
      { variantId: VARIANT_GID_BY_ID["PEACH PARTY"], quantity: 1 },
      { variantId: VARIANT_GID_BY_ID["gift-sticker"], quantity: 1 },
    ]);
    expect(url).toContain("/cart/55628142707030:2,52867405513046:1,55135962988886:1");
  });
});
