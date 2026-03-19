import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, PartyPopper } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { activateNewsletterDiscount } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (dbError && dbError.code !== "23505") {
        throw dbError;
      }

      const { error: fnError } = await supabase.functions.invoke("shopify-newsletter", {
        body: { email: email.trim().toLowerCase() },
      });

      if (fnError) {
        console.error("Shopify newsletter error:", fnError);
      }

      if (dbError?.code === "23505") {
        toast({ title: "Du bist bereits dabei! 💪", description: "Diese E-Mail ist schon angemeldet." });
      } else {
        // Activate discount and show popup
        activateNewsletterDiscount();
        setShowPopup(true);
      }
      setEmail("");
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
          <p className="text-xs text-primary-foreground/60 nl-fine">
            Kein Spam · Jederzeit kündbar
          </p>
        </div>
      </section>

      {/* Discount confirmation popup */}
      <AnimatePresence>
        {showPopup && (
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
            className="fixed inset-0 z-[10004] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl border-2 border-foreground/10 bg-card text-center pointer-events-auto">
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <PartyPopper className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="text-2xl font-extrabold mb-2">
                10% RABATT AKTIVIERT! 🎉
              </h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Dein Newsletter-Rabatt von <strong className="text-foreground">10%</strong> wird automatisch bei deiner Bestellung angewendet. Schau einfach in den Warenkorb!
              </p>

              <button
                onClick={() => setShowPopup(false)}
                className="comic-btn text-sm py-2.5 px-8 font-black bg-secondary text-secondary-foreground"
              >
                WEITER SHOPPEN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsletterSection;