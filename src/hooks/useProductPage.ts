import { useEffect, useRef, useState } from "react";
import { products, allProducts, bundleProduct, squadBundleProduct, flavorProducts } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import { SHOPIFY_PRODUCT_ID_BY_HANDLE } from "@/lib/shopify";
import { trackViewedProduct } from "@/lib/klaviyo";
const price = (value: number) => value.toFixed(2).replace(".", ",");

export function useProductPage(handle: string) {
  const product = allProducts.find((p) => p.handle === handle)!;
  const { addToCart, isOpen, popupOpen } = useCart();
  const { isAvailable } = useProductAvailability();
  const ctaRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const options = [
    { label: "1 DOSE", desc: "Sorte frei wählbar", price: 7.49, perDose: "7,49", dosen: 1, tag: null, productName: product.isBundle ? products[0].name : product.name, oldPrice: undefined, id: product.isBundle ? products[0].name : product.name },
    { label: "3 DOSEN", desc: "Thai Style, Lemon Breezy & Peach Party", price: bundleProduct.numericPrice, oldPrice: "22,47 €", perDose: "7,30", dosen: 3, tag: "SPARE 3 %", productName: bundleProduct.name, id: "starter-bundle" },
    { label: "5 DOSEN", desc: "je 1× alle fünf Sorten", price: squadBundleProduct.numericPrice, oldPrice: "37,45 €", perDose: "6,98", dosen: 5, tag: "SPARE 7 %", productName: squadBundleProduct.name, id: "squad-bundle" },
  ];
  const bundles = handle === "squad-bundle" ? [
    { label: "5 DOSEN – SQUAD BUNDLE", desc: "Je 1× alle fünf Sorten", price: product.numericPrice, oldPrice: "37,45 €", perDose: "6,98", dosen: 5, tag: "SPARE 7 %", productName: product.name, id: product.handle },
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
      addToCart(1, { id: selection.id, name: selection.productName, price: selection.price, image: selection.id === product.handle ? product.image : selection.id === "squad-bundle" ? squadBundleProduct.image : bundleProduct.image });
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
