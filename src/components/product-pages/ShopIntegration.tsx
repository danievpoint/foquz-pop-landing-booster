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
    const target = gallery?.children.item(index);
    if (!(target instanceof HTMLElement)) return;
    target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveImage(index);
  };
  const updateActiveImage = () => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const center = gallery.scrollLeft + gallery.clientWidth / 2;
    const slides = Array.from(gallery.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
    const closest = slides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    setActiveImage(closest.index);
  };
  if (!product.video && images.length === 0) return null;
  return <div className="mt-3">
    {product.video && <div ref={videoRef} className="mb-3"><AutoVideo src={product.video} poster={product.videoPoster} play={play} controls className="w-full rounded-xl border-2 border-black" /></div>}
    {images.length > 0 && <div className="mx-auto w-full max-w-[15rem] sm:max-w-[17rem]">
      <div ref={galleryRef} onScroll={updateActiveImage} className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-[calc(50%-5.5rem)] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.slice(0, 3).map((img, index) => (
          <button key={img.url} type="button" onClick={() => scrollToImage(index)} aria-label={`Produktbild ${index + 1} anzeigen`} className="w-28 shrink-0 snap-center overflow-hidden rounded-lg border-2 border-black bg-white p-0">
            <img src={shopifyImageUrl(img.url, 240)} srcSet={shopifyImageSrcSet(img.url, [120, 180, 240, 360])} sizes="112px" alt={img.altText || `${product.name} Produktbild ${index + 1}`} loading="lazy" className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2" aria-label="Produktbilder">
        {images.slice(0, 3).map((img, index) => (
          <button key={img.url} type="button" onClick={() => scrollToImage(index)} aria-label={`Zu Produktbild ${index + 1}`} aria-current={activeImage === index ? "true" : undefined} className={`h-2.5 w-2.5 rounded-full border border-black transition-colors ${activeImage === index ? "bg-yellow-400" : "bg-white"}`} />
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
