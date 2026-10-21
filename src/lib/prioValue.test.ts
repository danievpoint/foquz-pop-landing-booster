import { describe, expect, it } from "vitest";
import { merchandiseValueExcluding } from "./shopify";

const PRIO = "gid://shopify/ProductVariant/55430739493206";
const CAN = "gid://shopify/ProductVariant/1";
const cart = (total: string, lines: Array<[string, string]>) => ({
  cost: { totalAmount: { amount: total } },
  lines: { edges: lines.map(([id, amount]) => ({ node: { merchandise: { id }, cost: { totalAmount: { amount } } } })) },
});

describe("Klaviyo-Warenwert ohne Prio-Versand", () => {
  it("ohne Prio: Shopify-Gesamtbetrag", () => {
    // 5 Dosen, 5er Set-Rabatt bereits in der Zeile: 34,90
    expect(merchandiseValueExcluding(cart("34.90", [[CAN, "34.90"]]), PRIO)).toBe(34.9);
  });
  it("Prio 1,95 ohne Code: genau 1,95 abgezogen", () => {
    expect(merchandiseValueExcluding(cart("36.85", [[CAN, "34.90"], [PRIO, "1.95"]]), PRIO)).toBe(34.9);
  });
  it("Prio 1,95 mit DROP20 (Bestellrabatt): nur rabattierter Prio-Anteil 1,56 abgezogen", () => {
    // (34,90 + 1,95) × 0,8 = 29,48; Warenwert 34,90 × 0,8 = 27,92
    expect(merchandiseValueExcluding(cart("29.48", [[CAN, "34.90"], [PRIO, "1.95"]]), PRIO)).toBe(27.92);
  });
  it("geänderter Prio-Preis wird aus Shopifys Antwort übernommen", () => {
    expect(merchandiseValueExcluding(cart("37.40", [[CAN, "34.90"], [PRIO, "2.50"]]), PRIO)).toBe(34.9);
    expect(merchandiseValueExcluding(cart("29.92", [[CAN, "34.90"], [PRIO, "2.50"]]), PRIO)).toBe(27.92);
  });
  it("unvollständige Antwort: kein Wert (kein Event)", () => {
    expect(merchandiseValueExcluding({ cost: { totalAmount: { amount: "10" } } }, PRIO)).toBeNull();
  });
});
