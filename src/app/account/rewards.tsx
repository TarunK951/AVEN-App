import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Leaf } from "lucide-react-native";
import { Page, Notice, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useCustomer } from "../../store/customer";
import { useStore } from "../../store/store";
import { C, ui } from "../../ui/theme";
export default function Rewards() {
  const { data, update } = useCustomer(),
    { orders } = useStore(),
    points = data.loyalty
      ? orders
          .filter((o) => data.orderActions[o.id]?.status !== "cancelled")
          .reduce((s, o) => s + Math.floor(o.totals.subtotal / 100), 0)
      : 0;
  return (
    <Page
      title="A little closer, together."
      eyebrow="AVEN CIRCLE"
      intro="Everyday comfort. A few little extras."
      testID="rewards-screen"
    >
      <View style={a.card}>
        <Leaf size={32} color={C.ink} />
        <Text style={ui.h2}>
          {data.loyalty
            ? "Welcome to the Circle."
            : "Make room for good things."}
        </Text>
        <Text style={{ fontSize: 44, color: C.ink }}>{points}</Text>
        <Text style={ui.small}>CIRCLE POINTS</Text>
      </View>

      {!data.loyalty && (
        <Button onPress={() => update((old) => ({ ...old, loyalty: true }))}>
          Join the AVEN Circle
        </Button>
      )}
      <Text style={ui.body}>
        A point for every dollar before discounts. Your order history powers
        this balance.
      </Text>
      <View style={a.card}>
        <Text style={a.label}>A little welcome gift</Text>
        <Text style={ui.body}>
          Use AVEN10 at checkout for 10% off your next everyday favorite.
        </Text>
      </View>
      <Button onPress={() => router.navigate("/(tabs)/shop")}>
        Discover your next favorite
      </Button>
      {data.loyalty && (
        <Pressable
          accessibilityRole="button"
          onPress={() => update((old) => ({ ...old, loyalty: false }))}
        >
          <Text style={a.link}>Leave the AVEN Circle</Text>
        </Pressable>
      )}
    </Page>
  );
}
