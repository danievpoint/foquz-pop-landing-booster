import { useEffect, useRef, useState } from "react";
import { products, allProducts, bundleProduct, squadBundleProduct, crewBundleProduct, flavorProducts } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import { SHOPIFY_PRODUCT_ID_BY_HANDLE } from "@/lib/shopify";
import { trackViewedProduct } from "@/lib/klaviyo";
import { toast } from "sonner";
import { getSetMix, mixCount } from "@/lib/setMix";
const price = (value: number) => value.toFixed(2).replace(".", ",");

/** Bild, das in der Galerie gezeigt wird, solange ein Bundle-Set gewählt ist. */
export interface SetBoxImage {
  url: string;
  altText: string;
}

export function useProductPage(handle: string) {
  const product = allProducts.find((p) => p.handle === handle)!;
  const { addToCart, isOpen, popupOpen } = useCart();
  const { isAvailable: rawAvailable } = useProductAvailability();
  // Sets bestehen aus frei wählbaren Einzeldosen – Verfügbarkeit regelt der Sorten-Picker.
  const isAvailable = (name: string) => ["FOQUZ Power Bundle", "5ER SQUAD BUNDLE", "10ER VORRATS-BUNDLE"].includes(name) ? true : rawAvailable(name);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const options = [
    { label: "1 DOSE", desc: "Sorte frei wählbar", price: 7.49, perDose: "7,49", perKg: "1.498,00", dosen: 1, tag: null, productName: product.isBundle ? products[0].name : product.name, oldPrice: undefined, id: product.isBundle ? products[0].name : product.name, boxImage: null },
    { label: "3 DOSEN – STARTER SET", desc: "Sorten frei wählbar", price: bundleProduct.numericPrice, oldPrice: "22,47 €", perDose: "7,30", perKg: "1.460,00", dosen: 3, tag: null, productName: bundleProduct.name, id: "starter-bundle", boxImage: { url: bundleProduct.image, altText: "FOQUZ Starter Set – 3er Box" } },
    { label: "5 DOSEN – SQUAD BUNDLE", desc: "Sorten frei wählbar", price: squadBundleProduct.numericPrice, oldPrice: "37,45 €", perDose: "6,98", perKg: "1.396,00", dosen: 5, tag: null, productName: squadBundleProduct.name, id: "squad-bundle", boxImage: { url: squadBundleProduct.image, altText: "FOQUZ Squad Bundle – 5er Box" } },
    { label: "10 DOSEN – VORRATS-BUNDLE", desc: "Sorten frei wählbar", price: crewBundleProduct.numericPrice, oldPrice: "74,90 €", perDose: "5,99", perKg: "1.198,00", dosen: 10, tag: null, productName: crewBundleProduct.name, id: "vorrats-bundle", boxImage: { url: crewBundleProduct.image, altText: "FOQUZ Vorrats-Bundle – 10er Box" } },
  ];
  const bundles = handle === "vorrats-bundle" ? [
    { label: "10 DOSEN – VORRATS-BUNDLE", desc: "Sorten frei wählbar", price: product.numericPrice, oldPrice: "74,90 €", perDose: "5,99", perKg: "1.198,00", dosen: 10, tag: null, productName: product.name, id: product.handle, boxImage: { url: product.image, altText: "FOQUZ Vorrats-Bundle – 10er Box" } },
  ] : handle === "squad-bundle" ? [
    { label: "5 DOSEN – SQUAD BUNDLE", desc: "Sorten frei wählbar", price: product.numericPrice, oldPrice: "37,45 €", perDose: "6,98", perKg: "1.396,00", dosen: 5, tag: null, productName: product.name, id: product.handle, boxImage: { url: product.image, altText: "FOQUZ Squad Bundle – 5er Box" } },
  ] : options;
  const addSingle = () => {
    if (isAvailable(product.name) !== false) {
      addToCart(1, { id: product.isBundle ? product.handle : product.name, name: product.name, price: product.numericPrice, image: product.image });
    }
  };
  const addSelection = (selection: typeof bundles[number]) => {
    if (isAvailable(selection.productName) === false) return;
    if (selection.dosen === 1) {
      const single = flavorProducts.find((item) => item.name === selection.productName) ?? products[0];
      addToCart(1, { id: single.name, name: single.name, price: single.numericPrice, image: single.image });
    } else {
      const left = selection.dosen - mixCount(getSetMix(selection.dosen));
      if (left > 0) { toast.error(`Bitte noch ${left} ${left === 1 ? "Dose" : "Dosen"} wählen.`, { position: "top-center" }); return; }
      addToCart(1, { id: selection.id, name: selection.productName, price: selection.price, image: selection.id === product.handle ? product.image : selection.id === "squad-bundle" ? squadBundleProduct.image : selection.id === "vorrats-bundle" ? crewBundleProduct.image : bundleProduct.image });
    }
  };

  useEffect(() => {
    trackViewedProduct({ id: product.isBundle ? product.handle : product.name, name: product.name, image: product.image, price: product.numericPrice, url: `/produkt/${product.handle}` });
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
