// Pure Logik der elektronischen Widerrufsfunktion (§ 356a BGB).
// Ohne Deno-/npm-Importe, damit sie mit Mocks getestet werden kann.

export interface WithdrawalInput {
  name: string;
  email: string;
  orderNumber: string | null;
  contractDescription: string | null;
  address: string | null;
  orderDate: string | null; // YYYY-MM-DD
  statement: string;
}

export interface StoredWithdrawal {
  id: string;
  receivedAt: string; // ISO, serverseitig
}

export interface Deps {
  /** Speichert verlässlich; wirft bei Fehler. */
  store: (input: WithdrawalInput, meta: { ip: string | null; userAgent: string | null; receivedAt: string }) => Promise<StoredWithdrawal>;
  /** Anzahl Widerrufe dieser IP in der letzten Stunde (Missbrauchsschutz). */
  recentCount: (ip: string) => Promise<number>;
  sendMail: (to: string, subject: string, html: string) => Promise<void>;
  markSent: (id: string, field: "confirmation" | "notification", error: string | null) => Promise<void>;
  now: () => Date;
  shopAddress: string;
}

export const LIMITS = { name: 200, email: 254, orderNumber: 100, contractDescription: 2000, address: 500, statement: 4000 };
export const MAX_PER_HOUR = 5;
export const DEFAULT_STATEMENT = "Hiermit widerrufe ich den von mir abgeschlossenen Vertrag.";

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export type ValidationResult = { ok: true; value: WithdrawalInput } | { ok: false; error: string };

export function validate(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Ungültige Anfrage." };
  const r = raw as Record<string, unknown>;
  if (str(r.website)) return { ok: false, error: "Ungültige Anfrage." }; // Honeypot
  const v = {
    name: str(r.name),
    email: str(r.email).toLowerCase(),
    orderNumber: str(r.orderNumber) || null,
    contractDescription: str(r.contractDescription) || null,
    address: str(r.address) || null,
    orderDate: str(r.orderDate) || null,
    statement: str(r.statement) || DEFAULT_STATEMENT,
  };
  if (!v.name) return { ok: false, error: "Bitte geben Sie Ihren Namen an." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return { ok: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse an." };
  if (!v.orderNumber && !v.contractDescription) return { ok: false, error: "Bitte geben Sie die Bestellnummer oder eine Beschreibung des Vertrags an." };
  if (v.orderDate && !/^\d{4}-\d{2}-\d{2}$/.test(v.orderDate)) return { ok: false, error: "Ungültiges Bestelldatum." };
  for (const [k, max] of Object.entries(LIMITS)) {
    const val = (v as Record<string, string | null>)[k];
    if (val && val.length > max) return { ok: false, error: "Eine Angabe ist zu lang." };
  }
  return { ok: true, value: v };
}

export function formatReceived(iso: string): string {
  const d = new Date(iso);
  const s = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short",
  }).format(d);
  return `${s} (Europe/Berlin)`;
}

function rows(v: WithdrawalInput, receivedLabel: string, id: string) {
  const date = v.orderDate ? new Date(`${v.orderDate}T00:00:00Z`).toLocaleDateString("de-DE", { timeZone: "UTC" }) : "—";
  const row = (k: string, val: string) => `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;width:190px"><b>${esc(k)}</b></td><td style="padding:6px 0">${esc(val)}</td></tr>`;
  return `<table style="border-collapse:collapse;width:100%;font-size:14px">
${row("Eingang", receivedLabel)}
${row("Vorgangsnummer", id)}
${row("Name", v.name)}
${row("E-Mail für Bestätigung", v.email)}
${row("Bestellnummer", v.orderNumber ?? "—")}
${row("Vertragsbeschreibung", v.contractDescription ?? "—")}
${row("Anschrift (freiwillig)", v.address ?? "—")}
${row("Bestelldatum (freiwillig)", date)}
</table>
<h3 style="margin:20px 0 8px;font-size:15px">Widerrufserklärung</h3>
<p style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${esc(v.statement)}</p>`;
}

export function buildCustomerMail(v: WithdrawalInput, stored: StoredWithdrawal) {
  const received = formatReceived(stored.receivedAt);
  return {
    subject: "Eingangsbestätigung Ihres Widerrufs – FOQUZ",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
<h2 style="margin:0 0 16px">Eingangsbestätigung Ihres Widerrufs</h2>
<p>Hallo ${esc(v.name)},</p>
<p>wir bestätigen den Eingang Ihres Widerrufs am ${esc(received)}. Nachfolgend der vollständige Inhalt Ihrer Erklärung:</p>
${rows(v, received, stored.id)}
<p style="margin-top:24px">Bitte senden Sie die Ware an: FOQUZ GmbH, Gewerbering am Brand 8, 82549 Königsdorf, Deutschland. Bei Rückfragen: <a href="mailto:info@foquz.de">info@foquz.de</a>.</p>
<hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
<p style="color:#888;font-size:12px">FOQUZ GmbH · Gewerbering am Brand 8 · 82549 Königsdorf · Amtsgericht München HRB 311769</p>
</div>`,
  };
}

export function buildShopMail(v: WithdrawalInput, stored: StoredWithdrawal) {
  const received = formatReceived(stored.receivedAt);
  return {
    subject: `Neuer Widerruf – ${v.name.replace(/[\r\n]+/g, " ").slice(0, 80)}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
<h2 style="margin:0 0 16px">Neuer Widerruf eingegangen</h2>
${rows(v, received, stored.id)}
</div>`,
  };
}

export interface HandleResult {
  status: number;
  body: Record<string, unknown>;
}

export async function handleWithdrawal(raw: unknown, meta: { ip: string | null; userAgent: string | null }, deps: Deps): Promise<HandleResult> {
  const parsed = validate(raw);
  if (parsed.ok === false) return { status: 400, body: { error: parsed.error } };

  if (meta.ip && (await deps.recentCount(meta.ip)) >= MAX_PER_HOUR) {
    return { status: 429, body: { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut oder schreiben Sie an info@foquz.de." } };
  }

  const receivedAt = deps.now().toISOString();
  // Zuerst verlässlich speichern – erst danach Mails, getrennt behandelt.
  const stored = await deps.store(parsed.value, { ...meta, receivedAt });

  let confirmationSent = false;
  try {
    const m = buildCustomerMail(parsed.value, stored);
    await deps.sendMail(parsed.value.email, m.subject, m.html);
    confirmationSent = true;
    await deps.markSent(stored.id, "confirmation", null).catch(() => undefined);
  } catch (e) {
    await deps.markSent(stored.id, "confirmation", String(e).slice(0, 500)).catch(() => undefined);
  }
  try {
    const m = buildShopMail(parsed.value, stored);
    await deps.sendMail(deps.shopAddress, m.subject, m.html);
    await deps.markSent(stored.id, "notification", null).catch(() => undefined);
  } catch (e) {
    await deps.markSent(stored.id, "notification", String(e).slice(0, 500)).catch(() => undefined);
  }

  return {
    status: 200,
    body: { ok: true, id: stored.id, receivedAt: stored.receivedAt, receivedLabel: formatReceived(stored.receivedAt), confirmationSent },
  };
}
