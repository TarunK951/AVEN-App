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
        <Text style={ui.small}>PREVIEW POINTS · NO CASH VALUE</Text>
      </View>
      <Notice>
        Local loyalty concept only. Joining does not register you, subscribe you
        to messages, or create redeemable rewards.
      </Notice>
      {!data.loyalty && (
        <Button onPress={() => update((old) => ({ ...old, loyalty: true }))}>
          Join the preview Circle
        </Button>
      )}
      <Text style={ui.body}>
        A point for every demo dollar before discounts. Your local order history
        powers this preview balance.
      </Text>
      <View style={a.card}>
        <Text style={a.label}>A little welcome gift</Text>
        <Text style={ui.body}>
          Try AVEN10 at demo checkout for 10% off. This is a preview discount,
          available with or without Circle membership.
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
          <Text style={a.link}>Leave the preview Circle</Text>
        </Pressable>
      )}
    </Page>
  );
}
