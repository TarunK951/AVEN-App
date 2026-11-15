import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import { Header, Empty } from "../../ui/components";
import { ui, C } from "../../ui/theme";
import { products, collections } from "../../data/catalog";
import ProductCard from "../../ui/ProductCard";
export default function Shop() {
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 3 : 2;
  const cardWidth = (width - 32 - 12 * (columns - 1)) / columns;
  const params = useLocalSearchParams<{
    department?: string;
    collection?: string;
  }>();
  const [department, setDepartment] = useState("All"),
    [category, setCategory] = useState("All"),
    [sort, setSort] = useState(0),
    [edit, setEdit] = useState("");
  useEffect(() => {
    setDepartment(params.department ?? "All");
    setEdit(params.collection ?? "");
    setCategory("All");
  }, [params.department, params.collection]);
  const collection = collections[edit];
  const data = products
    .filter(
      (p) =>
        (department === "All" ||
          (department === "Accessories"
            ? p.category === "Accessories"
            : p.gender === department)) &&
        (category === "All" || p.category === category) &&
        (!collection?.ids || collection.ids.includes(p.id)) &&
        (!collection?.gender || p.gender === collection.gender),
    )
    .sort((a, b) =>
      sort === 1
        ? a.price - b.price
        : sort === 2
          ? b.price - a.price
          : a.id - b.id,
    );
  return (
    <View testID="shop-screen" style={ui.screen}>
      <Header />
      <FlatList
        key={`grid-${columns}`}
        data={data}
        numColumns={columns}
        keyExtractor={(p) => String(p.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 25 }}
        columnWrapperStyle={{ paddingHorizontal: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth, marginBottom: 25 }}>
            <ProductCard product={item} />
          </View>
        )}
        ListHeaderComponent={
          <>
            <View style={{ padding: 23, paddingTop: 28 }}>
              <Text style={ui.eyebrow}>MADE FOR A LIFE IN MOTION</Text>
              <Text style={[ui.title, { marginTop: 12 }]}>
                {collection?.title ?? "The everyday edit."}
              </Text>
              <Text style={[ui.body, { fontSize: 12, marginTop: 12 }]}>
                {collection?.description ??
                  "Meet the pieces that move with you."}
              </Text>
              {!!edit && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear collection"
                  onPress={() => setEdit("")}
                >
                  <Text style={[ui.link, { marginTop: 15 }]}>
                    View all collections
                  </Text>
                </Pressable>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                gap: 9,
                paddingBottom: 18,
              }}
            >
              {["All", "Women", "Men", "Accessories"].map((x) => (
                <Pressable
                  key={x}
                  accessibilityRole="button"
                  accessibilityLabel={`Shop ${x}`}
                  accessibilityState={{ selected: department === x }}
                  onPress={() => {
                    setDepartment(x);
                    setCategory("All");
                    setEdit("");
                  }}
                  style={[ui.chip, department === x && ui.chipActive]}
                >
                  <Text
                    style={[ui.chipText, department === x && ui.chipActiveText]}
                  >
                    {x}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={s.filters}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 17, paddingRight: 10 }}
              >
                {["All", "Tops", "Bottoms", "Outerwear"].map((x) => (
                  <Pressable
                    key={x}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter ${x}`}
                    onPress={() => setCategory(x)}
                  >
                    <Text
                      style={[
                        s.category,
                        category === x && {
                          color: C.ink,
                          textDecorationLine: "underline",
                        },
                      ]}
                    >
                      {x}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Sort: ${["Featured", "Price low to high", "Price high to low"][sort]}`}
                style={s.sort}
                onPress={() => setSort((sort + 1) % 3)}
              >
                <SlidersHorizontal size={15} color={C.ink} />
              </Pressable>
            </View>
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 18,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={ui.small}>{data.length} pieces</Text>
              <Text style={ui.small}>
                {["Featured", "Price: low to high", "Price: high to low"][sort]}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <Empty
            title="A different perspective."
            body="Try another category to find your everyday favorite."
            button="Clear filters"
            onPress={() => {
              setDepartment("All");
              setCategory("All");
              setEdit("");
            }}
          />
        }
      />
    </View>
  );
}
const s = StyleSheet.create({
  filters: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.line,
    marginBottom: 16,
    minHeight: 55,
  },
  category: { fontSize: 11, color: C.muted, paddingVertical: 15 },
  sort: { padding: 10, borderLeftWidth: 1, borderLeftColor: C.line },
});
