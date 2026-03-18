import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import mascotLemon from "@/assets/mascot-lemon.png";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[10000] bg-card border-4 border-foreground rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <button
            onClick={decline}
            className="absolute top-3 right-3 p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <img src={mascotLemon} alt="Maskottchen" className="w-16 h-16 object-contain" />
            </div>
            <div>
              <h3 className="font-black text-lg mb-1">Cookies & so</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Wir nutzen Cookies, damit alles smooth läuft. Kein Spam, versprochen!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={accept}
                  className="comic-btn bg-[#ffd618] text-foreground text-sm py-2 px-5"
                >
                  ALLES KLAR!
                </button>
                <button
                  onClick={decline}
                  className="comic-btn bg-muted text-foreground text-sm py-2 px-5"
                >
                  NEIN DANKE
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
