// Erzeugt die Shopify-Seiten aus denselben Quelltexten wie die Website.
// Aufruf: bun scripts/build-legal.ts
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname ?? __dirname, "..");
const SITE = "https://www.foquz.de";

export const LEGAL_PAGES = [
  { src: "impressum", out: "impressum", title: "Impressum" },
  { src: "agb", out: "agb", title: "Allgemeine Geschäftsbedingungen (AGB)" },
  { src: "widerruf", out: "widerruf", title: "Widerrufsbelehrung", append: "garantie" },
  { src: "datenschutz", out: "datenschutz", title: "Datenschutzerklärung" },
  { src: "versand", out: "versand", title: "Versandbedingungen" },
] as const satisfies readonly { src: string; out: string; title: string; append?: string }[];

/** Shopify-Inhalt einer Seite; Widerruf enthält zusätzlich die Garantiebedingungen (gelangen so ins Bestellmail-PDF). */
export function pageBody(p: (typeof LEGAL_PAGES)[number], read: (name: string) => string) {
  const extra = "append" in p ? `\n${read(p.append)}` : "";
  return read(p.src) + extra;
}

/** Relative Links werden für Shopify zu absoluten foquz.de-Links. */
export const absolutize = (html: string) => html.replace(/href="\/(?!\/)/g, `href="${SITE}/`);

export function shopifyPage(title: string, body: string) {
  return `<!-- Automatisch erzeugt aus src/legal – nicht direkt bearbeiten. In Shopify: Onlineshop > Seiten > HTML-Ansicht -->
<div class="foquz-legal" style="max-width:760px;margin:0 auto;line-height:1.55">
<h1>${title}</h1>
${absolutize(body).trim()}
</div>
`;
}

if ((import.meta as ImportMeta & { main?: boolean }).main) {
  mkdirSync(join(root, "legal/shopify"), { recursive: true });
  for (const p of LEGAL_PAGES) {
    const body = pageBody(p, (n) => readFileSync(join(root, `src/legal/${n}.html`), "utf8"));
    writeFileSync(join(root, `legal/shopify/${p.out}.html`), shopifyPage(p.title, body));
  }
  console.log("legal/shopify updated");
}
