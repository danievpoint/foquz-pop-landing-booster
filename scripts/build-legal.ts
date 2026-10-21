// Erzeugt die Shopify-Seiten aus denselben Quelltexten wie die Website.
// Aufruf: bun scripts/build-legal.ts
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname ?? __dirname, "..");
const SITE = "https://www.foquz.de";

export const LEGAL_PAGES = [
  { src: "impressum", out: "impressum", title: "Impressum" },
  { src: "agb", out: "agb", title: "Allgemeine Geschäftsbedingungen (AGB)" },
  { src: "widerruf", out: "widerruf", title: "Widerrufsbelehrung" },
  { src: "datenschutz", out: "datenschutz", title: "Datenschutzerklärung" },
] as const;

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

if (import.meta.main) {
  mkdirSync(join(root, "legal/shopify"), { recursive: true });
  for (const p of LEGAL_PAGES) {
    const body = readFileSync(join(root, `src/legal/${p.src}.html`), "utf8");
    writeFileSync(join(root, `legal/shopify/${p.out}.html`), shopifyPage(p.title, body));
  }
  console.log("legal/shopify updated");
}
