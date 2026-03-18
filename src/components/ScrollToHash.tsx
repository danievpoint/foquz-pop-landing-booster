import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      // On initial page load, always scroll to top regardless of hash
      isInitialLoad.current = false;
      window.scrollTo({ top: 0, behavior: "instant" });
      // Clear hash from URL without triggering navigation
      if (hash) {
        window.history.replaceState(null, "", pathname || "/");
      }
      return;
    }

    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToHash;
