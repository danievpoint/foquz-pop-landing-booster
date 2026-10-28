import BundleProductPage, { type BundleProductConfig } from "@/components/product-pages/BundleProductPage";
import { productImages } from "@/lib/redesignProductImages";
import { bundleContentsText, FIXED_BUNDLES } from "@/data/products";

const stickerAsset = "/images/product-pages/sticker-logo-nase.webp";
const noseStripsAsset = "/images/product-pages/nose-strips.jpg";
const FLAVOR_INFO: Record<string, { desc: string; img: string }> = {
  "PEACH PARTY": { desc: "Pfirsich & Kräuter", img: productImages.peach },
  "LEMON BREEZY": { desc: "Zitrone & Kräuter", img: productImages.lemon },
  "WATERMELON FLEX": { desc: "Wassermelone & Kräuter", img: productImages.watermelon },
  "BLUEBERRY FLOW": { desc: "Blaubeere & Kräuter", img: productImages.blueberry },
};
const titleCase = (f: string) => f.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const COMMON_FAQS = [
  { q: "Wofür ist FOQUZ?", a: "FOQUZ ist deine Frische-Dose für die Nase – für zwischendurch beim Arbeiten, Lernen, Zocken, Sport oder unterwegs. Einfach kurz riechen, tief durchatmen, weiter geht's." },
  { q: "Ist FOQUZ legal?", a: "Ja. FOQUZ ist ein frei verkäufliches Lifestyle-Produkt ohne Nikotin und ohne Koffein. Es wird gerochen, nicht geschnupft." },
  { q: "Wie schnell wird meine Bestellung geliefert?", a: "Versand mit DHL nach Deutschland, Österreich und die Schweiz – in 2 bis 5 Werktagen bei dir." },
];
const STYLE: Record<string, Pick<BundleProductConfig, "titleTopColor" | "titleBottomColor" | "cardColor">> = {
  "fruit-punch": { titleTopColor: "#ffd618", titleBottomColor: "#e5566b", cardColor: "#85c8b5" },
  "fresh-flash": { titleTopColor: "#ffffff", titleBottomColor: "#ffd618", cardColor: "#e5566b" },
  "family-first": { titleTopColor: "#ffffff", titleBottomColor: "#ffd618", cardColor: "#7b6cc0" },
};

/**
 * Final gelieferte Bundle-Texte (vollständig, ungekürzt), verteilt auf die ursprünglichen
 * Textblöcke: tagline = erster beschreibender Satz unter dem Titel, introHeadline = Kick-Zeile
 * (nur einmal, im Intro), introText = Fließtext-Absätze, description = Mengenzeile über „Was ist drin".
 */
const TEXT: Record<string, Partial<Pick<BundleProductConfig, "tagline" | "description" | "introHeadline" | "introText" | "checks">>> = {
  "fruit-punch": {
    tagline: "Drei fruchtige FOQUZ Sorten, eine Box: Lemon Breezy, Watermelon Flex und Peach Party – je eine Dose pro Sorte.",
    introHeadline: "DER FRUCHTIGE DREIFACH-KICK.",
    introText: "Perfekt zum Durchprobieren, Teilen oder um deinen persönlichen Favoriten zu finden. Einfach Dose öffnen, vorsichtig unter die Nase halten, kurz riechen und wieder verschließen.\n\nKein Koffein. Kein Nikotin. Drei fruchtige Duftwelten für deinen Refresh-Moment.\n\nKurz riechen. Ab auf Wolke 7.",
    description: "3 Dosen · 3 Sorten · Inklusive Stickern & Nasen-Strips gratis",
    checks: ["3 Dosen · 3 Sorten", "Inklusive Sticker & Nasen-Strips gratis"],
  },
  "fresh-flash": {
    tagline: "Vier Sorten, eine Box: Lemon Breezy, Watermelon Flex, Peach Party und Blueberry Flow – je eine Dose pro Sorte.",
    introHeadline: "DER VIERFACH-KICK.",
    introText: "Mehr Auswahl, mehr Abwechslung: Entdecke vier FOQUZ Duftwelten und finde deinen Favoriten – oder wechsel einfach je nach Mood.\n\nEinfach Dose öffnen, vorsichtig unter die Nase halten, kurz riechen und wieder verschließen.\n\nKein Koffein. Kein Nikotin. Vier Duftwelten für deinen Refresh-Moment.\n\nKurz riechen. Ab auf Wolke 7.",
    description: "4 Dosen · 4 Sorten · Inklusive Stickern & Nasen-Strips gratis",
    checks: ["4 Dosen · 4 Sorten", "Inklusive Sticker & Nasen-Strips gratis"],
  },
  "family-first": {
    tagline: "Vier Sorten. Jeweils doppelt am Start.",
    introHeadline: "DER ACHTFACH-KICK.",
    introText: "Hol dir Lemon Breezy, Watermelon Flex, Peach Party und Blueberry Flow jeweils zweimal – insgesamt 8 Dosen FOQUZ.\n\nDoppelt ausgestattet für zuhause und unterwegs, zum Teilen oder einfach als Vorrat. Eine Dose griffbereit am Schreibtisch, eine in der Sporttasche – und genug Auswahl für jeden Refresh-Moment.\n\nEinfach Dose öffnen, vorsichtig unter die Nase halten, kurz riechen und wieder verschließen.\n\nOhne Koffein. Ohne Nikotin. Vier Duftwelten – jeweils doppelt.\n\nKurz riechen. Ab auf Wolke 7.",
    description: "8 Dosen · 4 Sorten · Jede Sorte zweimal · Inklusive Stickern & Nasen-Strips gratis · Kostenloser Versand innerhalb Deutschlands",
    checks: ["8 Dosen · 4 Sorten · jede Sorte zweimal", "Inklusive Sticker & Nasen-Strips gratis", "Kostenloser Versand innerhalb Deutschlands"],
  },
};

export function fixedBundleConfig(handle: string): BundleProductConfig {
  const b = FIXED_BUNDLES.find((x) => x.handle === handle)!;
  const [top, ...rest] = b.name.split(" ");
  const contentsText = bundleContentsText(b);
  const flavors = Object.keys(b.mix).map(titleCase).join(", ");
  return {
    handle: b.handle,
    titleTop: top,
    titleBottom: rest.join(" "),
    ...STYLE[b.handle],
    bgColor: "#c5e6f2",
    reviewsBgColor: "#de596a",
    tagline: `${b.size} Dosen in einer Box – feste Zusammenstellung.`,
    description: `${contentsText}. Dazu Sticker & Nasen-Stripes.`,
    introHeadline: `${b.size}er ${titleCase(b.name)}`,
    introText: `In der Box: ${contentsText}.\n\nDose öffnen, vorsichtig unter die Nase halten, kurz riechen und wieder verschließen.\n\nOhne Koffein. Ohne Nikotin.`,
    // Ursprüngliches Intro-Layout: Bild links, Überschrift + Fließtext rechts daneben.
    introImage: b.image,
    introImageAlt: `FOQUZ ${b.name} – ${b.size}er Box`,
    ...TEXT[b.handle],
    contents: [
      ...Object.entries(b.mix).map(([f, q]) => ({ name: `${q}× ${f}`, ...FLAVOR_INFO[f] })),
      { name: "STICKER PACK", desc: "FOQUZ Sticker", img: stickerAsset },
      { name: "NOSE STRIPS", desc: "Schwarz & Weiß", img: noseStripsAsset },
    ],
    checks: [`${b.size} Dosen · feste Zusammenstellung`, "Inklusive Sticker & Nasen-Stripes"],
    faqs: [
      { q: `Welche Sorten sind in ${titleCase(b.name)}?`, a: `${titleCase(b.name)} enthält ${contentsText.replace(/^\d+ Dosen: /, "")} – insgesamt ${b.size} Dosen (${flavors}).` },
      ...COMMON_FAQS,
    ],
  };
}

export const FruitPunch = () => <BundleProductPage config={fixedBundleConfig("fruit-punch")} />;
export const FreshFlash = () => <BundleProductPage config={fixedBundleConfig("fresh-flash")} />;
export const FamilyFirst = () => <BundleProductPage config={fixedBundleConfig("family-first")} />;
