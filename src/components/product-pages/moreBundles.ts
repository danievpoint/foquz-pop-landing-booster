import { FIXED_BUNDLES, bundleContentsText, BUNDLE_PRICES } from "@/data/products";

import { useActiveBundles } from "@/lib/setMix";

/** "Mehr entdecken"-Karten auf den Sortenseiten: Fresh Flash (4) und Family First (8). */
export const useMoreBundles = () => useActiveBundles().filter((b) => b.size > 3).map((b) => ({
  name: b.name.includes("BUNDLE") ? b.name : `${b.size}ER ${b.name}`,
  desc: bundleContentsText(b),
  price: `${BUNDLE_PRICES[b.size].toFixed(2).replace(".", ",")} €`,
  tag: b.size < 8 ? "BELIEBTESTE WAHL" : `${b.size} DOSEN`,
  tagClass: b.size < 8 ? "bg-yellow-400 text-black" : "bg-violet-600 text-white",
  cta: "BUNDLE ANSEHEN",
  image: b.image,
  href: `/produkt/${b.handle}`,
}));
