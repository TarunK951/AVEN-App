import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Check, Package } from "lucide-react-native";
import { Page, Notice, Choice, Field, Row, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useStore } from "../../store/store";
import { useCustomer } from "../../store/customer";
import { exampleOrders } from "../../data/orders";
import { products, sizesFor } from "../../data/catalog";
import { productImage } from "../../data/images";
import { money } from "../../data/totals";
import { C, ui } from "../../ui/theme";
export default function Order() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    store = useStore(),
    { data, update } = useCustomer(),
    [action, setAction] = useState(""),
    [reason, setReason] = useState(""),
    [replacementSize, setReplacementSize] = useState(""),
    [message, setMessage] = useState("");
  const example = exampleOrders.find((o) => o.id === id),
    o = store.orders.find((o) => o.id === id) || example;
  if (!o)
    return (
      <Page title="This order wandered off.">
        <Notice>
          Only orders saved on this device and the sample journeys are
          available.
        </Notice>
        <Button onPress={() => router.replace("/account/orders")}>
          Back to My orders
        </Button>
      </Page>
    );
  const status =
      data.orderActions[id]?.status || example?.status || "Processing",
    stage = status === "Delivered" ? 3 : status === "In transit" ? 2 : 0;
  return (
    <Page title="A little closer." intro={o.id} testID="order-screen">
      <Notice>
        {example ? "Fictional sample journey." : "Local demo purchase."} No
        payment, carrier booking, return or refund is processed.
      </Notice>
      <View style={a.card}>
        <Package color={C.ink} size={25} />
        <Text style={ui.h2}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
        <Text style={ui.body}>
          {status === "Processing"
            ? "Your demo purchase is saved. This preview does not progress automatically."
            : status === "In transit"
              ? "Sample delivery estimate: 2–3 business days."
              : status === "Delivered"
                ? "This example has arrived. Preview a return or exchange below."
                : "Your demo request has been saved locally. No request was sent."}
        </Text>
      </View>
      {!data.orderActions[id] && (
        <View style={{ gap: 18 }}>
          {["Order placed", "Packed with care", "On its way", "Delivered"].map(
            (label, i) => (
              <View
                key={label}
                style={{ flexDirection: "row", alignItems: "center", gap: 13 }}
              >
                <View
                  style={{
                    height: 28,
                    width: 28,
                    borderRadius: 14,
                    backgroundColor: i <= stage ? C.ink : C.cream,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i <= stage ? (
                    <Check size={15} color={C.white} />
                  ) : (
                    <Text style={ui.small}>{i + 1}</Text>
                  )}
                </View>
                <Text
                  style={{ color: i <= stage ? C.ink : C.muted, fontSize: 13 }}
                >
                  {label}
                </Text>
              </View>
            ),
          )}
        </View>
      )}
      {o.items.map((i) => {
        const p = products.find((p) => p.id === i.id)!;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${p.name}`}
            key={`${i.id}-${i.size}`}
            onPress={() =>
              router.push({ pathname: "/product/[id]", params: { id: i.id } })
            }
            style={[a.row, { alignItems: "flex-start" }]}
          >
            <Image
              source={productImage(i.id)}
              style={{ width: 65, height: 85 }}
              contentFit="cover"
            />
            <View style={{ flex: 1, gap: 7 }}>
              <Text style={a.label}>{p.name}</Text>
              <Text style={ui.small}>
                {p.color} / {i.size} · Qty {i.quantity}
              </Text>
              <Text style={ui.small}>{money(p.price * 100 * i.quantity)}</Text>
            </View>
          </Pressable>
        );
      })}
      <View style={a.card}>
        {[
          ["Subtotal", o.totals.subtotal],
          ["Discount", o.totals.discount ? -o.totals.discount : 0],
          ["Shipping", o.totals.shipping],
          ["Tax (demo)", o.totals.tax],
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
        {"\n"}Demo Visa ending in 4242 · No charge
      </Text>
      {!data.orderActions[id] && (
        <View style={a.wrap}>
          {status === "Processing" && (
            <Choice
              label="Cancel demo order"
              selected={action === "cancelled"}
              onPress={() => setAction("cancelled")}
            />
          )}
          {status === "Delivered" && (
            <>
              <Choice
                label="Request return"
                selected={action === "return requested"}
                onPress={() => setAction("return requested")}
              />
              <Choice
                label="Request exchange"
                selected={action === "exchange requested"}
                onPress={() => setAction("exchange requested")}
              />
            </>
          )}
        </View>
      )}
      {!!action && !data.orderActions[id] && (
        <View style={a.card}>
          <Text style={a.label}>
            {action === "cancelled"
              ? "Cancel this demo order?"
              : "Return / exchange preview"}
          </Text>
          <Field
            label="Reason for your request"
            value={reason}
            onChange={setReason}
            multiline
          />
          {action === "exchange requested" && (
            <View style={{ gap: 10 }}>
              <Text style={ui.label}>Replacement size</Text>
              <View style={a.wrap}>
                {sizesFor(products.find((p) => p.id === o.items[0].id)!).map(
                  (size) => (
                    <Choice
                      key={size}
                      label={size}
                      selected={replacementSize === size}
                      onPress={() => setReplacementSize(size)}
                    />
                  ),
                )}
              </View>
            </View>
          )}
          <Button
            onPress={() => {
              if (action === "exchange requested" && !replacementSize) {
                setMessage("Choose a replacement size.");
                return;
              }
              if (reason.trim().length < 5) {
                setMessage("Please enter at least 5 characters.");
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
                      (action === "exchange requested"
                        ? ` · Replacement size: ${replacementSize}`
                        : ""),
                  },
                },
              }));
              setAction("");
              setMessage("Saved locally. No request or refund was sent.");
            }}
          >
            Confirm local request
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
        <Notice>Reason: {data.orderActions[id].reason}</Notice>
      )}
      {!!example && data.orderActions[id] && (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            update((old) => {
              const next = { ...old.orderActions };
              delete next[id];
              return { ...old, orderActions: next };
            });
            setMessage("");
            setAction("");
            setReason("");
            setReplacementSize("");
          }}
        >
          <Text style={a.link}>Reset sample journey</Text>
        </Pressable>
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
        subtitle="Open support"
        onPress={() => router.push("/account/support")}
      />
    </Page>
  );
}
