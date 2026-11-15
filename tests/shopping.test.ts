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
