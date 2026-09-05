import { useEffect } from "react";

/**
 * Das Gewinnspiel-/Newsletter-Popup wird von Klaviyo (externes Skript)
 * eingeblendet. Es überlagerte auf Produktseiten den Warenkorb-Button und war
 * fehlerhaft dargestellt – deshalb wird es hier vollständig entfernt.
 * Das Onsite-Tracking von Klaviyo bleibt unberührt.
 */
const SELECTOR = "[class*='klaviyo-form'], .kl-private-reset-css-Xuajs1, [data-testid='POPUP']";

const KlaviyoFormPolish = () => {
  useEffect(() => {
    let frame = 0;

    const removePopups = () => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        // Nur Popups/Overlays entfernen, keine In-Page-Inhalte der Seite selbst.
        const root = el.closest<HTMLElement>("[class*='klaviyo-form'], [data-testid='POPUP']") ?? el;
        root.remove();
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        observer.disconnect();
        try {
          removePopups();
        } finally {
          observer.observe(document.body, { childList: true, subtree: true });
        }
      });
    };

    const observer = new MutationObserver(schedule);

    removePopups();
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default KlaviyoFormPolish;
