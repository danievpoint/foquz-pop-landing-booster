import { FIXED_BUNDLES, bundleContentsText, BUNDLE_PRICES } from "@/data/products";

/** "Mehr entdecken"-Karten auf den Sortenseiten: Fresh Flash (4) und Family First (8). */
export const MORE_BUNDLES = FIXED_BUNDLES.filter((b) => b.size === 4 || b.size === 8).map((b) => ({
  name: `${b.size}ER ${b.name}`,
  desc: bundleContentsText(b),
  price: `${BUNDLE_PRICES[b.size].toFixed(2).replace(".", ",")} €`,
  tag: b.size === 4 ? "BELIEBTESTE WAHL" : "8 DOSEN",
  tagClass: b.size === 4 ? "bg-yellow-400 text-black" : "bg-violet-600 text-white",
  cta: "BUNDLE ANSEHEN",
  image: b.image,
  href: `/produkt/${b.handle}`,
}));
