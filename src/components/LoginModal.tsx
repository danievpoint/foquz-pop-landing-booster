import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to backend
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-[hsl(203,92%,89%)] rounded-2xl p-8 md:p-10"
            style={{
              border: "2px solid #000",
              boxShadow: "8px 8px 0px 0px #000",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center comic-outline bg-card hover:bg-muted transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>

            {/* Headline */}
            <h2 className="text-2xl md:text-3xl text-center mb-2">
              {mode === "login" ? "WILLKOMMEN IM TUNNEL" : "WERDE EIN PERFORMER"}
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              {mode === "login"
                ? "Log dich ein für deine exklusiven Performance-Angebote."
                : "Erstelle deinen Account und starte durch."}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card text-foreground placeholder:text-muted-foreground font-semibold text-sm outline-none transition-all duration-200"
                  style={{ border: "2px solid #000" }}
                  onFocus={(e) => (e.target.style.borderColor = "#ffd618")}
                  onBlur={(e) => (e.target.style.borderColor = "#000")}
                />
              )}
              <input
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-card text-foreground placeholder:text-muted-foreground font-semibold text-sm outline-none transition-all duration-200"
                style={{ border: "2px solid #000" }}
                onFocus={(e) => (e.target.style.borderColor = "#ffd618")}
                onBlur={(e) => (e.target.style.borderColor = "#000")}
              />
              <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-card text-foreground placeholder:text-muted-foreground font-semibold text-sm outline-none transition-all duration-200"
                style={{ border: "2px solid #000" }}
                onFocus={(e) => (e.target.style.borderColor = "#ffd618")}
                onBlur={(e) => (e.target.style.borderColor = "#000")}
              />

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-full font-extrabold uppercase tracking-wide text-base text-primary-foreground transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                style={{
                  backgroundColor: "#7e4fb6",
                  border: "2px solid #000",
                  boxShadow: "4px 4px 0px 0px #000",
                }}
              >
                {mode === "login" ? "JETZT STARTEN" : "ACCOUNT ERSTELLEN"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-[2px] bg-foreground/20" />
              <span className="text-xs font-bold text-muted-foreground uppercase">oder</span>
              <div className="flex-1 h-[2px] bg-foreground/20" />
            </div>

            {/* Social Buttons */}
            <div className="space-y-3">
              <button
                className="w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-3 bg-card hover:bg-muted transition-colors comic-outline comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Login mit Google
              </button>
              <button
                className="w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-3 bg-foreground text-primary-foreground hover:opacity-90 transition-opacity comic-outline comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Login mit Apple
              </button>
            </div>

            {/* Footer link */}
            <p className="text-center text-sm mt-6 text-muted-foreground">
              {mode === "login" ? (
                <>
                  Noch kein Performer?{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="font-extrabold text-foreground underline underline-offset-2 hover:text-primary transition-colors"
                  >
                    Jetzt registrieren
                  </button>
                </>
              ) : (
                <>
                  Schon dabei?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="font-extrabold text-foreground underline underline-offset-2 hover:text-primary transition-colors"
                  >
                    Jetzt einloggen
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
