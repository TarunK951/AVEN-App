import { useState } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import { Search, X } from "lucide-react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Header, Empty } from "../ui/components";
import { products } from "../data/catalog";
import { productImage } from "../data/images";
import { C, ui } from "../ui/theme";
export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const matches = products.filter((p) =>
    `${p.name} ${p.color} ${p.category} ${p.gender}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  return (
    <View testID="search-screen" style={ui.screen}>
      <Header title="Find your next favorite" back search={false} />
      <View
        style={{
          margin: 22,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderBottomWidth: 1,
          borderColor: C.ink,
          paddingBottom: 12,
        }}
      >
        <Search size={20} color={C.ink} />
        <TextInput
          accessibilityLabel="Search products"
          autoFocus
          autoCapitalize="none"
          placeholder="Try fleece, leggings, or pink…"
          placeholderTextColor="#98a08f"
          value={query}
          onChangeText={setQuery}
          style={{ flex: 1, fontSize: 15, color: C.ink, minHeight: 35 }}
        />
        {query.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setQuery("")}
          >
            <X size={17} color={C.muted} />
          </Pressable>
        )}
      </View>
      <Text style={[ui.eyebrow, { paddingHorizontal: 22, marginBottom: 15 }]}>
        {query ? "YOUR SEARCH RESULTS" : "DISCOVER YOUR EVERYDAY"}
      </Text>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={matches}
        keyExtractor={(p) => String(p.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 25 }}
        ListEmptyComponent={
          <Empty
            title="A different path."
            body="Try another name, color, or category."
            button="Clear search"
            onPress={() => setQuery("")}
          />
        }
        renderItem={({ item: p }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${p.name}`}
            onPress={() =>
              router.push({ pathname: "/product/[id]", params: { id: p.id } })
            }
            style={{
              flexDirection: "row",
              gap: 17,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderColor: C.line,
              alignItems: "center",
            }}
          >
            <Image
              source={productImage(p.id)}
              style={{ width: 65, height: 83 }}
              contentFit="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: C.ink, lineHeight: 20 }}>
                {p.name}
              </Text>
              <Text style={[ui.small, { marginTop: 8 }]}>
                {p.color} · ${p.price}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
