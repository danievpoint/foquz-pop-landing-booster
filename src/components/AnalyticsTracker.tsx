import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureAttributionFromSearch } from "@/lib/attribution";
import { trackPageView } from "@/lib/shopifyAnalytics";
import { metaPageView } from "@/lib/metaPixel";

/**
 * Sends one Shopify page view per navigation and keeps Collabs attribution
 * (dt_id, creator, discount) alive across client-side routing.
 * Duplicate sends are prevented inside `trackPageView`.
 */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    captureAttributionFromSearch(location.search);
    trackPageView(location.pathname, location.search);
    metaPageView();
  }, [location.pathname, location.search]);

  // Nach nachträglicher Marketing-Einwilligung den ersten PageView nachholen.
  useEffect(() => {
    const onConsent = () => metaPageView();
    window.addEventListener("foquz-consent-change", onConsent);
    return () => window.removeEventListener("foquz-consent-change", onConsent);
  }, []);

  return null;
};

export default AnalyticsTracker;
