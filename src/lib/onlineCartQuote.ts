import { parseDiscountAllocations, SHOPIFY_STORE_PERMANENT_DOMAIN, type CheckoutLine, type DiscountLine } from './shopify';

export interface OnlineCartQuote { subtotal: number; currency: 'EUR'; applicable: boolean; discounts: DiscountLine[] }
// Tokenless Storefront access uses Online Store publication, unlike the Lovable
// channel token which cannot see native bundles. Supported by Shopify for carts:
// https://shopify.dev/docs/api/storefront/latest#tokenless-access
const allocations = `discountedAmount { amount } ... on CartCodeDiscountAllocation { code } ... on CartAutomaticDiscountAllocation { title } ... on CartCustomDiscountAllocation { title }`;
export const ONLINE_CART_QUOTE_QUERY = `mutation BundleQuote($input: CartInput!) {
  cartCreate(input: $input) {
    userErrors { message }
    cart {
      cost { totalAmount { amount currencyCode } }
      discountCodes { code applicable }
      discountAllocations { ${allocations} }
      lines(first: 100) {
        pageInfo { hasNextPage }
        edges { node { quantity merchandise { ... on ProductVariant { id } } discountAllocations { ${allocations} } } }
      }
    }
  }
}`;

export async function fetchOnlineCartQuote(lines: CheckoutLine[], code: string | null): Promise<OnlineCartQuote | null> {
  if (!lines.length || lines.length > 100) return null;
  try {
    const response = await fetch(`https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/2026-10/graphql.json`, {
      method: 'POST', signal: AbortSignal.timeout(15000), credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: ONLINE_CART_QUOTE_QUERY, variables: { input: {
        lines: lines.map(l => ({ merchandiseId: l.variantId, quantity: l.quantity, ...(l.attributes ? { attributes: l.attributes } : {}) })),
        discountCodes: code ? [code] : [],
      } } }),
    });
    if (!response.ok) return null;
    const result = await response.json();
    const payload = result.data?.cartCreate;
    const cart = payload?.cart;
    if (result.errors?.length || payload?.userErrors?.length || !cart || cart.lines?.pageInfo?.hasNextPage) return null;
    const amount = cart.cost?.totalAmount;
    const subtotal = Number(amount?.amount);
    if (amount?.currencyCode !== 'EUR' || typeof amount?.amount !== 'string' || !Number.isFinite(subtotal) || subtotal < 0) return null;
    // Reject partial carts: Shopify can omit unavailable products or quantities.
    const expected = new Map<string, number>();
    const actual = new Map<string, number>();
    for (const l of lines) expected.set(l.variantId, (expected.get(l.variantId) ?? 0) + l.quantity);
    for (const { node } of cart.lines?.edges ?? []) {
      if (!node.merchandise?.id || !Number.isInteger(node.quantity) || node.quantity < 1) return null;
      actual.set(node.merchandise.id, (actual.get(node.merchandise.id) ?? 0) + node.quantity);
    }
    if (expected.size !== actual.size || [...expected].some(([id, qty]) => actual.get(id) !== qty)) return null;
    return {
      subtotal, currency: 'EUR', discounts: parseDiscountAllocations(cart),
      applicable: !code || Boolean(cart.discountCodes?.some((d: { code: string; applicable: boolean }) => d.code.toUpperCase() === code.toUpperCase() && d.applicable)),
    };
  } catch { return null; }
}
