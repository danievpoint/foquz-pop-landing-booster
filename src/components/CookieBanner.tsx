import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp, Settings } from "lucide-react";
import {
  CONSENT_SERVICES,
  readConsent,
  writeConsent,
  type ConsentCategory,
} from "@/lib/consent";
import mascotLemon from "@/assets/mascot-lemon.png";

type View = "hidden" | "banner" | "settings";

const CATEGORY_LABELS: Record<ConsentCategory, { title: string; desc: string }> = {
  necessary: {
    title: "Erforderlich",
    desc: "Technisch notwendig für Warenkorb, Checkout, Sicherheit. Kann nicht deaktiviert werden (§ 25 Abs. 2 TDDDG).",
  },
  analytics: {
    title: "Analyse",
    desc: "Hilft uns zu verstehen, wie der Shop genutzt wird. Lädt erst nach Ihrer Einwilligung.",
  },
  marketing: {
    title: "Marketing",
    desc: "Conversion-Messung, Retargeting und personalisierte Werbung. Lädt erst nach Ihrer Einwilligung.",
  },
};

const CookieBanner = () => {
  const [view, setView] = useState<View>("hidden");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [expanded, setExpanded] = useState<ConsentCategory | null>(null);

  useEffect(() => {
    const current = readConsent();
    if (!current) {
      const t = setTimeout(() => setView("banner"), 800);
      return () => clearTimeout(t);
    }
    setAnalytics(current.analytics);
    setMarketing(current.marketing);
  }, []);

  useEffect(() => {
    const open = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setView("settings");
    };
    window.addEventListener("foquz-open-cookie-settings", open);
    return () => window.removeEventListener("foquz-open-cookie-settings", open);
  }, []);

  const acceptAll = () => {
    writeConsent({ analytics: true, marketing: true });
    setView("hidden");
  };
  const rejectAll = () => {
    writeConsent({ analytics: false, marketing: false });
    setView("hidden");
  };
  const saveSelection = () => {
    writeConsent({ analytics, marketing });
    setView("hidden");
  };

  if (view === "hidden") return null;

  const grouped: Record<ConsentCategory, typeof CONSENT_SERVICES> = {
    necessary: CONSENT_SERVICES.filter((s) => s.category === "necessary"),
    analytics: CONSENT_SERVICES.filter((s) => s.category === "analytics"),
    marketing: CONSENT_SERVICES.filter((s) => s.category === "marketing"),
  };

  return (
    <AnimatePresence>
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        className={
          view === "settings"
            ? "fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40"
            : "fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-lg z-[10000]"
        }
      >
        <div
          className={
            "bg-card border-4 border-foreground rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative " +
            (view === "settings"
              ? "w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
              : "p-6")
          }
        >
          <button
            onClick={() => (view === "settings" ? setView("hidden") : rejectAll())}
            className="absolute top-3 right-3 p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Schließen"
          >
            <X size={18} />
          </button>

          {view === "banner" && (
            <div className="flex items-start gap-4">
              <img src={mascotLemon} alt="" className="w-16 h-16 object-contain shrink-0" />
              <div className="flex-1">
                <h3 className="font-black text-lg mb-1">Cookies & Privatsphäre</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Wir nutzen technisch notwendige Cookies, damit Shop, Warenkorb und Checkout funktionieren. Mit Ihrer Einwilligung verwenden wir zusätzlich Analyse- und Marketing-Dienste, um unser Angebot zu verbessern. Sie können Ihre Auswahl jederzeit unter „Cookie-Einstellungen" im Footer ändern. Details in der{" "}
                  <a href="/datenschutz" className="underline font-semibold">Datenschutzerklärung</a>.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={acceptAll} className="comic-btn bg-[#ffd618] text-foreground text-sm py-2 px-4">
                    ALLE AKZEPTIEREN
                  </button>
                  <button onClick={rejectAll} className="comic-btn bg-background text-foreground text-sm py-2 px-4">
                    ABLEHNEN
                  </button>
                  <button
                    onClick={() => setView("settings")}
                    className="text-sm underline font-semibold py-2 px-2 inline-flex items-center gap-1"
                  >
                    <Settings size={14} /> Einstellungen
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === "settings" && (
            <div>
              <h3 className="font-black text-xl mb-2">Cookie-Einstellungen</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Wählen Sie, welche Kategorien Sie zulassen möchten. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen oder ändern.
              </p>

              <div className="space-y-3">
                {(["necessary", "analytics", "marketing"] as ConsentCategory[]).map((cat) => {
                  const isOn = cat === "necessary" ? true : cat === "analytics" ? analytics : marketing;
                  const toggle = () => {
                    if (cat === "analytics") setAnalytics((v) => !v);
                    if (cat === "marketing") setMarketing((v) => !v);
                  };
                  const isExpanded = expanded === cat;
                  return (
                    <div key={cat} className="border-2 border-foreground/20 rounded-xl">
                      <div className="flex items-center justify-between p-3">
                        <button
                          type="button"
                          onClick={() => setExpanded(isExpanded ? null : cat)}
                          className="flex items-center gap-2 text-left flex-1"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          <span className="font-bold">{CATEGORY_LABELS[cat].title}</span>
                          <span className="text-xs opacity-60">({grouped[cat].length} Dienste)</span>
                        </button>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isOn}
                            disabled={cat === "necessary"}
                            onChange={toggle}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-muted border-2 border-foreground rounded-full peer-checked:bg-[#ffd618] peer-disabled:opacity-60 transition-colors">
                            <span
                              className={
                                "absolute top-0.5 left-0.5 w-4 h-4 bg-foreground rounded-full transition-transform " +
                                (isOn ? "translate-x-5" : "")
                              }
                            />
                          </div>
                        </label>
                      </div>
                      {isExpanded && (
                        <div className="px-3 pb-3 text-xs">
                          <p className="text-muted-foreground mb-3">{CATEGORY_LABELS[cat].desc}</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead className="text-[10px] uppercase opacity-60">
                                <tr>
                                  <th className="py-1 pr-2">Dienst</th>
                                  <th className="py-1 pr-2">Anbieter</th>
                                  <th className="py-1 pr-2">Zweck</th>
                                  <th className="py-1">Speicherdauer</th>
                                </tr>
                              </thead>
                              <tbody>
                                {grouped[cat].map((s) => (
                                  <tr key={s.name} className="border-t border-foreground/10 align-top">
                                    <td className="py-1.5 pr-2 font-semibold">{s.name}</td>
                                    <td className="py-1.5 pr-2">{s.provider}</td>
                                    <td className="py-1.5 pr-2">{s.purpose}</td>
                                    <td className="py-1.5">{s.duration}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <button onClick={acceptAll} className="comic-btn bg-[#ffd618] text-foreground text-sm py-2 px-4">
                  ALLE AKZEPTIEREN
                </button>
                <button onClick={saveSelection} className="comic-btn bg-background text-foreground text-sm py-2 px-4">
                  AUSWAHL SPEICHERN
                </button>
                <button onClick={rejectAll} className="comic-btn bg-background text-foreground text-sm py-2 px-4">
                  ALLE ABLEHNEN
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">
                Mehr Informationen in der <a href="/datenschutz" className="underline">Datenschutzerklärung</a> und im <a href="/impressum" className="underline">Impressum</a>.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieBanner;
