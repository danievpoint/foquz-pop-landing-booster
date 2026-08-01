/**
 * Server-side Shopify-Collabs discount redirect.
 *
 * GET /discount-redirect/:code?redirect=/&dt_id=0
 *   -> 302 Location: https://www.foquz.de/?dt_id=0&discount=CODE
 *
 * The response is a real HTTP 302 – no HTML, no React app, no JS redirect.
 * The discount code travels as `discount` query param and is picked up by
 * `captureAttributionFromSearch()` on the storefront, which stores it and
 * applies it to the existing/next Shopify cart via `cartDiscountCodesUpdate`.
 */

const CANONICAL_ORIGIN = "https://www.foquz.de";

/** Hosts we accept as internal redirect targets. */
const INTERNAL_HOSTS = new Set([
  "foquz.de",
  "www.foquz.de",
  "fokus.de",
  "www.fokus.de",
]);

/** Query params forwarded to the redirect target. */
const TRACKED_PARAMS = ["dt_id", "ref", "creator"];

function sanitizeRedirect(raw: string | null): string {
  if (!raw) return "/";
  const value = raw.trim();
  if (!value) return "/";
  // Protocol-relative and backslash tricks are never allowed.
  if (value.startsWith("//") || value.startsWith("\\")) return "/";
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "/";
    if (!INTERNAL_HOSTS.has(url.host.toLowerCase())) return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

Deno.serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  const incoming = new URL(req.url);
  // Last non-empty path segment is the discount code.
  const segments = incoming.pathname.split("/").filter(Boolean);
  const code = decodeURIComponent(segments[segments.length - 1] ?? "")
    .trim()
    .toUpperCase();

  const target = sanitizeRedirect(incoming.searchParams.get("redirect"));
  const [pathPart, hashPart] = target.split("#");
  const [path, targetSearch = ""] = pathPart.split("?");

  const params = new URLSearchParams(targetSearch);
  incoming.searchParams.forEach((value, key) => {
    if (TRACKED_PARAMS.includes(key) || key.startsWith("utm_")) {
      if (!params.has(key)) params.set(key, value);
    }
  });
  if (code && code !== "DISCOUNT-REDIRECT") params.set("discount", code);

  const search = params.toString();
  const location = `${CANONICAL_ORIGIN}${path.startsWith("/") ? path : `/${path}`}${
    search ? `?${search}` : ""
  }${hashPart ? `#${hashPart}` : ""}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
