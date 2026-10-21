// Granulares Consent-Management (DSGVO / § 25 TDDDG)
// ----------------------------------------------------
// Speichert die Einwilligung pro Kategorie, versioniert und streng validiert.
// Nicht-erforderliche Skripte dürfen erst geladen werden, wenn die jeweilige
// Kategorie eingewilligt ist. Es gibt keine automatische Einwilligung.

import { useEffect, useState } from "react";

export type ConsentCategory = "necessary" | "analytics" | "marketing" | "reviews";
export type OptionalCategory = Exclude<ConsentCategory, "necessary">;

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** Freiwillige Einwilligung in externe Bewertungsinhalte (Loox). */
  reviews: boolean;
  /** true, sobald Analyse/Marketing ausdrücklich entschieden wurden (Banner/Einstellungen). */
  choiceMade: boolean;
  timestamp: string; // ISO, Zeitpunkt der letzten Auswahl
  version: number; // Version des angezeigten Hinweistextes/Dienste-Katalogs
}

export interface ConsentService {
  name: string;
  provider: string;
  category: ConsentCategory;
  purpose: string;
  duration: string;
}

// Nur tatsächlich auf dieser Website eingebundene Dienste.
export const CONSENT_SERVICES: ConsentService[] = [
  {
    name: "Shopify (Warenkorb & Checkout)",
    provider: "Shopify International Ltd., Irland",
    category: "necessary",
    purpose: "Warenkorb, Rabattcodes, Checkout, Übergabe Ihrer Cookie-Auswahl an Shopify",
    duration: "Warenkorb lokal bis Bestellabschluss oder Leeren; Shopify-Checkout-Cookies nach Vorgabe von Shopify (siehe Shopify-Datenschutzhinweise)",
  },
  {
    name: "Consent-Speicherung",
    provider: "FOQUZ GmbH (lokal im Browser)",
    category: "necessary",
    purpose: "Speicherung Ihrer Cookie-Auswahl",
    duration: "12 Monate, danach erneute Abfrage; bis dahin bis zur Änderung oder Löschung im Browser",
  },
  {
    name: "Shopify Analytics (Seitenaufrufe)",
    provider: "Shopify International Ltd., Irland",
    category: "analytics",
    purpose: "Statistik über Seitenaufrufe des Shops",
    duration: "Eigene Kennung foquz_shopify_y 12 Monate ab Erzeugung, Sitzungskennung bis Ende der Browsersitzung; jeweils Löschung bei Widerruf",
  },
  {
    name: "Meta Pixel",
    provider: "Meta Platforms Ireland Ltd., Irland",
    category: "marketing",
    purpose: "Conversion-Messung, Retargeting, Anzeigenoptimierung",
    duration: "Vom Anbieter festgelegt (siehe dessen Datenschutzhinweise); bei Widerruf löschen wir bekannte Kennungen auf dieser Website",
  },
  {
    name: "TikTok Pixel",
    provider: "TikTok Technology Ltd., Irland",
    category: "marketing",
    purpose: "Conversion-Messung, Retargeting, Anzeigenoptimierung",
    duration: "Vom Anbieter festgelegt (siehe dessen Datenschutzhinweise); bei Widerruf löschen wir bekannte Kennungen auf dieser Website",
  },
  {
    name: "Google Ads",
    provider: "Google Ireland Ltd., Irland",
    category: "marketing",
    purpose: "Conversion-Messung, Remarketing, Anzeigenoptimierung",
    duration: "Vom Anbieter festgelegt (siehe dessen Datenschutzhinweise); bei Widerruf löschen wir bekannte Kennungen auf dieser Website",
  },
  {
    name: "Klaviyo (Onsite-Tracking & Pop-up)",
    provider: "Klaviyo Inc., USA",
    category: "marketing",
    purpose: "Newsletter-Pop-up, Web-Tracking, Kampagnenanalyse, Personalisierung",
    duration: "Vom Anbieter festgelegt (siehe dessen Datenschutzhinweise); bei Widerruf löschen wir bekannte Kennungen auf dieser Website",
  },
  {
    name: "Loox (Kundenbewertungen)",
    provider: "Loox Online Ltd., Israel",
    category: "reviews",
    purpose: "Anzeige externer Kundenbewertungen und Sterne",
    duration: "Vom Anbieter festgelegt (siehe dessen Datenschutzhinweise); bei Widerruf löschen wir bekannte Kennungen auf dieser Website",
  },
];

export const CONSENT_STORAGE_KEY = "foquz-consent-v3";
const OLD_KEYS = ["foquz-consent-v2", "cookie-consent"];
export const CONSENT_VERSION = 3;
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 12 Monate
export const CONSENT_CHANGE_EVENT = "foquz-consent-change";

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  reviews: false,
  choiceMade: false,
  timestamp: "",
  version: CONSENT_VERSION,
};

// Fallback, wenn localStorage blockiert ist: Auswahl gilt nur für diesen Seitenaufruf.
let memoryConsent: ConsentState | null = null;
// Nur wenn Schreiben/Lesen tatsächlich fehlgeschlagen ist, gilt der Speicher-Fallback.
let storageFailed = false;
const fromMemory = () => (storageFailed && memoryConsent && parseConsent(memoryConsent) ? memoryConsent : null);

function safe(fn: () => void) {
  try {
    fn();
  } catch {
    /* ignorieren */
  }
}

function storage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    const s = window.localStorage;
    return s ?? null;
  } catch {
    return null;
  }
}

/** Strenge Prüfung: exakte Typen, aktuelle Version, gültiger, nicht abgelaufener Zeitstempel. */
export function parseConsent(raw: unknown, now = Date.now()): ConsentState | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const v = raw as Record<string, unknown>;
  if (v.version !== CONSENT_VERSION || v.necessary !== true) return null;
  for (const key of ["analytics", "marketing", "reviews", "choiceMade"] as const) {
    if (typeof v[key] !== "boolean") return null;
  }
  if (typeof v.timestamp !== "string") return null;
  const time = Date.parse(v.timestamp);
  if (!Number.isFinite(time) || time > now + 60_000 || now - time > CONSENT_MAX_AGE_MS) return null;
  return {
    necessary: true,
    analytics: v.analytics as boolean,
    marketing: v.marketing as boolean,
    reviews: v.reviews as boolean,
    choiceMade: v.choiceMade as boolean,
    timestamp: v.timestamp,
    version: CONSENT_VERSION,
  };
}

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  const s = storage();
  if (!s) {
    storageFailed = true;
    return fromMemory();
  }
  try {
    OLD_KEYS.forEach((k) => s.removeItem(k));
    const raw = s.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return fromMemory();
    const parsed = parseConsent(JSON.parse(raw));
    if (!parsed) s.removeItem(CONSENT_STORAGE_KEY); // ungültig oder abgelaufen → neu fragen
    return parsed;
  } catch (e) {
    // Ungültiges JSON ist ein fehlender Wert, kein Speicherfehler.
    if (e instanceof SyntaxError) {
      safe(() => s.removeItem(CONSENT_STORAGE_KEY));
      return null;
    }
    storageFailed = true;
    return fromMemory();
  }
}

/** Aktuell wirksame Einwilligung für eine Kategorie – wird bei jedem Senden frisch gelesen. */
export function hasConsent(category: OptionalCategory): boolean {
  return readConsent()?.[category] === true;
}

export function writeConsent(
  state: Partial<Pick<ConsentState, OptionalCategory | "choiceMade">>
): ConsentState {
  const previous = readConsent();
  const next: ConsentState = {
    ...DEFAULT_CONSENT,
    ...(previous ?? {}),
    ...state,
    necessary: true,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  memoryConsent = next;
  try {
    const s = storage();
    if (!s) storageFailed = true;
    else {
      s.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
      storageFailed = false;
    }
  } catch {
    storageFailed = true; // Storage blockiert: Auswahl gilt nur im Speicher.
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { previous, next } }));
  }
  return next;
}

/** Kategorien, deren Einwilligung zwischen zwei Zuständen entzogen wurde. */
export function revokedCategories(previous: ConsentState | null, next: ConsentState | null): OptionalCategory[] {
  if (!previous) return [];
  return (["analytics", "marketing", "reviews"] as const).filter((c) => previous[c] && !next?.[c]);
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent("foquz-open-cookie-settings"));
}

/** Nur für Tests. */
export function __resetConsentMemory() {
  memoryConsent = null;
  storageFailed = false;
}

export function useConsent(): ConsentState {
  const [state, setState] = useState<ConsentState>(() => readConsent() ?? DEFAULT_CONSENT);
  useEffect(() => {
    const update = () => setState(readConsent() ?? DEFAULT_CONSENT);
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === CONSENT_STORAGE_KEY) update();
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, update);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return state;
}
