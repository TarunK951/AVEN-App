export type ShippingMethod = "standard" | "express";
export const countries = [
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Australia",
];
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );

export function checkoutTotals(
  subtotal: number,
  method: ShippingMethod,
  country: string,
  promo: boolean,
) {
  const discount = promo ? Math.round(subtotal * 0.1) : 0;
  const discounted = subtotal - discount;
  const domestic = country === "United States";
  const threshold = domestic ? 7500 : 15000;
  const shipping = !subtotal
    ? 0
    : method === "express"
      ? domestic
        ? 1800
        : 2800
      : discounted >= threshold
        ? 0
        : domestic
          ? 800
          : 1500;
  return {
    subtotal,
    discount,
    shipping,
    tax: 0,
    total: discounted + shipping,
    threshold,
  };
}

export type DemoReceipt = {
  id: string;
  createdAt: string;
  items: {
    id: number;
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  totals: ReturnType<typeof checkoutTotals>;
  shippingMethod: ShippingMethod;
  country: string;
};

export const RECEIPT_KEY = "aven-demo-receipt";
