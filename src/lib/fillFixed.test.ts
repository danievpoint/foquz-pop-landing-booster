import { describe, expect, it } from "vitest";
import { planFillToSet } from "./cartRules";
import { FIXED_SET_MIX } from "./setMix";

const F = ["THAI STYLE", "LEMON BREEZY", "PEACH PARTY", "WATERMELON FLEX", "BLUEBERRY FLOW"];
const stock = Object.fromEntries(F.map((f) => [f, { available: true, qty: 40 }]));
const set = (size: number, mix: Record<string, number>) =>
  Object.entries(mix).map(([f, q]) => ({ id: `set${size}:${f}`, name: f, price: 7.49, image: "", setSize: size, flavor: f, qty: q }));
const mixOf = (p: ReturnType<typeof planFillToSet>) =>
  Object.fromEntries(p!.items.filter((i) => i.flavor).map((i) => [i.flavor!, i.qty]));

describe("Auffüllen im festen Modus", () => {
  it.each([3, 4, 8])("leer → %ier exakt fest", (t) => {
    expect(mixOf(planFillToSet([], t, stock, {}, 7.49, FIXED_SET_MIX))).toEqual(FIXED_SET_MIX[t]);
  });
  it("Fruit Punch → Fresh Flash ergänzt genau 1 Blueberry", () => {
    const p = planFillToSet(set(3, FIXED_SET_MIX[3]), 4, stock, {}, 7.49, FIXED_SET_MIX)!;
    expect(p.added).toEqual({ "BLUEBERRY FLOW": 1 });
    expect(mixOf(p)).toEqual(FIXED_SET_MIX[4]);
  });
  it("Fresh Flash → Family First ergänzt je 1 der vier Sorten", () => {
    const p = planFillToSet(set(4, FIXED_SET_MIX[4]), 8, stock, {}, 7.49, FIXED_SET_MIX)!;
    expect(p.added).toEqual(FIXED_SET_MIX[4]);
    expect(mixOf(p)).toEqual(FIXED_SET_MIX[8]);
  });
  it("inkompatible freie Auswahl: keine feste Karte, Warenkorb unverändert", () => {
    const items = set(3, { "WATERMELON FLEX": 3 });
    expect(planFillToSet(items, 4, stock, {}, 7.49, FIXED_SET_MIX)).toBeNull();
    expect(items[0].qty).toBe(3);
  });
  it("freier Modus behält bisherige Verteilung", () => {
    const p = planFillToSet(set(3, { "WATERMELON FLEX": 3 }), 5, stock, {}, 7.49)!;
    expect(Object.values(p.added).reduce((a, b) => a + b, 0)).toBe(2);
  });
});
