import { useState } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import { Search, X } from "lucide-react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Header, Empty } from "../ui/components";
import { products } from "../data/catalog";
import { productImage } from "../data/images";
import { useCustomer } from "../store/customer";
import { Choice, a } from "../ui/account";
import { C, ui } from "../ui/theme";
export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const { data, update, rememberSearch } = useCustomer();
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
          borderWidth: 1,
          borderColor: C.line,
          backgroundColor: C.cream,
          paddingHorizontal: 14,
          minHeight: 50,
        }}
      >
        <Search size={20} color={C.ink} />
        <TextInput
          accessibilityLabel="Search products"
          autoFocus
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => rememberSearch(query)}
          placeholder="Try fleece, leggings, or pink…"
          placeholderTextColor={C.muted}
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            fontSize: 13,
            color: C.ink,
            minHeight: 46,
            minWidth: 0,
          }}
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
      {!query && data.recentSearches.length > 0 && (
        <View style={{ paddingHorizontal: 22, paddingBottom: 18, gap: 12 }}>
          <Text style={ui.eyebrow}>RECENT SEARCHES</Text>
          <View style={a.wrap}>
            {data.recentSearches.map((q) => (
              <Choice
                key={q}
                label={q}
                selected={false}
                onPress={() => setQuery(q)}
              />
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => update((old) => ({ ...old, recentSearches: [] }))}
          >
            <Text style={ui.link}>Clear recent searches</Text>
          </Pressable>
        </View>
      )}
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
            onPress={() => {
              rememberSearch(query);
              router.push({ pathname: "/product/[id]", params: { id: p.id } });
            }}
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
