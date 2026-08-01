/**
 * Attribution helpers for Shopify Collabs / Creator links.
 *
 * Persists `dt_id` (Shopify Collabs deep-tracking id), the creator handle and a
 * pending discount code so they survive client-side navigation and are still
 * available when the Shopify cart (and therefore the checkout) is created.
 */

const DT_ID_KEY = "foquz_dt_id";
const CREATOR_KEY = "foquz_creator";
const PENDING_DISCOUNT_KEY = "foquz_pending_discount";

/** Hosts we consider "internal" for the `redirect` parameter. */
const INTERNAL_HOSTS = new Set([
  "fokus.de",
  "www.fokus.de",
  "foquz.de",
  "www.foquz.de",
]);

function safeSession(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function setDtId(value: string | null) {
  const s = safeSession();
  if (!s || !value) return;
  s.setItem(DT_ID_KEY, value);
}

export function getDtId(): string | null {
  return safeSession()?.getItem(DT_ID_KEY) ?? null;
}

export function setCreator(handle: string | null) {
  const s = safeSession();
  if (!s || !handle) return;
  s.setItem(CREATOR_KEY, handle);
}

export function getCreator(): string | null {
  return safeSession()?.getItem(CREATOR_KEY) ?? null;
}

export function setPendingDiscountCode(code: string | null) {
  const s = safeSession();
  if (!s) return;
  if (!code) {
    s.removeItem(PENDING_DISCOUNT_KEY);
    return;
  }
  s.setItem(PENDING_DISCOUNT_KEY, code.trim().toUpperCase());
}

export function getPendingDiscountCode(): string | null {
  return safeSession()?.getItem(PENDING_DISCOUNT_KEY) ?? null;
}

/** Reads attribution params off any URL/search string and persists them. */
export function captureAttributionFromSearch(search: string) {
  const params = new URLSearchParams(search);
  const dtId = params.get("dt_id");
  if (dtId !== null) setDtId(dtId);
  const creator = params.get("ref") || params.get("creator");
  if (creator) setCreator(creator);
  const discount = params.get("discount");
  if (discount) setPendingDiscountCode(discount);
}

/**
 * Validates a `redirect` parameter. Only same-site internal targets are
 * allowed – everything else is rejected to avoid open redirects.
 * Returns a path (starting with "/") or null.
 */
export function sanitizeInternalRedirect(raw: string | null): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;

  // Protocol-relative ("//evil.com") and backslash tricks are never allowed.
  if (value.startsWith("//") || value.startsWith("\\")) return null;

  if (value.startsWith("/")) return value;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.host.toLowerCase();
    const currentHost =
      typeof window !== "undefined" ? window.location.host.toLowerCase() : "";
    if (host !== currentHost && !INTERNAL_HOSTS.has(host)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

/**
 * Preserves tracking query params (dt_id, ref, utm_*) when following an
 * internal redirect target.
 */
export function mergeTrackingParams(target: string, incoming: string): string {
  const incomingParams = new URLSearchParams(incoming);
  const [pathPart, hashPart] = target.split("#");
  const [path, targetSearch = ""] = pathPart.split("?");
  const merged = new URLSearchParams(targetSearch);

  incomingParams.forEach((value, key) => {
    if (key === "redirect") return;
    if (
      key === "dt_id" ||
      key === "ref" ||
      key === "creator" ||
      key === "discount" ||
      key.startsWith("utm_")
    ) {
      if (!merged.has(key)) merged.set(key, value);
    }
  });

  const search = merged.toString();
  return `${path}${search ? `?${search}` : ""}${hashPart ? `#${hashPart}` : ""}`;
}
