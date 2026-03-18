import { useState, useEffect } from "react";
import { fetchProductsAvailability, type ProductAvailability } from "@/lib/shopify";

export function useProductAvailability() {
  const [availability, setAvailability] = useState<ProductAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsAvailability().then((data) => {
      setAvailability(data);
      setLoading(false);
    });
  }, []);

  const isAvailable = (productName: string): boolean | null => {
    if (loading) return null;
    const product = availability.find(
      (p) => p.title.toLowerCase() === productName.toLowerCase()
    );
    return product ? product.availableForSale : null;
  };

  return { isAvailable, loading };
}
