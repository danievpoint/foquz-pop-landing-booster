import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type State = "loading" | "valid" | "done" | "invalid" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_KEY } },
        );
        setState(res.ok ? "valid" : "invalid");
      } catch {
        setState("error");
      }
    })();
  }, [token]);

  const confirm = async () => {
    setBusy(true);
    const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    setBusy(false);
    setState(error ? "error" : "done");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <div className="w-full max-w-md rounded-3xl border-2 border-foreground/10 bg-card p-8 text-center shadow-2xl">
        {state === "loading" && <p className="text-sm text-muted-foreground">Einen Moment …</p>}

        {state === "valid" && (
          <>
            <h1 className="mb-3 text-2xl font-extrabold">Wirklich abmelden?</h1>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Du erhältst dann keine E-Mails mehr von uns.
            </p>
            <button
              onClick={confirm}
              disabled={busy}
              className="comic-btn bg-primary px-8 py-3 text-sm font-black text-primary-foreground"
            >
              {busy ? "..." : "ABMELDUNG BESTÄTIGEN"}
            </button>
          </>
        )}

        {state === "done" && (
          <>
            <h1 className="mb-3 text-2xl font-extrabold">Abgemeldet</h1>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Du wurdest erfolgreich abgemeldet. Schade, dass du gehst!
            </p>
          </>
        )}

        {(state === "invalid" || state === "error") && (
          <>
            <h1 className="mb-3 text-2xl font-extrabold">Link ungültig</h1>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Dieser Abmeldelink ist abgelaufen oder wurde bereits genutzt.
            </p>
          </>
        )}

        <Link to="/" className="mt-4 inline-block text-sm underline text-muted-foreground">
          Zurück zum Shop
        </Link>
      </div>
    </main>
  );
};

export default Unsubscribe;
