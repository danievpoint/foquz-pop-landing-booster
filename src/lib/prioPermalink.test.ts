import { test, expect } from "vitest";
import { buildOnlineStoreCartPermalink, VARIANT_GID_BY_ID } from "@/lib/shopify";
test("prio nie im permalink", () => {
  const u = buildOnlineStoreCartPermalink([
    { variantId: VARIANT_GID_BY_ID["squad-bundle"], quantity: 1 },
    { variantId: VARIANT_GID_BY_ID["prio-versand"], quantity: 1 },
  ], null);
  expect(u).toBe("https://checkout.foquz.de/cart/55628142707030:1");
});
