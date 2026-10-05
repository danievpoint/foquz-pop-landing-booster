import BundleProductPage from "@/components/product-pages/BundleProductPage";
import { productImages } from "@/lib/redesignProductImages";
const squadBundleBannerAsset = { url: "/images/product-pages/10er-bundle-16zu9.webp" };
const squadBundleHeaderAsset = { url: "/images/product-pages/mann-standard-5er.webp" };
const stickerAsset = { url: "/images/product-pages/sticker-logo-nase.webp" };
const noseStripsAsset = { url: "/images/product-pages/nose-strips.jpg" };

const ZehnerBundle = () => (
  <BundleProductPage
    config={{
      handle: "vorrats-bundle",
      titleTop: "10ER POWER-",
      titleBottom: "BUNDLE",
      titleTopColor: "#85c8b5",
      titleBottomColor: "#ffd618",
      bgColor: "#c5e6f2",
      cardColor: "#85c8b5",
      reviewsBgColor: "#de596a",
      tagline: "Alle Sorten. Doppelt am Start.",
      description: "Zehn Dosen, alle fünf Sorten – je zwei Dosen pro Sorte.",
      introBannerImage: squadBundleBannerAsset.url,
      introBannerImageAlt: "FOQUZ 10er Power-Bundle Flatlay",
      introImage: squadBundleHeaderAsset.url,
      introImageAlt: "FOQUZ 10er Power-Bundle Header",
      introHeadline: "10er Power-Bundle",
      introText: `Alle Sorten. Doppelt am Start. Hol dir jede unserer fünf Duftwelten zweimal: Peach Party, Lemon Breezy, Thai Style, Blueberry Flow und Watermelon Flex.

Eine für den Schreibtisch. Eine für die Sporttasche. Und genug zum Teilen – wenn du willst. Mit dem 10er Vorrats-Bundle hast du deinen Frische-Mix griffbereit. Für die nächste Gaming-Runde, zwischen zwei Sätzen im Gym oder einfach zwischendurch.

Dose öffnen, vorsichtig unter die Nase halten, kurz riechen und wieder verschließen.

Ohne Koffein. Ohne Nikotin. Voll dein Ding.

10 Dosen · Jede Sorte zweimal · Inklusive Stickern & Nasen-Strips · Kostenloser Versand innerhalb Deutschlands

Kurz riechen. Ab auf Wolke 7.`,
      contents: [
        { name: "2× PEACH PARTY", desc: "Pfirsich & Kräuter", img: productImages.peach },
        { name: "2× LEMON BREEZY", desc: "Zitrone & Kräuter", img: productImages.lemon },
        { name: "2× THAI STYLE", desc: "Kräuter & Menthol", img: productImages.thai },
        { name: "2× WATERMELON FLEX", desc: "Wassermelone & Kräuter", img: productImages.watermelon },
        { name: "2× BLUEBERRY FLOW", desc: "Blaubeere & Kräuter", img: productImages.blueberry },
        { name: "STICKER PACK", desc: "Exklusive FOQUZ Sticker", img: stickerAsset.url },
        { name: "NOSE STRIPS", desc: "Schwarz & Weiß", img: noseStripsAsset.url },
      ],
      checks: ["10 Dosen · Jede Sorte zweimal", "Inklusive Stickern & Nasen-Strips", "Kostenloser Versand innerhalb Deutschlands"],
      faqs: [
        { q: "Welche Sorten sind im 10er Power-Bundle?", a: "Im 10er Power-Bundle steckt die volle FOQUZ-Auswahl: Peach Party, Lemon Breezy, Thai Style, Watermelon Flex und Blueberry Flow – je zwei Dosen pro Sorte." },
        { q: "Wofür ist FOQUZ?", a: "FOQUZ ist deine Frische-Dose für die Nase – für zwischendurch beim Arbeiten, Lernen, Zocken, Sport oder unterwegs. Einfach kurz riechen, tief durchatmen, weiter geht's." },
        { q: "Ist FOQUZ legal?", a: "Ja. FOQUZ ist ein frei verkäufliches Lifestyle-Produkt ohne Nikotin und ohne Koffein. Es wird gerochen, nicht geschnupft." },
        { q: "Wie schnell wird meine Bestellung geliefert?", a: "Versand mit DHL nach Deutschland, Österreich und die Schweiz – in 2 bis 5 Werktagen bei dir." },
      ],
    }}
  />
);

export default ZehnerBundle;
