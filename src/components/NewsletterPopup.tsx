import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import mascotWatermelon from "@/assets/mascot-watermelon.png";

const STORAGE_KEY = "foquz_nl_popup_dismissed";

const NewsletterPopup = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { activateNewsletterDiscount } = useCart();

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (dbError && dbError.code !== "23505") throw dbError;

      await supabase.functions.invoke("shopify-newsletter", {
        body: { email: email.trim().toLowerCase() },
      }).catch(() => {});

      if (dbError?.code === "23505") {
        toast({ title: "Du bist bereits dabei! 💪", description: "Diese E-Mail ist schon angemeldet." });
        dismiss();
      } else {
        activateNewsletterDiscount();
        setSuccess(true);
        sessionStorage.setItem(STORAGE_KEY, "1");
      }
      setEmail("");
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
            onClick={dismiss}
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
                  <h3 className="text-2xl font-extrabold mb-1">
                    10% RABATT SICHERN
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                    Melde dich für unseren Newsletter an und erhalte <strong className="text-foreground">10% Rabatt</strong> auf deine erste Bestellung.
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <Input
                      type="email"
                      placeholder="Deine E-Mail-Adresse"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-muted text-foreground border-none rounded-full px-5 text-base"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="comic-btn text-sm py-3 px-8 font-black bg-primary text-primary-foreground w-full"
                    >
                      {loading ? "..." : "RABATT AKTIVIEREN"}
                    </button>
                  </form>
                  <p className="text-[10px] text-muted-foreground mt-3">
                    Kein Spam · Jederzeit kündbar
                  </p>
                </>
              ) : (
                <>
                  <img src={mascotWatermelon} alt="FOQUZ Mascot" className="w-24 h-24 mx-auto mb-3 drop-shadow-lg" />
                  <h3 className="text-2xl font-extrabold mb-2">
                    10% RABATT AKTIVIERT! 🎉
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    Dein Rabatt wird automatisch im Warenkorb angewendet. Viel Spaß beim Shoppen!
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
