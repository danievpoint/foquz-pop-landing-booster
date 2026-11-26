// Explicit Berlin offsets keep campaign boundaries independent of visitor timezone.
export const DESIGN_START = Date.parse("2026-11-26T23:59:00+01:00");
export const HERO_END = Date.parse("2026-11-29T00:00:00+01:00");
export const SALE_START = Date.parse("2026-11-27T12:00:00+01:00");
export const BANNER_END = HERO_END;
export const BLACK_FRIDAY_CODE = "BLACKFRIDAY";
export const isCampaignActive = (end: number, now = Date.now()) => now < end;
export const heroImages = (now = Date.now()) => now >= DESIGN_START && isCampaignActive(HERO_END, now)
  ? { desktop: "/images/hero/black-week-desktop.png", mobile: "/images/hero/black-week-mobile.png" }
  : { desktop: "/images/hero/foquz-desktop.webp", mobile: "/images/hero/foquz-mobile.webp" };

export function campaignCountdown(now = Date.now()) {
  const phase = now < SALE_START ? "upcoming" : now < HERO_END ? "active" : "ended";
  const seconds = Math.max(0, Math.ceil(((phase === "upcoming" ? SALE_START : HERO_END) - now) / 1000));
  return { phase, hours: Math.floor(seconds / 3600), minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60 };
}
