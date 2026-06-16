import { toast } from "sonner";

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'foquz-pop-landing-booster-xb8ca.myshopify.com';
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
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

export interface CheckoutLine {
  variantId: string;
  quantity: number;
}

export async function createShopifyCheckout(
  lines: CheckoutLine[],
  discountCodes?: string[]
): Promise<string | null> {
  const input: Record<string, unknown> = {
    lines: lines.map((l) => ({ quantity: l.quantity, merchandiseId: l.variantId })),
  };
  if (discountCodes && discountCodes.length > 0) {
    input.discountCodes = discountCodes;
  }

  const data = await storefrontApiRequest(CART_CREATE_MUTATION, { input });
  const userErrors = data?.data?.cartCreate?.userErrors ?? [];
  if (userErrors.length > 0) {
    console.error('Shopify cartCreate errors:', userErrors);
    return null;
  }
  const checkoutUrl: string | undefined = data?.data?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) return null;

  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}
