import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import {
  ArrowUpRight,
  ChevronRight,
  Heart,
  ShoppingBag,
  Truck,
  Ruler,
  BookOpen,
  Info,
  ShieldCheck,
} from "lucide-react-native";
import { Row } from "../../ui/account";
import { useCustomer } from "../../store/customer";
import { Header, Mark } from "../../ui/components";
import { C, ui } from "../../ui/theme";
import { useStore } from "../../store/store";
const links = [
  {
    label: "Shipping & returns",
    detail: "From our doorstep to yours",
    slug: "shipping-returns",
    icon: Truck,
  },
  {
    label: "Find your fit",
    detail: "A little guidance, a better fit",
    slug: "size-guide",
    icon: Ruler,
  },
  {
    label: "Our story",
    detail: "Get to know AVEN",
    slug: "our-story",
    icon: BookOpen,
  },
];
export default function You() {
  const { favorites, count } = useStore();
  const { data } = useCustomer();
  return (
    <View testID="you-screen" style={ui.screen}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >
        <View style={s.intro}>
          <Text style={ui.eyebrow}>YOUR EVERYDAY, TOGETHER</Text>
          <Text style={s.title}>Make yourself{`\n`}at home.</Text>
          <Text style={[ui.body, { marginTop: 12 }]}>
            Your favorites, little essentials,{`\n`}and a little help along the
            way.
          </Text>
        </View>
        <View style={{ marginHorizontal: 22, marginBottom: 24 }}>
          <Row
            title={
              data.profile.firstName
                ? `Hello, ${data.profile.firstName}`
                : "Your account & profile"
            }
            subtitle="A local profile, made yours"
            onPress={() => router.push("/account")}
          />
          <Row
            title="My orders"
            subtitle="Demo purchases, tracking & returns"
            onPress={() => router.push("/account/orders")}
          />
          <Row
            title="Saved addresses"
            subtitle={`${data.addresses.length} saved places`}
            onPress={() => router.push("/account/addresses")}
          />
          <Row
            title="Preferences & alerts"
            subtitle="Delivery region, stock alerts and offers"
            onPress={() => router.push("/account/preferences")}
          />
          <Row
            title="AVEN Circle"
            subtitle="Preview rewards for your everyday"
            onPress={() => router.push("/account/rewards")}
          />
          <Row
            title="Recently viewed"
            subtitle="Take another look"
            onPress={() => router.push("/account/recent")}
          />
          <Row
            title="Help & support"
            subtitle="FAQs and support drafts"
            onPress={() => router.push("/account/support")}
          />
        </View>
        <View style={s.stats}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open saved favorites"
            style={({ pressed }) => [s.stat, pressed && s.pressed]}
            onPress={() => router.navigate("/(tabs)/saved")}
          >
            <View style={ui.row}>
              <Heart size={21} color={C.ink} strokeWidth={1.4} />
              <ArrowUpRight size={16} color={C.muted} />
            </View>
            <Text style={s.number}>
              {String(favorites.length).padStart(2, "0")}
            </Text>
            <Text style={s.statLabel}>Saved favorites</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open your bag"
            style={({ pressed }) => [s.stat, pressed && s.pressed]}
            onPress={() => router.navigate("/(tabs)/bag")}
          >
            <View style={ui.row}>
              <ShoppingBag size={21} color={C.ink} strokeWidth={1.4} />
              <ArrowUpRight size={16} color={C.muted} />
            </View>
            <Text style={s.number}>{String(count).padStart(2, "0")}</Text>
            <Text style={s.statLabel}>In your bag</Text>
          </Pressable>
        </View>
        <View style={s.help}>
          <Text style={[ui.eyebrow, { marginBottom: 14 }]}>HERE TO HELP</Text>
          {links.map(({ label, detail, slug, icon: Icon }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={label}
              key={slug}
              onPress={() =>
                router.push({ pathname: "/info/[slug]", params: { slug } })
              }
              style={({ pressed }) => [s.link, pressed && s.pressed]}
            >
              <View style={s.linkIcon}>
                <Icon size={20} color={C.ink} strokeWidth={1.3} />
              </View>
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={s.linkLabel}>{label}</Text>
                <Text style={ui.small}>{detail}</Text>
              </View>
              <ChevronRight size={17} color={C.muted} />
            </Pressable>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Explore the everyday collection"
          onPress={() => router.navigate("/(tabs)/shop")}
          style={({ pressed }) => [s.explore, pressed && { opacity: 0.9 }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={s.exploreEyebrow}>A LITTLE INSPIRATION</Text>
            <Text style={s.exploreTitle}>
              Find your next{`\n`}everyday favorite.
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 17,
              }}
            >
              <Text style={s.exploreLink}>Explore the collection</Text>
              <ArrowUpRight size={16} color={C.white} />
            </View>
          </View>
          <Mark size={58} color="#a6b3a0" />
        </Pressable>
        <View style={s.about}>
          {[
            { label: "About AVEN", slug: "about", icon: Info },
            { label: "Privacy", slug: "privacy", icon: ShieldCheck },
          ].map(({ label, slug, icon: Icon }) => (
            <Pressable
              accessibilityRole="button"
              key={slug}
              onPress={() =>
                router.push({ pathname: "/info/[slug]", params: { slug } })
              }
              style={s.aboutLink}
            >
              <Icon size={15} color={C.muted} strokeWidth={1.4} />
              <Text style={ui.small}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={s.footnote}>AVEN 1.0 · Made for a life in motion.</Text>
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  content: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingBottom: 24,
  },
  intro: { paddingHorizontal: 22, paddingTop: 27, paddingBottom: 25 },
  title: {
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.3,
    color: C.ink,
    marginTop: 14,
  },
  stats: { flexDirection: "row", gap: 12, marginHorizontal: 22 },
  stat: {
    flex: 1,
    backgroundColor: C.cream,
    borderWidth: 1,
    borderColor: C.line,
    padding: 17,
  },
  number: {
    fontSize: 31,
    lineHeight: 39,
    letterSpacing: -1,
    color: C.ink,
    marginTop: 20,
  },
  statLabel: { fontSize: 11, color: C.muted, marginTop: 3 },
  help: { paddingHorizontal: 22, paddingTop: 30 },
  link: {
    minHeight: 78,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  linkIcon: { width: 35, alignItems: "flex-start" },
  linkLabel: { fontSize: 13, color: C.ink },
  pressed: { opacity: 0.6 },
  explore: {
    marginHorizontal: 22,
    marginTop: 28,
    backgroundColor: C.ink,
    padding: 23,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exploreEyebrow: { fontSize: 8, letterSpacing: 1.5, color: "#c5cebd" },
  exploreTitle: {
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.5,
    color: C.white,
    marginTop: 12,
  },
  exploreLink: { fontSize: 11, color: C.white },
  about: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    paddingTop: 20,
  },
  aboutLink: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  footnote: {
    fontSize: 9,
    color: C.muted,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 6,
  },
});
