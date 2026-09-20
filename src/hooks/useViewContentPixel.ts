import { useEffect, useRef } from "react";
import { variantIdFor } from "@/lib/klaviyo";
import { trackPixelViewContent } from "@/lib/tracking";

/** Sendet ViewContent an die Werbe-Pixel, sobald sich die gewählte Option ändert. */
export function useViewContentPixel(id: string, name: string, value: number) {
  const last = useRef<string>("");
  useEffect(() => {
    const key = `${id}|${value}`;
    if (last.current === key) return;
    last.current = key;
    trackPixelViewContent({ contentId: variantIdFor(id) ?? id, name, value });
  }, [id, name, value]);
}
