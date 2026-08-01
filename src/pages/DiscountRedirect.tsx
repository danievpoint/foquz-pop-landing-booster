import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import {
  captureAttributionFromSearch,
  mergeTrackingParams,
  sanitizeInternalRedirect,
  setPendingDiscountCode,
} from "@/lib/attribution";

/**
 * /discount/:code – mirrors Shopify's discount links for a custom storefront.
 *
 * The code is applied to an existing Shopify cart (via cartDiscountCodesUpdate)
 * or stored until the cart is created. Afterwards the visitor is forwarded to
 * the (internal-only) `redirect` target with dt_id and tracking params intact.
 */
const DiscountRedirect = () => {
  const { code } = useParams<{ code: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { applyManualDiscountCode } = useCart();
  const handled = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    captureAttributionFromSearch(location.search);

    const normalized = (code ?? "").trim().toUpperCase();
    if (!normalized) {
      setError("Kein Rabattcode angegeben.");
      return;
    }

    // Stored until a cart exists; applied immediately when one already does.
    setPendingDiscountCode(normalized);
    applyManualDiscountCode(normalized);

    const params = new URLSearchParams(location.search);
    const target = sanitizeInternalRedirect(params.get("redirect")) ?? "/";
    navigate(mergeTrackingParams(target, location.search), { replace: true });
  }, [code, location.search, applyManualDiscountCode, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <p className="text-muted-foreground">
        {error ?? "Rabattcode wird angewendet…"}
      </p>
    </div>
  );
};

export default DiscountRedirect;
