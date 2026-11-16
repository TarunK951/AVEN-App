import { isAvailable } from "../data/customer";
import { products, sizesFor } from "../data/catalog";
export type BagItem = { id: number; size: string; quantity: number };
export function validBag(value: unknown): BagItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const p = products.find((p) => p.id === item?.id);
    return p &&
      sizesFor(p).includes(item.size) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
      ? [{ id: p.id, size: item.size, quantity: Math.min(item.quantity, 99) }]
      : [];
  });
}
export const subtotalFor = (bag: BagItem[]) =>
  bag.reduce(
    (sum, item) =>
      sum +
      (products.find((p) => p.id === item.id)?.price ?? 0) *
        100 *
        item.quantity,
    0,
  );
export function addItem(
  bag: BagItem[],
  id: number,
  size: string,
  quantity = 1,
) {
  const p = products.find((p) => p.id === id);
  if (
    !p ||
    !sizesFor(p).includes(size) ||
    !isAvailable(id, size) ||
    !Number.isInteger(quantity) ||
    quantity < 1
  )
    return bag;
  const existing = bag.find((i) => i.id === id && i.size === size);
  return existing
    ? bag.map((i) =>
        i === existing
          ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
          : i,
      )
    : [...bag, { id, size, quantity: Math.min(99, quantity) }];
}
