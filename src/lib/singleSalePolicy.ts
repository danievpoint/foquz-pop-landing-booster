import { VARIANT_GID_BY_ID } from "@/lib/shopify";

/** Standalone-Sperrliste. Leer: Verfügbarkeit kommt ausschließlich live aus Shopify. */
export const SOLD_OUT_SINGLE_IDS: string[] = [];

/** Only standalone cart IDs are checked; Shopify bundle components are never inspected. */
export function isSoldOutSingleItem(id: string): boolean {
  const standaloneId = id.startsWith("free:") ? id.slice(5) : id;
  return SOLD_OUT_SINGLE_IDS.some((name) => {
    const variantId = VARIANT_GID_BY_ID[name];
    return standaloneId === name
      || standaloneId === name.toLowerCase().replace(/ /g, "-")
      || (variantId !== undefined && (standaloneId === variantId || standaloneId === variantId.split("/").pop()));
  });
}