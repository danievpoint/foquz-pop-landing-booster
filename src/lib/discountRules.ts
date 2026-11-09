/** Mirrored Shopify campaign, verified in Admin on 2026-11-09.
 * VIRALVIDEO: EUR 5 order discount, EUR 15 minimum, all products/customers,
 * no usage limit or end date; combinable with product and shipping discounts.
 * Keep this rule in sync if the campaign changes in Shopify. Native bundles
 * use Online Store permalinks, which cannot return a priced cart to this app.
 * All other codes still require Shopify confirmation; never infer their value.
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
