import {
  orderStages,
  stageIndex,
  advanceOrder,
  canCancel,
  canReturn,
  fulfillmentStatus,
} from "../../data/fulfillment";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Check, Package } from "lucide-react-native";
import { Page, Row, Choice, Field, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useStore } from "../../store/store";
import { useCustomer } from "../../store/customer";
import { products, sizesFor } from "../../data/catalog";
import { productImage } from "../../data/images";
import { money } from "../../data/totals";
import { C, ui } from "../../ui/theme";
export default function Order() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    store = useStore(),
    { data, update } = useCustomer(),
    o = store.orders.find((o) => o.id === id);
  const [action, setAction] = useState(""),
    [reason, setReason] = useState(""),
    [size, setSize] = useState(""),
    [message, setMessage] = useState(""),
    [manage, setManage] = useState(false);
  if (!o)
    return (
      <Page title="This order wandered off.">
        <Button onPress={() => router.replace("/account/orders")}>
          Back to My orders
        </Button>
      </Page>
    );
  const progress = data.fulfillment[id],
    index = stageIndex(progress?.stage),
    request = data.orderActions[id];
  const status = fulfillmentStatus(progress?.stage, request?.status);
  const delivered = canReturn(progress?.stage),
    cancelled = request?.status === "cancelled";
  const eligibleActions = [
    ...(canCancel(progress?.stage) ? [["cancelled", "Cancel order"]] : []),
    ...(delivered
      ? [
          ["return requested", "Request return"],
          ["exchange requested", "Request exchange"],
        ]
      : []),
  ];
  return (
    <Page title="Your everyday arrivals." intro={o.id} testID="order-screen">
      <View style={a.card}>
        <Package color={C.ink} size={26} />
        <Text style={ui.h2}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
        <Text style={ui.body}>
          {data.orderActions[id]
            ? "Your request details are saved."
            : "Find your items, delivery choice and payment details below."}
        </Text>
      </View>
      <View style={{ gap: 18 }}>
        {orderStages.map(({ label, key }, i) => (
          <View
            key={label}
            style={{ flexDirection: "row", alignItems: "center", gap: 13 }}
          >
            <View
              style={{
                height: 27,
                width: 27,
                borderRadius: 14,
                backgroundColor: i <= index ? C.ink : C.cream,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i <= index ? (
                <Check size={14} color={C.white} />
              ) : (
                <Text style={ui.small}>{i + 1}</Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 13,
                lineHeight: 20,
                flex: 1,
                color: i <= index ? C.ink : C.muted,
              }}
            >
              {label}
              {i === index && !cancelled ? " · Current" : ""}
            </Text>
            {!!progress?.events.find((e) => e.stage === key) && (
              <Text
                style={[
                  ui.small,
                  {
                    marginLeft: "auto",
                    maxWidth: 76,
                    fontSize: 10,
                    textAlign: "right",
                  },
                ]}
              >
                {new Date(
                  progress.events.find((e) => e.stage === key)!.at,
                ).toLocaleDateString()}
              </Text>
            )}
          </View>
        ))}
      </View>
      {o.items.map((i) => {
        const p = products.find((p) => p.id === i.id)!;
        return (
          <View key={`${i.id}-${i.size}`} style={a.row}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`View ${p.name}`}
              onPress={() =>
                router.push({ pathname: "/product/[id]", params: { id: p.id } })
              }
            >
              <Image
                source={productImage(p.id)}
                style={{ width: 65, height: 83 }}
                contentFit="cover"
              />
            </Pressable>
            <View style={{ flex: 1, gap: 7 }}>
              <Text style={a.label}>{p.name}</Text>
              <Text style={ui.small}>
                {p.color} / {i.size} · Qty {i.quantity}
              </Text>
              <Text style={ui.small}>{money(p.price * 100 * i.quantity)}</Text>
              {delivered && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Review ${p.name}`}
                  onPress={() =>
                    router.push({
                      pathname: "/reviews/[id]",
                      params: { id: p.id },
                    })
                  }
                  style={{ paddingVertical: 10 }}
                >
                  <Text style={ui.link}>
                    {data.reviews.some((r) => r.productId === p.id)
                      ? "Edit your review"
                      : "Review this item"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        );
      })}
      <View style={a.card}>
        {[
          ["Subtotal", o.totals.subtotal],
          ["Shipping", o.totals.shipping],
          ["Discount", o.totals.discount ? -o.totals.discount : 0],
          ["Total", o.totals.total],
        ].map(([label, value]) => (
          <View key={label} style={ui.row}>
            <Text style={ui.small}>{label}</Text>
            <Text style={a.label}>{money(Number(value))}</Text>
          </View>
        ))}
      </View>
      <Text style={ui.body}>
        {o.shipping === "express" ? "Express" : "Standard"} shipping ·{" "}
        {o.country}
        {"\n"}Pay on delivery
      </Text>
      {!data.orderActions[id] && (
        <View style={a.wrap}>
          {eligibleActions.map(([value, label]) => (
            <Choice
              key={value}
              label={label}
              selected={action === value}
              onPress={() => setAction(value)}
            />
          ))}
        </View>
      )}
      {!!action && !data.orderActions[id] && (
        <View style={a.card}>
          <Text style={a.label}>How can we help?</Text>
          <Field
            label="Reason for your request"
            value={reason}
            onChange={setReason}
            multiline
          />
          {action === "exchange requested" && (
            <>
              <Text style={ui.label}>Replacement size</Text>
              <View style={a.wrap}>
                {sizesFor(products.find((p) => p.id === o.items[0].id)!).map(
                  (x) => (
                    <Choice
                      key={x}
                      label={x}
                      selected={size === x}
                      onPress={() => setSize(x)}
                    />
                  ),
                )}
              </View>
            </>
          )}
          <Button
            onPress={() => {
              if (reason.trim().length < 5) {
                setMessage("Please tell us a little more.");
                return;
              }
              if (action === "exchange requested" && !size) {
                setMessage("Choose a replacement size.");
                return;
              }
              if (
                (action === "cancelled" && !canCancel(progress?.stage)) ||
                (action !== "cancelled" && !canReturn(progress?.stage))
              ) {
                setAction("");
                setMessage(
                  "This action is no longer available for the current order status.",
                );
                return;
              }
              update((old) => ({
                ...old,
                orderActions: {
                  ...old.orderActions,
                  [id]: {
                    status: action as
                      "cancelled" | "return requested" | "exchange requested",
                    reason:
                      reason.trim() +
                      (size ? ` · Replacement size: ${size}` : ""),
                  },
                },
              }));
              setAction("");
              setMessage("Your request details are saved.");
            }}
          >
            Save request
          </Button>
          <Pressable accessibilityRole="button" onPress={() => setAction("")}>
            <Text style={a.link}>Keep order unchanged</Text>
          </Pressable>
        </View>
      )}
      {!!message && (
        <Text accessibilityRole="alert" style={a.success}>
          {message}
        </Text>
      )}
      {data.orderActions[id] && (
        <Text style={ui.body}>{data.orderActions[id].reason}</Text>
      )}
      {!request && index < orderStages.length - 1 && (
        <View style={a.card}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Manage order progress"
            accessibilityState={{ expanded: manage }}
            onPress={() => setManage(!manage)}
            style={a.row}
          >
            <Text style={a.label}>Manage order progress</Text>
            <Text style={ui.small}>{manage ? "−" : "+"}</Text>
          </Pressable>
          {manage && (
            <>
              <Text style={ui.small}>
                Update the status saved for this order.
              </Text>
              <Button
                onPress={() => {
                  update((old) => ({
                    ...old,
                    fulfillment: {
                      ...old.fulfillment,
                      [id]: advanceOrder(
                        old.fulfillment[id],
                        new Date().toISOString(),
                      ),
                    },
                  }));
                  setAction("");
                  setMessage("Order status updated.");
                }}
              >{`Mark as ${orderStages[index + 1].label.toLowerCase()}`}</Button>
            </>
          )}
        </View>
      )}
      {delivered && (
        <View style={a.card}>
          <Text style={ui.h2}>How did we do?</Text>
          <Text style={ui.body}>
            Share a review of your new everyday favorites. You’ll find a review
            link beside each item above.
          </Text>
        </View>
      )}
      <Button
        onPress={() => {
          o.items.forEach((i) => store.add(i.id, i.size, i.quantity));
          router.navigate("/(tabs)/bag");
        }}
      >
        Buy again
      </Button>
      <Row
        title="Need a hand?"
        subtitle="Visit help & support"
        onPress={() => router.push("/account/support")}
      />
    </Page>
  );
}
