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
    [message, setMessage] = useState("");
  if (!o)
    return (
      <Page title="This order wandered off.">
        <Button onPress={() => router.replace("/account/orders")}>
          Back to My orders
        </Button>
      </Page>
    );
  const status = data.orderActions[id]?.status || "Awaiting confirmation";
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
        {["Order saved", "Confirmed", "On its way", "Delivered"].map(
          (label, i) => (
            <View
              key={label}
              style={{ flexDirection: "row", alignItems: "center", gap: 13 }}
            >
              <View
                style={{
                  height: 27,
                  width: 27,
                  borderRadius: 14,
                  backgroundColor: i === 0 ? C.ink : C.cream,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i === 0 ? (
                  <Check size={14} color={C.white} />
                ) : (
                  <Text style={ui.small}>{i + 1}</Text>
                )}
              </View>
              <Text style={{ fontSize: 13, color: i === 0 ? C.ink : C.muted }}>
                {label}
              </Text>
            </View>
          ),
        )}
      </View>
      {o.items.map((i) => {
        const p = products.find((p) => p.id === i.id)!;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${p.name}`}
            key={`${i.id}-${i.size}`}
            onPress={() =>
              router.push({ pathname: "/product/[id]", params: { id: p.id } })
            }
            style={a.row}
          >
            <Image
              source={productImage(p.id)}
              style={{ width: 65, height: 83 }}
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
          {[
            ["cancelled", "Cancel order"],
            ["return requested", "Request return"],
            ["exchange requested", "Request exchange"],
          ].map(([value, label]) => (
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
