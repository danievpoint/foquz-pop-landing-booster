import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { klaviyoIdentify } from "@/lib/klaviyo";
import { metaLead } from "@/lib/metaPixel";
import { toast } from "@/hooks/use-toast";

/**
 * Verbindet das Klaviyo-Newsletter-Popup mit dem Warenkorb:
 * Sobald jemand das Klaviyo-Formular erfolgreich absendet, wird der
 * 10%-Newsletter-Rabatt sofort aktiviert (wie beim eigenen Popup).
 */
type KlaviyoFormsEvent = CustomEvent<{
  type?: string;
  metaData?: Record<string, unknown>;
}>;

const findEmail = (data?: Record<string, unknown>): string | null => {
  if (!data) return null;
  for (const value of Object.values(data)) {
    if (typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return value.trim().toLowerCase();
    }
  }
  return null;
};

const KlaviyoNewsletterBridge = () => {
  const { activateNewsletterDiscount } = useCart();

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as KlaviyoFormsEvent).detail;
      const type = detail?.type;
      if (type !== "submit" && type !== "stepSubmit" && type !== "redirectedToUrl") return;

      const email = findEmail(detail?.metaData);
      if (email) klaviyoIdentify({ $email: email });
      metaLead("Klaviyo-Popup");

      activateNewsletterDiscount();

      if (type !== "stepSubmit") return;
      toast({
        title: "10% Rabatt aktiviert",
        description: "Dein Newsletter-Rabatt wird automatisch im Warenkorb angewendet.",
      });
    };

    window.addEventListener("klaviyoForms", handler);
    return () => window.removeEventListener("klaviyoForms", handler);
  }, [activateNewsletterDiscount]);

  // Klaviyo sperrt beim Öffnen des Popups das Scrollen (body position:fixed,
  // html overflow:hidden) und entfernt die Sperre nach dem Schliessen teilweise
  // nicht. Ergebnis: die Seite laesst sich gar nicht mehr scrollen.
  // Sobald kein Klaviyo-Popup mehr sichtbar ist, heben wir die Sperre auf.
  useEffect(() => {
    const popupVisible = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>('[data-testid="POPUP"], [class*="klaviyo-form"]')
      ).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
      });

    const release = () => {
      if (popupVisible()) return;
      const body = document.body;
      const html = document.documentElement;
      const locked =
        body.classList.contains("klaviyo-prevent-body-scrolling") ||
        body.style.position === "fixed" ||
        html.style.overflow === "hidden";
      if (!locked) return;

      body.classList.remove("klaviyo-prevent-body-scrolling");
      body.style.removeProperty("position");
      body.style.removeProperty("top");
      body.style.removeProperty("left");
      body.style.removeProperty("right");
      body.style.removeProperty("width");
      body.style.removeProperty("overflow");
      html.style.removeProperty("overflow");
      html.style.removeProperty("overscroll-behavior-y");
    };

    const observer = new MutationObserver(release);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    const interval = window.setInterval(release, 500);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, []);

  return null;
};

export default KlaviyoNewsletterBridge;
