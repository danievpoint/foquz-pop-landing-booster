/** Mirrored Shopify campaign, verified in Admin on 2026-11-09.
 * VIRALVIDEO: EUR 5 order discount, EUR 15 minimum, all products/customers,
 * no usage limit or end date; combinable with product and shipping discounts.
 * Keep this rule in sync if the campaign changes in Shopify. Native bundles
 * use Online Store permalinks, which cannot return a priced cart to this app.
 * Percentage rules verified separately below are supported as well.
 */
export function fixedDiscountRule(code: string | null) {
  return code?.trim().toUpperCase() === "VIRALVIDEO"
    ? { code: "VIRALVIDEO", amountCents: 500, minimumCents: 1500 }
    : null;
}

export function fixedDiscountAmount(code: string | null, merchandiseTotal: number): number {
  const rule = fixedDiscountRule(code);
  const cents = Math.round(merchandiseTotal * 100);
  return rule && Number.isFinite(cents) && cents >= rule.minimumCents
    ? Math.min(rule.amountCents, cents) / 100 : 0;
}

/** Active order-wide percentage campaigns checked against Shopify 2026-11-09.
 * CLOUD10 was also checked on the native 5-can bundle: 34.90 - 3.49 = 31.41.
 * Keep these rates in sync with Shopify; do not use unknown codes or infer rates
 * from combined savings. KEVIN and FOQUZ20 were not applicable in that check.
 */
export const BUNDLE_PERCENT_DISCOUNTS: Readonly<Record<string, number>> = {
  CLOUD10: 10,
  MATYAS: 10,
  LIVIO: 10,
  WOLKE7: 15,
  DROP20: 20,
};

export function hasBundleDiscountRule(code: string | null): boolean {
  const normalized = code?.trim().toUpperCase() ?? "";
  return Boolean(fixedDiscountRule(normalized)) || Object.prototype.hasOwnProperty.call(BUNDLE_PERCENT_DISCOUNTS, normalized);
}

export function bundleDiscountAmount(code: string | null, merchandiseTotal: number): number {
  if (fixedDiscountRule(code)) return fixedDiscountAmount(code, merchandiseTotal);
  const normalized = code?.trim().toUpperCase() ?? "";
  if (!Object.prototype.hasOwnProperty.call(BUNDLE_PERCENT_DISCOUNTS, normalized)) return 0;
  const cents = Math.round(merchandiseTotal * 100);
  if (!Number.isFinite(cents) || cents <= 0) return 0;
  // Shopify rounds down once on the order discount, then allocates those cents
  // across lines. Rounding each unit separately undercounts mixed/multi-item carts.
  return Math.floor(cents * BUNDLE_PERCENT_DISCOUNTS[normalized] / 100) / 100;
}
