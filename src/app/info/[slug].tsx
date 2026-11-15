import { ScrollView, View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Header, Button } from "../../ui/components";
import { ui } from "../../ui/theme";
const content: Record<
  string,
  { title: string; intro: string; sections: [string, string][] }
> = {
  "our-story": {
    title: "A life in motion.",
    intro: "Inspired by the coast. Made for your everyday.",
    sections: [
      [
        "A fresh perspective",
        "We believe the best things happen when you get moving. AVEN brings together versatile silhouettes, thoughtful details, and everyday comfort.",
      ],
      [
        "From outside to everyday",
        "From morning movement to the long way home, make room for a life well lived.",
      ],
    ],
  },
  "shipping-returns": {
    title: "A little more clarity.",
    intro: "Shipping and returns, made simple.",
    sections: [
      [
        "Shipping preview",
        "Standard US shipping is free on $75+ after discounts; otherwise $8. Express is $18. International standard is $15, free on $150+ after discounts, and express is $28. These are demo rates in USD.",
      ],
      [
        "Returns",
        "A final returns policy will be published before launch. This app does not accept real orders or payments.",
      ],
    ],
  },
  "size-guide": {
    title: "Find your fit.",
    intro: "A starting point for everyday comfort.",
    sections: [
      ["Women", "XS: US 0–2 · S: 4–6 · M: 8–10 · L: 12–14 · XL: 16."],
      [
        "Men",
        "Chest: XS 33–35 in · S 35–37 in · M 38–40 in · L 41–43 in · XL 44–46 in.",
      ],
      [
        "Accessories",
        "Accessories in this collection are One Size. Preview size recommendations should be confirmed against final garment measurements.",
      ],
    ],
  },
  about: {
    title: "A fresh perspective.",
    intro: "AVEN · Independent shopping preview",
    sections: [
      [
        "Built for mobile",
        "A React Native app with native navigation, a local catalog, persistent favorites and bag storage, and a complete demo checkout.",
      ],
      [
        "About this preview",
        "AVEN is an independent design project inspired by Vuori and is not affiliated with Vuori. Reference photography must be licensed or replaced before commercial publication. No live inventory, user accounts, charges, or shipments are connected.",
      ],
    ],
  },
  privacy: {
    title: "Clear by design.",
    intro: "Your privacy, in a few words.",
    sections: [
      [
        "On your device",
        "Your bag, favorites, and last demo receipt are saved locally with AsyncStorage. No contact, street address, or card information is included in that saved receipt.",
      ],
      [
        "Checkout",
        "Contact and address entries stay only in the checkout screen’s memory. Only a fixed demo card is available. No payment processor, analytics, or order API receives these details.",
      ],
      [
        "Remove saved data",
        "Clear this app’s storage or uninstall it to remove the saved bag, favorites, and sample receipt.",
      ],
    ],
  },
};
export default function Info() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const page = content[slug] ?? content.about;
  return (
    <View testID="info-screen" style={ui.screen}>
      <Header back />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 25, paddingBottom: 45 }}
      >
        <Text style={[ui.eyebrow, { marginTop: 20 }]}>
          AVEN · A FRESH PERSPECTIVE
        </Text>
        <Text style={[ui.title, { marginTop: 22 }]}>{page.title}</Text>
        <Text style={[ui.body, { marginTop: 18, marginBottom: 35 }]}>
          {page.intro}
        </Text>
        {page.sections.map(([title, body]) => (
          <View key={title} style={{ marginBottom: 30 }}>
            <Text style={[ui.h2, { fontSize: 23, marginBottom: 12 }]}>
              {title}
            </Text>
            <Text style={ui.body}>{body}</Text>
          </View>
        ))}
        <Button onPress={() => router.navigate("/(tabs)/shop")}>
          Explore the collection
        </Button>
      </ScrollView>
    </View>
  );
}
