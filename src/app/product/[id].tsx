import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Heart,
  Plus,
  Minus,
  Truck,
  ArrowUpRight,
  ChevronDown,
  X,
  ZoomIn,
  Check,
} from "lucide-react-native";
import { products, sizesFor, isAvailable } from "../../data/catalog";
import { productImage } from "../../data/images";
import { money } from "../../data/totals";
import { useStore } from "../../store/store";
import { useCustomer } from "../../store/customer";
import { Header, Button, Empty } from "../../ui/components";
import ProductCard from "../../ui/ProductCard";
import { Row } from "../../ui/account";
import { C, ui } from "../../ui/theme";
export default function Product() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    p = products.find((x) => String(x.id) === id),
    { width } = useWindowDimensions(),
    store = useStore(),
    { data, update, viewProduct } = useCustomer();
  const [size, setSize] = useState(""),
    [quantity, setQuantity] = useState(1),
    [photo, setPhoto] = useState(0),
    [open, setOpen] = useState("Fit & sizing"),
    [zoom, setZoom] = useState(false),
    [alert, setAlert] = useState(false);
  const gallery = useRef<FlatList>(null);
  useEffect(() => {
    if (p) viewProduct(p.id);
  }, [p?.id]);
  useEffect(() => {
    setSize("");
    setQuantity(1);
    setPhoto(0);
    setOpen("Fit & sizing");
    setAlert(false);
    gallery.current?.scrollToOffset({ offset: 0, animated: false });
  }, [id]);
  if (!p)
    return (
      <View style={ui.screen}>
        <Header back />
        <Empty
          title="This piece wandered off."
          body="Find a fresh favorite in the everyday collection."
        />
      </View>
    );
  const photos = [productImage(p.id), productImage(p.id, true)],
    saved = store.favorites.includes(p.id),
    reviews = data.reviews.filter((r) => r.productId === p.id),
    average = reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "";
  const related = products
    .filter((x) => x.id !== p.id)
    .sort(
      (a, b) => Number(b.gender === p.gender) - Number(a.gender === p.gender),
    )
    .slice(0, 4);
  const notes: Record<string, string> = {
    "Fit & sizing": p.fit,
    "Fabric & care": `${p.fabric}\n\n${p.care}`,
    "Shipping & returns":
      "Complimentary standard shipping on orders $75+. Choose your delivery method at checkout. Visit Shipping & returns for more information.",
  };
  return (
    <View testID="product-screen" style={ui.screen}>
      <Header back />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View>
          <FlatList
            key={width}
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
                  style={{ width, height: Math.min(width * 1.25, 680) }}
                  contentFit="cover"
                />
                <ZoomIn
                  size={19}
                  color={C.ink}
                  style={{ position: "absolute", bottom: 18, right: 18 }}
                />
              </Pressable>
            )}
          />
          <Text style={s.badge}>THE EVERYDAY COLLECTION</Text>
          <Text style={s.counter}>
            {photo + 1} / {photos.length}
          </Text>
        </View>
        <View style={s.thumbs}>
          {photos.map((source, i) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Product image ${i + 1}`}
              accessibilityState={{ selected: photo === i }}
              key={i}
              onPress={() => {
                setPhoto(i);
                gallery.current?.scrollToIndex({ index: i, animated: true });
              }}
              style={[s.thumb, photo === i && { borderColor: C.ink }]}
            >
              <Image
                source={source}
                style={{ width: 43, height: 53 }}
                contentFit="cover"
              />
            </Pressable>
          ))}
        </View>
        <View style={s.content}>
          <Text style={ui.eyebrow}>AVEN ESSENTIALS</Text>
          <View style={[ui.row, { alignItems: "flex-start", marginTop: 12 }]}>
            <Text style={s.title}>{p.name}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save product"
              accessibilityState={{ selected: saved }}
              onPress={() => store.toggleFavorite(p.id)}
              style={ui.iconButton}
            >
              <Heart
                size={23}
                color={saved ? C.accent : C.ink}
                fill={saved ? C.accent : "transparent"}
                strokeWidth={1.3}
              />
            </Pressable>
          </View>
          <Text style={s.price}>{money(p.price * 100)}</Text>
          <Text style={[ui.body, { marginTop: 12 }]}>{p.tagline}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reviews & ratings"
            onPress={() =>
              router.push({ pathname: "/reviews/[id]", params: { id: p.id } })
            }
            style={{ paddingVertical: 17 }}
          >
            <Text style={ui.link}>
              {reviews.length
                ? `★ ${average} · ${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`
                : "Be the first to review"}
            </Text>
          </Pressable>
          <View style={s.rule} />
          <Text style={s.label}>Color · {p.color}</Text>
          <View style={[s.swatch, { backgroundColor: p.swatch }]} />
          <View style={ui.row}>
            <Text style={s.label}>
              {size ? `Size · ${size}` : "Select your size"}
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
              style={{ paddingVertical: 12 }}
            >
              <Text style={ui.link}>Size guide</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            {sizesFor(p).map((x) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Size ${x}`}
                accessibilityState={{ selected: size === x }}
                onPress={() => setSize(x)}
                key={x}
                style={[
                  s.size,
                  size === x && { backgroundColor: C.ink, borderColor: C.ink },
                ]}
              >
                <Text
                  style={{ fontSize: 12, color: size === x ? C.white : C.ink }}
                >
                  {x}
                  {!isAvailable(p.id, x) ? " *" : ""}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={[ui.small, { marginTop: 12 }]}>{p.model}</Text>
          <View style={[ui.row, { marginVertical: 22 }]}>
            <View style={s.quantity}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
                disabled={quantity <= 1}
                onPress={() => setQuantity(quantity - 1)}
                style={s.quantityButton}
              >
                <Minus size={14} color={quantity > 1 ? C.ink : C.subtle} />
              </Pressable>
              <Text style={{ fontSize: 13, color: C.ink }}>{quantity}</Text>
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
            <Text style={[ui.small, { flexShrink: 1, textAlign: "right" }]}>
              Made for your everyday.
            </Text>
          </View>
          <Button
            disabled={!size || !isAvailable(p.id, size)}
            onPress={() => {
              store.add(p.id, size, quantity);
              router.navigate("/(tabs)/bag");
            }}
          >
            {!size
              ? "Select a size"
              : !isAvailable(p.id, size)
                ? "Size unavailable"
                : `Add to bag · ${money(p.price * 100 * quantity)}`}
          </Button>
          {!!size && !isAvailable(p.id, size) && (
            <Text style={[ui.small, { marginTop: 12 }]}>
              This size is currently unavailable. Choose another size or save a
              restock alert.
            </Text>
          )}
          <View style={s.shipping}>
            <Truck size={20} color={C.ink} />
            <Text style={[ui.small, { flex: 1, color: C.ink }]}>
              Complimentary standard shipping $75+{`\n`}A little comfort goes a
              long way.
            </Text>
          </View>
          <Text style={[ui.body, { color: C.ink, marginTop: 23 }]}>
            {p.description}
          </Text>
          <View style={s.features}>
            {p.features.map((feature) => (
              <View key={feature} style={s.feature}>
                <Check size={15} color={C.muted} />
                <Text style={[ui.small, { flex: 1, color: C.ink }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
          {Object.entries(notes).map(([label, body]) => (
            <View
              key={label}
              style={{ borderTopWidth: 1, borderColor: C.line }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ expanded: open === label }}
                onPress={() => setOpen(open === label ? "" : label)}
                style={[ui.row, { paddingVertical: 21 }]}
              >
                <Text style={s.label}>{label}</Text>
                <ChevronDown
                  size={17}
                  color={C.ink}
                  style={
                    open === label ? { transform: [{ rotate: "180deg" }] } : {}
                  }
                />
              </Pressable>
              {open === label && (
                <Text style={[ui.body, { paddingBottom: 22 }]}>{body}</Text>
              )}
            </View>
          ))}
          <Row
            title={
              data.alerts.includes(p.id)
                ? "Restock alert saved"
                : "Keep me in the loop"
            }
            subtitle={
              data.alerts.includes(p.id)
                ? "Tap to remove this alert"
                : "Save an alert for this piece"
            }
            onPress={() => {
              update((old) => ({
                ...old,
                alerts: old.alerts.includes(p.id)
                  ? old.alerts.filter((x) => x !== p.id)
                  : [...old.alerts, p.id],
              }));
              setAlert(true);
            }}
          />
          {alert && (
            <Text
              accessibilityRole="alert"
              style={[ui.small, { marginTop: 12 }]}
            >
              Your preference has been saved.
            </Text>
          )}
        </View>
        <View style={s.quality}>
          <Text style={ui.eyebrow}>A CLOSER LOOK</Text>
          <Text style={[ui.title, { marginTop: 14 }]}>{p.qualityTitle}</Text>
          <Text style={[ui.body, { marginTop: 15, marginBottom: 24 }]}>
            {p.qualityCopy}
          </Text>
          <Image
            source={productImage(p.id, true)}
            style={{ width: "100%", aspectRatio: 4 / 5 }}
            contentFit="cover"
          />
          <View style={[ui.row, { marginTop: 18 }]}>
            <Text style={[ui.small, { flex: 1 }]}>{p.fabric}</Text>
            <ArrowUpRight size={18} color={C.muted} />
          </View>
        </View>
        <View style={{ paddingHorizontal: 22, paddingVertical: 28 }}>
          <Text style={ui.eyebrow}>GOOD COMPANY</Text>
          <Text style={[ui.h2, { marginTop: 12 }]}>
            Complete your everyday.
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 22,
            gap: 14,
            paddingBottom: 20,
          }}
        >
          {related.map((x) => (
            <ProductCard key={x.id} product={x} width={165} />
          ))}
        </ScrollView>
      </ScrollView>
      <Modal
        visible={zoom}
        transparent
        animationType="fade"
        onRequestClose={() => setZoom(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
          <View style={[ui.row, { padding: 18 }]}>
            <Text style={[ui.small, { flex: 1 }]}>
              {p.name} · {photo + 1}/{photos.length}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close image viewer"
              onPress={() => setZoom(false)}
              style={ui.iconButton}
            >
              <X size={24} color={C.ink} />
            </Pressable>
          </View>
          <Image
            source={photos[photo]}
            style={{ flex: 1, width: "100%" }}
            contentFit="contain"
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
              padding: 22,
            }}
          >
            {photos.map((_, i) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`View image ${i + 1}`}
                key={i}
                onPress={() => setPhoto(i)}
                style={ui.iconButton}
              >
                <Text
                  style={[ui.link, { fontWeight: photo === i ? "700" : "400" }]}
                >
                  {i + 1}
                </Text>
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: C.cream,
    padding: 9,
    fontSize: 8,
    letterSpacing: 1.1,
    color: C.ink,
  },
  counter: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: C.cream,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 10,
    color: C.ink,
  },
  thumbs: { flexDirection: "row", gap: 9, padding: 16 },
  thumb: { padding: 3, borderWidth: 1, borderColor: C.line },
  content: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 30,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  title: {
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: -0.9,
    color: C.ink,
    flex: 1,
  },
  price: { fontSize: 18, color: C.ink, marginTop: 12 },
  rule: { height: 1, backgroundColor: C.line, marginBottom: 22 },
  label: { fontSize: 12, color: C.ink },
  swatch: {
    width: 33,
    height: 33,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: C.white,
    outlineWidth: 1,
    outlineColor: C.line,
    marginVertical: 16,
  },
  size: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.line,
    padding: 6,
  },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: C.line,
  },
  quantityButton: {
    height: 40,
    width: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  shipping: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 16,
    backgroundColor: C.cream,
    marginTop: 18,
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 12,
    rowGap: 17,
    marginVertical: 27,
  },
  feature: { width: "47%", flexDirection: "row", alignItems: "center", gap: 8 },
  quality: { backgroundColor: C.cream, padding: 22, paddingVertical: 32 },
});
