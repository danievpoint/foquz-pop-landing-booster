# Agent rules

- Standalone sale restrictions use `singleSalePolicy` (currently empty; availability comes live from Shopify) and guard both cart offers and checkout preparation; check cart IDs only, never expand or filter Shopify bundle components.
- Cart mutations reconcile gifts through `cartRules`; set benefits require complete set groups, and cart set cards fill up to the target via `planFillToSet` (keep existing cans, add only missing available ones, no-op at/above target) so product-page adds stay additive.
- Persist validated versioned cart items, not prices or checkout results; keyed Shopify preparation is the sole publisher of cart/code totals and links to prevent async races.
- Track the launched checkout snapshot separately from newer prepared carts; never interpret an expired/missing Shopify cart as proof of payment.

- Marquee and navbar are both `position: fixed` and shifted with the same `transform` driven by `--marquee-height`/`--marquee-full`; never animate their `top` — separate movement causes visible gaps while scrolling.
- Fixed header elements carry `data-chrome`; the white preload overlay in `index.html` ignores them when deciding if page content is ready, so the header can never appear alone.
- Header background images are inlined via `build.assetsInlineLimit` so the navbar paints in the same frame as the page.
- Keep heavy libs (e.g. recharts) out of shared `manualChunks` so they stay off the critical path.
- Discount display shows only Shopify discountAllocations per discount (automatic vs code); never derive percentages or per-item prices from totals, since stacked set and code discounts make them wrong.
- Cart 'free shipping' for can-sets follows `hasCheckoutFreeShipping`/`SHOPIFY_FREE_SHIPPING_FOR_CAN_SETS`; only enable it once Shopify itself makes those carts free, so the cart never promises what checkout charges.
- Third-party scripts (Klaviyo, Loox, pixels, Shopify Monorail, Collabs attribution) start only via consent checks in `consent`/`consentRuntime`; never hardcode them in index.html, and revocation clears known IDs then reloads, because loaded SDKs cannot be stopped reliably.
- Legal texts live once in `src/legal/*.html` and are rendered by the site and exported to `legal/shopify` via `scripts/build-legal.ts`; a test enforces both stay identical.

- Klaviyo 'Added to Cart' goes through `AddToCartTracker`: enqueued only with marketing consent at action time, bound to the cart key that action produced (full cart incl. gifts/prio), sent once only when Shopify confirms exactly that key; failures drop only that key and revocation clears everything, so events never carry another action's cart or pre-consent data.
- Set fills require a freshly confirmed stock read and are never offered next to legacy bundle products; carts containing flavours Shopify reports unavailable block checkout instead of letting Shopify drop lines.
- Bundles are fixed mixes defined once in `FIXED_BUNDLES` (`src/data/products.ts`); `setMix` derives contents and per-bundle availability (`bundleStatusFor`) from freshly confirmed Shopify stock, with no free-mix fallback, so a missing component blocks only that bundle. `BUNDLE_PRICING_PENDING` gates every bundle price display, add, fill and JSON-LD offer until final pricing and real Shopify bundles are confirmed. Retired 3/5/10 set IDs cannot be added; existing carts are never relabelled or re-mixed.
