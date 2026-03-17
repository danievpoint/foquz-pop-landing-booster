import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (hash) {
      // Always scroll to hash (even on initial load, e.g. navigating from subpage to /#sorten)
      const behavior = isInitialLoad.current ? "instant" : "smooth";
      isInitialLoad.current = false;
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior });
        }
      }, 100);
    } else if (!isInitialLoad.current) {
      // Only scroll to top on subsequent navigations, not initial page load
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      isInitialLoad.current = false;
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToHash;
