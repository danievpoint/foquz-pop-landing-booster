import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PeachParty from "./PeachParty";

const state = vi.hoisted(() => ({ addToCart: vi.fn(), available: true as boolean | null }));
vi.mock("@/contexts/CartContext", () => ({ useCart: () => ({ addToCart: state.addToCart, isOpen: false, popupOpen: false }) }));
vi.mock("@/hooks/useProductAvailability", () => ({ useProductAvailability: () => ({ isAvailable: () => state.available, loading: false }) }));
vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SeoHead", () => ({ default: () => null }));
vi.mock("@/components/LooxRating", () => ({ default: () => null }));
vi.mock("@/components/LooxReviews", () => ({ default: () => null }));
vi.mock("@/pages/ProductDetail", () => ({ BundleBanner: () => null }));
vi.mock("@/lib/klaviyo", () => ({ trackViewedProduct: vi.fn() }));
vi.mock("@/lib/shopify", () => ({ SHOPIFY_PRODUCT_ID_BY_HANDLE: {}, fetchProductGalleryImages: vi.fn().mockResolvedValue([]) }));

beforeEach(() => {
  state.addToCart.mockClear();
  state.available = true;
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const mount = () => render(<MemoryRouter initialEntries={["/produkt/peach-party"]}><Routes>
  <Route path="/produkt/peach-party" element={<PeachParty />} />
  <Route path="/produkt/lemon-breezy" element={<h1>Lemon product route</h1>} />
</Routes></MemoryRouter>);

describe("Peach Party shop integration", () => {
  it("adds one actual Shopify bundle, not three discounted Peach cans", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "IN DEN WARENKORB – 19,98 €" }));
    expect(state.addToCart).toHaveBeenCalledWith(1, expect.objectContaining({ id: "starter-bundle", price: 19.98 }));
  });
  it("adds a single Peach using the existing cart ID and price", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: /1 DOSE.*Zum/ }));
    fireEvent.click(screen.getByRole("button", { name: "IN DEN WARENKORB – 7,49 €" }));
    expect(state.addToCart).toHaveBeenCalledWith(1, expect.objectContaining({ id: "PEACH PARTY", price: 7.49 }));
  });
  it("blocks unavailable products and the concept-only Squad bundle", () => {
    state.available = false;
    mount();
    expect(screen.getByRole("button", { name: /5 DOSEN/ })).toBeDisabled();
    const buy = screen.getByRole("button", { name: "AUSVERKAUFT" });
    expect(buy).toBeDisabled();
    fireEvent.click(buy);
    expect(state.addToCart).not.toHaveBeenCalled();
  });
  it("navigates to the actual Lemon page when switching flavour", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: /LEMON BREEZY.*Zitrone/ }));
    expect(screen.getByRole("heading", { name: "Lemon product route" })).toBeInTheDocument();
  });
  it("keeps the FAQ, story and comparison controls interactive", () => {
    mount();
    const faq = screen.getByRole("button", { name: "Wofür ist FOQUZ?" });
    fireEvent.click(faq);
    expect(faq).toHaveAttribute("aria-expanded", "true");
    const story = screen.getByRole("button", { name: /Mehr zur Geschichte/i });
    fireEvent.click(story);
    expect(story).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "Nächster Vergleich" }));
    expect(screen.getByRole("heading", { name: "FOQUZ VS. NASENSPRAY" })).toBeInTheDocument();
  });
});
