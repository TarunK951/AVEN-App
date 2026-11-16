import { ScrollView, View, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Header, Button } from "../../ui/components";
import { C, ui } from "../../ui/theme";
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
        "AVEN is a collection of considered essentials. Soft textures, clean silhouettes and quiet details make room for the way you move.",
      ],
      [
        "Less, but considered.",
        "Five pieces, thoughtfully brought together. An easy layer, a favorite fit, a little room for the things you carry.",
      ],
    ],
  },
  "shipping-returns": {
    title: "A little more clarity.",
    intro: "The details for your everyday arrivals.",
    sections: [
      [
        "Shipping",
        "Standard US shipping is complimentary on orders $75+ after discounts; otherwise $8. Express shipping is $18. International standard is $15, complimentary on orders $150+; express is $28. All prices are in USD.",
      ],
      [
        "Delivery",
        "Choose your delivery method at checkout. Standard delivery is estimated at 4–7 business days and express at 2–3 business days.",
      ],
      [
        "Returns & exchanges",
        "Visit My Orders, select your order and choose Request return or Request exchange. Save your reason and preferred replacement size, or visit Help & support for more assistance.",
      ],
    ],
  },
  "size-guide": {
    title: "Find your fit.",
    intro: "A little guidance. A little more comfort.",
    sections: [
      [
        "Women",
        "XS: US 0–2 · S: 4–6 · M: 8–10 · L: 12–14 · XL: 16. Coast Fleece has a relaxed fit; Form Leggings fit close to the body.",
      ],
      [
        "Men",
        "Chest: XS 33–35 in · S 35–37 in · M 38–40 in · L 41–43 in · XL 44–46 in. Check each product’s fit notes before choosing your size.",
      ],
      [
        "Accessories",
        "The Everyday Canvas Tote is available in One Size. Broad handles and a softly structured body make it easy to carry.",
      ],
    ],
  },
  about: {
    title: "Your everyday. Reconsidered.",
    intro: "AVEN · A fresh perspective",
    sections: [
      [
        "The collection",
        "Coast Fleece. Ridge Trail Pant. Form Legging. Field Overshirt. Everyday Tote. Five original pieces in a palette of oat, olive, graphite, sage and sand.",
      ],
      [
        "Our point of view",
        "Thoughtful texture. Easy shape. A quieter kind of style. Find comfort in the pieces you reach for again and again.",
      ],
    ],
  },
  privacy: {
    title: "Clear by design.",
    intro: "Your details, considered.",
    sections: [
      [
        "Your information",
        "Your profile, saved addresses, bag, favorites and order details are stored on this device. Reviews, preferences and browsing history are also saved here.",
      ],
      [
        "Your choices",
        "You can edit your profile, remove saved addresses, manage alerts and clear recent browsing from your account.",
      ],
      [
        "Payments",
        "Pay on delivery is available at checkout. This app does not collect card numbers.",
      ],
      [
        "Storage",
        "Clear the app’s storage to remove its saved information from this device.",
      ],
    ],
  },
};
export default function Info() {
  const { slug } = useLocalSearchParams<{ slug: string }>(),
    page = content[slug] || content.about;
  return (
    <View testID="info-screen" style={ui.screen}>
      <Header back />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 22,
          paddingTop: 32,
          paddingBottom: 40,
          width: "100%",
          maxWidth: 680,
          alignSelf: "center",
        }}
      >
        <Text style={ui.eyebrow}>AVEN · A FRESH PERSPECTIVE</Text>
        <Text style={[ui.title, { marginTop: 18 }]}>{page.title}</Text>
        <Text style={[ui.body, { marginTop: 16, marginBottom: 32 }]}>
          {page.intro}
        </Text>
        {page.sections.map(([title, body]) => (
          <View key={title} style={{ marginBottom: 30 }}>
            <Text style={ui.h2}>{title}</Text>
            <Text style={[ui.body, { marginTop: 13 }]}>{body}</Text>
          </View>
        ))}
        <Button onPress={() => router.navigate("/(tabs)/shop")}>
          Explore the collection
        </Button>
      </ScrollView>
    </View>
  );
}
