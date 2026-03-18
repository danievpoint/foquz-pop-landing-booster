import productWatermelon from "@/assets/product-watermelon-new.png";
import productThai from "@/assets/product-thai-new.png";
import productLemon from "@/assets/product-lemon-new.png";

export interface Product {
  name: string;
  handle: string;
  price: string;
  numericPrice: number;
  desc: string;
  image: string;
  color: string;
  ingredients: string[];
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
