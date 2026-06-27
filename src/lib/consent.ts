// Granulares Consent-Management (DSGVO / § 25 TDDDG)
// ----------------------------------------------------
// Speichert die Einwilligung pro Kategorie. Nicht-erforderliche Skripte
// dürfen erst geladen werden, wenn die jeweilige Kategorie eingewilligt ist.

import { useEffect, useState } from "react";

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export interface ConsentState {
  necessary: true; // immer true
  analytics: boolean;
  marketing: boolean;
  timestamp: string; // ISO
  version: number;
}

export interface ConsentService {
  name: string;
  provider: string;
  category: ConsentCategory;
  purpose: string;
  duration: string;
}

// Anbieter-/Dienste-Übersicht (im Banner sichtbar)
export const CONSENT_SERVICES: ConsentService[] = [
  // Erforderlich
  {
    name: "Shopify (Warenkorb & Checkout)",
    provider: "Shopify International Ltd., Irland",
    category: "necessary",
    purpose: "Warenkorb, Checkout, Sicherheit, Betrugsprävention, Shop-Betrieb",
    duration: "Session bis max. 2 Jahre",
  },
  {
    name: "Consent-Cookie",
    provider: "FOQUZ GmbH (lokal)",
    category: "necessary",
    purpose: "Speicherung & Nachweis Ihrer Cookie-Auswahl",
    duration: "12 Monate",
  },
  // Analyse
  {
    name: "Hotjar",
    provider: "Hotjar Ltd., Malta",
    category: "analytics",
    purpose: "Heatmaps, Session-Aufzeichnungen, Nutzungsanalyse",
    duration: "bis zu 365 Tage",
  },
  {
    name: "Google Analytics",
    provider: "Google Ireland Ltd., Irland",
    category: "analytics",
    purpose: "Reichweitenmessung, Nutzungsanalyse",
    duration: "bis zu 14 Monate",
  },
  {
    name: "Microsoft Clarity",
    provider: "Microsoft Ireland Operations Ltd., Irland",
    category: "analytics",
    purpose: "Heatmaps, Session-Aufzeichnungen, Nutzungsanalyse",
    duration: "bis zu 12 Monate",
  },
  // Marketing
  {
    name: "Meta Pixel / Meta Conversions API",
    provider: "Meta Platforms Ireland Ltd., Irland",
    category: "marketing",
    purpose: "Conversion-Messung, Retargeting, Anzeigenoptimierung",
    duration: "bis zu 180 Tage",
  },
  {
    name: "TikTok Pixel / Events API",
    provider: "TikTok Technology Ltd., Irland",
    category: "marketing",
    purpose: "Conversion-Messung, Retargeting, Anzeigenoptimierung",
    duration: "bis zu 13 Monate",
  },
  {
    name: "Google Ads",
    provider: "Google Ireland Ltd., Irland",
    category: "marketing",
    purpose: "Conversion-Messung, Remarketing, Anzeigenoptimierung",
    duration: "bis zu 540 Tage",
  },
  {
    name: "Pinterest Tag",
    provider: "Pinterest Europe Ltd., Irland",
    category: "marketing",
    purpose: "Conversion-Messung, Retargeting, Anzeigenoptimierung",
    duration: "bis zu 365 Tage",
  },
  {
    name: "Snapchat Pixel",
    provider: "Snap Group Ltd., UK",
    category: "marketing",
    purpose: "Conversion-Messung, Retargeting, Anzeigenoptimierung",
    duration: "bis zu 12 Monate",
  },
  {
    name: "Microsoft Advertising",
    provider: "Microsoft Ireland Operations Ltd., Irland",
    category: "marketing",
    purpose: "Conversion-Messung, Anzeigenoptimierung",
    duration: "bis zu 13 Monate",
  },
  {
    name: "Klaviyo (Web-Tracking)",
    provider: "Klaviyo Inc., USA",
    category: "marketing",
    purpose: "Newsletter-Tracking, Kampagnenanalyse, Personalisierung",
    duration: "bis zu 2 Jahre",
  },
];

const STORAGE_KEY = "foquz-consent-v2";
const LEGACY_KEY = "cookie-consent";
const CONSENT_VERSION = 2;

const DEFAULT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: "",
  version: CONSENT_VERSION,
};

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Legacy: alter Banner hatte nur "accepted" / "declined" — als ungültig behandeln
      localStorage.removeItem(LEGACY_KEY);
      return null;
    }
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return { ...parsed, necessary: true };
  } catch {
    return null;
  }
}

export function writeConsent(state: Partial<ConsentState>): ConsentState {
  const next: ConsentState = {
    ...DEFAULT,
    ...state,
    necessary: true,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("foquz-consent-change", { detail: next }));
  return next;
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent("foquz-open-cookie-settings"));
}

export function useConsent(): ConsentState {
  const [state, setState] = useState<ConsentState>(() => readConsent() ?? DEFAULT);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail;
      if (detail) setState(detail);
      else setState(readConsent() ?? DEFAULT);
    };
    window.addEventListener("foquz-consent-change", handler);
    return () => window.removeEventListener("foquz-consent-change", handler);
  }, []);
  return state;
}
