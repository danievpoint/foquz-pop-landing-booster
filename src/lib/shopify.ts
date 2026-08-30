import { toast } from "sonner";
import { getCreator, getDtId } from "./attribution";


const SHOPIFY_API_VERSION = '2025-07';
export const SHOPIFY_STORE_PERMANENT_DOMAIN = 'foquz-pop-landing-booster-xb8ca.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '8aca74773e74c1661173fb980846444a';

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active billing plan.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Shopify error: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }
  return data;
}

const PRODUCTS_AVAILABILITY_QUERY = `
  query GetProductsAvailability($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          availableForSale
        }
      }
    }
  }
`;

export interface ProductAvailability {
  title: string;
  availableForSale: boolean;
}

export async function fetchProductsAvailability(): Promise<ProductAvailability[]> {
  try {
    const data = await storefrontApiRequest(PRODUCTS_AVAILABILITY_QUERY, { first: 50 });
    if (!data?.data?.products?.edges) return [];
    return data.data.products.edges.map((edge: { node: { title: string; availableForSale: boolean } }) => ({
      title: edge.node.title,
      availableForSale: edge.node.availableForSale,
    }));
  } catch (error) {
    console.error('Failed to fetch product availability:', error);
    return [];
  }
}

// Map local cart item IDs to Shopify ProductVariant GIDs
export const VARIANT_GID_BY_ID: Record<string, string> = {
  // Product names (used in ProductGrid/ProductDetail)
  "PEACH PARTY": "gid://shopify/ProductVariant/52867405513046",
  "THAI STYLE": "gid://shopify/ProductVariant/52867410788694",
  "LEMON BREEZY": "gid://shopify/ProductVariant/52867411738966",
  // Bundle IDs (used in CartContext default and ProductDetail)
  "bundle": "gid://shopify/ProductVariant/52867411837270",
  "starter-bundle": "gid://shopify/ProductVariant/52867411837270",
};

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        discountCodes { code applicable }
      }
      userErrors { field message }
    }
  }
`;

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

export interface CheckoutLine {
  variantId: string;
  quantity: number;
}

export interface ShopifyCheckout {
  url: string;
  cartId: string;
  discountedSubtotal: number | null;
  discountApplicable: boolean;
}

export async function createShopifyCheckout(
  lines: CheckoutLine[],
  discountCodes?: string[]
): Promise<ShopifyCheckout | null> {
  const input: Record<string, unknown> = {
    lines: lines.map((l) => ({ quantity: l.quantity, merchandiseId: l.variantId })),
  };
  if (discountCodes && discountCodes.length > 0) {
    input.discountCodes = discountCodes;
  }

  // Persist Collabs attribution on the cart so it reaches the Shopify order.
  const dtId = getDtId();
  const creator = getCreator();
  const attributes: Array<{ key: string; value: string }> = [];
  if (dtId) attributes.push({ key: "dt_id", value: dtId });
  if (creator) attributes.push({ key: "creator", value: creator });
  if (attributes.length > 0) input.attributes = attributes;

  const data = await storefrontApiRequest(CART_CREATE_MUTATION, { input });
  const userErrors = data?.data?.cartCreate?.userErrors ?? [];
  if (userErrors.length > 0) {
    console.error('Shopify cartCreate errors:', userErrors);
    return null;
  }
  const cart = data?.data?.cartCreate?.cart;
  const checkoutUrl: string | undefined = cart?.checkoutUrl;
  const cartId: string | undefined = cart?.id;
  if (!checkoutUrl || !cartId) return null;

  // Shopify's subtotalAmount is BEFORE discount codes. totalAmount reflects
  // the Storefront cart total after discount codes, before shipping selection.
  const subtotalRaw = cart?.cost?.totalAmount?.amount;
  const discountedSubtotal =
    typeof subtotalRaw === "string" && !Number.isNaN(parseFloat(subtotalRaw))
      ? parseFloat(subtotalRaw)
      : null;
  const codes: Array<{ code: string; applicable: boolean }> = cart?.discountCodes ?? [];
  const discountApplicable = codes.length === 0 ? true : codes.every((c) => c.applicable);

  return { url: decorateCheckoutUrl(checkoutUrl), cartId, discountedSubtotal, discountApplicable };
}

/**
 * The checkout URL is ALWAYS the untouched `cart.checkoutUrl` returned by
 * Shopify – host and path are never rebuilt or string-replaced. We only append
 * the tracking query params Shopify itself expects on a custom storefront
 * (`channel` and the Collabs `dt_id`).
 */
export function decorateCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    const dtId = getDtId();
    if (dtId && !url.searchParams.has('dt_id')) url.searchParams.set('dt_id', dtId);
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

const CART_DISCOUNT_CODES_UPDATE_MUTATION = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        checkoutUrl
        cost { totalAmount { amount currencyCode } }
        discountCodes { code applicable }
      }
      userErrors { field message }
    }
  }
`;

/** Applies a discount code to an EXISTING Shopify cart. */
export async function applyDiscountCodeToCart(
  cartId: string,
  discountCodes: string[]
): Promise<ShopifyCheckout | null> {
  const data = await storefrontApiRequest(CART_DISCOUNT_CODES_UPDATE_MUTATION, {
    cartId,
    discountCodes,
  });
  const userErrors = data?.data?.cartDiscountCodesUpdate?.userErrors ?? [];
  if (userErrors.length > 0) {
    console.error('Shopify cartDiscountCodesUpdate errors:', userErrors);
    return null;
  }
  const cart = data?.data?.cartDiscountCodesUpdate?.cart;
  if (!cart?.checkoutUrl || !cart?.id) return null;

  const amountRaw = cart?.cost?.totalAmount?.amount;
  const discountedSubtotal =
    typeof amountRaw === "string" && !Number.isNaN(parseFloat(amountRaw))
      ? parseFloat(amountRaw)
      : null;
  const codes: Array<{ code: string; applicable: boolean }> = cart?.discountCodes ?? [];
  const discountApplicable = codes.length === 0 ? true : codes.every((c) => c.applicable);

  return {
    url: decorateCheckoutUrl(cart.checkoutUrl),
    cartId: cart.id,
    discountedSubtotal,
    discountApplicable,
  };
}

const URL_REDIRECTS_QUERY = `
  query UrlRedirects($first: Int!, $query: String) {
    urlRedirects(first: $first, query: $query) {
      edges { node { id path target } }
    }
  }
`;

/**
 * Resolves a Shopify "URL Redirect" (Online Store > Navigation > URL Redirects).
 * Used for personalised Collabs links like /creatorname.
 */
export async function resolveShopifyRedirect(path: string): Promise<string | null> {
  try {
    const data = await storefrontApiRequest(URL_REDIRECTS_QUERY, {
      first: 10,
      query: `path:${path}`,
    });
    const edges: Array<{ node: { path: string; target: string } }> =
      data?.data?.urlRedirects?.edges ?? [];
    const normalized = path.replace(/\/+$/, "").toLowerCase() || "/";
    const match =
      edges.find((e) => (e.node.path ?? "").replace(/\/+$/, "").toLowerCase() === normalized) ??
      edges[0];
    return match?.node?.target ?? null;
  } catch (e) {
    console.error('Failed to resolve Shopify URL redirect:', e);
    return null;
  }
}


/**
 * Returns true when the Shopify cart no longer exists or has 0 items,
 * which indicates the checkout was completed (or expired).
 */
export async function isShopifyCartCompleted(cartId: string): Promise<boolean> {
  try {
    const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
    const cart = data?.data?.cart;
    if (!cart) return true;
    return (cart.totalQuantity ?? 0) === 0;
  } catch (e) {
    console.error('Failed to check Shopify cart status:', e);
    return false;
  }
}

// Validates a discount code against Shopify by creating a throwaway cart with
// the code applied and checking the `applicable` flag on the returned cart.
// Returns true only for codes that actually exist and can be used.
const CART_VALIDATE_DISCOUNT_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        discountCodes { code applicable }
      }
      userErrors { field message code }
    }
  }
`;

export async function validateDiscountCode(code: string): Promise<boolean> {
  const normalized = code.trim();
  if (!normalized) return false;

  // Use any known variant as a stub line so Shopify actually evaluates the code.
  const stubVariantId =
    VARIANT_GID_BY_ID["starter-bundle"] ||
    Object.values(VARIANT_GID_BY_ID)[0];
  if (!stubVariantId) return false;

  try {
    const data = await storefrontApiRequest(CART_VALIDATE_DISCOUNT_MUTATION, {
      input: {
        lines: [{ quantity: 1, merchandiseId: stubVariantId }],
        discountCodes: [normalized],
      },
    });
    const userErrors = data?.data?.cartCreate?.userErrors ?? [];
    if (userErrors.length > 0) return false;
    const codes = data?.data?.cartCreate?.cart?.discountCodes ?? [];
    const match = codes.find(
      (c: { code: string; applicable: boolean }) =>
        c.code?.toUpperCase() === normalized.toUpperCase()
    );
    return !!match?.applicable;
  } catch (e) {
    console.error("Failed to validate discount code:", e);
    return false;
  }
}

const PRODUCT_IMAGES_QUERY = `
  query ProductImages($handle: String!) {
    product(handle: $handle) {
      images(first: 12) {
        edges { node { url altText } }
      }
    }
  }
`;

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

/** Extra gallery images uploaded in Shopify (primary image excluded). */
export async function fetchProductGalleryImages(handle: string): Promise<ShopifyImage[]> {
  try {
    const data = await storefrontApiRequest(PRODUCT_IMAGES_QUERY, { handle });
    const edges: Array<{ node: ShopifyImage }> = data?.data?.product?.images?.edges ?? [];
    // Feste Reihenfolge: 1. Warum FOQUZ (Inhaltsstoffe), 2. How to FOQUZ
    // (Anwendung), 3. Sortiment / Go Thai, danach der Rest.
    const order = ["inhaltsstoffe", "anwendung", "sortiment"];
    const rank = (url: string) => {
      const name = url.toLowerCase();
      const i = order.findIndex((k) => name.includes(k));
      return i === -1 ? order.length : i;
    };
    return edges
      .slice(1)
      .map((e) => e.node)
      .sort((a, b) => rank(a.url) - rank(b.url));

  } catch (e) {
    console.error("Failed to fetch product images:", e);
    return [];
  }
}
