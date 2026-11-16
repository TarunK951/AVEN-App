import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Page, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useCustomer } from "../../store/customer";
import { products } from "../../data/catalog";
import ProductCard from "../../ui/ProductCard";
import { ui } from "../../ui/theme";
export default function Recent() {
  const { data, update } = useCustomer();
  return (
    <Page
      title="A second look."
      intro="The pieces that caught your eye."
      testID="recent-screen"
    >
      {data.viewed.length ? (
        <>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {data.viewed.map((id) => (
              <View key={id} style={{ width: "47%" }}>
                <ProductCard product={products.find((p) => p.id === id)!} />
              </View>
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => update((old) => ({ ...old, viewed: [] }))}
          >
            <Text style={a.link}>Clear recently viewed</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={ui.body}>
            Your recently viewed pieces will appear here as you explore.
          </Text>
          <Button onPress={() => router.navigate("/(tabs)/shop")}>
            Explore the collection
          </Button>
        </>
      )}
    </Page>
  );
}
