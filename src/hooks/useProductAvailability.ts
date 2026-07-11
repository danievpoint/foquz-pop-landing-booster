import { useQuery } from "@tanstack/react-query";
import { fetchProductsAvailability } from "@/lib/shopify";

// Local display names may differ from Shopify product titles.
const SHOPIFY_TITLE_BY_NAME: Record<string, string> = {
  "FOQUZ Power Bundle": "Starter Bundle",
};

export function useProductAvailability() {
  const { data: availability = [], isLoading: loading } = useQuery({
    queryKey: ["shopify-availability"],
    queryFn: fetchProductsAvailability,
    staleTime: 5 * 60 * 1000, // 5 min cache
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const isAvailable = (productName: string): boolean | null => {
    if (loading) return null;
    const shopifyTitle = SHOPIFY_TITLE_BY_NAME[productName] ?? productName;
    const product = availability.find(
      (p) => p.title.toLowerCase() === shopifyTitle.toLowerCase()
    );
    return product ? product.availableForSale : null;
  };

  return { isAvailable, loading };
}
