import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  __resetConsentMemory,
  hasConsent,
  openCookieSettings,
  parseConsent,
  readConsent,
  writeConsent,
} from "@/lib/consent";
import { __resetConsentRuntime, handleConsentTransition, initConsentRuntime, KLAVIYO_SRC, LOOX_SRC } from "@/lib/consentRuntime";
import { klaviyoTrack, klaviyoIdentify } from "@/lib/klaviyo";
import { trackPageView } from "@/lib/shopifyAnalytics";
import { captureAttributionFromSearch, getDtId, getPendingDiscountCode, mergeTrackingParams } from "@/lib/attribution";

vi.mock("@/components/HeroSection", () => ({ heroReadyPromise: new Promise(() => undefined) }));
import CookieBanner from "@/components/CookieBanner";
import LooxReviews from "@/components/LooxReviews";

const scripts = (src: string) => document.querySelectorAll(`script[src="${src}"]`).length;
const valid = (over: Record<string, unknown> = {}) => ({
  necessary: true, analytics: false, marketing: false, reviews: false, choiceMade: true,
  timestamp: new Date().toISOString(), version: CONSENT_VERSION, ...over,
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  __resetConsentMemory();
  __resetConsentRuntime();
  document.head.querySelectorAll("script").forEach((s) => s.remove());
  delete (window as unknown as { klaviyo?: unknown }).klaviyo;
  window.history.replaceState(null, "", "/");
  vi.useRealTimers();
});

describe("Consent-Speicher", () => {
  it("Erstbesuch: keine Einwilligung, keine Kategorie aktiv", () => {
    expect(readConsent()).toBeNull();
    expect(hasConsent("analytics") || hasConsent("marketing") || hasConsent("reviews")).toBe(false);
  });
  it("lehnt ungültige Typen, falsche Version und Zukunftsdaten ab", () => {
    expect(parseConsent(valid({ marketing: "true" }))).toBeNull();
    expect(parseConsent(valid({ version: 2 }))).toBeNull();
    expect(parseConsent(valid({ timestamp: new Date(Date.now() + 86400000).toISOString() }))).toBeNull();
    expect(parseConsent([])).toBeNull();
  });
  it("läuft nach 12 Monaten ab und wird entfernt", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(valid({ marketing: true, timestamp: new Date(Date.now() - CONSENT_MAX_AGE_MS - 1000).toISOString() })));
    expect(readConsent()).toBeNull();
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });
  it("alte v2-Einwilligung zählt nicht", () => {
    localStorage.setItem("foquz-consent-v2", JSON.stringify({ necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString(), version: 2 }));
    expect(readConsent()).toBeNull();
  });
  it("blockiertes localStorage: kein Absturz, Auswahl gilt nur im Speicher", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(() => writeConsent({ analytics: false, marketing: true, reviews: false, choiceMade: true })).not.toThrow();
    expect(hasConsent("marketing")).toBe(true);
    spy.mockRestore();
  });
});

describe("Tracking-Gates", () => {
  it("Ablehnen: keine Klaviyo-Queue, kein Monorail, keine Shopify-IDs, kein dt_id", () => {
    writeConsent({ analytics: false, marketing: false, reviews: false, choiceMade: true });
    const beacon = vi.fn();
    Object.defineProperty(navigator, "sendBeacon", { value: beacon, configurable: true });
    klaviyoTrack("Viewed Product", {});
    klaviyoIdentify({ $email: "a@b.de" });
    trackPageView("/x");
    captureAttributionFromSearch("?dt_id=abc&creator=kev&discount=drop20");
    expect((window as unknown as { klaviyo?: unknown }).klaviyo).toBeUndefined();
    expect(beacon).not.toHaveBeenCalled();
    expect(localStorage.getItem("foquz_shopify_y")).toBeNull();
    expect(getDtId()).toBeNull();
    expect(sessionStorage.getItem("foquz_dt_id")).toBeNull();
    expect(getPendingDiscountCode()).toBe("DROP20"); // funktional erhalten
    expect(mergeTrackingParams("/", "?dt_id=abc&discount=X")).toBe("/?discount=X");
  });
  it("selektiv: nur Analyse → Monorail ja, Klaviyo/Attribution nein", () => {
    writeConsent({ analytics: true, marketing: false, choiceMade: true });
    const beacon = vi.fn(() => true);
    Object.defineProperty(navigator, "sendBeacon", { value: beacon, configurable: true });
    trackPageView("/selektiv");
    klaviyoTrack("x");
    expect(beacon).toHaveBeenCalledTimes(1);
    expect((window as unknown as { klaviyo?: unknown }).klaviyo).toBeUndefined();
  });
  it("vor Einwilligung gesammelte Klaviyo-Events werden nicht nachgesendet", () => {
    klaviyoTrack("vorher");
    writeConsent({ marketing: true, choiceMade: true });
    klaviyoTrack("nachher");
    const q = (window as unknown as { klaviyo: unknown[] }).klaviyo;
    expect(q).toEqual([["track", "nachher", {}]]);
  });
  it("Klaviyo- und Loox-Skript nur nach Einwilligung", () => {
    vi.useFakeTimers();
    initConsentRuntime();
    vi.advanceTimersByTime(5000);
    expect(scripts(KLAVIYO_SRC)).toBe(0);
    expect(scripts(LOOX_SRC)).toBe(0);
    writeConsent({ marketing: true, reviews: true, choiceMade: true });
    vi.advanceTimersByTime(3000);
    expect(scripts(KLAVIYO_SRC)).toBe(1);
    expect(scripts(LOOX_SRC)).toBe(1);
  });
  it("Widerruf: entfernt bekannte IDs, behält Warenkorb, lädt neu", async () => {
    const prev = writeConsent({ analytics: true, marketing: true, choiceMade: true });
    document.cookie = "_fbp=fb.1; path=/";
    localStorage.setItem("foquz_cart_v1", "cart");
    localStorage.setItem("foquz_shopify_y", "id");
    sessionStorage.setItem("foquz_dt_id", "abc");
    const next = writeConsent({ analytics: false, marketing: false });
    const reload = vi.fn();
    handleConsentTransition(prev, next, reload);
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
    expect(document.cookie).not.toContain("_fbp");
    expect(localStorage.getItem("foquz_shopify_y")).toBeNull();
    expect(sessionStorage.getItem("foquz_dt_id")).toBeNull();
    expect(localStorage.getItem("foquz_cart_v1")).toBe("cart");
  });
});

describe("CookieBanner & Loox", () => {
  it("Direktaufruf Unterseite: Banner erscheint ohne Hero", async () => {
    vi.useFakeTimers();
    window.history.replaceState(null, "", "/impressum");
    render(<CookieBanner />);
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(screen.getByRole("dialog", { name: "Cookies & Privatsphäre" })).toBeInTheDocument();
  });
  it("Ablehnen speichert eine Auswahl ohne Einwilligung; Einstellungen danach wieder öffnbar", async () => {
    vi.useFakeTimers();
    window.history.replaceState(null, "", "/faq");
    render(<CookieBanner />);
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    fireEvent.click(screen.getByText("ABLEHNEN"));
    expect(readConsent()).toMatchObject({ analytics: false, marketing: false, reviews: false, choiceMade: true });
    act(() => openCookieSettings());
    expect(screen.getByRole("dialog", { name: "Cookie-Einstellungen" })).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Analyse"));
    fireEvent.click(screen.getByText("AUSWAHL SPEICHERN"));
    expect(readConsent()).toMatchObject({ analytics: true, marketing: false, reviews: false });
  });
  it("Loox zeigt Platzhalter und lädt erst nach Klick", () => {
    render(<LooxReviews productId="1" />);
    expect(screen.getByText("Kundenbewertungen von Loox")).toBeInTheDocument();
    expect(document.getElementById("looxReviews")).toBeNull();
    fireEvent.click(screen.getByText("BEWERTUNGEN LADEN"));
    expect(document.getElementById("looxReviews")).not.toBeNull();
    expect(readConsent()).toMatchObject({ reviews: true, marketing: false, choiceMade: false });
  });
});
