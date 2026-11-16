import { FlatList, View, Text, useWindowDimensions } from "react-native";
import { useStore } from "../../store/store";
import { products } from "../../data/catalog";
import { Header, Empty } from "../../ui/components";
import { ui } from "../../ui/theme";
import ProductCard from "../../ui/ProductCard";
export default function Saved() {
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 3 : 2;
  const cardWidth = (width - 32 - 12 * (columns - 1)) / columns;
  const { favorites } = useStore();
  const data = products.filter((p) => favorites.includes(p.id));
  return (
    <View testID="saved-screen" style={ui.screen}>
      <Header />
      {data.length ? (
        <FlatList
          key={`saved-${columns}`}
          data={data}
          numColumns={columns}
          keyExtractor={(p) => String(p.id)}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ paddingHorizontal: 16, gap: 12 }}
          contentContainerStyle={{ paddingBottom: 25 }}
          ListHeaderComponent={
            <View style={ui.section}>
              <Text style={ui.eyebrow}>THE ONES YOU LOVE</Text>
              <Text style={[ui.title, { marginTop: 12 }]}>
                Keep them close.
              </Text>
              <Text style={[ui.body, { marginTop: 12 }]}>
                {data.length} saved{" "}
                {data.length === 1 ? "favorite" : "favorites"}, ready when you
                are.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ width: cardWidth, marginBottom: 25 }}>
              <ProductCard product={item} />
            </View>
          )}
        />
      ) : (
        <Empty
          title="Keep your favorites close."
          body="Tap a heart on something you love. Your favorites will be waiting here."
        />
      )}
    </View>
  );
}
