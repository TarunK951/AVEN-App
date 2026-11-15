import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Plus, Minus, X, Truck } from "lucide-react-native";
import { useStore } from "../../store/store";
import { products } from "../../data/catalog";
import { productImage } from "../../data/images";
import { money } from "../../data/totals";
import { Header, Empty, Button } from "../../ui/components";
import { ui, C } from "../../ui/theme";
export default function Bag() {
  const { bag, count, subtotal, quantity, remove, ready, storageError } =
    useStore();
  return (
    <View testID="bag-screen" style={ui.screen}>
      <Header title={`Your bag (${count})`} />
      {!ready ? (
        <Empty
          title="Getting your bag ready…"
          body="A little comfort is on its way."
        />
      ) : !bag.length ? (
        <Empty
          title="A little room for something good."
          body="Your bag is empty. Let’s find you an everyday favorite."
        />
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 22, paddingBottom: 30 }}
          >
            <View style={s.shipping}>
              <Truck size={16} color={C.ink} />
              <Text style={{ fontSize: 11, lineHeight: 17, color: C.ink, flex: 1 }}>
                {subtotal >= 7500
                  ? "Your bag qualifies for free standard shipping."
                  : `You’re ${money(7500 - subtotal)} away from free shipping.`}
              </Text>
            </View>
            {storageError && (
              <Text style={ui.error}>
                Your bag is available in this session. Device storage is
                unavailable.
              </Text>
            )}
            {bag.map((item) => {
              const p = products.find((p) => p.id === item.id)!;
              return (
                <View key={`${item.id}-${item.size}`} style={s.item}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`View ${p.name}`}
                    onPress={() =>
                      router.push({
                        pathname: "/product/[id]",
                        params: { id: p.id },
                      })
                    }
                  >
                    <Image
                      source={productImage(p.id)}
                      style={{ width: 96, height: 126 }}
                      contentFit="cover"
                    />
                  </Pressable>
                  <View style={{ flex: 1, paddingVertical: 5 }}>
                    <Text style={s.name}>{p.name}</Text>
                    <Text style={s.detail}>
                      {p.color} / {item.size}
                    </Text>
                    <Text style={s.price}>{money(p.price * 100)}</Text>
                    <View style={s.quantity}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Decrease ${p.name} quantity`}
                        onPress={() => quantity(p.id, item.size, -1)}
                        style={s.quantityButton}
                      >
                        <Minus size={14} color={C.ink} />
                      </Pressable>
                      <Text style={{ fontSize: 12, color: C.ink }}>
                        {item.quantity}
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Increase ${p.name} quantity`}
                        disabled={item.quantity >= 99}
                        onPress={() => quantity(p.id, item.size, 1)}
                        style={s.quantityButton}
                      >
                        <Plus size={14} color={C.ink} />
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${p.name}`}
                        onPress={() => remove(p.id, item.size)}
                        style={{ marginLeft: "auto", padding: 5 }}
                      >
                        <X size={15} color={C.muted} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
            <Pressable
              accessibilityRole="button"
              onPress={() => router.navigate("/(tabs)/shop")}
            >
              <Text style={[ui.link, { marginTop: 22 }]}>Keep exploring</Text>
            </Pressable>
          </ScrollView>
          <View style={ui.footer}>
            <View style={ui.row}>
              <Text style={{ fontSize: 14, color: C.ink }}>Subtotal</Text>
              <Text style={{ fontSize: 20, color: C.ink }}>
                {money(subtotal)}
              </Text>
            </View>
            <Text style={[ui.small, { fontSize: 10 }]}>
              Shipping and demo tax calculated at checkout.
            </Text>
            <Button onPress={() => router.push("/checkout")}>
              Continue to checkout
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  shipping: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 14,
    backgroundColor: C.soft,
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  name: { fontSize: 13, lineHeight: 20, color: C.ink },
  detail: { fontSize: 10, color: C.muted, marginTop: 7 },
  price: { fontSize: 12, color: C.ink, marginTop: 13 },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 9,
  },
  quantityButton: {
    width: 32,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.line,
  },
});
