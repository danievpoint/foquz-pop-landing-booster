import { describe, expect, it } from "vitest";
import { AddToCartTracker } from "./addToCartTracker";
import { planFillToSet } from "./cartRules";

type Snap = { lines: { id: string; price: number; qty: number }[] };
const conf = (value: number) => ({ value, checkoutUrl: `https://checkout.foquz.de/c/${value}` });

describe("AddToCartTracker", () => {
  it("alte abgelehnte Anfrage verwirft keine neuere Aktion", () => {
    const t = new AddToCartTracker<string, Snap>();
    t.enqueue("A", true); t.bind("K1", { lines: [] }, true);
    t.enqueue("B", true); t.bind("K2", { lines: [] }, true);
    t.fail("K1"); // alte Promise rejected nach neuer Aktion
    const sent = t.confirm("K2", conf(34.9), true);
    expect(sent.map((e) => e.added)).toEqual(["B"]);
  });

  it("vor Einwilligung ausgelöste Aktion wird nach Zustimmung nicht nachgesendet", () => {
    const t = new AddToCartTracker<string, Snap>();
    expect(t.enqueue("A", false)).toBeNull();
    t.bind("K1", { lines: [] }, true);
    expect(t.confirm("K1", conf(21.9), true)).toEqual([]); // Zustimmung kam vor Shopify-Antwort
  });

  it("Widerruf verwirft endgültig, neue Zustimmung belebt nichts wieder", () => {
    const t = new AddToCartTracker<string, Snap>();
    t.enqueue("A", true); t.bind("K1", { lines: [] }, true);
    t.clear(); // Widerruf
    expect(t.confirm("K1", conf(21.9), true)).toEqual([]);
  });

  it("zwei schnelle Aktionen melden jeweils ihren eigenen bestätigten Warenkorb", () => {
    const t = new AddToCartTracker<string, Snap>();
    t.enqueue("A", true); t.bind("K3", { lines: [{ id: "x", price: 7.49, qty: 3 }] }, true);
    t.enqueue("B", true); t.bind("K5", { lines: [{ id: "x", price: 7.49, qty: 5 }] }, true);
    const b = t.confirm("K5", conf(34.9), true);
    const a = t.confirm("K3", conf(21.9), true); // veraltete Antwort trifft später ein
    expect(b).toHaveLength(1); expect(b[0].added).toBe("B"); expect(b[0].confirmed.value).toBe(34.9);
    expect(a).toHaveLength(1); expect(a[0].added).toBe("A"); expect(a[0].snapshot.lines[0].qty).toBe(3);
    expect(t.confirm("K5", conf(34.9), true)).toEqual([]); // genau einmal
  });

  it("Snapshot enthält vollständigen Warenkorb inkl. Gratis-Positionen und Prio", () => {
    const t = new AddToCartTracker<string, Snap>();
    t.enqueue("fill-5", true);
    const lines = [{ id: "set5:PEACH PARTY", price: 7.49, qty: 5 }, { id: "gift-sticker", price: 0, qty: 1 }, { id: "gift-nasenstripes", price: 0, qty: 1 }, { id: "prio-versand", price: 1.95, qty: 1 }];
    t.bind("K", { lines }, true);
    const [e] = t.confirm("K", conf(34.9), true);
    expect(e.snapshot.lines.map((l) => l.id)).toEqual(["set5:PEACH PARTY", "gift-sticker", "gift-nasenstripes", "prio-versand"]);
  });

  it("Legacy-Bundle-Warenkorb erzeugt kein Event", () => {
    const t = new AddToCartTracker<string, Snap>();
    t.enqueue("A", true); t.bind("K", { lines: [] }, false);
    expect(t.confirm("K", conf(34.9), true)).toEqual([]);
  });

  it("ohne Einwilligung bei Bestätigung wird nichts gesendet", () => {
    const t = new AddToCartTracker<string, Snap>();
    t.enqueue("A", true); t.bind("K", { lines: [] }, true);
    expect(t.confirm("K", conf(21.9), false)).toEqual([]);
  });
});

describe("Auffüllen mit altem Bundle-Produkt", () => {
  it("bietet kein ungetestetes Auffüllen an", () => {
    const items = [{ id: "starter-bundle", name: "3er", price: 21.9, image: "", qty: 1 }];
    expect(planFillToSet(items as never, 5, null, {}, 7.49)).toBeNull();
  });
});
