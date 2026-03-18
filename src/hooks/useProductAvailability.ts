import { useQuery } from "@tanstack/react-query";
import { fetchProductsAvailability } from "@/lib/shopify";

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
    const product = availability.find(
      (p) => p.title.toLowerCase() === productName.toLowerCase()
    );
    return product ? product.availableForSale : null;
  };

  return { isAvailable, loading };
}