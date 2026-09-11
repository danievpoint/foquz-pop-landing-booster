/**
 * Meta (Facebook/Instagram) Pixel – DSGVO-konform hinter dem Marketing-Consent.
 *
 * Das Pixel-Skript wird ERST geladen, wenn die Kategorie "Marketing" im
 * Cookie-Banner eingewilligt wurde. Wird die Einwilligung widerrufen, werden
 * keine weiteren Events mehr gesendet.
 *
 * Alle Aufrufe sind fail-safe: Adblocker oder fehlendes window brechen nichts.
 */
import { readConsent } from "@/lib/consent";

export const META_PIXEL_ID = "835106479686262";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let scriptInjected = false;
let initialized = false;

const marketingAllowed = () => readConsent()?.marketing === true;

function injectScript() {
  if (scriptInjected || typeof window === "undefined") return;
  scriptInjected = true;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const w = window as any;
  if (!w.fbq) {
    const n: Fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args as []) : n.queue!.push(args);
    } as Fbq;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    w.fbq = n;
    w._fbq = n;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
}

/** Lädt & initialisiert das Pixel (nur mit Marketing-Consent). */
export function initMetaPixel() {
  if (typeof window === "undefined") return false;
  if (!marketingAllowed()) return false;
  injectScript();
  if (!initialized) {
    initialized = true;
    try {
      window.fbq?.("init", META_PIXEL_ID);
    } catch (e) {
      console.warn("Meta Pixel init failed:", e);
    }
  }
  return true;
}

/** Standard-Event senden (z. B. "PageView", "AddToCart"). */
export function metaTrack(event: string, params: Record<string, unknown> = {}) {
  try {
    if (!initMetaPixel()) return;
    window.fbq?.("track", event, params);
  } catch (e) {
    console.warn("Meta Pixel track failed:", e);
  }
}

export function metaTrackCustom(event: string, params: Record<string, unknown> = {}) {
  try {
    if (!initMetaPixel()) return;
    window.fbq?.("trackCustom", event, params);
  } catch (e) {
    console.warn("Meta Pixel trackCustom failed:", e);
  }
}

export const metaPageView = () => metaTrack("PageView");

export const metaViewContent = (p: {
  id: string;
  name: string;
  price: number;
}) =>
  metaTrack("ViewContent", {
    content_ids: [p.id],
    content_name: p.name,
    content_type: "product",
    value: p.price,
    currency: "EUR",
  });

export const metaAddToCart = (p: {
  id: string;
  name: string;
  price: number;
  qty: number;
}) =>
  metaTrack("AddToCart", {
    content_ids: [p.id],
    content_name: p.name,
    content_type: "product",
    contents: [{ id: p.id, quantity: p.qty, item_price: p.price }],
    value: Number((p.price * p.qty).toFixed(2)),
    currency: "EUR",
  });

export const metaInitiateCheckout = (p: {
  contents: Array<{ id: string; quantity: number; item_price: number }>;
  value: number;
  numItems: number;
}) =>
  metaTrack("InitiateCheckout", {
    content_ids: p.contents.map((c) => c.id),
    content_type: "product",
    contents: p.contents,
    num_items: p.numItems,
    value: Number(p.value.toFixed(2)),
    currency: "EUR",
  });

/** Newsletter-Anmeldung. */
export const metaLead = (source: string) =>
  metaTrack("Lead", { content_name: source, currency: "EUR", value: 0 });
