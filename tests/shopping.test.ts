import { strict as assert } from "node:assert";
import { test } from "node:test";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { addItem, validBag, subtotalFor } from "../src/store/logic";
import { products, isAvailable } from "../src/data/catalog";
import { hydrateCustomer, validateProfile } from "../src/data/customer";
import { blankAddress, validateAddress, validEmail } from "../src/data/address";
import { checkoutTotals } from "../src/data/totals";
import { matchesDiscovery } from "../src/data/discovery";
import { isReceipt } from "../src/data/orders";
test("the original AVEN collection contains five unique products with complete detail content", () => {
  assert.equal(products.length, 5);
  assert.equal(new Set(products.map((p) => p.id)).size, 5);
  for (const p of products) {
    assert.ok(
      p.fit && p.fabric && p.care && p.description && p.qualityCopy && p.swatch,
    );
    assert.equal(p.features.length, 4);
  }
});
test("same variant merges and different sizes stay separate", () => {
  let bag = addItem([], 100, "M", 2);
  bag = addItem(bag, 100, "M", 1);
  bag = addItem(bag, 100, "S");
  assert.equal(bag.length, 2);
  assert.equal(bag[0].quantity, 3);
  assert.equal(subtotalFor(bag), 51200);
});
test("invalid products, sizes and quantities are rejected", () => {
  assert.deepEqual(addItem([], 999, "M"), []);
  assert.deepEqual(addItem([], 100, "bad"), []);
  assert.deepEqual(addItem([], 100, "M", -1), []);
});
test("tote uses One Size and quantity is bounded", () => {
  assert.deepEqual(addItem([], 104, "M"), []);
  assert.equal(addItem([], 104, "One Size", 100)[0].quantity, 99);
});
test("old catalog variants and malformed cart entries are discarded", () => {
  assert.deepEqual(validBag([{ id: 0, size: "M", quantity: 1 }]), []);
  assert.equal(
    validBag([
      { id: 100, size: "M", quantity: 2 },
      { id: 999, size: "S", quantity: 1 },
    ]).length,
    1,
  );
  assert.deepEqual(validBag(null), []);
});
test("profile requires a name and valid email", () => {
  assert.equal(validEmail("bad"), false);
  assert.ok(
    validateProfile({ firstName: "", lastName: "", email: "bad", phone: "" })
      .email,
  );
  assert.deepEqual(
    validateProfile({
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex@example.com",
      phone: "",
    }),
    {},
  );
});
const address = {
  ...blankAddress,
  id: "home",
  label: "Home",
  firstName: "Alex",
  lastName: "Morgan",
  street: "123 Coast Lane",
  city: "Los Angeles",
  region: "CA",
  postal: "90001",
};
test("address validation follows postal country", () => {
  assert.equal(Object.keys(validateAddress(blankAddress)).length, 6);
  assert.deepEqual(validateAddress(address), {});
  assert.ok(validateAddress({ ...address, postal: "x" }).postal);
  assert.deepEqual(
    validateAddress({ ...address, country: "India", postal: "560001" }),
    {},
  );
});
test("saved address fallback and current catalog hydration tolerate corrupt data", () => {
  const d = hydrateCustomer({
    addresses: [address, { ...address, id: "bad", postal: "x" }],
    defaultAddressId: "gone",
    viewed: [100, 100, 0, 999],
    alerts: [104, 8],
    reviews: [{ rating: 99 }],
  });
  assert.equal(d.addresses.length, 1);
  assert.equal(d.defaultAddressId, "home");
  assert.deepEqual(d.viewed, [100]);
  assert.deepEqual(d.alerts, [104]);
  assert.deepEqual(d.reviews, []);
});
test("preferences hydrate without accepting invalid shapes", () => {
  const d = hydrateCustomer({
    preferences: { country: "Invalid", offers: true },
    tickets: [null, { id: "one", topic: "Order help", message: "A question" }],
  });
  assert.equal(d.preferences.country, "United States");
  assert.equal(d.preferences.offers, true);
  assert.equal(d.tickets.length, 1);
});
test("combined discovery filters respect size, color, price and stock", () => {
  assert.equal(
    matchesDiscovery(products[0], {
      size: "M",
      color: "Oat",
      under150: true,
      inStock: true,
    }),
    true,
  );
  assert.equal(
    matchesDiscovery(products[1], {
      size: "XL",
      color: "Olive",
      under150: false,
      inStock: true,
    }),
    false,
  );
  assert.equal(
    matchesDiscovery(products[1], {
      size: "M",
      color: "",
      under150: true,
      inStock: false,
    }),
    false,
  );
});
test("unavailable sizes cannot enter the bag", () => {
  assert.equal(isAvailable(101, "XL"), false);
  assert.deepEqual(addItem([], 101, "XL"), []);
  assert.equal(addItem([], 101, "M").length, 1);
});
test("discounts apply before shipping thresholds", () => {
  assert.equal(
    checkoutTotals(7500, "standard", "United States", true).shipping,
    800,
  );
  assert.equal(
    checkoutTotals(7500, "standard", "United States", true).total,
    7550,
  );
});
test("shipping and totals reconcile in cents", () => {
  assert.equal(
    checkoutTotals(12800, "express", "United States", true).total,
    13320,
  );
  assert.equal(checkoutTotals(12800, "express", "India", true).total, 14320);
  assert.equal(checkoutTotals(0, "standard", "India", true).total, 0);
});
test("order hydration rejects retired products and malformed totals", () => {
  const o = {
    id: "AVN-ONE",
    items: [{ id: 100, size: "M", quantity: 1 }],
    totals: checkoutTotals(12800, "standard", "United States", false),
    country: "United States",
    shipping: "standard",
    createdAt: "2026-11-16T12:00:00Z",
  };
  assert.equal(isReceipt(o), true);
  assert.equal(
    isReceipt({ ...o, items: [{ id: 0, size: "M", quantity: 1 }] }),
    false,
  );
  assert.equal(isReceipt({ ...o, totals: { total: 12800 } }), false);
});
test("customer-facing screens contain no placeholder labels and all original image assets exist", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((x) =>
      x.isDirectory() ? walk(join(dir, x.name)) : [join(dir, x.name)],
    );
  for (const file of walk("src/app").filter((x) => x.endsWith(".tsx"))) {
    assert.equal(
      /\b(demo|sample|example|preview|fictional)\b/i.test(
        readFileSync(file, "utf8"),
      ),
      false,
      file,
    );
  }
  for (const name of ["fleece", "pants", "leggings", "overshirt", "tote"]) {
    assert.ok(existsSync(`assets/originals/aven-${name}.png`));
    assert.ok(existsSync(`assets/originals/aven-${name}-detail.png`));
  }
});

import {
  orderStages,
  advanceOrder,
  canCancel,
  canReturn,
  fulfillmentStatus,
} from "../src/data/fulfillment";
test("order progression follows every stage once and stops at delivery", () => {
  let f;
  for (const step of orderStages.slice(1)) {
    f = advanceOrder(f, "2026-11-16T12:00:00Z");
    assert.equal(f.stage, step.key);
  }
  assert.equal(f!.events.length, 5);
  assert.equal(advanceOrder(f, "2026-11-17T12:00:00Z"), f);
});
test("cancellation and returns follow fulfillment eligibility", () => {
  assert.equal(canCancel("placed"), true);
  assert.equal(canCancel("packed"), true);
  assert.equal(canCancel("shipped"), false);
  assert.equal(canCancel("delivered"), false);
  assert.equal(canReturn("shipped"), false);
  assert.equal(canReturn("delivered"), true);
  assert.equal(fulfillmentStatus("delivered"), "Delivered");
  assert.equal(
    fulfillmentStatus("delivered", "return requested"),
    "Return requested",
  );
});
test("order progress survives hydration while malformed stage data is removed", () => {
  const d = hydrateCustomer({
    fulfillment: {
      "AVN-ONE": {
        stage: "delivered",
        events: [
          { stage: "delivered", at: "2026-11-16T12:00:00Z" },
          { stage: "bad", at: "bad" },
        ],
      },
      "AVN-BAD": { stage: "invalid", events: [] },
    },
  });
  assert.equal(d.fulfillment["AVN-ONE"]?.stage, "delivered");
  assert.equal(d.fulfillment["AVN-ONE"]?.events.length, 1);
  assert.equal(d.fulfillment["AVN-BAD"], undefined);
});
