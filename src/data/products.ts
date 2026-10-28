import productWatermelon from "@/assets/product-watermelon-new.webp";
import productThai from "@/assets/product-thai-new.webp";
import productLemon from "@/assets/product-lemon-new.webp";
import productPeachVideoPoster from "@/assets/product-peach-video-poster.webp";
import productThaiVideoPoster from "@/assets/product-thai-video-poster.webp";
import productLemonVideoPoster from "@/assets/product-lemon-video-poster.jpg";
import lemonBreezyProductVideo from "@/assets/lemon-breezy-product.mp4.asset.json";
import productBlueberryVideoPoster from "@/assets/product-blueberry-video-poster.webp";
import productWatermelonVideoPoster from "@/assets/product-watermelon-video-poster.webp";
import blueberryFlowProductVideo from "@/assets/blueberry-flow-product.mp4.asset.json";
import watermelonFlexProductVideo from "@/assets/watermelon-flex-product.mp4.asset.json";
import peachPartyProductVideo from "@/assets/peach-party-product.mp4.asset.json";
import thaiStyleProductVideo from "@/assets/thai-style-product.mp4.asset.json";
import fruitPunchImage from "@/assets/bundles/fruit-punch.jpg.asset.json";
import freshFlashImage from "@/assets/bundles/fresh-flash.webp.asset.json";
import familyFirstImage from "@/assets/bundles/family-first.webp.asset.json";

export interface Product {
  name: string;
  handle: string;
  price: string;
  numericPrice: number;
  originalPrice?: string;
  desc: string;
  longDesc?: { heading: string; paragraphs: string[] };
  image: string;
  video?: string;
  videoPoster?: string;
  color: string;
  ingredients: string[];
  isBundle?: boolean;
  /** Kauf erst nach Shopify-Abgleich (Komponenten/IDs/Preis/Zugaben/Versand) freigegeben – kein Kauf, kein JSON-LD-Angebot. Standard: true. */
  checkoutReady?: boolean;
}

export const products: Product[] = [
  {
    name: "PEACH PARTY",
    handle: "peach-party",
    price: "€7,49",
    numericPrice: 7.49,
    desc: "Auch Mario wollte nur Peach.\nFruchtige Frische, einfach durchgespielt.",
    longDesc: {
      heading: "Was ist Peach Party?",
      paragraphs: [
        "Peach Party ist deine Frische-Dose für die Nase.",
        "Einfach Dose öffnen, kurz daran riechen und tief durchatmen. Der intensive Duft aus Menthol, Kräutern und fruchtigem Pfirsich sorgt für einen angenehm frischen Moment – egal ob beim Arbeiten, Lernen, Zocken, Sport oder unterwegs.",
        "Kein Energy Drink. Kein Kaffee. Kein Nikotin.",
        "Einfach kurz durchatmen und weiter geht's.",
      ],
    },
    image: productWatermelon,
    video: peachPartyProductVideo.url,
    videoPoster: productPeachVideoPoster,
    color: "#e88a3a",
    ingredients: ["Zitronengras", "Gewürznelke", "Weißdorn", "Süßholz", "Knöterichwurzel", "Osmanthusblüte", "Jasminblüte", "Menthol", "Pfirsicharoma"],
  },
  {
    name: "THAI STYLE",
    handle: "thai-style",
    price: "€7,49",
    numericPrice: 7.49,
    desc: "Thailand für die Tasche.\nAbheben ohne Flugticket.",
    longDesc: {
      heading: "Was ist Thai Style?",
      paragraphs: [
        "Thai Style ist der intensivste FOQUZ-Flavour.",
        "Der klassische Mix aus Menthol und aromatischen Kräutern sorgt für einen besonders kräftigen Frischemoment.",
        "Inspiriert vom typischen Kräuterduft, den Millionen Menschen aus Thailand kennen.",
      ],
    },
    image: productThai,
    video: thaiStyleProductVideo.url,
    videoPoster: productThaiVideoPoster,
    color: "#85c8b5",
    ingredients: ["Menthol", "Borneol", "Kampferaroma"],
  },
  {
    name: "LEMON BREEZY",
    handle: "lemon-breezy",
    price: "€7,49",
    numericPrice: 7.49,
    desc: "Nimm's Easy, bleib Breezy.\nHol dir einen Tag unter Zitronenbäumen.",
    longDesc: {
      heading: "Was ist Lemon Breezy?",
      paragraphs: [
        "Lemon Breezy verbindet den klassischen FOQUZ-Frischemoment mit einer angenehm fruchtigen Zitronennote.",
        "Dose öffnen, kurz daran riechen und tief durchatmen. Ideal für Schule, Uni, Büro, Gaming, Autofahrten oder einfach zwischendurch.",
        "Ein kleines Ritual. Große Frische.",
      ],
    },
    image: productLemon,
    video: lemonBreezyProductVideo.url,
    videoPoster: productLemonVideoPoster,
    color: "#ffd618",
    ingredients: ["Zitronengras", "Gewürznelke", "Weißdorn", "Süßholz", "Knöterichwurzel", "Osmanthusblüte", "Jasminblüte", "Menthol", "Zitronenaroma"],
  },
];

/** Neue Sorten – erscheinen im Karussell und haben eigene Produktseiten, sind aber nicht Teil des 3er-Bundles. */
export const newFlavorProducts: Product[] = [
  {
    name: "WATERMELON FLEX",
    handle: "watermelon-flex",
    price: "€7,49",
    numericPrice: 7.49,
    desc: "Melon Flex. Just Relax.\nSaftige Melone trifft auf kühle Frische.",
    longDesc: {
      heading: "Was ist Watermelon Flex?",
      paragraphs: [
        "Watermelon Flex verbindet den klassischen FOQUZ-Frischemoment mit einer saftigen Wassermelonennote.",
        "Dose öffnen, kurz daran riechen und tief durchatmen. Ideal für Schule, Uni, Büro, Gaming, Autofahrten oder einfach zwischendurch.",
        "Kein Energy Drink. Kein Kaffee. Kein Nikotin.",
      ],
    },
    image: "/images/product-pages/product-new-watermelon.webp",
    video: watermelonFlexProductVideo.url,
    videoPoster: productWatermelonVideoPoster,
    color: "#e5566b",
    ingredients: ["Zitronengras", "Gewürznelke", "Weißdorn", "Süßholz", "Knöterichwurzel", "Osmanthusblüte", "Jasminblüte", "Menthol", "Wassermelonenaroma"],
  },
  {
    name: "BLUEBERRY FLOW",
    handle: "blueberry-flow",
    price: "€7,49",
    numericPrice: 7.49,
    desc: "Feel the Flow. Bleib im Glow.\nFruchtige Blaubeere, frischer Kopf.",
    longDesc: {
      heading: "Was ist Blueberry Flow?",
      paragraphs: [
        "Blueberry Flow verbindet den klassischen FOQUZ-Frischemoment mit einer fruchtigen Blaubeernote.",
        "Dose öffnen, kurz daran riechen und tief durchatmen. Ideal für Schule, Uni, Büro, Gaming, Autofahrten oder einfach zwischendurch.",
        "Kein Energy Drink. Kein Kaffee. Kein Nikotin.",
      ],
    },
    image: "/images/product-pages/product-new-blueberry.webp",
    video: blueberryFlowProductVideo.url,
    videoPoster: productBlueberryVideoPoster,
    color: "#7b6cc0",
    ingredients: ["Zitronengras", "Gewürznelke", "Weißdorn", "Süßholz", "Knöterichwurzel", "Osmanthusblüte", "Jasminblüte", "Menthol", "Blaubeeraroma"],
  },
];

/** Alle Einzelsorten (Karussell, Sortenauswahl, Warenkorb). */
export const flavorProducts: Product[] = [...products, ...newFlavorProducts];

/**
 * Feste Bundles (Vorschau). Preise sind final, der Kauf bleibt gesperrt (`BUNDLE_CHECKOUT_READY = false`),
 * bis echte Shopify-Komponentenbundles mit IDs, Preis, Zugaben und Versand verifiziert sind.
 */
export const BUNDLE_CHECKOUT_READY = false;

/** Finale Bundle-Preise in EUR (vom Nutzer freigegeben). */
export const BUNDLE_PRICES: Record<number, number> = { 3: 21.9, 4: 27.9, 8: 49.9 };
/** Vergleichspreis: gleiche Dosenzahl als Einzeldosen à 7,49 €. */
export const BUNDLE_COMPARE_AT: Record<number, string> = { 3: "€22,47", 4: "€29,96", 8: "€59,92" };
/** Gerundeter Dosenpreis im Bundle. */
export const BUNDLE_PER_DOSE: Record<number, string> = { 3: "7,30", 4: "6,98", 8: "6,24" };

export interface FixedBundle {
  size: number;
  handle: string;
  name: string;
  image: string;
  /** Exakter Inhalt je Sorte. */
  mix: Record<string, number>;
}

const bundleMix = (names: string[], each: number) => Object.fromEntries(names.map((n) => [n, each]));
const FOUR = ["PEACH PARTY", "LEMON BREEZY", "WATERMELON FLEX", "BLUEBERRY FLOW"];

export const FIXED_BUNDLES: FixedBundle[] = [
  { size: 3, handle: "fruit-punch", name: "FRUIT PUNCH", image: fruitPunchImage.url, mix: bundleMix(["WATERMELON FLEX", "PEACH PARTY", "LEMON BREEZY"], 1) },
  { size: 4, handle: "fresh-flash", name: "FRESH FLASH", image: freshFlashImage.url, mix: bundleMix(FOUR, 1) },
  { size: 8, handle: "family-first", name: "FAMILY FIRST", image: familyFirstImage.url, mix: bundleMix(FOUR, 2) },
];

const titleCase = (f: string) => f.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
/** Sachliche Inhaltsangabe, z. B. "8 Dosen: je 2× Peach Party, Lemon Breezy, …". */
export const bundleContentsText = (b: FixedBundle) => {
  const entries = Object.entries(b.mix);
  const same = entries.every(([, q]) => q === entries[0][1]);
  return same
    ? `${b.size} Dosen: je ${entries[0][1]}× ${entries.map(([f]) => titleCase(f)).join(", ")}`
    : `${b.size} Dosen: ${entries.map(([f, q]) => `${q}× ${titleCase(f)}`).join(", ")}`;
};

const toProduct = (b: FixedBundle): Product => ({
  name: b.name,
  handle: b.handle,
  price: "Preis folgt",
  numericPrice: 0,
  pricePending: BUNDLE_PRICING_PENDING,
  desc: `${bundleContentsText(b)}. Inklusive Sticker & Nasen-Stripes.`,
  image: b.image,
  color: "#85c8b5",
  isBundle: true,
  ingredients: Object.entries(b.mix).map(([f, q]) => `${q}× ${f}`),
});

export const [fruitPunchProduct, freshFlashProduct, familyFirstProduct] = FIXED_BUNDLES.map(toProduct);
export const bundleProducts: Product[] = [fruitPunchProduct, freshFlashProduct, familyFirstProduct];
export const bundleBySize = (size: number) => FIXED_BUNDLES.find((b) => b.size === size);

export const allProducts: Product[] = [...flavorProducts, ...bundleProducts];
