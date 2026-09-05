import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { klaviyoIdentify } from "@/lib/klaviyo";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import mascotWatermelon from "@/assets/mascot-watermelon.png";
import { heroReadyPromise } from "@/components/HeroSection";

export const NEWSLETTER_POPUP_ENABLED = true;

const STORAGE_KEY = "foquz_nl_popup_dismissed";
// Einheitliche Anzeigezeit (nach vollständigem Laden der Seite)
const POPUP_DELAY_MS = 10000;
const TIMER_DURATION_S = 5 * 60;
// Falls Bild/Fonts auf schwachen Verbindungen haengen: spaetestens danach starten.
const READY_FALLBACK_MS = 3000;
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
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION_S);
  const { activateNewsletterDiscount, items, popupOpen, setPopupOpen } = useCart();
  const isMobile = useIsMobile();
  const triggered = useRef(false);
  const loadingPopup = useRef(false);
  const mounted = useRef(false);
  const openedAt = useRef(0);
  useLockBodyScroll(visible);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (!visible) return;
    setTimeLeft(TIMER_DURATION_S);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

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

  // Einheitlich auf Desktop & Mobil: fester Timer, gestartet erst wenn die Seite geladen ist.
  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const ready = Promise.race([
      heroReadyPromise,
      new Promise((resolve) => setTimeout(resolve, READY_FALLBACK_MS)),
    ]);

    ready.then(() => {
      if (cancelled) return;
      timer = setTimeout(() => trigger(), POPUP_DELAY_MS);
    });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [trigger]);

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
            className="fixed inset-0 z-[10006] flex items-center justify-center px-4 py-5 pointer-events-none"
          >
            <div className="relative w-[calc(100vw-2rem)] max-w-[22rem] max-h-[calc(100dvh-2.5rem)] overflow-y-auto rounded-2xl border-[3px] border-foreground bg-card px-5 py-6 sm:p-7 text-center pointer-events-auto comic-shadow font-barlow">
              <button
                onClick={dismiss}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {!success ? (
                <>
                  <img src={mascotWatermelon} alt="FOQUZ Mascot" className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-2 drop-shadow-lg" />
                  <h3 className="text-xl sm:text-2xl font-black uppercase leading-tight mb-2">
                    250€ GEWINNEN + 10% RABATT
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
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
                    <label className={`flex items-start gap-2 text-xs text-muted-foreground text-left leading-relaxed cursor-pointer rounded-lg p-2.5 transition-colors ${consentError ? "bg-destructive/10 border border-destructive/30" : "bg-muted/50 border border-foreground/15"}`}>
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
                        Mit der Anmeldung erklärst du dich mit unseren{" "}
                        <a href="/agb" className="font-bold text-foquz-peach underline underline-offset-2">AGB</a>{" "}und unserer{" "}
                        <a href="/datenschutz" className="font-bold text-foquz-peach underline underline-offset-2">Datenschutzerklärung</a>{" "}
                        einverstanden. Kein Spam · Jederzeit kündbar.
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
                    <Button
                      type="submit"
                      disabled={loading}
                      className="comic-btn h-auto w-full bg-secondary text-secondary-foreground py-3 px-5 text-sm font-black"
                    >
                      {loading ? "..." : "TEILNEHMEN & 10% SPAREN"}
                    </Button>
                  </form>
                  </motion.div>
                </>
              ) : (
                <>
                  <img src={mascotWatermelon} alt="FOQUZ Mascot" className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-2 drop-shadow-lg" />
                  <h3 className="text-xl sm:text-2xl font-black uppercase leading-tight mb-2">
                    {alreadySubscribed ? "Du bist bereits dabei! 💪" : "DU NIMMST TEIL! 🎉"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {alreadySubscribed
                      ? "Diese E-Mail ist schon für unseren Newsletter angemeldet. Dein 10% Rabattcode ist aktiv und wird im Warenkorb angewendet."
                      : "Vielen Dank! Du bist jetzt für das Gewinnspiel eingetragen und dein 10% Rabattcode ist direkt aktiv. Bitte bestätige noch kurz deine Anmeldung über den Link in unserer E-Mail, damit wir dir den Newsletter schicken dürfen."
                    }
                  </p>
                  <Button
                    onClick={dismiss}
                    className="comic-btn h-auto bg-secondary text-secondary-foreground py-2.5 px-8 text-sm font-black"
                  >
                    WEITER SHOPPEN
                  </Button>
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
