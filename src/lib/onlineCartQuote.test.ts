import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchOnlineCartQuote } from './onlineCartQuote';
const lines = [{ variantId: 'gid://shopify/ProductVariant/123', quantity: 1 }];
const cart = () => ({ cost: { totalAmount: { amount: '31.41', currencyCode: 'EUR' } }, discountCodes: [{ code: 'BRANDNEW', applicable: true }], discountAllocations: [{ code: 'BRANDNEW', discountedAmount: { amount: '3.49' } }], lines: { pageInfo: { hasNextPage: false }, edges: [{ node: { merchandise: { id: lines[0].variantId }, quantity: 1, discountAllocations: [] } }] } });
function respond(value = cart(), extra = {}) { vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { cartCreate: { cart: value, userErrors: [] } }, ...extra }) })); }
beforeEach(() => { vi.stubGlobal('AbortSignal', { timeout: () => undefined }); respond(); });
afterEach(() => vi.unstubAllGlobals());
describe('tokenless bundle quotes', () => {
  it('prices future codes from Shopify without channel credentials or hardcoded rules', async () => {
    expect(await fetchOnlineCartQuote(lines, 'BRANDNEW')).toEqual({ subtotal: 31.41, currency: 'EUR', applicable: true, discounts: [{ kind: 'code', label: 'BRANDNEW', amount: 3.49 }] });
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toContain('/api/2026-10/graphql.json');
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(init?.credentials).toBe('omit');
    expect(JSON.parse(init!.body as string).variables.input).toEqual({ lines: [{ merchandiseId: lines[0].variantId, quantity: 1 }], discountCodes: ['BRANDNEW'] });
  });
  it('rejects missing/changed variants and quantities rather than quoting a partial cart', async () => {
    for (const mutate of [(c: ReturnType<typeof cart>) => { c.lines.edges = []; }, (c: ReturnType<typeof cart>) => { c.lines.edges[0].node.quantity = 2; }, (c: ReturnType<typeof cart>) => { c.lines.edges[0].node.merchandise.id = 'different'; }, (c: ReturnType<typeof cart>) => { c.lines.pageInfo.hasNextPage = true; }]) {
      const c = cart(); mutate(c); respond(c); expect(await fetchOnlineCartQuote(lines, 'BRANDNEW')).toBeNull();
    }
  });
  it('fails closed for currency, API and network failures', async () => {
    const c = cart(); c.cost.totalAmount.currencyCode = 'USD'; respond(c); expect(await fetchOnlineCartQuote(lines, '')).toBeNull();
    respond(cart(), { errors: [{ message: 'Throttled' }] }); expect(await fetchOnlineCartQuote(lines, '')).toBeNull();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline'))); expect(await fetchOnlineCartQuote(lines, '')).toBeNull();
  });
  it('honors Shopify rejection and removal of a code', async () => {
    const c = cart(); c.discountCodes[0].applicable = false; c.discountAllocations = []; c.cost.totalAmount.amount = '34.90'; respond(c);
    expect(await fetchOnlineCartQuote(lines, 'BRANDNEW')).toMatchObject({ applicable: false, subtotal: 34.9, discounts: [] });
    expect(await fetchOnlineCartQuote(lines, null)).toMatchObject({ applicable: true, subtotal: 34.9 });
    expect(JSON.parse(vi.mocked(fetch).mock.calls[1][1]!.body as string).variables.input.discountCodes).toEqual([]);
  });
});
