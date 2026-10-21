import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { supabase } from "@/integrations/supabase/client";

type Result =
  | { kind: "stored"; id: string; receivedLabel: string; confirmationSent: boolean; content: Array<[string, string]> }
  | { kind: "error"; message: string };

const field = "w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm";

/** Elektronische Widerrufsfunktion nach § 356a BGB – ohne Login, ohne Einwilligung. */
const VertragWiderrufen = () => {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [identError, setIdentError] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    if (!get("orderNumber") && !get("contractDescription")) {
      setIdentError(true);
      return;
    }
    setIdentError(false);
    setSubmitting(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("send-widerruf", {
        body: {
          name: get("name"),
          email: get("email"),
          orderNumber: get("orderNumber"),
          contractDescription: get("contractDescription"),
          address: get("address"),
          orderDate: get("orderDate"),
          statement: get("statement"),
          website: get("website"),
        },
      });
      const body = data as { ok?: boolean; id?: string; receivedLabel?: string; confirmationSent?: boolean; error?: string } | null;
      if (body?.ok && body.id) {
        const content: Array<[string, string]> = ([
          ["Name", get("name")], ["E-Mail", get("email")], ["Bestellnummer", get("orderNumber")],
          ["Vertragsbeschreibung", get("contractDescription")], ["Anschrift", get("address")],
          ["Bestelldatum", get("orderDate")], ["Erklärung", get("statement")],
        ] as Array<[string, string]>).filter(([, v]) => v);
        setResult({ kind: "stored", id: body.id, receivedLabel: body.receivedLabel ?? "", confirmationSent: body.confirmationSent === true, content });
        return;
      }
      let message = body?.error;
      if (!message && error && "context" in error) {
        try { message = (await (error as { context: Response }).context.json())?.error; } catch { /* ignore */ }
      }
      setResult({ kind: "error", message: message ?? "Ihr Widerruf konnte nicht übermittelt werden." });
    } catch {
      setResult({ kind: "error", message: "Ihr Widerruf konnte nicht übermittelt werden." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SeoHead title={"Vertrag widerrufen – FOQUZ"} description={"Elektronische Widerrufsfunktion für Bestellungen bei FOQUZ."} path={"/vertrag-widerrufen"} />
      <Navbar />
      <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Vertrag widerrufen</h1>
        <p className="opacity-80 mb-2 leading-relaxed">
          Hier können Sie Ihren Vertrag mit der FOQUZ GmbH widerrufen. Ein Kundenkonto ist nicht nötig. Nach dem Klick auf „Widerruf bestätigen“ ist Ihr Widerruf erklärt; Sie erhalten eine Eingangsbestätigung mit Datum und Uhrzeit per E-Mail.
        </p>
        <p className="opacity-80 mb-6 text-sm">
          Details: <Link to="/widerrufsbelehrung" className="underline">Widerrufsbelehrung</Link>. Ihre Angaben verarbeiten wir zur Bearbeitung des Widerrufs und zur gesetzlich vorgeschriebenen Bestätigung (<Link to="/datenschutz" className="underline">Datenschutz</Link>).
        </p>

        {result?.kind === "stored" ? (
          <div role="status" className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6 text-sm space-y-2">
            <p className="font-semibold">Ihr Widerruf ist bei uns eingegangen.</p>
            <p>Eingang: {result.receivedLabel}<br />Vorgangsnummer: {result.id}</p>
            <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 pt-2">
              {result.content.map(([k, v]) => (
                <div key={k} className="contents"><dt className="font-semibold">{k}:</dt><dd className="whitespace-pre-wrap break-words">{v}</dd></div>
              ))}
            </dl>
            {result.confirmationSent ? (
              <p className="opacity-80">Die Eingangsbestätigung haben wir an Ihre E-Mail-Adresse gesendet.</p>
            ) : (
              <p className="opacity-80">Ihr Widerruf ist gespeichert und damit bei uns eingegangen. Die Bestätigungs-E-Mail konnte jedoch nicht versendet werden. Bitte drucken oder speichern Sie diese Seite als Nachweis. Eine Kopie der Eingangsbestätigung erhalten Sie auf Anfrage unter <a href="mailto:info@foquz.de" className="underline">info@foquz.de</a> unter Angabe der Vorgangsnummer.</p>
            )}
            <button type="button" onClick={() => window.print()} className="underline font-semibold print:hidden">Seite drucken oder als PDF speichern</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate={false} className="space-y-4 bg-foreground/[0.03] border border-foreground/10 rounded-2xl p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="block mb-1 font-semibold">Name *</span>
                <input required maxLength={200} type="text" name="name" autoComplete="name" className={field} />
              </label>
              <label className="block text-sm">
                <span className="block mb-1 font-semibold">E-Mail für die Eingangsbestätigung *</span>
                <input required maxLength={254} type="email" name="email" autoComplete="email" className={field} />
              </label>
              <label className="block text-sm">
                <span className="block mb-1 font-semibold">Bestellnummer</span>
                <input maxLength={100} type="text" name="orderNumber" className={field} />
              </label>
              <label className="block text-sm">
                <span className="block mb-1 font-semibold">Bestelldatum (freiwillig)</span>
                <input type="date" name="orderDate" className={field} />
              </label>
              <label className="block text-sm md:col-span-2">
                <span className="block mb-1 font-semibold">Oder: Beschreibung des Vertrags (z. B. Artikel, ungefähres Datum)</span>
                <input maxLength={2000} type="text" name="contractDescription" className={field} />
              </label>
              <label className="block text-sm md:col-span-2">
                <span className="block mb-1 font-semibold">Anschrift (freiwillig)</span>
                <input maxLength={500} type="text" name="address" autoComplete="street-address" className={field} />
              </label>
            </div>
            {identError && <p role="alert" className="text-sm text-destructive">Bitte geben Sie die Bestellnummer oder eine Beschreibung des Vertrags an.</p>}
            <label className="block text-sm">
              <span className="block mb-1 font-semibold">Ihre Widerrufserklärung</span>
              <textarea name="statement" rows={3} maxLength={4000} className={field} defaultValue="Hiermit widerrufe ich den von mir abgeschlossenen Vertrag." />
            </label>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            {result?.kind === "error" && <p role="alert" className="text-sm text-destructive">{result.message} Sie können den Widerruf auch per E-Mail an info@foquz.de erklären.</p>}
            <button type="submit" disabled={submitting} className="inline-flex items-center justify-center rounded-full bg-foreground text-background font-bold px-6 py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {submitting ? "Wird übermittelt…" : "Widerruf bestätigen"}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VertragWiderrufen;
