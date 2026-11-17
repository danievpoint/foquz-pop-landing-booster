import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import LooxReviews from "./LooxReviews";
import LooxRating from "./LooxRating";
import { __resetConsentMemory, readConsent, writeConsent } from "@/lib/consent";

const reload = vi.hoisted(() => vi.fn());
vi.mock("@/lib/consentRuntime", () => ({ loadLooxIfAllowed: reload }));

beforeEach(() => {
  localStorage.clear();
  __resetConsentMemory();
  reload.mockClear();
});

describe("Shop-wide Loox consent", () => {
  it("does not load ratings or reviews before reviews permission", () => {
    render(<><LooxRating productId="10276794335574" /><LooxReviews /></>);
    expect(reload).not.toHaveBeenCalled();
    expect(readConsent()).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "BEWERTUNGEN ANZEIGEN" }));
    expect(readConsent()).toMatchObject({ reviews: true, analytics: false, marketing: false });
  });

  it("requests aggregate reviews without a bundle product ID after consent", async () => {
    vi.useFakeTimers();
    writeConsent({ reviews: true, analytics: false, marketing: false });
    render(<LooxReviews embedded />);
    await act(async () => { await vi.advanceTimersByTimeAsync(100); });
    expect(reload).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});