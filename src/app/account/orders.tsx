import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Page, Notice, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useStore, type Receipt } from "../../store/store";
import { useCustomer } from "../../store/customer";
import { exampleOrders } from "../../data/orders";
import { productImage } from "../../data/images";
import { money } from "../../data/totals";
import { ui, C } from "../../ui/theme";
export default function Orders() {
  const { orders } = useStore(),
    { data } = useCustomer();
  return (
    <Page
      title="Your everyday arrivals."
      intro="All your demo purchases, in one place."
      testID="orders-screen"
    >
      <Notice>
        Demo orders only. Nothing has been purchased, charged or shipped.
      </Notice>
      {orders.length === 0 ? (
        <View style={a.card}>
          <Text style={ui.h2}>Your story starts here.</Text>
          <Text style={ui.body}>
            Complete a demo checkout to see your orders here.
          </Text>
          <Button onPress={() => router.navigate("/(tabs)/shop")}>
            Explore the collection
          </Button>
        </View>
      ) : (
        orders.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            status={data.orderActions[o.id]?.status || "Processing"}
          />
        ))
      )}
      <Text style={[ui.eyebrow, { marginTop: 10 }]}>
        EXPLORE SAMPLE JOURNEYS
      </Text>
      <Text style={ui.small}>
        Fictional examples to preview tracking, returns and exchanges.
      </Text>
      {exampleOrders.map((o) => (
        <OrderCard
          key={o.id}
          order={o}
          status={data.orderActions[o.id]?.status || o.status}
          sample
        />
      ))}
    </Page>
  );
}
function OrderCard({
  order: o,
  status,
  sample = false,
}: {
  order: Receipt;
  status: string;
  sample?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View order ${o.id}`}
      onPress={() =>
        router.push({ pathname: "/order/[id]", params: { id: o.id } })
      }
      style={a.card}
    >
      <View style={ui.row}>
        <Text style={[ui.eyebrow, { flex: 1 }]}>{status.toUpperCase()}</Text>
        <Text style={ui.small}>{sample ? "SAMPLE" : "LOCAL DEMO"}</Text>
      </View>
      <Text style={a.label}>{o.id}</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {o.items.slice(0, 3).map((i) => (
          <Image
            key={`${i.id}-${i.size}`}
            source={productImage(i.id)}
            style={{ width: 60, height: 75 }}
            contentFit="cover"
          />
        ))}
      </View>
      <View style={ui.row}>
        <Text style={ui.small}>
          {o.items.reduce((s, i) => s + i.quantity, 0)} items ·{" "}
          {o.createdAt
            ? new Date(o.createdAt).toLocaleDateString()
            : "Previous preview"}
        </Text>
        <Text style={{ color: C.ink }}>{money(o.totals.total)}</Text>
      </View>
      <Text style={a.link}>View details & tracking</Text>
    </Pressable>
  );
}
