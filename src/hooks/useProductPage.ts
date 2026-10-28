import { useEffect, useRef, useState } from "react";
import { products, allProducts, flavorProducts, FIXED_BUNDLES, BUNDLE_CHECKOUT_READY, BUNDLE_PRICES, BUNDLE_COMPARE_AT, BUNDLE_PER_DOSE, bundleContentsText } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import { SHOPIFY_PRODUCT_ID_BY_HANDLE } from "@/lib/shopify";
import { trackViewedProduct } from "@/lib/klaviyo";
import { getBundleStatus, useFlavorStock } from "@/lib/setMix";

/** Bild, das in der Galerie gezeigt wird, solange ein Bundle-Set gewählt ist. */
export interface SetBoxImage {
  url: string;
  altText: string;
}

export function useProductPage(handle: string) {
  const product = allProducts.find((p) => p.handle === handle)!;
  const { addToCart, isOpen, popupOpen } = useCart();
  const { isAvailable: rawAvailable } = useProductAvailability();
  const stock = useFlavorStock();
  // Feste Bundles: lieferbar nur, wenn alle Komponenten laut Shopify lieferbar sind (unbekannt = null).
  const bundleAvailable = (size: number): boolean | null => {
    void stock; // Re-Render bei neuem Bestand
    const status = getBundleStatus(size);
    return status === "available" ? true : status === "unavailable" ? false : null;
  };
  const isAvailable = (name: string) => {
    const b = FIXED_BUNDLES.find((x) => x.name === name);
    return b ? bundleAvailable(b.size) : rawAvailable(name);
  };
  const ctaRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const bundleOption = (b: (typeof FIXED_BUNDLES)[number]) => ({
    label: `${b.size} DOSEN – ${b.name}`, desc: bundleContentsText(b), price: BUNDLE_PRICES[b.size], checkoutReady: BUNDLE_CHECKOUT_READY,
    oldPrice: BUNDLE_COMPARE_AT[b.size] as string | undefined, perDose: BUNDLE_PER_DOSE[b.size] as string | null, dosen: b.size, tag: null, productName: b.name, id: b.handle,
    boxImage: { url: b.image, altText: `FOQUZ ${b.name} – ${b.size}er Box` },
  });
  const single = {
    label: "1 DOSE", desc: "Sorte frei wählbar", price: 7.49, checkoutReady: true, perDose: "7,49" as string | null, dosen: 1, tag: null,
    productName: product.isBundle ? products[0].name : product.name, oldPrice: undefined as string | undefined,
    id: product.isBundle ? products[0].name : product.name, boxImage: null as { url: string; altText: string } | null,
  };
  const own = FIXED_BUNDLES.find((b) => b.handle === handle);
  const bundles = own ? [bundleOption(own)] : [single, ...FIXED_BUNDLES.map(bundleOption)];
  const addSingle = () => {
    if (product.checkoutReady === false) return;
    if (isAvailable(product.name) !== false) {
      addToCart(1, { id: product.isBundle ? product.handle : product.name, name: product.name, price: product.numericPrice, image: product.image });
    }
  };
  const addSelection = (selection: typeof bundles[number]) => {
    if (selection.checkoutReady === false) return; // Kauf erst nach Shopify-Abgleich freigegeben
    if (isAvailable(selection.productName) === false) return;
    if (selection.dosen === 1) {
      const single = flavorProducts.find((item) => item.name === selection.productName) ?? products[0];
      addToCart(1, { id: single.name, name: single.name, price: single.numericPrice, image: single.image });
    } else {
      addToCart(1, { id: selection.id, name: selection.productName, price: selection.price, image: selection.boxImage?.url ?? product.image });
    }
  };

  useEffect(() => {
    if (product.checkoutReady !== false) trackViewedProduct({ id: product.isBundle ? product.handle : product.name, name: product.name, image: product.image, price: product.numericPrice, url: `/produkt/${product.handle}` });
  }, [product]);

  useEffect(() => {
    let ctaPassed = false;
    let footerVisible = false;
    const update = () => setShowSticky(ctaPassed && !footerVisible);
    const observer = new IntersectionObserver(([entry]) => {
      ctaPassed = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
      update();
    });
    const footerObserver = new IntersectionObserver(([entry]) => { footerVisible = entry.isIntersecting; update(); });
    if (ctaRef.current) observer.observe(ctaRef.current);
    if (footerRef.current) footerObserver.observe(footerRef.current);
    return () => { observer.disconnect(); footerObserver.disconnect(); };
  }, []);

  return {
    product, productId: SHOPIFY_PRODUCT_ID_BY_HANDLE[handle], bundles, addSingle, addSelection, isAvailable,
    ctaRef, footerRef, showSticky: showSticky && !isOpen && !popupOpen,
    priceFor: (name: string) => flavorProducts.find((p) => p.name === name)?.price ?? "",
  };
}
