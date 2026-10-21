import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { LEGAL_PAGES, shopifyPage } from "../../scripts/build-legal";
import { handleWithdrawal, validate, esc, formatReceived, MAX_PER_HOUR, type Deps } from "../../supabase/functions/send-widerruf/logic";

const read = (p: string) => readFileSync(p, "utf8");
const all = ["impressum", "agb", "widerruf", "datenschutz", "garantie"].map((n) => read(`src/legal/${n}.html`)).join("\n");

describe("Rechtstexte", () => {
  it("Shopify-Dateien sind synchron mit den Website-Texten", () => {
    for (const p of LEGAL_PAGES) {
      expect(read(`legal/shopify/${p.out}.html`)).toBe(shopifyPage(p.title, read(`src/legal/${p.src}.html`)));
    }
  });
  it("einheitliche Stammdaten, keine erfundene USt-IdNr.", () => {
    const imp = read("src/legal/impressum.html");
    for (const s of ["FOQUZ GmbH", "Gewerbering am Brand 8", "82549 Königsdorf", "Matthias Kurpiers", "Kevin Zaremba", "HRB 311769", "Amtsgericht München", "info@foquz.de", "+49 179 1599764"]) expect(imp).toContain(s);
    expect(all).not.toMatch(/USt-Id|DE\d{9}/);
    expect(all).not.toMatch(/0170|achtabahn/);
  });
  it("keine veralteten oder unzulässigen Bausteine", () => {
    expect(read("src/legal/impressum.html")).not.toMatch(/ec\.europa\.eu\/consumers\/odr|§\s?7|§§\s?8/);
    const agb = read("src/legal/agb.html");
    expect(agb).not.toMatch(/Amazon|Geschmacksrichtung|30 Tagen|Schriftform|abzutreten|sieben Werktagen|technische Ausfälle/);
    expect(agb).toContain("innerhalb von fünf Tagen");
    expect(agb).toContain("§ 377 HGB");
  });
  it("Widerruf: kein pauschaler Ausschluss geöffneter Dosen", () => {
    const w = read("src/legal/widerruf.html");
    expect(w).toContain("letzte Ware");
    expect(w).toContain("je nachdem, welches der frühere Zeitpunkt ist");
    expect(w).toContain("Allein das Öffnen");
    expect(read("src/data/faqs.ts")).not.toContain("Ungeöffnete Dosen");
    expect(read("src/components/product-pages/ShopIntegration.tsx")).not.toContain("geöffnete aus Hygienegründen ausgeschlossen");
  });
  it("Meta-Texte ohne unbelegte Claims", () => {
    const head = read("index.html").match(/<head>[\s\S]*<\/head>/)![0];
    expect(head).not.toMatch(/Made in Germany|ohne Chemie|100% natürlich/i);
  });
});

const input = { name: "Erika <b>Muster</b>", email: "erika@example.com", orderNumber: "#1001", statement: "Ich widerrufe." };
const deps = (over: Partial<Deps> = {}): Deps => ({
  store: vi.fn(async (_v, m) => ({ id: "w-1", receivedAt: m.receivedAt })),
  recentCount: vi.fn(async () => 0),
  sendMail: vi.fn(async () => undefined),
  markSent: vi.fn(async () => undefined),
  now: () => new Date("2026-10-21T16:05:09Z"),
  shopAddress: "shop@test.invalid",
  ...over,
});

describe("Widerrufsfunktion § 356a (Mocks, keine echten Mails)", () => {
  it("Pflicht: Name, E-Mail, Bestellnummer ODER Beschreibung; Anschrift/Datum freiwillig", () => {
    expect(validate({ name: "A", email: "a@b.de", orderNumber: "1" }).ok).toBe(true);
    expect(validate({ name: "A", email: "a@b.de", contractDescription: "2 Dosen" }).ok).toBe(true);
    expect(validate({ name: "A", email: "a@b.de" }).ok).toBe(false);
    expect(validate({ name: "", email: "a@b.de", orderNumber: "1" }).ok).toBe(false);
    expect(validate({ name: "A", email: "x", orderNumber: "1" }).ok).toBe(false);
    expect(validate({ name: "A", email: "a@b.de", orderNumber: "1", website: "spam" }).ok).toBe(false);
  });
  it("speichert zuerst und bestätigt mit vollständigem Inhalt, Datum, Uhrzeit, Zeitzone", async () => {
    const d = deps();
    const r = await handleWithdrawal(input, { ip: "1.1.1.1", userAgent: "t" }, d);
    expect(r.status).toBe(200);
    expect(r.body.confirmationSent).toBe(true);
    const [to, , html] = (d.sendMail as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(to).toBe("erika@example.com");
    expect(html).toContain("21.10.2026, 18:05:09 MESZ (Europe/Berlin)");
    expect(html).toContain("#1001");
    expect(html).toContain("Ich widerrufe.");
    expect(html).toContain("Erika &lt;b&gt;Muster&lt;/b&gt;");
    expect(html).not.toContain("<b>Muster</b>");
  });
  it("Mailfehler: Widerruf bleibt eingegangen, keine falsche Mail-Erfolgsmeldung", async () => {
    const d = deps({ sendMail: vi.fn(async () => { throw new Error("Resend 500"); }) });
    const r = await handleWithdrawal(input, { ip: null, userAgent: null }, d);
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ ok: true, id: "w-1", confirmationSent: false });
    expect(d.markSent).toHaveBeenCalledWith("w-1", "confirmation", expect.stringContaining("Resend 500"));
  });
  it("Speicherfehler wird nicht als Eingang gemeldet und versendet keine Mail", async () => {
    const d = deps({ store: vi.fn(async () => { throw new Error("db"); }) });
    await expect(handleWithdrawal(input, { ip: null, userAgent: null }, d)).rejects.toThrow();
    expect(d.sendMail).not.toHaveBeenCalled();
  });
  it("Missbrauchsschutz pro IP", async () => {
    const d = deps({ recentCount: vi.fn(async () => MAX_PER_HOUR) });
    expect((await handleWithdrawal(input, { ip: "1.1.1.1", userAgent: null }, d)).status).toBe(429);
    expect(d.store).not.toHaveBeenCalled();
  });
  it("escaped HTML sicher", () => {
    expect(esc(`<script>"'&`)).toBe("&lt;script&gt;&quot;&#39;&amp;");
    expect(formatReceived("2026-01-15T10:00:00Z")).toContain("MEZ");
  });
});

describe("Abwärtskompatibilität", () => {
  it("akzeptiert Anfragen der bisherigen Formularversion", () => {
    const r = validate({ name: "A", email: "a@b.de", address: "X", orderDate: "2026-10-01", body: "Hiermit widerrufe ich: 2 Dosen" });
    expect(r.ok).toBe(true);
  });
});

describe("Versandbedingungen", () => {
  const v = readFileSync("src/legal/versand.html", "utf8");
  it("nennt die in Shopify konfigurierten Tarife in EUR", () => {
    for (const row of [["Deutschland", "4,49 EUR", "29,00 EUR"], ["Österreich", "7,30 EUR", "29,00 EUR"], ["Dänemark", "4,49 EUR", "29,00 EUR"], ["Schweiz", "6,45 EUR", "60,00 EUR"]]) {
      expect(v).toMatch(new RegExp(`<td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td>`));
    }
  });
  it("verbindliche Lieferzeiten ohne unverbindliche Richtwerte", () => {
    expect(v).toContain("Deutschland: <strong>2–5 Werktage</strong>");
    expect(v).toContain("Österreich, Dänemark und Schweiz: <strong>3–5 Werktage</strong>");
    expect(v).not.toMatch(/unverbindlich|Richtwert/);
  });
  it("Garantie gilt in allen vier Lieferländern", () => {
    for (const f of ["src/legal/garantie.html", "legal/garantie-bestellmail.html"]) expect(readFileSync(f, "utf8")).toContain("Deutschland, Österreich, Dänemark oder in die Schweiz");
  });
});
