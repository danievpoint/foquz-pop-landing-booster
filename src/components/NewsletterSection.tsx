import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { klaviyoIdentify } from "@/lib/klaviyo";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, PartyPopper } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [consent, setConsent] = useState(false);
  const { activateNewsletterDiscount } = useCart();
  useLockBodyScroll(showPopup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    if (!consent) {
      toast({ title: "Einwilligung erforderlich", description: "Bitte bestätige die Verarbeitung deiner E-Mail-Adresse.", variant: "destructive" });
      return;
    }

    setLoading(true);
    klaviyoIdentify({ $email: email.trim().toLowerCase() });
    try {
      const { data, error: fnError } = await supabase.functions.invoke("shopify-newsletter", {
        body: { email: email.trim().toLowerCase() },
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.already_subscribed) {
        setAlreadySubscribed(true);
        setShowPopup(true);
      } else {
        setAlreadySubscribed(false);
        activateNewsletterDiscount();
        setShowPopup(true);
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
    <>
      <section className="bg-primary py-10 md:py-14" style={{ containerType: 'inline-size' }}>
        <style>{`
          @container (min-width: 1024px) {
            .nl-headline { font-size: clamp(1.75rem, 2.8cqw, 2.75rem); margin-bottom: clamp(0.375rem, 0.6cqw, 0.625rem); }
            .nl-body { font-size: clamp(0.875rem, 1cqw, 1rem); margin-bottom: clamp(0.75rem, 1.2cqw, 1.25rem); }
            .nl-input { font-size: clamp(0.875rem, 1cqw, 1rem) !important; height: clamp(2.5rem, 3cqw, 3rem) !important; }
            .nl-btn { font-size: clamp(0.875rem, 1cqw, 1rem) !important; height: clamp(2.5rem, 3cqw, 3rem) !important; }
            .nl-form { gap: clamp(0.5rem, 0.8cqw, 0.75rem); margin-bottom: clamp(0.625rem, 1cqw, 1rem); }
            .nl-fine { font-size: clamp(0.625rem, 0.7cqw, 0.75rem); }
          }
        `}</style>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-black text-primary-foreground mb-3 tracking-tight nl-headline">
            ENTER THE CLOUD
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 mb-5 max-w-lg mx-auto leading-relaxed nl-body">
            Werde Teil der Community. <span className="font-black text-primary-foreground">FOQUZ Cloud Members</span> bekommen als erste Drops, exklusive Deals und Cloud-Only Content — bevor irgendjemand anderes. <span className="font-black text-primary-foreground">Sichere dir jetzt 10% Rabatt</span> auf deine erste Order.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4 nl-form">
            <Input
              type="email"
              placeholder="Deine E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-primary-foreground text-foreground border-none rounded-full px-5 text-base nl-input"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-full px-8 font-extrabold text-base bg-secondary text-secondary-foreground hover:bg-secondary/90 comic-outline whitespace-nowrap nl-btn"
            >
              {loading ? "..." : "JOIN THE CLOUD"}
            </Button>
          </form>
          <label className="flex items-start gap-2 font-barlow text-xs text-primary-foreground max-w-md mx-auto text-left leading-relaxed nl-fine cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 shrink-0 w-4 h-4 accent-secondary cursor-pointer"
              required
            />
            <span>
              Mit der Anmeldung erklärst du dich mit unseren{" "}
              <a href="/agb" className="font-bold text-secondary underline underline-offset-2">AGB</a>{" "}und unserer{" "}
              <a href="/datenschutz" className="font-bold text-secondary underline underline-offset-2">Datenschutzerklärung</a>{" "}
              einverstanden. Kein Spam · Jederzeit kündbar.
            </span>
          </label>
        </div>
      </section>

      {/* Discount confirmation popup */}
      <AnimatePresence>
        {showPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10003] bg-black/50 backdrop-blur-sm"
              onClick={() => setShowPopup(false)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed inset-0 z-[10004] flex items-center justify-center px-4 py-5 pointer-events-none"
            >
              <div className="relative w-[calc(100vw-2rem)] max-w-[22rem] max-h-[calc(100dvh-2.5rem)] overflow-y-auto rounded-2xl border-[3px] border-foreground bg-card px-5 py-6 sm:p-7 text-center pointer-events-auto comic-shadow font-barlow">
                <button
                  type="button"
                  aria-label="Popup schließen"
                  onClick={() => setShowPopup(false)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="w-8 h-8 text-accent" />
                </div>

                <h3 className="font-barlow text-2xl font-black uppercase tracking-tight mb-2">
                  {alreadySubscribed ? "Du bist bereits dabei! 💪" : "10% RABATT AKTIVIERT! 🎉"}
                </h3>
                <p className="font-barlow text-muted-foreground text-sm mb-6 leading-relaxed">
                  {alreadySubscribed
                    ? "Diese E-Mail ist schon für unseren Newsletter angemeldet."
                    : <>Dein Newsletter-Rabatt von <strong className="text-foreground">10%</strong> ist direkt aktiv und wird automatisch bei deiner Bestellung angewendet. Schau einfach in den Warenkorb!<br /><br /><span className="text-xs">Wir haben dir eine E-Mail geschickt: Bitte bestätige darin deine Anmeldung, damit wir dir den Newsletter schicken dürfen.</span></>
                  }
                </p>


                <Button
                  onClick={() => setShowPopup(false)}
                  className="comic-btn h-auto bg-secondary text-secondary-foreground py-2.5 px-8 text-sm font-black"
                >
                  WEITER SHOPPEN
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsletterSection;