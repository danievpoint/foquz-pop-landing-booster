import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, PartyPopper } from "lucide-react";

const StarSVG = () => (
  <svg viewBox="0 0 24 24" fill="#ffd618" stroke="#1d1d1b" strokeWidth="1.5">
    <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
  </svg>
);

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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#c9e8fb] p-0 m-0">

        {/* SVG Illustration */}
        <div className="w-full p-0 m-0">
          <img
            src="/coming_soon.svg"
            alt=""
            className="w-full h-auto block"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-20 w-full px-4 md:px-0 md:max-w-2xl lg:max-w-3xl mx-auto -mt-8 md:-mt-12 lg:-mt-16 pb-8 md:pb-12"
        >
          <div
            className="relative bg-white rounded-3xl p-6 md:p-10 lg:p-14 text-center"
            style={{ border: "3.5px solid #1d1d1b", boxShadow: "6px 6px 0 #1d1d1b" }}
          >


            {/* Coming Soon Badge */}
            <div
              className="inline-block text-xs md:text-sm lg:text-base font-black tracking-[0.2em] uppercase px-4 md:px-6 lg:px-8 py-1.5 lg:py-2 rounded-full mb-4"
              style={{
                background: "#ffd618",
                border: "2px solid #1d1d1b",
                color: "#1d1d1b",
              }}
            >
              COMING SOON
            </div>

            {/* Headline */}
            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight mb-3"
              style={{ fontFamily: "'Bangers', cursive", letterSpacing: "0.04em", color: "#1d1d1b" }}
            >
              SOMETHING{" "}
              <span style={{ color: "#f07e26" }}>BIG</span>{" "}
              IS COMING
            </h1>

            {/* Subline */}
            <p className="text-sm md:text-lg lg:text-xl leading-relaxed mb-6" style={{ color: "rgba(29,29,27,0.75)" }}>
              Wir arbeiten an etwas Neuem. Werde Teil der{" "}
              <span className="font-bold" style={{ color: "#1d1d1b" }}>FOQUZ Cloud</span> und sei
              als Erste*r dabei, wenn's losgeht —{" "}
              <span className="font-bold" style={{ color: "#1d1d1b" }}>sichere dir 10% Rabatt</span>{" "}
              auf deine erste Order.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Deine E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 md:h-14 lg:h-16 rounded-full px-5 text-base focus:shadow-[3px_3px_0_#1d1d1b]"
                style={{
                  background: "white",
                  border: "2.5px solid #1d1d1b",
                  color: "#1d1d1b",
                }}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="h-12 md:h-14 lg:h-16 font-black text-base lg:text-xl rounded-full px-6 lg:px-10 whitespace-nowrap transition-all"
                style={{
                  background: "#f07e26",
                  color: "white",
                  border: "2.5px solid #1d1d1b",
                  boxShadow: "3px 3px 0 #1d1d1b",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "#d96a1a";
                  el.style.boxShadow = "5px 5px 0 #1d1d1b";
                  el.style.transform = "translate(-1px, -1px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "#f07e26";
                  el.style.boxShadow = "3px 3px 0 #1d1d1b";
                  el.style.transform = "translate(0, 0)";
                }}
                onMouseDown={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translate(2px, 2px)";
                  el.style.boxShadow = "1px 1px 0 #1d1d1b";
                }}
                onMouseUp={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translate(-1px, -1px)";
                  el.style.boxShadow = "5px 5px 0 #1d1d1b";
                }}
              >
                {loading ? "..." : "JOIN THE CLOUD"}
              </Button>
            </form>

            <p className="text-xs mt-4" style={{ color: "rgba(29,29,27,0.4)" }}>
              Kein Spam · Jederzeit kündbar
            </p>

            {/* Deko-Sterne */}
            <div className="absolute -top-4 -right-6 w-8 h-8" style={{ animation: "spin 6s linear infinite" }}>
              <StarSVG />
            </div>
            <div className="absolute -bottom-3 -left-5 w-6 h-6" style={{ animation: "spin 8s linear infinite reverse" }}>
              <StarSVG />
            </div>
            <div className="absolute -top-5 -left-4 w-5 h-5" style={{ animation: "spin 10s linear infinite" }}>
              <StarSVG />
            </div>

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
