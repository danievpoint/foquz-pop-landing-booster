import { useEffect, useRef, useState } from "react";
import { type Product } from "@/data/products";
import { useProductPage } from "@/hooks/useProductPage";
import { fetchProductGalleryImages, shopifyImageSrcSet, shopifyImageUrl, type ShopifyImage } from "@/lib/shopify";
import SeoHead from "@/components/SeoHead";
import AutoVideo from "@/components/AutoVideo";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const price = (value: number) => value.toFixed(2).replace(".", ",");

type Shop = ReturnType<typeof useProductPage>;

export function ProductPageMeta({ shop }: { shop: Shop }) {
  const { product, isAvailable } = shop;
  const availability = isAvailable(product.name);
  const url = `https://www.foquz.de/produkt/${product.handle}`;
  return <SeoHead title={`${product.name} – FOQUZ Riechdose`} description={product.desc.replace(/\n/g, " ")} path={`/produkt/${product.handle}`} type="product" image={product.image}
    jsonLd={{ "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.desc, image: new URL(product.image, "https://www.foquz.de").href, brand: { "@type": "Brand", name: "FOQUZ" }, offers: { "@type": "Offer", url, priceCurrency: "EUR", price: product.numericPrice, ...(availability === null ? {} : { availability: `https://schema.org/${availability ? "InStock" : "OutOfStock"}` }) } }} />;
}

export function ProductPageMedia({ product, includeProductImage = false, maxImages = 3 }: { product: Product; includeProductImage?: boolean; maxImages?: number }) {
  const [images, setImages] = useState<ShopifyImage[]>([]);
  const [play, setPlay] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const galleryImages = (includeProductImage
    ? [{ url: product.image, altText: product.name }, ...images.filter((image) => image.url !== product.image)]
    : images).slice(0, maxImages);
  const slideOffset = product.video ? 1 : 0;
  const slideCount = galleryImages.length + slideOffset;
  useEffect(() => {
    let active = true;
    setActiveIndex(0);
    galleryRef.current?.scrollTo({ left: 0 });
    fetchProductGalleryImages(product.handle).then((result) => {
      if (!active) return;
      setImages(result);
      setActiveIndex(0);
      galleryRef.current?.scrollTo({ left: 0 });
    }).catch(() => {});
    return () => { active = false; };
  }, [product.handle]);
  useEffect(() => {
    if (!videoRef.current) return;
    // Sofort starten, sobald ein nennenswerter Teil sichtbar ist (z. B. direkt
    // nach dem Seitenaufruf), nicht erst bei vollstaendiger Sichtbarkeit.
    setPlay(true);
    const observer = new IntersectionObserver(([entry]) => setPlay(entry.intersectionRatio >= 0.25), { threshold: [0, 0.25, 0.6, 1] });
    observer.observe(videoRef.current);
    return () => { observer.disconnect(); setPlay(false); };
  }, []);
  useEffect(() => () => {
    if (frameRef.current !== undefined) window.cancelAnimationFrame(frameRef.current);
  }, []);
  const updateActiveIndex = () => {
    if (frameRef.current !== undefined) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      const gallery = galleryRef.current;
      if (!gallery || gallery.clientWidth === 0) return;
      setActiveIndex(Math.max(0, Math.min(slideCount - 1, Math.round(gallery.scrollLeft / gallery.clientWidth))));
    });
  };
  const scrollToSlide = (index: number) => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    gallery.scrollTo({ left: index * gallery.clientWidth, behavior: "smooth" });
    setActiveIndex(index);
  };
  if (!product.video && galleryImages.length === 0) return null;
  return <div className="mt-3">
    <div ref={galleryRef} onScroll={updateActiveIndex} className="flex w-full snap-x snap-mandatory overflow-x-auto rounded-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {product.video && <div ref={videoRef} className="w-full flex-none basis-full snap-center"><AutoVideo src={product.video} poster={product.videoPoster} play={play && activeIndex === 0} className="aspect-square w-full rounded-xl border-2 border-black object-cover pointer-events-none" /></div>}
      {galleryImages.map((img, index) => (
        <div key={img.url} className={`${product.isBundle ? "aspect-[6/5]" : "aspect-square"} w-full flex-none basis-full snap-center overflow-hidden rounded-xl border-2 border-black bg-white`}>
          <img src={shopifyImageUrl(img.url, 900)} srcSet={shopifyImageSrcSet(img.url, [480, 640, 900, 1200])} sizes="(max-width: 1024px) 100vw, 50vw" width={product.isBundle ? 1920 : 900} height={product.isBundle ? 1586 : 900} alt={img.altText || `${product.name} Produktbild ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" className={`block h-full w-full ${product.isBundle ? "object-cover" : "object-contain"}`} />
        </div>
      ))}
    </div>
    {slideCount > 1 && <div className="mt-3 flex items-center justify-center gap-2" aria-label="Produktbild auswählen">
      {Array.from({ length: slideCount }, (_, index) => (
        <Button key={index} type="button" variant="ghost" size="icon" onClick={() => scrollToSlide(index)} aria-label={`Bild ${index + 1} anzeigen`} aria-current={activeIndex === index ? "true" : undefined} className={`h-3 min-h-3 rounded-full border-2 border-foreground p-0 transition-all ${activeIndex === index ? "w-7 bg-primary hover:bg-primary" : "w-3 bg-background hover:bg-muted"}`} />
      ))}
    </div>}
    {galleryImages.length > 0 && <div className="mx-auto mt-3 flex w-full flex-wrap justify-center gap-2">
      {galleryImages.map((img, index) => (
        <button key={img.url} type="button" onClick={() => scrollToSlide(index + slideOffset)} aria-label={`${img.altText || `${product.name} Produktbild ${index + 1}`} anzeigen`} className={`h-14 w-14 flex-none overflow-hidden rounded-md border-2 bg-white p-0 ${activeIndex === index + slideOffset ? "border-primary ring-2 ring-primary" : "border-black"}`}>
          <img src={shopifyImageUrl(img.url, 160)} srcSet={shopifyImageSrcSet(img.url, [96, 128, 160, 240])} sizes="56px" width={160} height={160} alt="" aria-hidden="true" loading="lazy" decoding="async" className="block h-full w-full object-contain" />
        </button>
      ))}
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

export function FreeShippingStatus({ selectedPrice }: { selectedPrice: number }) {
  const remaining = Math.max(0, 29 - selectedPrice);
  return <div className="pt-4 flex items-center gap-2 text-xs font-semibold">
    {remaining === 0 && <span className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5" /></span>}
    <span>{remaining === 0 ? "Versandkostenfrei" : `Noch ${price(remaining)} € bis zum Gratisversand`}</span>
  </div>;
}

export function ProductPromise() {
  return <div className="mt-4 mb-24 lg:mb-0 rounded-2xl border-2 border-black bg-white p-4 pb-5 shadow-[4px_4px_0_0_#000]">
    <h2 className="font-barlow font-extrabold text-base">UNSER VERSPRECHEN</h2>
    <p className="mt-2 text-xs font-semibold leading-relaxed">Ungeöffnete Dosen kannst du innerhalb von 14 Tagen zurückschicken und bekommst dein Geld zurück. Geöffnete Dosen nehmen wir aus Hygienegründen nicht zurück (§ 312g Abs. 2 Nr. 3 BGB). Wenn mit deiner Bestellung etwas nicht stimmt, schreib uns an info@foquz.de und wir kümmern uns drum.</p>
  </div>;
}
