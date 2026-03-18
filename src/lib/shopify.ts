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
