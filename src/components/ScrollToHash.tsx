import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();
  const hasMounted = useRef(false);

  // On first mount: set manual scroll restoration, but do NOT force scroll to top.
  // This prevents the page from jumping back up if the user already scrolled.
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (hash) {
      window.history.replaceState(null, "", pathname || "/");
    }
  }, []);

  // On subsequent navigation changes, scroll to hash or top
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [hash, pathname]);

  return null;
};

export default ScrollToHash;
