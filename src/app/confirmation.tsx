import { View, Text, ScrollView } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import { Header, Button, Empty } from "../ui/components";
import { Row, a } from "../ui/account";
import { useStore } from "../store/store";
import { products } from "../data/catalog";
import { productImage } from "../data/images";
import { money } from "../data/totals";
import { C, ui } from "../ui/theme";
export default function Confirmation() {
  const { receipt } = useStore();
  return (
    <View testID="confirmation-screen" style={ui.screen}>
      <Header />
      {!receipt ? (
        <Empty
          title="Your next chapter starts here."
          body="Find your everyday favorites in the collection."
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 22, paddingBottom: 40 }}
        >
          <View style={{ alignItems: "center", paddingVertical: 28, gap: 18 }}>
            <View
              style={{ padding: 20, borderRadius: 50, backgroundColor: C.soft }}
            >
              <Check size={28} color={C.ink} />
            </View>
            <Text style={ui.eyebrow}>
              A LITTLE COMFORT. A LOT OF POSSIBILITY.
            </Text>
            <Text style={[ui.title, { textAlign: "center" }]}>
              Good things,{`\n`}coming together.
            </Text>
            <Text style={ui.body}>Your order details are saved.</Text>
            <Text style={ui.small}>{receipt.id}</Text>
          </View>
          <View style={a.card}>
            <Text style={ui.eyebrow}>AWAITING CONFIRMATION</Text>
            <Text style={ui.h2}>Your favorites, together.</Text>
            {receipt.items.map((i) => {
              const p = products.find((p) => p.id === i.id);
              return p ? (
                <View
                  key={`${i.id}-${i.size}`}
                  style={[ui.row, { alignItems: "flex-start" }]}
                >
                  <Image
                    source={productImage(i.id)}
                    style={{ width: 65, height: 83 }}
                    contentFit="cover"
                  />
                  <View style={{ flex: 1, gap: 7 }}>
                    <Text style={a.label}>{p.name}</Text>
                    <Text style={ui.small}>
                      {p.color} / {i.size} · Qty {i.quantity}
                    </Text>
                    <Text style={ui.small}>
                      {money(p.price * 100 * i.quantity)}
                    </Text>
                  </View>
                </View>
              ) : null;
            })}
            <View
              style={{ height: 1, backgroundColor: C.line, marginVertical: 8 }}
            />
            {[
              ["Subtotal", receipt.totals.subtotal],
              ["Shipping", receipt.totals.shipping],
              [
                "Discount",
                receipt.totals.discount ? -receipt.totals.discount : 0,
              ],
              ["Total", receipt.totals.total],
            ].map(([label, value]) => (
              <View key={label} style={ui.row}>
                <Text style={ui.small}>{label}</Text>
                <Text style={a.label}>{money(Number(value))}</Text>
              </View>
            ))}
          </View>
          <Row
            title="My orders"
            subtitle="View your order details"
            onPress={() => router.push("/account/orders")}
          />
          <Text style={[ui.body, { marginVertical: 22 }]}>
            Pay on delivery · {receipt.country}
          </Text>
          <Button onPress={() => router.navigate("/(tabs)/shop")}>
            Continue exploring
          </Button>
        </ScrollView>
      )}
    </View>
  );
}
