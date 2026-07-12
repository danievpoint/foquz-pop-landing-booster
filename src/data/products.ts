import productWatermelon from "@/assets/product-watermelon-new.png";
import productThai from "@/assets/product-thai-new.png";
import productLemon from "@/assets/product-lemon-new.png";
import productPeachVideoPoster from "@/assets/product-peach-video-poster.jpg";
import productThaiVideoPoster from "@/assets/product-thai-video-poster.jpg";
import productLemonVideoPoster from "@/assets/product-lemon-video-poster.jpg";
import foquzBox from "@/assets/foquz-box.png";

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
    video: "/videos/video_product_peach.mp4",
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
    video: "/videos/video_product_mint.mp4",
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
    video: "/videos/video_product_lemon.mp4",
    videoPoster: productLemonVideoPoster,
    color: "#ffd618",
    ingredients: ["Zitronengras", "Gewürznelke", "Weißdorn", "Süßholz", "Knöterichwurzel", "Osmanthusblüte", "Jasminblüte", "Menthol", "Zitronenaroma"],
  },
];

export const bundleProduct: Product = {
  name: "FOQUZ Power Bundle",
  handle: "starter-bundle",
  price: "19,99€",
  originalPrice: "22,47€",
  numericPrice: 19.99,
  desc: "Alle 3 Sorten in einer Box.\nMit Code LAUNCH25 (wird automatisch angewendet) nur 14,99€.",
  image: foquzBox,
  color: "#75559f",
  isBundle: true,
  ingredients: [
    "Alle 3 Geschmacksrichtungen enthalten",
    "PEACH PARTY – Fruchtig & leicht",
    "THAI STYLE – Kräuter-Power",
    "LEMON BREEZY – Frisch & belebend",
  ],
};

export const allProducts: Product[] = [...products, bundleProduct];
