/**
 * Lädt einwilligungspflichtige Drittanbieter-Skripte (Klaviyo, Loox) erst nach
 * Einwilligung und räumt bei Widerruf auf: bekannte Tracking-IDs werden
 * gelöscht und die Seite neu geladen, damit bereits geladene SDKs sicher
 * gestoppt sind. Warenkorb, Rabattcodes und Consent-Speicher bleiben erhalten.
 */
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
  readConsent,
  revokedCategories,
  type ConsentState,
  type OptionalCategory,
} from "./consent";
import { syncShopifyConsentWithTimeout } from "./tracking";

export const KLAVIYO_SRC = "https://static.klaviyo.com/onsite/js/WE63iq/klaviyo.js";
export const LOOX_SRC = "https://loox.io/widget/loox.js?shop=foquz-pop-landing-booster-xb8ca.myshopify.com";

// Nur bekannte Kennungen der jeweiligen Kategorie – niemals Warenkorb-/Rabattdaten.
const COOKIES: Record<OptionalCategory, RegExp[]> = {
  analytics: [/^_shopify_y$/, /^_shopify_s$/, /^_shopify_sa_[pt]$/],
  marketing: [/^_fbp$/, /^_fbc$/, /^_ttp$/, /^ttcsid/, /^_tt_enable_cookie$/, /^_gcl_/, /^__kla_id$/],
  reviews: [/^loox/i],
};
const LOCAL_KEYS: Record<OptionalCategory, RegExp[]> = {
  analytics: [/^foquz_shopify_y$/],
  marketing: [/^__kla/, /^klaviyo/i, /^_kl/, /^tt_/, /^_ttp$/, /^tiktok/i],
  reviews: [/^loox/i],
};
const SESSION_KEYS: Record<OptionalCategory, RegExp[]> = {
  analytics: [/^foquz_shopify_s$/],
  marketing: [/^foquz_dt_id$/, /^foquz_creator$/, /^__kla/, /^klaviyo/i],
  reviews: [/^loox/i],
};

function expireCookie(name: string) {
  const host = window.location.hostname;
  const parts = host.split(".");
  const domains = new Set<string>(["", host, `.${host}`]);
  for (let i = 1; i < parts.length - 1; i++) domains.add(`.${parts.slice(i).join(".")}`);
  domains.forEach((d) => {
    document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  });
}

function clearStorage(s: Storage | null, patterns: RegExp[]) {
  if (!s) return;
  const keys: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (k && k !== CONSENT_STORAGE_KEY && patterns.some((p) => p.test(k))) keys.push(k);
  }
  keys.forEach((k) => s.removeItem(k));
}

const safe = <T,>(fn: () => T): T | null => {
  try {
    return fn();
  } catch {
    return null;
  }
};

/** Entfernt bekannte Kennungen der widerrufenen Kategorien. */
export function clearCategoryData(categories: OptionalCategory[]) {
  for (const cat of categories) {
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0]?.trim();
      if (name && COOKIES[cat].some((p) => p.test(name))) expireCookie(name);
    });
    clearStorage(safe(() => window.localStorage), LOCAL_KEYS[cat]);
    clearStorage(safe(() => window.sessionStorage), SESSION_KEYS[cat]);
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const w = window as any;
  if (categories.includes("marketing")) {
    safe(() => w.fbq?.("consent", "revoke"));
    safe(() => w.gtag?.("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" }));
    safe(() => w.ttq?.holdConsent?.());
    safe(() => w.ttq?.disableCookie?.());
    delete w.klaviyo;
    delete w._learnq;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

function injectOnce(src: string, onLoad?: () => void) {
  if (document.querySelector(`script[src="${src}"]`)) return false;
  const el = document.createElement("script");
  el.async = true;
  el.src = src;
  if (onLoad) el.onload = onLoad;
  document.head.appendChild(el);
  return true;
}

let klaviyoTimer: ReturnType<typeof setTimeout> | null = null;

/** Klaviyo nur mit Marketing-Einwilligung; leicht verzögert, damit die Seite zuerst erscheint. */
export function loadKlaviyoIfAllowed(delayMs = 2500) {
  if (readConsent()?.marketing !== true || klaviyoTimer) return;
  if (document.querySelector(`script[src="${KLAVIYO_SRC}"]`)) return;
  klaviyoTimer = setTimeout(() => {
    klaviyoTimer = null;
    if (readConsent()?.marketing === true) injectOnce(KLAVIYO_SRC);
  }, delayMs);
}

/** Loox nur mit gesonderter Einwilligung in externe Bewertungsinhalte. */
export function loadLooxIfAllowed() {
  if (readConsent()?.reviews !== true) return;
  const reload = () => {
    safe(() => (window as unknown as { loox?: { intg?: { reload?: () => void } } }).loox?.intg?.reload?.());
  };
  if (!injectOnce(LOOX_SRC, reload)) reload();
}

let lastKnown: ConsentState | null = null;
let initialized = false;

export function handleConsentTransition(
  previous: ConsentState | null,
  next: ConsentState | null,
  reload: () => void = () => window.location.reload()
) {
  const revoked = revokedCategories(previous, next);
  lastKnown = next;
  if (revoked.length > 0) {
    if (klaviyoTimer && revoked.includes("marketing")) {
      clearTimeout(klaviyoTimer);
      klaviyoTimer = null;
    }
    clearCategoryData(revoked);
    // Widerruf zuerst an Shopify geben, dann neu laden: geladene SDKs lassen sich
    // nicht zuverlässig entladen.
    void syncShopifyConsentWithTimeout(1500).then(reload, reload);
    return;
  }
  loadKlaviyoIfAllowed();
  loadLooxIfAllowed();
}

export function initConsentRuntime() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;
  lastKnown = readConsent();
  // Ohne Marketing-Einwilligung dürfen keine vorab gesammelten Klaviyo-Events existieren.
  if (lastKnown?.marketing !== true) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    delete (window as any).klaviyo;
    delete (window as any)._learnq;
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
  loadKlaviyoIfAllowed();
  loadLooxIfAllowed();
  window.addEventListener(CONSENT_CHANGE_EVENT, (e) => {
    const detail = (e as CustomEvent<{ previous: ConsentState | null; next: ConsentState }>).detail;
    handleConsentTransition(detail?.previous ?? lastKnown, detail?.next ?? readConsent());
  });
  // Änderungen in anderen Tabs sofort übernehmen.
  window.addEventListener("storage", (e) => {
    if (e.key !== null && e.key !== CONSENT_STORAGE_KEY) return;
    handleConsentTransition(lastKnown, readConsent());
  });
}

/** Nur für Tests. */
export function __resetConsentRuntime() {
  initialized = false;
  lastKnown = null;
  if (klaviyoTimer) clearTimeout(klaviyoTimer);
  klaviyoTimer = null;
}
