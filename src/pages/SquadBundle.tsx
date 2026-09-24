import BundleProductPage from "@/components/product-pages/BundleProductPage";
import { productImages } from "@/lib/redesignProductImages";
const squadBundleBannerAsset = { url: "/images/product-pages/5er-bundle-16zu9.jpg" };
const squadBundleHeaderAsset = { url: "/images/product-pages/mann-standard-5er.jpg" };
const stickerAsset = { url: "/images/product-pages/sticker-logo-nase.jpg" };
const noseStripsAsset = { url: "/images/product-pages/nose-strips.jpg" };

const SquadBundle = () => (
  <BundleProductPage
    config={{
      handle: "squad-bundle",
      titleTop: "5ER SQUAD",
      titleBottom: "BUNDLE",
      titleTopColor: "#85c8b5",
      titleBottomColor: "#ffd618",
      bgColor: "#c5e6f2",
      cardColor: "#85c8b5",
      reviewsBgColor: "#de596a",
      tagline: "Dein Vorrat für die ganze Crew. Fünf Dosen, maximale Auswahl.",
      description: "Fünf Dosen voller Power – damit nie einer leer ausgeht.",
      introBannerImage: squadBundleBannerAsset.url,
      introBannerImageAlt: "FOQUZ 5er Squad Bundle Flatlay",
      introImage: squadBundleHeaderAsset.url,
      introImageAlt: "FOQUZ 5er Squad Bundle Header",
      introHeadline: "Der Fünffach-Kick.",
      introText: `Fünf Sorten, eine Box: Peach Party, Lemon Breezy, Thai Style, Watermelon Flex und Blueberry Flow – je eine Dose pro Sorte. Entdecke deinen Lieblingsduft oder teile die fünf Sorten. Einfach Dose öffnen, vorsichtig unter die Nase halten, kurz riechen und wieder verschließen.

Kein Koffein. Kein Nikotin. Fünf Duftwelten für deinen Refresh-Moment.

Ab auf Wolke 7 – mit der ganzen Crew.`,
      contents: [
        { name: "PEACH PARTY", desc: "Pfirsich & Kräuter", img: productImages.peach },
        { name: "LEMON BREEZY", desc: "Zitrone & Kräuter", img: productImages.lemon },
        { name: "THAI STYLE", desc: "Kräuter & Menthol", img: productImages.thai },
        { name: "WATERMELON FLEX", desc: "Wassermelone & Kräuter", img: productImages.watermelon },
        { name: "BLUEBERRY FLOW", desc: "Blaubeere & Kräuter", img: productImages.blueberry },
        { name: "STICKER PACK", desc: "Exklusive FOQUZ Sticker", img: stickerAsset.url },
        { name: "NOSE STRIPS", desc: "Schwarz & Weiß", img: noseStripsAsset.url },
      ],
      checks: ["5 Dosen voller Power", "Maximale Auswahl", "Nur solange der Vorrat reicht"],
      faqs: [
        { q: "Welche Sorten sind im Squad Bundle?", a: "Im 5er Squad Bundle steckt die volle FOQUZ-Auswahl: Peach Party, Lemon Breezy, Thai Style, Watermelon Flex und Blueberry Flow – je eine Dose pro Sorte." },
        { q: "Wofür ist FOQUZ?", a: "FOQUZ ist deine Frische-Dose für die Nase – für zwischendurch beim Arbeiten, Lernen, Zocken, Sport oder unterwegs. Einfach kurz riechen, tief durchatmen, weiter geht's." },
        { q: "Ist FOQUZ legal?", a: "Ja. FOQUZ ist ein frei verkäufliches Lifestyle-Produkt ohne Nikotin und ohne Koffein. Es wird gerochen, nicht geschnupft." },
        { q: "Wie schnell wird meine Bestellung geliefert?", a: "Versand mit DHL nach Deutschland, Österreich und die Schweiz – in 2 bis 5 Werktagen bei dir." },
      ],
    }}
  />
);

export default SquadBundle;
