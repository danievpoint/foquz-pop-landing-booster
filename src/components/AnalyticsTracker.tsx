import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureAttributionFromSearch } from "@/lib/attribution";
import { trackPageView } from "@/lib/shopifyAnalytics";

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
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
