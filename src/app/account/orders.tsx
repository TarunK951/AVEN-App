import { fulfillmentStatus } from "../../data/fulfillment";
import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Page, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useStore, type Receipt } from "../../store/store";
import { useCustomer } from "../../store/customer";
import { productImage } from "../../data/images";
import { money } from "../../data/totals";
import { C, ui } from "../../ui/theme";
export default function Orders() {
  const { orders } = useStore(),
    { data } = useCustomer();
  return (
    <Page
      title="Your everyday arrivals."
      intro="Your orders, all in one place."
      testID="orders-screen"
    >
      {!orders.length ? (
        <View style={a.card}>
          <Text style={ui.h2}>Your story starts here.</Text>
          <Text style={ui.body}>
            When you place an order, you’ll find its details here.
          </Text>
          <Button onPress={() => router.navigate("/(tabs)/shop")}>
            Explore the collection
          </Button>
        </View>
      ) : (
        orders.map((o) => {
          const count = o.items.reduce((s, i) => s + i.quantity, 0);
          return (
            <Pressable
              key={o.id}
              accessibilityRole="button"
              accessibilityLabel={`View order ${o.id}`}
              onPress={() =>
                router.push({ pathname: "/order/[id]", params: { id: o.id } })
              }
              style={a.card}
            >
              <Text style={ui.eyebrow}>
                {fulfillmentStatus(
                  data.fulfillment[o.id]?.stage,
                  data.orderActions[o.id]?.status,
                ).toUpperCase()}
              </Text>
              <Text style={a.label}>{o.id}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {o.items.slice(0, 3).map((i) => (
                  <Image
                    key={`${i.id}-${i.size}`}
                    source={productImage(i.id)}
                    style={{ width: 64, height: 80 }}
                    contentFit="cover"
                  />
                ))}
              </View>
              <View style={ui.row}>
                <Text style={ui.small}>
                  {count} {count === 1 ? "item" : "items"} ·{" "}
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString()
                    : ""}
                </Text>
                <Text style={{ color: C.ink }}>{money(o.totals.total)}</Text>
              </View>
              <Text style={a.link}>View order details</Text>
            </Pressable>
          );
        })
      )}
    </Page>
  );
}
