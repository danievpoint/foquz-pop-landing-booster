import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { SALE_START, campaignCountdown, HERO_END, BANNER_END, heroImages, isCampaignActive } from "./blackFriday";
import { useCampaignActive } from "../hooks/use-campaign-active";
describe("Black Friday Berlin schedule", () => {
  it("ends banner and artwork together at Berlin midnight", () => {
    expect(BANNER_END).toBe(HERO_END);
    expect(isCampaignActive(BANNER_END, HERO_END - 1)).toBe(true);
    expect(isCampaignActive(BANNER_END, HERO_END)).toBe(false);
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

it("counts to the real start and then the fixed deadline without resetting", () => {
  expect(campaignCountdown(SALE_START - 1000)).toEqual({phase: "upcoming", hours: 0, minutes: 0, seconds: 1});
  expect(campaignCountdown(SALE_START)).toEqual({phase: "active", hours: 36, minutes: 0, seconds: 0});
  expect(campaignCountdown(HERO_END - 1000)).toEqual({phase: "active", hours: 0, minutes: 0, seconds: 1});
  expect(campaignCountdown(HERO_END)).toEqual({phase: "ended", hours: 0, minutes: 0, seconds: 0});
});
