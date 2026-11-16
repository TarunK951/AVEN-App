export const orderStages = [
  {
    key: "placed",
    label: "Order placed",
    detail: "Your order details are saved.",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    detail: "Your order has been confirmed.",
  },
  {
    key: "packed",
    label: "Packed",
    detail: "Your pieces are ready for their next step.",
  },
  { key: "shipped", label: "Shipped", detail: "Your order is on its way." },
  {
    key: "out-for-delivery",
    label: "Out for delivery",
    detail: "Your order is on the last part of its journey.",
  },
  {
    key: "delivered",
    label: "Delivered",
    detail: "Your everyday favorites have arrived.",
  },
] as const;
export type OrderStage = (typeof orderStages)[number]["key"];
export type Fulfillment = {
  stage: OrderStage;
  events: { stage: OrderStage; at: string }[];
};
export const stageIndex = (stage?: OrderStage) =>
  Math.max(
    0,
    orderStages.findIndex((x) => x.key === stage),
  );
export function advanceOrder(
  current: Fulfillment | undefined,
  at: string,
): Fulfillment {
  const index = stageIndex(current?.stage),
    next = orderStages[Math.min(index + 1, orderStages.length - 1)].key;
  if (current?.stage === "delivered") return current;
  return {
    stage: next,
    events: [...(current?.events ?? []), { stage: next, at }],
  };
}
export const canCancel = (stage?: OrderStage) => stageIndex(stage) < 3;
export const canReturn = (stage?: OrderStage) => stage === "delivered";
export function fulfillmentStatus(stage?: OrderStage, action?: string) {
  return action
    ? action.charAt(0).toUpperCase() + action.slice(1)
    : orderStages[stageIndex(stage)].label;
}
