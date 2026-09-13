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
  const [activeImage, setActiveImage] = useState(0);
  const videoRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let active = true;
    setActiveImage(0);
    fetchProductGalleryImages(product.handle).then((result) => { if (active) setImages(result); }).catch(() => {});
    return () => { active = false; };
  }, [product.handle]);
  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setPlay(entry.intersectionRatio >= 0.99), { threshold: [0, 0.99, 1] });
    observer.observe(videoRef.current);
    return () => { observer.disconnect(); setPlay(false); };
  }, []);
  const scrollToImage = (index: number) => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    gallery.scrollTo({ left: index * gallery.clientWidth, behavior: "smooth" });
    setActiveImage(index);
  };
  const updateActiveImage = () => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    setActiveImage(Math.round(gallery.scrollLeft / gallery.clientWidth));
  };
  if (!product.video && images.length === 0) return null;
  return <div className="mt-3">
    {product.video && <div ref={videoRef} className="mb-3"><AutoVideo src={product.video} poster={product.videoPoster} play={play} controls className="w-full rounded-xl border-2 border-black" /></div>}
    {images.length > 0 && <div className="mx-auto w-full max-w-[15rem] sm:max-w-[17rem]">
      <div ref={galleryRef} onScroll={updateActiveImage} className="flex aspect-square snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-lg border-2 border-black bg-card [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.slice(0, 3).map((img, index) => (
          <div key={img.url} className="h-full min-w-full snap-center snap-always">
            <img src={shopifyImageUrl(img.url, 480)} srcSet={shopifyImageSrcSet(img.url, [240, 360, 480, 640])} sizes="(min-width: 640px) 272px, 240px" alt={img.altText || `${product.name} Produktbild ${index + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 py-0.5" aria-label="Produktbilder">
        {images.slice(0, 3).map((img, index) => (
          <button key={img.url} type="button" onClick={() => scrollToImage(index)} aria-label={`Zu Produktbild ${index + 1}`} aria-current={activeImage === index ? "true" : undefined} className={`h-2.5 shrink-0 rounded-full border-2 border-black transition-all ${activeImage === index ? "w-6 bg-secondary" : "w-2.5 bg-card"}`} />
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.slice(0, 3).map((img, index) => (
          <button key={`thumb-${img.url}`} type="button" onClick={() => scrollToImage(index)} aria-label={`Vorschaubild ${index + 1}`} className={`h-12 w-12 shrink-0 overflow-hidden rounded-md bg-card transition-shadow ${activeImage === index ? "border-2 border-secondary shadow-[2px_2px_0_0_hsl(var(--foreground))]" : "border-2 border-border"}`}>
            <img src={shopifyImageUrl(img.url, 120)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
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
