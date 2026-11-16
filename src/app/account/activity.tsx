import { fulfillmentStatus } from "../../data/fulfillment";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { Page, Row, Notice, a } from "../../ui/account";
import { useStore } from "../../store/store";
import { useCustomer } from "../../store/customer";
import { products } from "../../data/catalog";
import { ui } from "../../ui/theme";
export default function Activity() {
  const { orders } = useStore(),
    { data } = useCustomer();
  return (
    <Page
      title="A little up to date."
      intro="Your shopping activity."
      testID="activity-screen"
    >
      {data.preferences.orderUpdates &&
        orders.map((o) => (
          <Row
            key={o.id}
            title={`Order ${o.id}`}
            subtitle={fulfillmentStatus(
              data.fulfillment[o.id]?.stage,
              data.orderActions[o.id]?.status,
            )}
            onPress={() =>
              router.push({ pathname: "/order/[id]", params: { id: o.id } })
            }
          />
        ))}
      {data.preferences.backInStock &&
        data.alerts.map((id) => (
          <Row
            key={id}
            title={products.find((p) => p.id === id)?.name || "Product alert"}
            subtitle="Restock alert saved"
            onPress={() =>
              router.push({ pathname: "/product/[id]", params: { id } })
            }
          />
        ))}
      {data.preferences.offers && (
        <View style={a.card}>
          <Text style={ui.h2}>A little welcome comfort.</Text>
          <Text style={ui.body}>
            Try AVEN10 for 10% off your next checkout.
          </Text>
        </View>
      )}
      {!orders.length && !data.alerts.length && !data.preferences.offers && (
        <Text style={ui.body}>
          All quiet for now. Orders and saved stock alerts will appear here.
        </Text>
      )}
      <Row
        title="Manage notification preferences"
        onPress={() => router.push("/account/preferences")}
      />
    </Page>
  );
}
