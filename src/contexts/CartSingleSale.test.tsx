import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider, useCart } from "./CartContext";
import CartDrawer from "@/components/CartDrawer";
import { isSoldOutSingleItem } from "@/lib/singleSalePolicy";
import { createShopifyCheckout, VARIANT_GID_BY_ID } from "@/lib/shopify";
import { CART_STORAGE_KEY } from "@/lib/cartRules";

const state = vi.hoisted(() => ({ legacy: [] as Array<{ id: string; name: string; price: number; image: string; qty: number }> }));
vi.mock("canvas-confetti", () => ({ default: { create: () => vi.fn() } }));
vi.mock("@/lib/tracking", () => ({ trackPixelAddToCart: vi.fn(), syncShopifyConsentWithTimeout: vi.fn() }));
vi.mock("@/lib/klaviyo", () => ({ trackAddedToCart: vi.fn(), variantIdFor: () => null }));
vi.mock("@/lib/shopify", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/shopify")>(),
  createShopifyCheckout: vi.fn(async () => ({ url: "https://example.com/checkout?channel=online_store", cartId: "test-cart", discountedSubtotal: 7.49, discountApplicable: true })),
}));

function Controls() {
  const cart = useCart();
  return <><output data-testid="items">{JSON.stringify(cart.items)}</output>
    <a data-testid="checkout" href={cart.checkoutUrl ?? undefined}>Checkout</a>
    <button onClick={cart.openCart}>Open cart</button>
    <button onClick={() => cart.addToCart(1, { id: "THAI STYLE", name: "THAI STYLE", price: 7.49, image: "" })}>Add Thai</button>
  </>;
}
const item = (id: string, price = 7.49) => ({ id, name: id, price, image: "", qty: 1 });
function mount() { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, items: state.legacy })); render(<MemoryRouter><CartProvider><Controls /><CartDrawer /></CartProvider></MemoryRouter>); }
afterEach(() => { cleanup(); state.legacy = []; vi.clearAllMocks(); localStorage.clear(); });

describe("Thai Style folgt echter Shopify-Verfügbarkeit", () => {
  it.each(["THAI STYLE", "thai-style", "free:THAI STYLE", "gid://shopify/ProductVariant/52867410788694", "52867410788694"])("keine fest codierte Sperre für %s", (id) => {
    expect(isSoldOutSingleItem(id)).toBe(false);
  });
  it.each(["bundle", "starter-bundle", "squad-bundle", "vorrats-bundle", "gid://shopify/ProductVariant/55628142707030"])("preserves bundle %s", (id) => {
    expect(isSoldOutSingleItem(id)).toBe(false);
  });
  it("behält eine Thai-Einzeldose und bereitet den Checkout mit der echten Variante vor", async () => {
    state.legacy = [item("THAI STYLE")]; mount();
    await waitFor(() => expect(createShopifyCheckout).toHaveBeenCalledWith([{ variantId: VARIANT_GID_BY_ID["THAI STYLE"], quantity: 1 }], undefined));
    expect(screen.getByTestId("items").textContent).toContain("THAI STYLE");
    fireEvent.click(screen.getByText("Add Thai"));
    expect(JSON.parse(screen.getByTestId("items").textContent ?? "[]")[0].qty).toBe(2);
  });
});
