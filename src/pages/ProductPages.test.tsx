import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PeachParty from "./PeachParty";
import ThaiStyle from "./ThaiStyle";
import LemonBreezy from "./LemonBreezy";
import { FruitPunch } from "./FixedBundlePage";

const state = vi.hoisted(() => ({ add: vi.fn(), available: true as boolean | null }));
vi.mock("@/contexts/CartContext", () => ({ GIFTS_ENABLED: true, GIFT_ITEMS: [{name: "FOQUZ Sticker (gratis)", image: "/sticker.png"}, {name: "Nasen-Stripes (gratis)", image: "/strips.png"}], useCart: () => ({ addToCart: state.add, isOpen: false, popupOpen: false }) }));
vi.mock("@/hooks/useProductAvailability", () => ({ useProductAvailability: () => ({ isAvailable: () => state.available }) }));
vi.mock("@/lib/klaviyo", () => ({ trackViewedProduct: vi.fn(), variantIdFor: () => null }));
vi.mock("@/lib/shopify", () => ({ SHOPIFY_PRODUCT_ID_BY_HANDLE: {}, fetchProductGalleryImages: () => Promise.resolve([]), shopifyImageUrl: (url: string) => url, shopifyImageSrcSet: () => undefined, VARIANT_GID_BY_ID: {}, storefrontApiRequest: () => Promise.resolve(null) }));
vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SeoHead", () => ({ default: () => null }));
vi.mock("@/components/LooxRating", () => ({ default: () => null }));
vi.mock("@/components/LooxReviews", () => ({ default: () => null }));
vi.mock("@/components/AutoVideo", () => ({ default: () => null }));
beforeEach(() => {
  state.add.mockClear(); state.available = true;
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} unobserve() {} });
  (Element.prototype as unknown as { scrollTo: () => void }).scrollTo = () => {};
});
afterEach(async () => { await act(async () => {}); cleanup(); vi.unstubAllGlobals(); delete (Element.prototype as unknown as { scrollTo?: () => void }).scrollTo; });

function page(handle = "peach-party") {
  return render(<MemoryRouter initialEntries={[`/produkt/${handle}`]}><Routes>
    <Route path="/produkt/peach-party" element={<PeachParty />} />
    <Route path="/produkt/thai-style" element={<ThaiStyle />} />
    <Route path="/produkt/lemon-breezy" element={<LemonBreezy />} />
    <Route path="/produkt/fruit-punch" element={<FruitPunch />} />
  </Routes></MemoryRouter>);
}

describe("Imported product pages keep Shopify identities", () => {
  it.each([['peach-party', 'PEACH PARTY'], ['thai-style', 'THAI STYLE'], ['lemon-breezy', 'LEMON BREEZY']])("buys the correct single and real bundle on %s", (handle, name) => {
    page(handle);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(name);
    fireEvent.click(screen.getByRole('button', { name: /^1 DOSE/ }));
    fireEvent.click(screen.getByRole('button', { name: /IN DEN WARENKORB/ }));
    expect(state.add).toHaveBeenLastCalledWith(1, expect.objectContaining({ id: name, price: 7.49 }));
    state.add.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /3 DOSEN – FRUIT PUNCH/ }));
    expect(screen.getByRole('button', { name: /BALD BESTELLBAR/ })).toBeDisabled();
    expect(state.add).not.toHaveBeenCalled();
  });
  it('switches product content and cart identity with the flavor selector', () => {
    page();
    fireEvent.click(screen.getByRole('button', { name: /^1 DOSE/ }));
    fireEvent.click(screen.getByRole('button', { name: /THAI STYLE Kräuter/ }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('THAI STYLE');
    fireEvent.click(screen.getByRole('button', { name: /LEMON BREEZY Zitrone/ }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('LEMON BREEZY');
    fireEvent.click(screen.getByRole('button', { name: 'KURZ RIECHEN, AB AUF WOLKE 7' }));
    expect(state.add).toHaveBeenLastCalledWith(1, expect.objectContaining({ id: 'LEMON BREEZY' }));
  });
  it('blocks sold-out purchases and does not invent availability', () => {
    state.available = false; page();
    fireEvent.click(screen.getByRole('button', { name: /^1 DOSE/ }));
    expect(screen.getByRole('button', { name: /IN DEN WARENKORB/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'KURZ RIECHEN, AB AUF WOLKE 7' })).toBeDisabled();
    cleanup(); state.available = null; page(); fireEvent.click(screen.getByRole('button', { name: /^1 DOSE/ }));
    expect(screen.queryByText(/AUF LAGER/)).not.toBeInTheDocument();
  });
  it('opens FAQs and updates the comparison carousel', () => {
    page();
    const faq = screen.getByRole('button', { name: 'Wofür ist FOQUZ?' });
    fireEvent.click(faq); expect(faq).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Nächster Vergleich' }));
    expect(document.querySelector('[style*="translateX(-100%)"]')).not.toBeNull();
  });
  it('shows fixed 3/4/8 bundles with exact contents, final prices and no purchase', () => {
    page();
    expect(screen.getByRole('button', { name: /3 DOSEN – FRUIT PUNCH/ })).toHaveTextContent('je 1× Watermelon Flex, Peach Party, Lemon Breezy');
    expect(screen.getByRole('button', { name: /4 DOSEN – FRESH FLASH/ })).toHaveTextContent('je 1× Peach Party, Lemon Breezy, Watermelon Flex, Blueberry Flow');
    expect(screen.getByRole('button', { name: /8 DOSEN – FAMILY FIRST/ })).toHaveTextContent('je 2× Peach Party, Lemon Breezy, Watermelon Flex, Blueberry Flow');
    expect(screen.queryByRole('button', { name: /5 DOSEN|10 DOSEN/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /8 DOSEN – FAMILY FIRST/ }));
    // Finale Preise und Ersparnis gegenüber Einzeldosen à 7,49 €
    expect(screen.getByRole('button', { name: /3 DOSEN – FRUIT PUNCH/ })).toHaveTextContent('21,90 €');
    expect(screen.getByRole('button', { name: /4 DOSEN – FRESH FLASH/ })).toHaveTextContent('27,90 €');
    expect(screen.getByRole('button', { name: /8 DOSEN – FAMILY FIRST/ })).toHaveTextContent('49,90 €');
    expect(screen.getByRole('button', { name: /8 DOSEN – FAMILY FIRST/ })).toHaveTextContent('Du sparst 10,02 €');
    expect(screen.queryByText(/27,92|47,92|59,90|34,90/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /mehr$/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /BALD BESTELLBAR/ }));
    expect(state.add).not.toHaveBeenCalled();
  });
  it('bundle page lists exactly the Fruit Punch contents and cannot be bought yet', () => {
    page('fruit-punch');
    expect(screen.getByText('1× WATERMELON FLEX')).toBeInTheDocument();
    expect(screen.getByText('1× PEACH PARTY')).toBeInTheDocument();
    expect(screen.getByText('1× LEMON BREEZY')).toBeInTheDocument();
    expect(screen.queryByText(/BLUEBERRY FLOW|THAI STYLE/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /BALD BESTELLBAR/ })).toBeDisabled();
  });

});
