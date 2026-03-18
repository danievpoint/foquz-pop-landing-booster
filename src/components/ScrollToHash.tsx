import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (hash) {
      const behavior = isInitialLoad.current ? "instant" : "smooth";
      isInitialLoad.current = false;
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior });
        }
      }, 100);
    } else {
      // Always scroll to top when there's no hash (including initial load)
      window.scrollTo({ top: 0, behavior: isInitialLoad.current ? "instant" : "smooth" });
      isInitialLoad.current = false;
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToHash;
