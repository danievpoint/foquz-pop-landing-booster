/**
 * Shopify storefront analytics for our custom (headless) storefront.
 *
 * Sends page views to Shopify's Monorail endpoint using the
 * `custom_storefront_customer_tracking` schema – the same schema Hydrogen uses.
 * Events are de-duplicated so a page view is never sent twice for the same
 * navigation (React StrictMode double-effects, re-renders, back/forward).
 */

import { SHOPIFY_STORE_PERMANENT_DOMAIN } from "./shopify";

const MONORAIL_ENDPOINT = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/.well-known/shopify/monorail/unstable/produce_batch`;
const SCHEMA_ID = "custom_storefront_customer_tracking/1.2";

const UNIQUE_TOKEN_KEY = "foquz_shopify_y";
const SESSION_TOKEN_KEY = "foquz_shopify_s";

/** Guards against sending the identical event twice. */
const sentEvents = new Set<string>();

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Prefer Shopify's own cookies when present, otherwise keep our own stable ids. */
function getUniqueToken(): string {
  const shopifyCookie = readCookie("_shopify_y");
  if (shopifyCookie) return shopifyCookie;
  let token = localStorage.getItem(UNIQUE_TOKEN_KEY);
  if (!token) {
    token = uuid();
    localStorage.setItem(UNIQUE_TOKEN_KEY, token);
  }
  return token;
}

function getSessionToken(): string {
  const shopifyCookie = readCookie("_shopify_s");
  if (shopifyCookie) return shopifyCookie;
  let token = sessionStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) {
    token = uuid();
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  }
  return token;
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify({
    events: [
      {
        schema_id: SCHEMA_ID,
        payload,
        metadata: { event_created_at_ms: Date.now() },
      },
    ],
    metadata: { event_sent_at_ms: Date.now() },
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        MONORAIL_ENDPOINT,
        new Blob([body], { type: "text/plain" })
      );
      return;
    }
  } catch {
    // fall through to fetch
  }

  void fetch(MONORAIL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body,
    keepalive: true,
    mode: "no-cors",
  }).catch(() => {
    /* analytics must never break the app */
  });
}

export function trackPageView(path: string, search = "") {
  if (typeof window === "undefined") return;

  // De-duplicate: one page view per unique location per page load.
  const key = `pageview:${path}${search}`;
  if (sentEvents.has(key)) return;
  sentEvents.add(key);

  const url = `${window.location.origin}${path}${search}`;

  send({
    shop_id: null,
    hydrogenSubchannelId: "custom-storefront",
    is_persistent_cookie: true,
    unique_token: getUniqueToken(),
    event_time: Date.now(),
    event_id: uuid(),
    ccpa_enforced: false,
    gdpr_enforced: false,
    canonical_url: url,
    url,
    normalized_page_type: "index",
    referrer: document.referrer || "",
    source: "custom_storefront",
    page_id: uuid(),
    session_token: getSessionToken(),
    navigation_type: "navigate",
    navigation_api: "PerformanceNavigationTiming",
    user_agent: navigator.userAgent,
    language: navigator.language,
  });
}
