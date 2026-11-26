// Explicit Berlin offsets keep campaign boundaries independent of visitor timezone.
export const HERO_END = Date.parse("2026-11-29T00:00:00+01:00");
export const BANNER_END = Date.parse("2026-11-28T12:00:00+01:00");
export const isCampaignActive = (end: number, now = Date.now()) => now < end;
export const heroImages = (now = Date.now()) => isCampaignActive(HERO_END, now)
  ? { desktop: "/images/hero/black-week-desktop.png", mobile: "/images/hero/black-week-mobile.png" }
  : { desktop: "/images/hero/foquz-desktop.webp", mobile: "/images/hero/foquz-mobile.webp" };
