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

/** Final gelieferte Bundle-Texte. Fresh Flash: Rest des Texts wurde nicht geliefert – generischer Introtext bleibt. */
const TEXT: Record<string, Partial<Pick<BundleProductConfig, "tagline" | "description" | "introHeadline" | "introText" | "checks">>> = {
  "fruit-punch": {
    tagline: "DER FRUCHTIGE DREIFACH-KICK.",
    description: "Drei fruchtige FOQUZ Sorten, eine Box: Lemon Breezy, Watermelon Flex und Peach Party – je eine Dose pro Sorte.",
    introHeadline: "DER FRUCHTIGE DREIFACH-KICK.",
    introText: "Perfekt zum Durchprobieren, Teilen oder um deinen persönlichen Favoriten zu finden. Einfach Dose öffnen, vorsichtig unter die Nase halten, kurz riechen und wieder verschließen.\n\nKein Koffein. Kein Nikotin. Drei fruchtige Duftwelten für deinen Refresh-Moment.\n\n3 Dosen · 3 Sorten · Inklusive Stickern & Nasen-Strips gratis\n\nKurz riechen. Ab auf Wolke 7.",
    checks: ["3 Dosen · 3 Sorten", "Inklusive Sticker & Nasen-Strips gratis"],
  },
  "fresh-flash": {
    tagline: "DER VIERFACH-KICK.",
    description: "Vier Sorten, eine Box: Lemon Breezy, Watermelon Flex, Peach Party und Blueberry Flow – je eine Dose pro Sorte.",
    introHeadline: "DER VIERFACH-KICK.",
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
