import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ArrowRight, Heart, PackageCheck, Leaf } from "lucide-react-native";
import { Header, Mark } from "../../ui/components";
import { C, ui } from "../../ui/theme";
import { useStore } from "../../store/store";
export default function You() {
  const { favorites, count } = useStore();
  return (
    <View testID="you-screen" style={ui.screen}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[ui.section, { paddingVertical: 40 }]}>
          <Text style={ui.eyebrow}>YOUR OWN KIND OF EVERYDAY</Text>
          <Text style={[ui.title, { marginTop: 15 }]}>
            A little space for you.
          </Text>
          <Text style={[ui.body, { marginTop: 15 }]}>
            The pieces you love. The moments that move you.
          </Text>
        </View>
        <View style={s.stats}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open saved favorites"
            style={s.stat}
            onPress={() => router.navigate("/(tabs)/saved")}
          >
            <Heart size={22} color={C.ink} strokeWidth={1.3} />
            <Text style={s.number}>{favorites.length}</Text>
            <Text style={ui.small}>Favorites</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open your bag"
            style={s.stat}
            onPress={() => router.navigate("/(tabs)/bag")}
          >
            <PackageCheck size={22} color={C.ink} strokeWidth={1.3} />
            <Text style={s.number}>{count}</Text>
            <Text style={ui.small}>In your bag</Text>
          </Pressable>
        </View>
        <View style={ui.section}>
          {[
            { label: "Our story", slug: "our-story" },
            { label: "Shipping & returns", slug: "shipping-returns" },
            { label: "Find your fit", slug: "size-guide" },
            { label: "About this app", slug: "about" },
            { label: "Privacy", slug: "privacy" },
          ].map((x) => (
            <Pressable
              accessibilityRole="button"
              key={x.slug}
              onPress={() =>
                router.push({
                  pathname: "/info/[slug]",
                  params: { slug: x.slug },
                })
              }
              style={s.link}
            >
              <Text style={{ fontSize: 13, color: C.ink }}>{x.label}</Text>
              <ArrowRight size={17} color={C.muted} />
            </Pressable>
          ))}
        </View>
        <View style={s.note}>
          <Mark size={29} />
          <Text
            style={[
              ui.h2,
              { fontSize: 22, textAlign: "center", marginTop: 18 },
            ]}
          >
            Made for a life in motion.
          </Text>
          <Text style={[ui.small, { textAlign: "center", marginTop: 12 }]}>
            AVEN 1.0 · Independent shopping preview{`\n`}Demo checkout. No real
            charges or orders.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  stats: {
    flexDirection: "row",
    marginHorizontal: 22,
    backgroundColor: C.cream,
    padding: 25,
  },
  stat: { flex: 1, alignItems: "center", gap: 10 },
  number: { fontSize: 25, color: C.ink },
  link: {
    paddingVertical: 21,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  note: {
    padding: 30,
    alignItems: "center",
    backgroundColor: C.cream,
    marginTop: 15,
    marginBottom: 25,
  },
});
