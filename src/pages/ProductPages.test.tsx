import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PeachParty from "./PeachParty";
import ThaiStyle from "./ThaiStyle";
import LemonBreezy from "./LemonBreezy";
import StarterBundle from "./StarterBundle";

const state = vi.hoisted(() => ({ add: vi.fn(), available: true as boolean | null }));
vi.mock("@/contexts/CartContext", () => ({ GIFTS_ENABLED: true, GIFT_ITEMS: [{name: "FOQUZ Sticker (gratis)", image: "/sticker.png"}, {name: "Nasen-Stripes (gratis)", image: "/strips.png"}], useCart: () => ({ addToCart: state.add, isOpen: false, popupOpen: false }) }));
vi.mock("@/hooks/useProductAvailability", () => ({ useProductAvailability: () => ({ isAvailable: () => state.available }) }));
vi.mock("@/lib/klaviyo", () => ({ trackViewedProduct: vi.fn() }));
vi.mock("@/lib/shopify", () => ({ SHOPIFY_PRODUCT_ID_BY_HANDLE: {}, fetchProductGalleryImages: () => Promise.resolve([]), shopifyImageUrl: (url: string) => url, shopifyImageSrcSet: () => undefined }));
vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SeoHead", () => ({ default: () => null }));
vi.mock("@/components/LooxRating", () => ({ default: () => null }));
vi.mock("@/components/LooxReviews", () => ({ default: () => null }));
vi.mock("@/components/AutoVideo", () => ({ default: () => null }));
beforeEach(() => {
  state.add.mockClear(); state.available = true;
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});
afterEach(async () => { await act(async () => {}); cleanup(); vi.unstubAllGlobals(); });

function page(handle = "peach-party") {
  return render(<MemoryRouter initialEntries={[`/produkt/${handle}`]}><Routes>
    <Route path="/produkt/peach-party" element={<PeachParty />} />
    <Route path="/produkt/thai-style" element={<ThaiStyle />} />
    <Route path="/produkt/lemon-breezy" element={<LemonBreezy />} />
    <Route path="/produkt/starter-bundle" element={<StarterBundle />} />
  </Routes></MemoryRouter>);
}

describe("Imported product pages keep Shopify identities", () => {
  it.each([['peach-party', 'PEACH PARTY'], ['thai-style', 'THAI STYLE'], ['lemon-breezy', 'LEMON BREEZY']])("buys the correct single and real bundle on %s", (handle, name) => {
    page(handle);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(name);
    expect(screen.queryByText(/Blueberry|Watermelon|BLUEBERRY|WATERMELON|SQUAD BUNDLE/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /IN DEN WARENKORB/ }));
    expect(state.add).toHaveBeenLastCalledWith(1, expect.objectContaining({ id: name, price: 7.49 }));
    fireEvent.click(screen.getByRole('button', { name: /3 DOSEN – POWER BUNDLE/ }));
    fireEvent.click(screen.getByRole('button', { name: /IN DEN WARENKORB/ }));
    expect(state.add).toHaveBeenLastCalledWith(1, expect.objectContaining({ id: 'starter-bundle', price: 19.98 }));
  });
  it('switches product content and cart identity with the flavor selector', () => {
    page();
    fireEvent.click(screen.getByRole('button', { name: /THAI STYLE Kräuter/ }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('THAI STYLE');
    fireEvent.click(screen.getByRole('button', { name: /LEMON BREEZY Zitrone/ }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('LEMON BREEZY');
    fireEvent.click(screen.getByRole('button', { name: 'KURZ RIECHEN, AB AUF WOLKE 7' }));
    expect(state.add).toHaveBeenLastCalledWith(1, expect.objectContaining({ id: 'LEMON BREEZY' }));
  });
  it('blocks sold-out purchases and does not invent availability', () => {
    state.available = false; page();
    expect(screen.getByRole('button', { name: /IN DEN WARENKORB/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'KURZ RIECHEN, AB AUF WOLKE 7' })).toBeDisabled();
    cleanup(); state.available = null; page();
    expect(screen.queryByText(/AUF LAGER/)).not.toBeInTheDocument();
  });
  it('opens FAQs and updates the comparison carousel', () => {
    page();
    const faq = screen.getByRole('button', { name: 'Wofür ist FOQUZ?' });
    fireEvent.click(faq); expect(faq).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Nächster Vergleich' }));
    expect(document.querySelector('[style*="translateX(-100%)"]')).not.toBeNull();
  });
  it('opens the starter bundle from the existing selector and buys one Shopify bundle', () => {
    page();
    fireEvent.click(screen.getByRole('button', { name: /FOQUZ Power Bundle Alle 3 Sorten/i }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('3ER STARTER BUNDLE');
    expect(screen.queryByText(/Blueberry|Watermelon|39,99|44,97|SORTEN WÄHLEN/)).not.toBeInTheDocument();
    expect(screen.getByText('FOQUZ Sticker (gratis)')).toBeInTheDocument();
    expect(screen.getByText('Nasen-Stripes (gratis)')).toBeInTheDocument();
    expect(screen.getByAltText('Google Pay')).toBeInTheDocument();
    expect(screen.queryByAltText('Klarna')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /IN DEN WARENKORB/ }));
    expect(state.add).toHaveBeenLastCalledWith(1, expect.objectContaining({ id: 'starter-bundle', price: 19.98 }));
    fireEvent.click(screen.getByRole('button', { name: 'Welche Sorten sind im Starter Bundle?' }));
    expect(screen.getByText(/Im 3er Starter Bundle findest du/)).toBeInTheDocument();
  });
  it('disables sold-out bundles', () => {
    state.available = false;
    page('starter-bundle');
    const buy = screen.getByRole('button', { name: /IN DEN WARENKORB/ });
    expect(buy).toBeDisabled();
    fireEvent.click(buy);
    expect(state.add).not.toHaveBeenCalled();
  });
});
