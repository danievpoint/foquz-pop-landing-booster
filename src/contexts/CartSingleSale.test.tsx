import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider, useCart } from "./CartContext";
import CartDrawer from "@/components/CartDrawer";
import { isSoldOutSingleItem } from "@/lib/singleSalePolicy";
import { createShopifyCheckout, VARIANT_GID_BY_ID } from "@/lib/shopify";

const state = vi.hoisted(() => ({ legacy: [] as Array<{ id: string; name: string; price: number; image: string; qty: number }> }));
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useState: (initial: unknown) => actual.useState(Array.isArray(initial) && initial.length === 0 ? state.legacy : initial) };
});
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
function mount() { render(<MemoryRouter><CartProvider><Controls /><CartDrawer /></CartProvider></MemoryRouter>); }
afterEach(() => { cleanup(); state.legacy = []; vi.clearAllMocks(); localStorage.clear(); });

describe("Thai standalone sale restrictions", () => {
  it.each(["THAI STYLE", "thai-style", "free:THAI STYLE", "gid://shopify/ProductVariant/52867410788694", "52867410788694"])("recognizes old standalone ID %s", (id) => {
    expect(isSoldOutSingleItem(id)).toBe(true);
  });
  it.each(["bundle", "starter-bundle", "squad-bundle", "vorrats-bundle", "gid://shopify/ProductVariant/55628142707030"])("preserves bundle %s", (id) => {
    expect(isSoldOutSingleItem(id)).toBe(false);
  });
  it("removes an old Thai-only cart without preparing checkout or allowing re-add", () => {
    state.legacy = [item("THAI STYLE")]; mount();
    expect(screen.getByTestId("items")).toHaveTextContent("[]");
    expect(screen.getByTestId("checkout")).not.toHaveAttribute("href");
    expect(createShopifyCheckout).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Add Thai"));
    expect(screen.getByTestId("items")).toHaveTextContent("[]");
  });
  it("prepares a remaining single without sending the old Thai variant", async () => {
    state.legacy = [item("THAI STYLE"), item("PEACH PARTY")]; mount();
    await waitFor(() => expect(createShopifyCheckout).toHaveBeenCalledWith([{ variantId: VARIANT_GID_BY_ID["PEACH PARTY"], quantity: 1 }], undefined));
    expect(screen.getByTestId("items").textContent).not.toContain("THAI STYLE");
  });
  it("keeps a mixed bundle cart, quantities and gifts, and hides Thai upsells", () => {
    state.legacy = [{ ...item("squad-bundle", 34.9), qty: 2 }, item("THAI STYLE"), item("PEACH PARTY")]; mount();
    const items = JSON.parse(screen.getByTestId("items").textContent ?? "[]");
    expect(items.map((i: { id: string }) => i.id)).toEqual(["squad-bundle", "PEACH PARTY", "gift-nasenstripes", "gift-sticker"]);
    expect(items[0].qty).toBe(2);
    const href = screen.getByTestId("checkout").getAttribute("href");
    expect(href).toContain("55628142707030:2");
    expect(href).toContain("52867405513046:1");
    expect(href).not.toContain("52867410788694");
    expect(createShopifyCheckout).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Open cart"));
    expect(screen.getByText("Nachschub sichern")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "THAI STYLE zum Warenkorb hinzufügen" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "LEMON BREEZY zum Warenkorb hinzufügen" })).toBeInTheDocument();
  });
});