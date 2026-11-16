import { products, sizesFor } from "./catalog";
import { type Receipt } from "../store/store";
import { checkoutTotals } from "./totals";
export function isReceipt(value: unknown): value is Receipt {
  if (!value || typeof value !== "object") return false;
  const o = value as Receipt;
  return (
    typeof o.id === "string" &&
    o.id.startsWith("AVN-") &&
    typeof o.country === "string" &&
    ["standard", "express"].includes(o.shipping) &&
    Array.isArray(o.items) &&
    o.items.length > 0 &&
    o.items.every(
      (i) =>
        i &&
        Number.isInteger(i.quantity) &&
        i.quantity > 0 &&
        i.quantity <= 99 &&
        products.some((p) => p.id === i.id && sizesFor(p).includes(i.size)),
    ) &&
    !!o.totals &&
    ["subtotal", "discount", "shipping", "tax", "total", "threshold"].every(
      (k) => Number.isFinite(o.totals[k as keyof typeof o.totals]),
    ) &&
    o.totals.total >= 0 &&
    (!o.createdAt || Number.isFinite(Date.parse(o.createdAt)))
  );
}
