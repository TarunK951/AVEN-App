import { strict as assert } from "node:assert";
import { test } from "node:test";
import { addItem, validBag, subtotalFor } from "../src/store/logic";
import { blankAddress, validateAddress, validEmail } from "../src/data/address";
import { checkoutTotals } from "../src/data/totals";
test("same variant merges, while different sizes remain separate", () => {
  let bag = addItem([], 0, "M", 2);
  bag = addItem(bag, 0, "M", 1);
  bag = addItem(bag, 0, "S", 1);
  assert.equal(bag.length, 2);
  assert.equal(bag[0].quantity, 3);
  assert.equal(subtotalFor(bag), 51200);
});
test("invalid sizes, product IDs, and quantities cannot be added", () => {
  assert.deepEqual(addItem([], 0, "Invalid"), []);
  assert.deepEqual(addItem([], 999, "M"), []);
  assert.deepEqual(addItem([], 0, "M", -1), []);
});
test("accessories require One Size and quantities are bounded", () => {
  assert.deepEqual(addItem([], 8, "M"), []);
  assert.equal(addItem([], 8, "One Size", 100)[0].quantity, 99);
});
test("hydration drops invalid variants and resolves prices from the catalog", () => {
  const bag = validBag([
    { id: 0, size: "M", quantity: 2, price: 1 },
    { id: 999, size: "M", quantity: 1 },
    { id: 0, size: "M", quantity: -1 },
  ]);
  assert.equal(bag.length, 1);
  assert.equal(subtotalFor(bag), 25600);
});
test("malformed storage does not produce a cart", () => {
  assert.deepEqual(validBag(null), []);
  assert.deepEqual(validBag({}), []);
});
test("blank contact and address are rejected", () => {
  assert.equal(validEmail("invalid"), false);
  assert.equal(validEmail("alex@example.com"), true);
  assert.equal(Object.keys(validateAddress(blankAddress)).length, 6);
});
test("postal validation follows the shipping country", () => {
  const address = {
    ...blankAddress,
    firstName: "Alex",
    lastName: "Morgan",
    street: "123 Demo Lane",
    city: "Los Angeles",
    region: "CA",
    postal: "90210",
  };
  assert.deepEqual(validateAddress(address), {});
  assert.ok(validateAddress({ ...address, postal: "123" }).postal);
  assert.deepEqual(
    validateAddress({ ...address, country: "India", postal: "560001" }),
    {},
  );
  assert.ok(
    validateAddress({ ...address, country: "India", postal: "90210" }).postal,
  );
});
test("shipping thresholds are evaluated after discounts", () => {
  assert.equal(
    checkoutTotals(7500, "standard", "United States", false).shipping,
    0,
  );
  assert.equal(
    checkoutTotals(7500, "standard", "United States", true).shipping,
    800,
  );
  assert.equal(
    checkoutTotals(7500, "standard", "United States", true).total,
    7550,
  );
});
test("demo totals reconcile to cents and international rates differ", () => {
  assert.equal(
    checkoutTotals(12800, "express", "United States", true).total,
    13320,
  );
  assert.equal(checkoutTotals(12800, "express", "India", true).total, 14320);
  assert.equal(checkoutTotals(15000, "standard", "India", false).shipping, 0);
});
test("an empty bag has no charge", () => {
  assert.equal(checkoutTotals(0, "express", "India", true).total, 0);
});
import {
  hydrateCustomer,
  validateProfile,
  demoStock,
} from "../src/data/customer";
import { matchesDiscovery } from "../src/data/discovery";
import { products } from "../src/data/catalog";
test("customer hydration rejects corrupt addresses and falls back to a valid default", () => {
  const address = {
    ...blankAddress,
    id: "home",
    label: "Home",
    firstName: "Demo",
    lastName: "Shopper",
    street: "123 Sample Lane",
    city: "Los Angeles",
    region: "CA",
    postal: "90001",
  };
  const result = hydrateCustomer({
    addresses: [address, { ...address, id: "bad", postal: "X" }],
    defaultAddressId: "deleted",
    viewed: [0, 0, 999, "1"],
    reviews: [{ rating: 99 }],
    preferences: { country: "Invalid" },
  });
  assert.equal(result.addresses.length, 1);
  assert.equal(result.defaultAddressId, "home");
  assert.deepEqual(result.viewed, [0]);
  assert.equal(result.reviews.length, 0);
  assert.equal(result.preferences.country, "United States");
});
test("local profile and preferences survive hydration without accepting invalid shapes", () => {
  const result = hydrateCustomer({
    profile: {
      firstName: "Demo",
      lastName: "Shopper",
      email: "demo@example.com",
      phone: "",
    },
    preferences: {
      offers: true,
      orderUpdates: false,
      backInStock: true,
      country: "India",
    },
    tickets: [
      null,
      { id: "one", topic: "Order help", message: "Sample draft" },
    ],
  });
  assert.deepEqual(validateProfile(result.profile), {});
  assert.equal(result.preferences.country, "India");
  assert.equal(result.preferences.offers, true);
  assert.equal(result.tickets.length, 1);
  assert.ok(validateProfile({ ...result.profile, email: "invalid" }).email);
  assert.deepEqual(hydrateCustomer(null).addresses, []);
});
test("discovery combines size, color, price and sample availability", () => {
  assert.equal(
    matchesDiscovery(products[0], {
      size: "M",
      color: "Pink Taffy",
      under150: true,
      inStock: true,
    }),
    true,
  );
  assert.equal(
    matchesDiscovery(products[1], {
      size: "XL",
      color: "",
      under150: false,
      inStock: true,
    }),
    false,
  );
  assert.equal(
    matchesDiscovery(products[0], {
      size: "One Size",
      color: "",
      under150: false,
      inStock: false,
    }),
    false,
  );
  assert.equal(
    matchesDiscovery(products[1], {
      size: "",
      color: "",
      under150: true,
      inStock: false,
    }),
    false,
  );
});
test("unavailable sample variants cannot enter the bag, including buy-again", () => {
  assert.equal(demoStock(10), false);
  assert.deepEqual(addItem([], 10, "One Size"), []);
  assert.deepEqual(addItem([], 1, "XL"), []);
  assert.equal(addItem([], 1, "M").length, 1);
});

import { isReceipt, exampleOrders } from "../src/data/orders";
test("order hydration accepts legacy receipts and rejects malformed line items and totals", () => {
  const sample = exampleOrders[0];
  assert.equal(isReceipt(sample), true);
  const { createdAt, ...legacy } = sample;
  assert.equal(isReceipt(legacy), true);
  assert.equal(
    isReceipt({ ...sample, items: [{ id: 999, size: "M", quantity: 1 }] }),
    false,
  );
  assert.equal(isReceipt({ ...sample, totals: { total: 12800 } }), false);
  assert.equal(isReceipt({ ...sample, createdAt: "not-a-date" }), false);
});
