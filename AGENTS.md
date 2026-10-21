# Agent rules

- Standalone sale restrictions use `singleSalePolicy` and guard both cart offers and checkout preparation; check cart IDs only, never expand or filter Shopify bundle components.
- Cart mutations reconcile gifts through `cartRules`; set benefits require complete set groups, and only cart upsells replace paid cans/sets so product-page adds stay additive.
- Persist validated versioned cart items, not prices or checkout results; keyed Shopify preparation is the sole publisher of cart/code totals and links to prevent async races.
- Track the launched checkout snapshot separately from newer prepared carts; never interpret an expired/missing Shopify cart as proof of payment.

- Marquee and navbar are both `position: fixed` and shifted with the same `transform` driven by `--marquee-height`/`--marquee-full`; never animate their `top` — separate movement causes visible gaps while scrolling.
- Fixed header elements carry `data-chrome`; the white preload overlay in `index.html` ignores them when deciding if page content is ready, so the header can never appear alone.
- Header background images are inlined via `build.assetsInlineLimit` so the navbar paints in the same frame as the page.
- Keep heavy libs (e.g. recharts) out of shared `manualChunks` so they stay off the critical path.
- Discount display shows only Shopify discountAllocations per discount (automatic vs code); never derive percentages or per-item prices from totals, since stacked set and code discounts make them wrong.
- Cart 'free shipping' for can-sets follows `hasCheckoutFreeShipping`/`SHOPIFY_FREE_SHIPPING_FOR_CAN_SETS`; only enable it once Shopify itself makes those carts free, so the cart never promises what checkout charges.
