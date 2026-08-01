import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  captureAttributionFromSearch,
  mergeTrackingParams,
  sanitizeInternalRedirect,
} from "@/lib/attribution";
import { resolveShopifyRedirect } from "@/lib/shopify";
import NotFound from "./NotFound";

/**
 * Catch-all route that resolves Shopify URL Redirects, so personalised
 * Collabs links like /creatorname keep working on the custom storefront.
 * Query params (dt_id, utm_*, …) are preserved on the forwarded URL.
 */
const ShopifyRedirectRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setChecking(true);

    // A creator link is itself attribution: remember the handle + dt_id.
    captureAttributionFromSearch(location.search);

    resolveShopifyRedirect(location.pathname)
      .then((target) => {
        if (cancelled) return;
        const internal = sanitizeInternalRedirect(target);
        if (internal) {
          navigate(mergeTrackingParams(internal, location.search), { replace: true });
          return;
        }
        if (target && /^https?:\/\//i.test(target)) {
          // External target configured in Shopify itself – full page load.
          window.location.replace(target);
          return;
        }
        setChecking(false);
      })
      .catch(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, navigate]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Einen Moment…</p>
      </div>
    );
  }

  return <NotFound />;
};

export default ShopifyRedirectRoute;
