import productWatermelon from "@/assets/product-watermelon-new.png";
import productThai from "@/assets/product-thai-new.png";
import productLemon from "@/assets/product-lemon-new.png";
import foquzBox from "@/assets/foquz-box.png";

export interface Product {
  name: string;
  handle: string;
  price: string;
  numericPrice: number;
  originalPrice?: string;
  desc: string;
  image: string;
  color: string;
  ingredients: string[];
  isBundle?: boolean;
}

export const products: Product[] = [
  {
    name: "PEACH PARTY",
    handle: "peach-party",
    price: "€7,99",
    numericPrice: 7.99,
    desc: "Kein Stress, nur Party.\nDie fruchtige Leichtigkeit für deinen Fokus.",
    image: productWatermelon,
    color: "#e94362",
    ingredients: ["Zitronengras", "Gewürznelke", "Weißdorn", "Süßholz", "Knöterichwurzel", "Osmanthusblüte", "Jasminblüte", "Menthol", "Wassermelonenaroma"],
  },
  {
    name: "THAI STYLE",
    handle: "thai-style",
    price: "€7,99",
    numericPrice: 7.99,
    desc: "Dein Style, dein Kick.\nKräuter-Power für tiefste Konzentration.",
    image: productThai,
    color: "#85c8b5",
    ingredients: ["Menthol", "Borneol", "Kampferaroma"],
  },
  {
    name: "LEMON BREEZY",
    handle: "lemon-breezy",
    price: "€7,99",
    numericPrice: 7.99,
    desc: "Bleib Breezy, nimm's easy.\nFrischer Wind für deine besten Ideen.",
    image: productLemon,
    color: "#ffd618",
    ingredients: ["Zitronengras", "Gewürznelke", "Weißdorn", "Süßholz", "Knöterichwurzel", "Osmanthusblüte", "Jasminblüte", "Menthol", "Zitronenaroma"],
  },
];

export const bundleProduct: Product = {
  name: "Starter Bundle",
  handle: "starter-bundle",
  price: "14,99€",
  originalPrice: "23,97€",
  numericPrice: 14.99,
  desc: "Alle 3 Sorten in einer Box.\nSpar 15% und finde heraus, welcher Kick dich am weitesten bringt.",
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
