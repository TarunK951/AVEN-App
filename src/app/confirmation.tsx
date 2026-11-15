import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Check, Truck, CreditCard } from "lucide-react-native";
import { Header, Empty, Button } from "../ui/components";
import { useStore } from "../store/store";
import { ui, C } from "../ui/theme";
import { products } from "../data/catalog";
import { productImage } from "../data/images";
import { money } from "../data/totals";
export default function Confirmation() {
  const { receipt } = useStore();
  if (!receipt)
    return (
      <View testID="confirmation-screen" style={ui.screen}>
        <Header back />
        <Empty
          title="A little something awaits."
          body="Complete the demo checkout to see your confirmation."
        />
      </View>
    );
  return (
    <View testID="confirmation-screen" style={ui.screen}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 45 }}
      >
        <View style={{ alignItems: "center", paddingVertical: 25 }}>
          <View style={s.check}>
            <Check size={26} color={C.ink} strokeWidth={1.5} />
          </View>
          <Text
            style={[
              ui.eyebrow,
              { fontSize: 7, textAlign: "center", marginTop: 23 },
            ]}
          >
            A LITTLE COMFORT. A LOT OF POSSIBILITY.
          </Text>
          <Text
            style={[
              ui.title,
              { fontSize: 34, textAlign: "center", marginTop: 20 },
            ]}
          >
            Feels good,{`\n`}doesn’t it?
          </Text>
          <Text style={[ui.body, { marginTop: 14 }]}>
            Your demo journey is complete.
          </Text>
          <Text style={[ui.small, { fontSize: 9, marginTop: 18 }]}>
            Demo reference {receipt.id}
          </Text>
        </View>
        <Text style={s.note}>
          No payment was taken, no order was sent, and no confirmation email was
          delivered. This is a local shopping preview.
        </Text>
        <View style={s.order}>
          <Text style={[ui.h2, { fontSize: 23, marginBottom: 25 }]}>
            Your favorites, together.
          </Text>
          {receipt.items.map((item) => {
            const p = products.find((p) => p.id === item.id)!;
            return (
              <View
                key={`${item.id}-${item.size}`}
                style={{ flexDirection: "row", gap: 13, marginBottom: 24 }}
              >
                <Image
                  source={productImage(p.id)}
                  style={{ width: 62, height: 78 }}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: C.ink, lineHeight: 18 }}>
                    {p.name}
                  </Text>
                  <Text style={[ui.small, { fontSize: 9, marginTop: 7 }]}>
                    {p.color} / {item.size}
                  </Text>
                  <Text style={[ui.small, { fontSize: 9 }]}>
                    Qty {item.quantity}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, color: C.ink }}>
                  {money(p.price * 100 * item.quantity)}
                </Text>
              </View>
            );
          })}
          <View style={ui.rule} />
          {[
            ["Subtotal", money(receipt.totals.subtotal)],
            ...(receipt.totals.discount
              ? [["AVEN10 discount", "−" + money(receipt.totals.discount)]]
              : []),
            [
              "Shipping",
              receipt.totals.shipping
                ? money(receipt.totals.shipping)
                : "Complimentary",
            ],
            ["Tax (demo)", money(0)],
          ].map(([label, value]) => (
            <View key={label} style={[ui.row, { marginBottom: 17 }]}>
              <Text style={[ui.small, { fontSize: 11 }]}>{label}</Text>
              <Text style={{ fontSize: 12, color: C.ink }}>{value}</Text>
            </View>
          ))}
          <View style={ui.rule} />
          <View style={ui.row}>
            <Text style={{ fontSize: 18, color: C.ink }}>Demo total</Text>
            <Text style={{ fontSize: 23, color: C.ink }}>
              {money(receipt.totals.total)}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingVertical: 28,
            borderBottomWidth: 1,
            borderColor: C.line,
          }}
        >
          <Truck size={22} color={C.ink} />
          <Text style={[ui.h2, { fontSize: 22, marginTop: 15 }]}>
            Your delivery preview
          </Text>
          <Text style={[ui.body, { fontSize: 12, marginTop: 13 }]}>
            {receipt.shipping === "standard" ? "Standard" : "Express"} shipping
            · {receipt.country}
          </Text>
          <Text style={[ui.small, { fontSize: 10, marginTop: 12 }]}>
            No shipment is created. Contact and street address details were not
            saved with this receipt.
          </Text>
        </View>
        <View style={{ paddingVertical: 28 }}>
          <CreditCard size={22} color={C.ink} />
          <Text style={[ui.h2, { fontSize: 22, marginTop: 15 }]}>
            A little peace of mind.
          </Text>
          <Text style={[ui.body, { fontSize: 12, marginTop: 13 }]}>
            Demo Visa ending in 4242. No real card details were collected or
            charged.
          </Text>
        </View>
        <Button onPress={() => router.replace("/(tabs)/shop")}>
          Continue exploring
        </Button>
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  check: {
    backgroundColor: C.soft,
    borderRadius: 40,
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  note: {
    fontSize: 10,
    lineHeight: 19,
    color: C.muted,
    backgroundColor: C.cream,
    padding: 18,
    textAlign: "center",
    marginBottom: 28,
  },
  order: { backgroundColor: C.cream, padding: 20 },
});
