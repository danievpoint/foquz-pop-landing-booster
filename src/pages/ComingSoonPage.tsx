import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, PartyPopper } from "lucide-react";

const ComingSoonPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
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
        setAlreadySubscribed(true);
        setShowPopup(true);
      } else {
        setAlreadySubscribed(false);
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
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center" style={{ background: "#f07e26" }}>

        {/* Background radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(255,214,24,0.35) 0%, transparent 70%)" }} />

        {/* SVG Illustration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src="/coming_soon.svg" alt="" className="w-full h-full object-cover" />
        </div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-[92vw] max-w-md mx-auto"
        >
          <div className="relative bg-[#ffd618] border-[3px] border-foreground rounded-3xl shadow-[6px_6px_0_#1d1d1b] px-6 py-10 md:px-10 md:py-12 text-center">

            {/* Halftone dots decoration */}
            <div className="absolute -top-4 -right-4 w-20 h-20 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #1d1d1b 1.5px, transparent 1.5px)", backgroundSize: "8px 8px" }} />

            {/* Coming Soon Badge */}
            <div className="inline-block bg-foreground text-[#ffd618] text-xs font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4 shadow-[2px_2px_0_#f07e26]">
              COMING SOON
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-3" style={{ fontFamily: "'Bangers', cursive", letterSpacing: "0.04em" }}>
              SOMETHING BIG IS COMING
            </h1>

            {/* Subline */}
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-6">
              Wir arbeiten an etwas Neuem. Werde Teil der{" "}
              <span className="font-bold text-foreground">FOQUZ Cloud</span> und sei
              als Erste*r dabei, wenn's losgeht —{" "}
              <span className="font-bold text-foreground">sichere dir 10% Rabatt</span>{" "}
              auf deine erste Order.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Deine E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white text-foreground border-[2.5px] border-foreground rounded-full px-5 text-base focus:shadow-[3px_3px_0_#1d1d1b]"
                required
              />
              <Button type="submit" disabled={loading} className="h-12 bg-foreground text-[#ffd618] font-black text-base rounded-full px-6 border-[2.5px] border-foreground shadow-[3px_3px_0_#f07e26] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#f07e26] transition-all whitespace-nowrap">
                {loading ? "..." : "JOIN THE CLOUD"}
              </Button>
            </form>

            <p className="text-xs text-foreground/50 mt-4">
              Kein Spam · Jederzeit kündbar
            </p>

          </div>
        </motion.div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setShowPopup(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
              <div className="bg-background border-[3px] border-foreground rounded-3xl shadow-[6px_6px_0_#1d1d1b] p-8 max-w-sm w-full text-center relative">
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="text-5xl mb-4">
                  <PartyPopper className="w-12 h-12 mx-auto text-[#ffd618]" />
                </div>

                <h3 className="text-xl font-black text-foreground mb-2">
                  {alreadySubscribed ? "Du bist bereits dabei! 💪" : "10% RABATT AKTIVIERT! 🎉"}
                </h3>

                <p className="text-sm text-muted-foreground mb-6">
                  {alreadySubscribed
                    ? "Diese E-Mail ist schon für unseren Newsletter angemeldet."
                    : <>Dein Newsletter-Rabatt von <span className="font-bold">10%</span> wird automatisch angewendet, sobald wir live gehen. Wir melden uns bei dir!</>
                  }
                </p>

                <button
                  onClick={() => setShowPopup(false)}
                  className="comic-btn text-sm py-2.5 px-8 font-black bg-secondary text-secondary-foreground"
                >
                  ALLES KLAR!
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ComingSoonPage;
