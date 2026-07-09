import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SeoHead from "@/components/SeoHead";
import MarqueeBanner from "@/components/MarqueeBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type Status = "loading" | "confirmed" | "already" | "invalid" | "expired" | "error";

const NewsletterBestaetigen = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }
      try {
        // @ts-ignore - functions.invoke supports method override in supabase-js
        const { data, error } = await supabase.functions.invoke(
          `newsletter-confirm?token=${encodeURIComponent(token)}`,
          { method: "GET" as any }
        );
        if (cancelled) return;
        if (error) {
          const ctx = (error as any)?.context;
          try {
            const bodyText = ctx?.text ? await ctx.text() : "";
            const parsed = bodyText ? JSON.parse(bodyText) : null;
            if (parsed?.error === "expired") return setStatus("expired");
            if (parsed?.error === "invalid_token") return setStatus("invalid");
          } catch {}
          setStatus("error");
          return;
        }
        if (data?.status === "confirmed") setStatus("confirmed");
        else if (data?.status === "already_confirmed") setStatus("already");
        else setStatus("error");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const content = (() => {
    switch (status) {
      case "loading":
        return {
          icon: <Loader2 className="h-12 w-12 animate-spin" />,
          title: "Einen Moment …",
          text: "Wir prüfen deinen Bestätigungslink.",
        };
      case "confirmed":
        return {
          icon: <CheckCircle2 className="h-14 w-14 text-[hsl(var(--foquz-thai))]" />,
          title: "Bestätigt! 🎉",
          text: "Deine E-Mail ist bestätigt. Willkommen im FOQUZ-Newsletter.",
        };
      case "already":
        return {
          icon: <CheckCircle2 className="h-14 w-14 text-[hsl(var(--foquz-thai))]" />,
          title: "Alles klar",
          text: "Diese E-Mail war bereits bestätigt. Du bist dabei.",
        };
      case "expired":
        return {
          icon: <XCircle className="h-14 w-14 text-[hsl(var(--foquz-watermelon))]" />,
          title: "Link abgelaufen",
          text: "Dein Bestätigungslink ist abgelaufen. Melde dich einfach erneut zum Newsletter an.",
        };
      case "invalid":
        return {
          icon: <XCircle className="h-14 w-14 text-[hsl(var(--foquz-watermelon))]" />,
          title: "Link ungültig",
          text: "Dieser Bestätigungslink ist ungültig oder wurde bereits verwendet.",
        };
      default:
        return {
          icon: <XCircle className="h-14 w-14 text-[hsl(var(--foquz-watermelon))]" />,
          title: "Da lief was schief",
          text: "Bitte versuche es später erneut.",
        };
    }
  })();

  return (
    <div className="min-h-screen">
      <SeoHead
        title="Newsletter bestätigen – FOQUZ"
        description="Bestätige deine Newsletter-Anmeldung bei FOQUZ."
        path="/newsletter/bestaetigen"
      />
      <MarqueeBanner />
      <Navbar />
      <main className="container mx-auto px-4 pt-44 md:pt-56 pb-24 max-w-xl">
        <div className="comic-border bg-card rounded-2xl p-8 md:p-10 text-center shadow-[6px_6px_0_hsl(var(--foreground))]">
          <div className="flex justify-center mb-5">{content.icon}</div>
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-3">
            {content.title}
          </h1>
          <p className="opacity-80 leading-relaxed mb-6">{content.text}</p>
          <Link
            to="/"
            className="comic-btn inline-block bg-secondary text-secondary-foreground font-black"
          >
            ZUR STARTSEITE
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsletterBestaetigen;
