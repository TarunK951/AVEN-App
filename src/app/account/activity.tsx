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
      intro="Your local shopping activity."
      testID="activity-screen"
    >
      <Notice>
        Activity preview only. No device notifications, emails or SMS are sent.
      </Notice>
      {data.preferences.orderUpdates &&
        orders.map((o) => (
          <Row
            key={o.id}
            title={`Demo order ${o.id}`}
            subtitle={
              data.orderActions[o.id]?.status ||
              "Saved locally · Processing preview"
            }
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
            subtitle="Restock request saved · No live inventory monitoring"
            onPress={() =>
              router.push({ pathname: "/product/[id]", params: { id } })
            }
          />
        ))}
      {data.preferences.offers && (
        <View style={a.card}>
          <Text style={ui.h2}>A little welcome comfort.</Text>
          <Text style={ui.body}>
            Try AVEN10 for 10% off your next demo checkout.
          </Text>
        </View>
      )}
      {!orders.length && !data.alerts.length && !data.preferences.offers && (
        <Text style={ui.body}>
          All quiet for now. Demo orders and saved stock alerts will appear
          here.
        </Text>
      )}
      <Row
        title="Manage notification preferences"
        onPress={() => router.push("/account/preferences")}
      />
    </Page>
  );
}
