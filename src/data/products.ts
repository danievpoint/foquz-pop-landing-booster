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
    price: "€7,99",
    numericPrice: 7.99,
    desc: "Auch Mario wollte nur Peach.\nFruchtige Frische, einfach durchgespielt.",
    image: productWatermelon,
    video: "/videos/video_product_peach.mp4",
    videoPoster: productPeachVideoPoster,
    color: "#e88a3a",
    ingredients: ["Zitronengras", "Gewürznelke", "Weißdorn", "Süßholz", "Knöterichwurzel", "Osmanthusblüte", "Jasminblüte", "Menthol", "Pfirsicharoma"],
  },
  {
    name: "THAI STYLE",
    handle: "thai-style",
    price: "€7,99",
    numericPrice: 7.99,
    desc: "Thailand für die Tasche.\nAbheben ohne Flugticket.",
    image: productThai,
    video: "/videos/video_product_mint.mp4",
    videoPoster: productThaiVideoPoster,
    color: "#85c8b5",
    ingredients: ["Menthol", "Borneol", "Kampferaroma"],
  },
  {
    name: "LEMON BREEZY",
    handle: "lemon-breezy",
    price: "€7,99",
    numericPrice: 7.99,
    desc: "Nimm's Easy, bleib Breezy.\nHol dir einen Tag unter Zitronenbäumen.",
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
