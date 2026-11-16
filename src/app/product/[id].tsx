import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { Heart, Plus, Minus, Truck, X, ZoomIn } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { products, sizesFor } from "../../data/catalog";
import { images, productImage } from "../../data/images";
import { money } from "../../data/totals";
import { useStore } from "../../store/store";
import { Header, Button, Empty } from "../../ui/components";
import { C, ui } from "../../ui/theme";
import { useCustomer } from "../../store/customer";
import { demoStock } from "../../data/customer";
import { Row, Notice } from "../../ui/account";
import ProductCard from "../../ui/ProductCard";
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = products.find((p) => String(p.id) === id);
  const { width } = useWindowDimensions();
  const gallery = useRef<FlatList>(null);
  const [photo, setPhoto] = useState(0),
    [size, setSize] = useState(""),
    [quantity, setQuantity] = useState(1),
    [zoom, setZoom] = useState(false),
    [open, setOpen] = useState("Product details");
  const { add, toggleFavorite, favorites, ready } = useStore();
  const { data: customer, update, viewProduct } = useCustomer();
  useEffect(() => {
    if (p) viewProduct(p.id);
  }, [p?.id]);
  if (!p)
    return (
      <View testID="product-screen" style={ui.screen}>
        <Header back />
        <Empty
          title="A different path."
          body="This piece is no longer in the edit."
        />
      </View>
    );
  const photos = [
    productImage(p.id),
    productImage(p.id, true),
    ...(p.id === 0
      ? [images["product-0-detail"], images["product-0-back"]]
      : []),
  ];
  const notes: Record<string, string> = {
    "Product details": `${p.name} brings thoughtful details and a fresh perspective to your everyday. A versatile ${p.category === "Accessories" ? "accessory" : "essential"} for slowing down, heading out, and everything in between.`,
    "Fit & feel":
      p.category === "Accessories"
        ? "Available in One Size. Soft texture, considered details, and a versatile everyday feel."
        : p.id === 0
          ? "Oversized silhouette, designed for easy layering. Choose your usual size for a relaxed feel."
          : "Comfortable, versatile fit. Select from XS–XL and consult the size guide for a starting point.",
    "Fabric & care":
      "Follow the care label on your garment. Wash with similar colors. Final composition and care instructions will be confirmed with the production catalog.",
    "Shipping & returns":
      "Free standard US shipping on $75+ after discounts in this demo. Delivery rates are examples. No live orders, payments, or shipments are created.",
  };
  return (
    <View testID="product-screen" style={ui.screen}>
      <Header back />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 21 }}>
          <Text style={[ui.h2, { fontSize: 24, lineHeight: 30 }]}>
            {p.name}
          </Text>
          <Text style={{ fontSize: 15, color: C.ink, marginTop: 10 }}>
            {money(p.price * 100)}{" "}
            <Text style={{ fontSize: 10, color: C.muted }}>
              {" "}
              ·{" "}
              {p.gender === "Unisex"
                ? "Unisex accessories"
                : `${p.gender}’s everyday essentials`}
            </Text>
          </Text>
        </View>
        <View>
          <FlatList
            ref={gallery}
            data={photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={(e) =>
              setPhoto(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            renderItem={({ item, index }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Enlarge product image ${index + 1}`}
                onPress={() => {
                  setPhoto(index);
                  setZoom(true);
                }}
              >
                <Image
                  source={item}
                  style={{ width, height: width * 1.25 }}
                  contentFit="cover"
                />
                <ZoomIn
                  size={19}
                  color={C.ink}
                  style={{ position: "absolute", right: 18, bottom: 18 }}
                />
              </Pressable>
            )}
          />
          <Text style={s.new}>
            {demoStock(p.id) ? "NEW ARRIVAL" : "OUT OF STOCK · DEMO"}
          </Text>
        </View>
        <View style={s.dots}>
          {photos.map((_, i) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Product image ${i + 1}`}
              key={i}
              onPress={() => {
                setPhoto(i);
                gallery.current?.scrollToIndex({ index: i, animated: true });
              }}
              style={{ padding: 8 }}
            >
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: photo === i ? C.ink : "#ccd4c2",
                }}
              />
            </Pressable>
          ))}
        </View>
        <View style={{ padding: 22, paddingTop: 10 }}>
          <View style={ui.row}>
            <Text style={{ fontSize: 12, color: C.ink }}>Color: {p.color}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save product"
              accessibilityState={{ selected: favorites.includes(p.id) }}
              onPress={() => toggleFavorite(p.id)}
              style={ui.iconButton}
            >
              <Heart
                size={20}
                color={favorites.includes(p.id) ? C.accent : C.ink}
                fill={favorites.includes(p.id) ? C.accent : "transparent"}
                strokeWidth={1.5}
              />
            </Pressable>
          </View>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor:
                p.color === "Pink Taffy"
                  ? "#cfa0b2"
                  : p.color === "Silt"
                    ? "#aaa18e"
                    : p.color.includes("Grey")
                      ? "#c2c4bc"
                      : "#40373c",
              borderWidth: 3,
              borderColor: C.white,
              marginBottom: 24,
            }}
          />
          <View style={ui.row}>
            <Text style={{ fontSize: 12, color: C.ink }}>
              Select a size{size ? `: ${size}` : ""}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Size guide"
              onPress={() =>
                router.push({
                  pathname: "/info/[slug]",
                  params: { slug: "size-guide" },
                })
              }
            >
              <Text style={[ui.link, { fontSize: 10 }]}>Size guide</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 15 }}>
            {sizesFor(p).map((s) => (
              <Pressable
                key={s}
                accessibilityRole="button"
                accessibilityLabel={`Size ${s}`}
                accessibilityState={{ selected: size === s }}
                onPress={() => setSize(s)}
                style={[
                  ui.chip,
                  {
                    flex: 1,
                    alignItems: "center",
                    paddingHorizontal: 5,
                    paddingVertical: 14,
                  },
                  size === s && ui.chipActive,
                ]}
              >
                <Text style={[ui.chipText, size === s && ui.chipActiveText]}>
                  {s}
                  {!demoStock(p.id, s) ? " *" : ""}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={[ui.row, { marginTop: 22, marginBottom: 22 }]}>
            <View style={s.quantity}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
                disabled={quantity <= 1}
                onPress={() => setQuantity(quantity - 1)}
                style={s.quantityButton}
              >
                <Minus size={14} color={quantity <= 1 ? "#bfc7b5" : C.ink} />
              </Pressable>
              <Text style={{ color: C.ink, fontSize: 12 }}>{quantity}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
                disabled={quantity >= 10}
                onPress={() => setQuantity(quantity + 1)}
                style={s.quantityButton}
              >
                <Plus size={14} color={C.ink} />
              </Pressable>
            </View>
            <Text style={[ui.small, { fontSize: 10, flexShrink: 1 }]}>
              {p.category === "Accessories"
                ? "The finishing touch."
                : "Feel-good, everyday comfort."}
            </Text>
          </View>
          <Button
            disabled={!size || !ready || !demoStock(p.id, size)}
            onPress={() => {
              add(p.id, size, quantity);
              router.navigate("/(tabs)/bag");
            }}
          >
            {!demoStock(p.id, size)
              ? "Unavailable in demo stock"
              : size
                ? `Add to bag · ${money(p.price * 100 * quantity)}`
                : "Select a size"}
          </Button>
          {!demoStock(p.id, size) && (
            <Notice>
              This variant is unavailable in the sample inventory. Choose
              another size or save a stock alert below.
            </Notice>
          )}
          <Row
            title={
              customer.alerts.includes(p.id)
                ? "Stock alert saved · Remove"
                : "Notify me about restocks"
            }
            subtitle="Local preference only · No messages are sent"
            onPress={() =>
              update((old) => ({
                ...old,
                alerts: old.alerts.includes(p.id)
                  ? old.alerts.filter((x) => x !== p.id)
                  : [...old.alerts, p.id],
              }))
            }
          />
          <Row
            title="Reviews & ratings"
            subtitle={`${customer.reviews.filter((r) => r.productId === p.id).length} local reviews · Share a first impression`}
            onPress={() =>
              router.push({ pathname: "/reviews/[id]", params: { id: p.id } })
            }
          />
          <View style={s.shipping}>
            <Truck size={19} color={C.ink} />
            <Text
              style={{ fontSize: 11, lineHeight: 18, color: C.muted, flex: 1 }}
            >
              Complimentary standard US shipping $75+{`\n`}A little comfort goes
              a long way.
            </Text>
          </View>
          {Object.keys(notes).map((title) => (
            <View
              key={title}
              style={{ borderTopWidth: 1, borderColor: C.line }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={title}
                accessibilityState={{ expanded: open === title }}
                style={[ui.row, { paddingVertical: 21 }]}
                onPress={() => setOpen(open === title ? "" : title)}
              >
                <Text style={{ fontSize: 13, color: C.ink }}>{title}</Text>
                {open === title ? (
                  <Minus size={16} color={C.ink} />
                ) : (
                  <Plus size={16} color={C.ink} />
                )}
              </Pressable>
              {open === title && (
                <Text style={[ui.body, { fontSize: 12, paddingBottom: 22 }]}>
                  {notes[title]}
                </Text>
              )}
            </View>
          ))}
        </View>
        <View style={{ padding: 22, paddingTop: 10 }}>
          <Text style={ui.h2}>You might also like</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 22,
            paddingBottom: 32,
            gap: 13,
          }}
        >
          {products
            .filter((x) => x.gender === p.gender && x.id !== p.id)
            .map((x) => (
              <ProductCard key={x.id} product={x} width={170} />
            ))}
        </ScrollView>
      </ScrollView>
      <Modal
        visible={zoom}
        animationType="fade"
        onRequestClose={() => setZoom(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
          <View style={[ui.row, { paddingHorizontal: 20 }]}>
            <Text style={ui.small}>
              {photo + 1} / {photos.length}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close image"
              style={ui.iconButton}
              onPress={() => setZoom(false)}
            >
              <X size={23} color={C.ink} />
            </Pressable>
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Image
              source={photos[photo]}
              style={{ width: "100%", height: "90%" }}
              contentFit="contain"
            />
          </View>
          <View style={[ui.row, { padding: 22 }]}>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setPhoto((photo + photos.length - 1) % photos.length)
              }
            >
              <Text style={ui.link}>Previous</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setPhoto((photo + 1) % photos.length)}
            >
              <Text style={ui.link}>Next image</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  new: {
    position: "absolute",
    left: 16,
    top: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#ffffffef",
    fontSize: 7,
    letterSpacing: 1,
    color: C.ink,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderWidth: 1,
    borderColor: C.line,
  },
  quantityButton: {
    width: 34,
    height: 37,
    alignItems: "center",
    justifyContent: "center",
  },
  shipping: {
    backgroundColor: C.cream,
    borderWidth: 1,
    borderColor: C.line,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginVertical: 24,
  },
});
