import { useEffect, useRef, useState } from "react";
import { type Product } from "@/data/products";
import { useProductPage } from "@/hooks/useProductPage";
import { fetchProductGalleryImages, type ShopifyImage } from "@/lib/shopify";
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
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ShopifyImage[]>([]);
  const [play, setPlay] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    let active = true;
    fetchProductGalleryImages(product.handle).then((result) => { if (active) setImages(result); }).catch(() => {});
    return () => { active = false; };
  }, [product.handle, open]);
  useEffect(() => {
    if (!open || !videoRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setPlay(entry.intersectionRatio >= 0.99), { threshold: [0, 0.99, 1] });
    observer.observe(videoRef.current);
    return () => { observer.disconnect(); setPlay(false); };
  }, [open]);
  return <div>
    <button className="text-sm font-bold underline py-2" aria-expanded={open} onClick={() => setOpen(!open)}>Weitere Produktbilder & Video</button>
    {open && <div className="grid gap-3 mt-3">
      {product.video && <div ref={videoRef}><AutoVideo src={product.video} poster={product.videoPoster} play={play} controls className="w-full rounded-xl" /></div>}
      {images.map((img) => <img key={img.url} src={img.url} alt={img.altText || product.name} loading="lazy" className="w-full rounded-xl" />)}
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
