import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { klaviyoIdentify } from "@/lib/klaviyo";
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

  return null;
};

export default KlaviyoNewsletterBridge;
