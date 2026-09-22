/**
 * Werbe-Pixel (Meta, TikTok, Google Ads).
 *
 * Regeln:
 * - Ein Pixel wird nur geladen, wenn seine ID gesetzt ist.
 * - Ein Pixel wird nur geladen, wenn Marketing-Consent vorliegt.
 * - Jedes Script wird maximal einmal geladen.
 * - Alles fail-safe: Tracking-Fehler duerfen den Shop nie beeintraechtigen.
 *
 * InitiateCheckout und Purchase werden bewusst NICHT gesendet – das misst
 * Shopify im Checkout ueber seine eigenen Web Pixel / Conversions API.
 */

export const TRACKING_IDS = {
  metaPixelId: "835106479686262",
  tiktokPixelId: "D9FARVJC77UCUJ4UM35G",
  googleAdsId: "AW-18438820424",
  googleAdsConversionLabel: "",
};

const CONSENT_KEY = "foquz-consent-v2";
const CURRENCY = "EUR";

type Props = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; push?: unknown; loaded?: boolean; version?: string };
    _fbq?: unknown;
    ttq?: Record<string, unknown>;
    TiktokAnalyticsObject?: string;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function hasMarketingConsent(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { marketing?: boolean };
    return parsed?.marketing === true;
  } catch {
    return false;
  }
}

let metaLoaded = false;
let tiktokLoaded = false;
let googleLoaded = false;

const injectScript = (src: string, async = true) => {
  const el = document.createElement("script");
  el.async = async;
  el.src = src;
  document.head.appendChild(el);
};

function loadMeta() {
  if (metaLoaded || !TRACKING_IDS.metaPixelId) return;
  metaLoaded = true;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const w = window as any;
  if (!w.fbq) {
    const n: any = (w.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    });
    if (!w._fbq) w._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    injectScript("https://connect.facebook.net/en_US/fbevents.js");
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  window.fbq?.("init", TRACKING_IDS.metaPixelId);
}

function loadTikTok() {
  if (tiktokLoaded || !TRACKING_IDS.tiktokPixelId) return;
  tiktokLoaded = true;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const w = window as any;
  w.TiktokAnalyticsObject = "ttq";
  const ttq: any = (w.ttq = w.ttq || []);
  ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
  ttq.setAndDefer = (t: any, e: string) => {
    t[e] = (...args: unknown[]) => t.push([e, ...args]);
  };
  for (const method of ttq.methods) ttq.setAndDefer(ttq, method);
  ttq.load = (id: string) => {
    ttq._i = ttq._i || {};
    ttq._i[id] = [];
    ttq._i[id]._u = "https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._t = ttq._t || {};
    ttq._t[id] = Number(new Date());
    ttq._o = ttq._o || {};
    ttq._o[id] = {};
    injectScript(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${id}&lib=ttq`);
  };
  ttq.load(TRACKING_IDS.tiktokPixelId);
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

function loadGoogle() {
  if (googleLoaded || !TRACKING_IDS.googleAdsId) return;
  googleLoaded = true;
  window.dataLayer = window.dataLayer || [];
  // Gtag exakt nach Google-Vorgabe: das arguments-Objekt pushen – kein Array,
  // kein Spread, keine Arrow-Function. Alles andere ignoriert gtag.js.
  /* eslint-disable prefer-rest-params */
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  /* eslint-enable prefer-rest-params */
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${TRACKING_IDS.googleAdsId}`);
  window.gtag("js", new Date());
  window.gtag("config", TRACKING_IDS.googleAdsId);
}

/** Laedt alle konfigurierten Pixel, sofern Marketing-Consent vorliegt. */
export function loadTrackingPixels() {
  try {
    if (typeof window === "undefined" || !hasMarketingConsent()) return;
    loadMeta();
    loadTikTok();
    loadGoogle();
  } catch (e) {
    console.warn("Tracking load failed:", e);
  }
}

let initialized = false;

/** Einmalig aufrufen: laedt Pixel und reagiert auf nachtraegliche Einwilligung. */
export function initTracking() {
  try {
    if (typeof window === "undefined" || initialized) return;
    initialized = true;
    loadTrackingPixels();
    // Bestehende Entscheidung sofort an Shopify weitergeben.
    void syncShopifyConsentWithTimeout();
    window.addEventListener("foquz-consent-change", () => {
      loadTrackingPixels();
      void syncShopifyConsentWithTimeout();
    });
  } catch (e) {
    console.warn("Tracking init failed:", e);
  }
}

interface Item {
  contentId: string;
  name: string;
  value: number;
  quantity?: number;
}

const send = (event: "PageView" | "ViewContent" | "AddToCart", item?: Item) => {
  try {
    if (!hasMarketingConsent()) return;
    loadTrackingPixels();

    const qty = item?.quantity ?? 1;

    // --- Meta ---
    if (TRACKING_IDS.metaPixelId) {
      const props: Props = item
        ? {
            content_type: "product",
            content_ids: [item.contentId],
            content_name: item.name,
            value: item.value,
            quantity: qty,
            currency: CURRENCY,
          }
        : {};
      window.fbq?.("track", event, props);
    }

    // --- TikTok ---
    if (TRACKING_IDS.tiktokPixelId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ttq = window.ttq as any;
      if (event === "PageView") {
        ttq?.page?.();
      } else if (item) {
        ttq?.track?.(event, {
          content_id: item.contentId,
          content_type: "product",
          content_name: item.name,
          quantity: qty,
          value: item.value,
          currency: CURRENCY,
        });
      }
    }

    // --- Google Ads (gtag.js) ---
    if (TRACKING_IDS.googleAdsId) {
      if (event === "PageView") {
        window.gtag?.("event", "page_view", {
          page_location: window.location.href,
          page_path: window.location.pathname,
        });
      } else if (item) {
        window.gtag?.("event", event === "ViewContent" ? "view_item" : "add_to_cart", {
          value: item.value,
          currency: CURRENCY,
          items: [
            {
              item_id: item.contentId,
              item_name: item.name,
              price: item.value,
              quantity: qty,
            },
          ],
        });
      }
    }
  } catch (e) {
    console.warn("Tracking event failed:", e);
  }
};

export function trackPixelPageView() {
  send("PageView");
}

export function trackPixelViewContent(p: { contentId: string; name: string; value: number }) {
  send("ViewContent", p);
}

export function trackPixelAddToCart(p: { contentId: string; name: string; value: number; quantity: number }) {
  send("AddToCart", p);
}

/* ------------------------------------------------------------------ */
/* Shopify Customer Privacy API – Consent an den Checkout weitergeben   */
/* ------------------------------------------------------------------ */

const SHOPIFY_PRIVACY_API_SRC =
  "https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js";
const STOREFRONT_ACCESS_TOKEN = "8aca74773e74c1661173fb980846444a";
const CHECKOUT_ROOT_DOMAIN = "checkout.foquz.de";
const STOREFRONT_ROOT_DOMAIN = "foquz.de";

let privacyApiPromise: Promise<void> | null = null;

function loadShopifyPrivacyApi(): Promise<void> {
  if (privacyApiPromise) return privacyApiPromise;
  privacyApiPromise = new Promise<void>((resolve) => {
    try {
      if (typeof window === "undefined") return resolve();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).Shopify?.customerPrivacy) return resolve();
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${SHOPIFY_PRIVACY_API_SRC}"]`
      );
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => resolve());
        return;
      }
      const el = document.createElement("script");
      el.async = true;
      el.src = SHOPIFY_PRIVACY_API_SRC;
      el.onload = () => resolve();
      el.onerror = () => resolve();
      document.head.appendChild(el);
    } catch {
      resolve();
    }
  });
  return privacyApiPromise;
}

/**
 * Gibt die Einwilligung aus unserem Banner an Shopify weiter, damit der
 * Checkout (checkout.foquz.de) die Pixel laden darf.
 */
export function syncShopifyConsent(consent: {
  analytics: boolean;
  marketing: boolean;
}): Promise<void> {
  return new Promise<void>((resolve) => {
    try {
      if (typeof window === "undefined") return resolve();
      void loadShopifyPrivacyApi().then(() => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const api = (window as any).Shopify?.customerPrivacy;
          if (!api?.setTrackingConsent) return resolve();
          api.setTrackingConsent(
            {
              analytics: consent.analytics,
              marketing: consent.marketing,
              preferences: consent.marketing,
              sale_of_data: consent.marketing,
              headlessStorefront: true,
              checkoutRootDomain: CHECKOUT_ROOT_DOMAIN,
              storefrontRootDomain: STOREFRONT_ROOT_DOMAIN,
              storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
            },
            () => resolve()
          );
        } catch (e) {
          console.warn("Shopify consent sync failed:", e);
          resolve();
        }
      });
    } catch (e) {
      console.warn("Shopify consent sync failed:", e);
      resolve();
    }
  });
}

/** Wartet maximal `ms` auf die Shopify-Consent-Übergabe. */
export function syncShopifyConsentWithTimeout(ms = 1500): Promise<void> {
  try {
    if (typeof window === "undefined") return Promise.resolve();
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return Promise.resolve();
    const parsed = JSON.parse(raw) as { analytics?: boolean; marketing?: boolean };
    return Promise.race([
      syncShopifyConsent({
        analytics: parsed.analytics === true,
        marketing: parsed.marketing === true,
      }),
      new Promise<void>((r) => setTimeout(r, ms)),
    ]);
  } catch {
    return Promise.resolve();
  }
}
