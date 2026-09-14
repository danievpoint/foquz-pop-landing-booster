import { useEffect, useRef, useState } from "react";
import { products, allProducts, bundleProduct } from "@/data/products";
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
    { label: "1 DOSE", desc: "Zum Reinschnuppern", price: product.numericPrice, perDose: price(product.numericPrice), dosen: 1, tag: null, productName: product.name, oldPrice: undefined },
    { label: "3 DOSEN – POWER BUNDLE", desc: "Alle 3 Sorten in einer Box, 11 % sparen", price: bundleProduct.numericPrice, oldPrice: bundleProduct.originalPrice, perDose: price(bundleProduct.numericPrice / 3), dosen: 3, tag: "BELIEBT", productName: bundleProduct.name },
  ];
  const bundles = product.isBundle ? options.filter((option) => option.dosen === 3) : options;
  const addSingle = () => {
    if (isAvailable(product.name) !== false) {
      addToCart(1, { id: product.isBundle ? "starter-bundle" : product.name, name: product.name, price: product.numericPrice, image: product.image });
    }
  };
  const addSelection = (selection: typeof bundles[number]) => {
    if (isAvailable(selection.productName) === false) return;
    if (selection.dosen === 1) addSingle();
    else addToCart(1, { id: "starter-bundle", name: bundleProduct.name, price: bundleProduct.numericPrice, image: bundleProduct.image });
  };

  useEffect(() => {
    trackViewedProduct({ id: product.isBundle ? "starter-bundle" : product.name, name: product.name, image: product.image, price: product.numericPrice, url: `/produkt/${product.handle}` });
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
    priceFor: (name: string) => products.find((p) => p.name === name)?.price ?? "",
  };
}
