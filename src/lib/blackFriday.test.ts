import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { HERO_END, BANNER_END, heroImages, isCampaignActive } from "./blackFriday";
import { useCampaignActive } from "../hooks/use-campaign-active";
describe("Black Friday Berlin schedule", () => {
  it("ends the banner at noon but retains artwork until midnight", () => {
    const noon = Date.parse("2026-11-28T11:00:00Z");
    expect(BANNER_END).toBe(noon);
    expect(isCampaignActive(BANNER_END, noon - 1)).toBe(true);
    expect(isCampaignActive(BANNER_END, noon)).toBe(false);
    expect(heroImages(noon).mobile).toContain("black-week");
    expect(HERO_END).toBe(Date.parse("2026-11-28T23:00:00Z"));
    expect(heroImages(HERO_END - 1).desktop).toContain("black-week");
    expect(heroImages(HERO_END).desktop).toBe("/images/hero/foquz-desktop.webp");
    expect(heroImages(HERO_END).mobile).toBe("/images/hero/foquz-mobile.webp");
  });
  it("switches an already open page back without reload", () => {
    vi.useFakeTimers();
    vi.setSystemTime(HERO_END - 1000);
    const { result, unmount } = renderHook(() => useCampaignActive(HERO_END));
    expect(result.current).toBe(true);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(false);
    unmount();
    vi.useRealTimers();
  });
});
