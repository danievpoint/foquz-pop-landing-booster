import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { klaviyoIdentify } from "@/lib/klaviyo";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import mascotWatermelon from "@/assets/mascot-watermelon.png";

export const NEWSLETTER_POPUP_ENABLED = false;

const STORAGE_KEY = "foquz_nl_popup_dismissed";
const BUNDLE_SHOWN_KEY = "foquz_bundle_popup_shown_at";

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    if (typeof Image === "undefined") {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;

    if (img.complete) resolve();
  });

const mascotReady = preloadImage(mascotWatermelon);

const NewsletterPopup = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [shake, setShake] = useState(0);
  const { activateNewsletterDiscount, items, popupOpen, setPopupOpen } = useCart();
  const isMobile = useIsMobile();
  const triggered = useRef(false);
  const loadingPopup = useRef(false);
  const mounted = useRef(false);
  const openedAt = useRef(0);
  useLockBodyScroll(visible);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const canShow = useCallback(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return false;
    if (items.length > 0) return false;
    if (popupOpen) return false;
    // Don't show right after bundle popup
    const bundleShownAt = sessionStorage.getItem(BUNDLE_SHOWN_KEY);
    if (bundleShownAt && Date.now() - Number(bundleShownAt) < 10000) return false;
    return true;
  }, [items.length, popupOpen]);

  const trigger = useCallback(async () => {
    if (triggered.current) return;
    if (loadingPopup.current) return;
    if (!canShow()) return;

    loadingPopup.current = true;
    await mascotReady;
    loadingPopup.current = false;

    if (!mounted.current) return;
    if (triggered.current) return;
    if (!canShow()) return;

    triggered.current = true;
    openedAt.current = Date.now();
    setVisible(true);
    setPopupOpen(true);
  }, [canShow, setPopupOpen]);

  // Desktop: Exit Intent (erst nach 8s scharf, damit kein Fehlauslöser beim Laden)
  useEffect(() => {
    if (isMobile) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let armed = false;
    const armTimer = setTimeout(() => {
      armed = true;
    }, 8000);

    const handler = (e: MouseEvent) => {
      if (!armed) return;
      if (e.clientY < 0) trigger();
    };
    document.documentElement.addEventListener("mouseleave", handler);
    return () => {
      clearTimeout(armTimer);
      document.documentElement.removeEventListener("mouseleave", handler);
    };
  }, [isMobile, items.length, popupOpen, trigger]);

  // Mobile: 25s timer OR 55% scroll
  useEffect(() => {
    if (!isMobile) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => trigger(), 25000);

    const scrollHandler = () => {
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrolled = window.scrollY / (docHeight - viewportHeight);
      if (scrolled >= 0.55) trigger();
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [isMobile, items.length, popupOpen, trigger]);

  const dismiss = () => {
    setVisible(false);
    setPopupOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  // Overlay-Klicks in den ersten 800ms ignorieren (verhindert sofortiges Auto-Schließen)
  const dismissFromOverlay = () => {
    if (Date.now() - openedAt.current < 800) return;
    dismiss();
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    if (!consent) {
      setConsentError(true);
      setShake((s) => s + 1);
      return;
    }
    setConsentError(false);

    setLoading(true);
    klaviyoIdentify({ $email: email.trim().toLowerCase() });
    try {
      const { data, error: fnError } = await supabase.functions.invoke("shopify-newsletter", {
        body: { email: email.trim().toLowerCase() },
      });

      if (fnError) throw fnError;

      if (data?.already_subscribed) {
        setSuccess(true);
        setAlreadySubscribed(true);
      } else {
        activateNewsletterDiscount();
        setSuccess(true);
        setAlreadySubscribed(false);
        sessionStorage.setItem(STORAGE_KEY, "1");
      }
      setEmail("");
      setConsent(false);
    } catch {
      toast({ title: "Fehler", description: "Bitte versuche es später erneut.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10005] bg-black/50 backdrop-blur-sm"
            onClick={dismissFromOverlay}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[10006] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl border-2 border-foreground/10 bg-card text-center pointer-events-auto">
              <button
                onClick={dismiss}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {!success ? (
                <>
                  <img src={mascotWatermelon} alt="FOQUZ Mascot" className="w-32 h-32 mx-auto mb-3 drop-shadow-lg" />
                  <h3 className="font-barlow text-2xl font-black uppercase tracking-tight mb-1">
                    250€ GEWINNEN + 10% RABATT
                  </h3>
                  <p className="font-barlow text-muted-foreground text-sm mb-5 leading-relaxed">
                    Melde dich für unseren Newsletter an und nimm bis Ende des Jahres am Gewinnspiel teil. Deine Chance: <strong className="text-foreground">250 €</strong> gewinnen. Zusätzlich bekommst du direkt <strong className="text-foreground">10% Rabatt</strong> auf deine erste Bestellung geschenkt.
                  </p>
                  <motion.div
                    key={shake}
                    animate={{ x: shake > 0 ? [0, -10, 10, -7, 7, -4, 4, 0] : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <Input
                        type="email"
                        placeholder="Deine E-Mail-Adresse"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-muted text-foreground border-none rounded-full px-5 text-base"
                        required
                      />
                    <label className={`flex items-start gap-2 text-[11px] text-muted-foreground text-left leading-snug cursor-pointer rounded-xl p-2 transition-colors ${consentError ? "bg-destructive/10 border border-destructive/30" : ""}`}>
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (e.target.checked) setConsentError(false);
                        }}
                        className="mt-0.5 shrink-0 w-4 h-4 accent-primary cursor-pointer"
                        required
                      />
                      <span>
                        Ich willige ein, dass meine E-Mail-Adresse zum Versand des Newsletters und zur Teilnahme am Gewinnspiel verarbeitet wird. Widerruf jederzeit möglich (Abmeldelink in jeder E-Mail). Es gelten unsere{" "}
                        <a href="/agb" className="underline" style={{ color: "#f07e26" }}>AGB</a>{" "}und die{" "}
                        <a href="/datenschutz" className="underline" style={{ color: "#f07e26" }}>Datenschutzerklärung</a>.
                      </span>
                    </label>
                    {consentError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] text-destructive font-medium text-left -mt-1"
                      >
                        Bitte setze den Haken, damit wir deine Gewinnspiel-Teilnahme bestätigen können.
                      </motion.p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="comic-btn text-sm py-3 px-8 font-black bg-primary text-primary-foreground w-full"
                    >
                      {loading ? "..." : "TEILNEHMEN & 10% SPAREN"}
                    </button>
                  </form>
                  </motion.div>
                </>
              ) : (
                <>
                  <img src={mascotWatermelon} alt="FOQUZ Mascot" className="w-32 h-32 mx-auto mb-3 drop-shadow-lg" />
                  <h3 className="font-barlow text-2xl font-black uppercase tracking-tight mb-2">
                    {alreadySubscribed ? "Du bist bereits dabei! 💪" : "DU NIMMST TEIL! 🎉"}
                  </h3>
                  <p className="font-barlow text-muted-foreground text-sm mb-6 leading-relaxed">
                    {alreadySubscribed
                      ? "Diese E-Mail ist schon für unseren Newsletter angemeldet. Dein 10% Rabattcode ist aktiv und wird im Warenkorb angewendet."
                      : "Vielen Dank! Du bist jetzt für das Gewinnspiel eingetragen und dein 10% Rabattcode ist direkt aktiv. Bitte bestätige noch kurz deine Anmeldung über den Link in unserer E-Mail, damit wir dir den Newsletter schicken dürfen."
                    }
                  </p>
                  <button
                    onClick={dismiss}
                    className="comic-btn text-sm py-2.5 px-8 font-black bg-secondary text-secondary-foreground"
                  >
                    WEITER SHOPPEN
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
