import BundleProductPage from "@/components/product-pages/BundleProductPage";
import { products } from "@/data/products";


const starterBundleHeaderImg = "/images/starter-bundle/header-mann-standard-3er.jpg";
const starterBundleFlatlayImg = "/images/starter-bundle/3er-bundle-16zu9-3.jpg";

const StarterBundle = () => (
  <BundleProductPage
    config={{
      titleTop: "3ER STARTER",
      titleBottom: "BUNDLE",
      titleTopColor: "#f6871f",
      titleBottomColor: "#ffd618",
      bgColor: "#c5e6f2",
      cardColor: "#ffd618",
      tagline: "Alle 3 Klassiker in einer Box. Finde deinen Vibe.",
      description: "Alle 3 Sorten in einer Box – ideal zum Durchprobieren und Teilen.",
      introBannerImage: starterBundleFlatlayImg,
      introBannerImageAlt: "FOQUZ 3er Starter Bundle Flatlay",
      introImage: starterBundleHeaderImg,
      introImageAlt: "FOQUZ 3er Starter Bundle Header",
      introHeadline: "Der Dreifach-Kick.",
      introText: "Drei Klassiker, eine Box: Peach Party, Lemon Breezy und Thai Style – je eine Dose pro Sorte. Entdecke deinen Lieblingsduft oder teile die drei Sorten. Einfach Dose öffnen, vorsichtig unter die Nase halten, kurz riechen und wieder verschließen.\n\nKein Koffein. Kein Nikotin. Drei Duftwelten für deinen Refresh-Moment.\n\nAb auf Wolke 7 – dreimal, mit allen drei Klassikern.",
      contents: [
        ...products.map((product) => ({ name: product.name, desc: product.handle === "peach-party" ? "Pfirsich & Kräuter" : product.handle === "lemon-breezy" ? "Zitrone & Kräuter" : "Kräuter & Menthol", img: product.image })),
      ],
      checks: ["Alle Sorten testen", "Exklusive Box", "Bestpreis sichern"],
      faqs: [
        { q: "Welche Sorten sind im Starter Bundle?", a: "Im 3er Starter Bundle findest du die drei FOQUZ-Klassiker: Peach Party, Lemon Breezy und Thai Style – je eine Dose pro Sorte." },
        { q: "Wofür ist FOQUZ?", a: "FOQUZ ist deine Frische-Dose für die Nase – für zwischendurch beim Arbeiten, Lernen, Zocken, Sport oder unterwegs. Einfach kurz riechen, tief durchatmen, weiter geht's." },
        { q: "Ist FOQUZ legal?", a: "Ja. FOQUZ ist ein frei verkäufliches Lifestyle-Produkt ohne Nikotin und ohne Koffein. Es wird gerochen, nicht geschnupft." },
        { q: "Wie schnell wird meine Bestellung geliefert?", a: "Versand mit DHL nach Deutschland, Österreich und die Schweiz – in 2 bis 5 Werktagen bei dir." },
      ],
    }}
  />
);

export default StarterBundle;
