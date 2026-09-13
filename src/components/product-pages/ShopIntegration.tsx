import { useEffect, useRef, useState } from "react";
import { type Product } from "@/data/products";
import { useProductPage } from "@/hooks/useProductPage";
import { fetchProductGalleryImages, shopifyImageSrcSet, shopifyImageUrl, type ShopifyImage } from "@/lib/shopify";
import SeoHead from "@/components/SeoHead";
import AutoVideo from "@/components/AutoVideo";

const price = (value: number) => value.toFixed(2).replace(".", ",");

type Shop = ReturnType<typeof useProductPage>;

export function ProductPageMeta({ shop }: { shop: Shop }) {
  const { product, isAvailable } = shop;
  const availability = isAvailable(product.name);
  const url = `https://www.foquz.de/produkt/${product.handle}`;
  return <SeoHead title={`${product.name} – FOQUZ Riechdose`} description={product.desc.replace(/\n/g, " ")} path={`/produkt/${product.handle}`} type="product" image={product.image}
    jsonLd={{ "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.desc, image: new URL(product.image, "https://www.foquz.de").href, brand: { "@type": "Brand", name: "FOQUZ" }, offers: { "@type": "Offer", url, priceCurrency: "EUR", price: product.numericPrice, ...(availability === null ? {} : { availability: `https://schema.org/${availability ? "InStock" : "OutOfStock"}` }) } }} />;
}

export function ProductPageMedia({ product }: { product: Product }) {
  const [images, setImages] = useState<ShopifyImage[]>([]);
  const [play, setPlay] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let active = true;
    fetchProductGalleryImages(product.handle).then((result) => { if (active) setImages(result); }).catch(() => {});
    return () => { active = false; };
  }, [product.handle]);
  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setPlay(entry.intersectionRatio >= 0.99), { threshold: [0, 0.99, 1] });
    observer.observe(videoRef.current);
    return () => { observer.disconnect(); setPlay(false); };
  }, []);
  if (!product.video && images.length === 0) return null;
  return <div className="mt-3">
    {product.video && <div ref={videoRef} className="mb-3"><AutoVideo src={product.video} poster={product.videoPoster} play={play} controls className="w-full rounded-xl border-2 border-black" /></div>}
    {images.length > 0 && <div className="grid grid-cols-3 gap-2 md:gap-3">
      {images.slice(0, 3).map((img) => <img key={img.url} src={shopifyImageUrl(img.url, 320)} srcSet={shopifyImageSrcSet(img.url, [160, 240, 320, 480])} sizes="(min-width: 1024px) 160px, 30vw" alt={img.altText || product.name} loading="lazy" className="w-full aspect-square object-cover rounded-lg border-2 border-black" />)}
    </div>}
  </div>;
}

export function ProductPageSticky({ shop, selectedBundle }: { shop: Shop; selectedBundle: Shop["bundles"][number] }) {
  if (!shop.showSticky) return null;
  return <div className="product-page-design fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-black p-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden">
    <button className="comic-btn w-full text-sm py-3" style={{ backgroundColor: "#ffd618", color: "#000" }} disabled={shop.isAvailable(selectedBundle.productName) === false} onClick={() => shop.addSelection(selectedBundle)}>
      IN DEN WARENKORB – {price(selectedBundle.price)} €
    </button>
  </div>;
}
