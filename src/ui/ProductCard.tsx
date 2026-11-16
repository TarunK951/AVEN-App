import { Pressable, Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Heart, ArrowUpRight } from "lucide-react-native";
import { router } from "expo-router";
import { type Product } from "../data/catalog";
import { productImage } from "../data/images";
import { useStore } from "../store/store";
import { isAvailable } from "../data/customer";
import { C } from "./theme";
export default function ProductCard({
  product: p,
  width,
}: {
  product: Product;
  width?: number;
}) {
  const { favorites, toggleFavorite } = useStore();
  return (
    <View style={[s.card, width ? { width } : { flex: 1 }]}>
      <View style={s.image}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${p.name}`}
          onPress={() =>
            router.push({ pathname: "/product/[id]", params: { id: p.id } })
          }
        >
          <Image
            source={productImage(p.id)}
            style={{ width: "100%", aspectRatio: 4 / 5 }}
            contentFit="cover"
            transition={150}
          />
        </Pressable>
        <Text style={s.badge}>
          {!isAvailable(p.id)
            ? "OUT OF STOCK"
            : p.id === 100
              ? "BEST SELLER"
              : "NEW ARRIVAL"}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Save ${p.name}`}
          accessibilityState={{ selected: favorites.includes(p.id) }}
          onPress={() => toggleFavorite(p.id)}
          style={s.heart}
        >
          <Heart
            size={18}
            color={favorites.includes(p.id) ? C.accent : C.ink}
            fill={favorites.includes(p.id) ? C.accent : "transparent"}
            strokeWidth={1.5}
          />
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Details for ${p.name}`}
        onPress={() =>
          router.push({ pathname: "/product/[id]", params: { id: p.id } })
        }
        style={s.title}
      >
        <Text numberOfLines={2} style={s.name}>
          {p.name}
        </Text>
        <Text style={s.price}>${p.price}</Text>
      </Pressable>
      <Text style={s.color}>{p.color}</Text>
      <View style={s.bottom}>
        <View
          style={[
            s.swatch,
            {
              backgroundColor: p.swatch,
            },
          ]}
        />
        <Text style={s.color}>1 color</Text>
        <ArrowUpRight
          size={13}
          color={C.muted}
          style={{ marginLeft: "auto" }}
        />
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  card: { minWidth: 0, paddingBottom: 8 },
  image: { position: "relative", backgroundColor: C.cream, overflow: "hidden" },
  badge: {
    position: "absolute",
    left: 7,
    top: 9,
    fontSize: 7,
    letterSpacing: 0.4,
    backgroundColor: C.cream,
    paddingHorizontal: 5,
    paddingVertical: 4,
    color: C.ink,
    pointerEvents: "none",
  },
  heart: {
    position: "absolute",
    right: 2,
    top: 2,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flexDirection: "row",
    gap: 7,
    justifyContent: "space-between",
    marginTop: 13,
  },
  name: { fontSize: 11, lineHeight: 17, color: C.ink, flex: 1 },
  price: { fontSize: 11, color: C.ink, paddingTop: 1 },
  color: { fontSize: 10, color: C.muted, lineHeight: 17 },
  bottom: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 8 },
  swatch: {
    height: 10,
    width: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dedfe1",
  },
});
