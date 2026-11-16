import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Header, Button, Mark } from "../../ui/components";
import { C, ui } from "../../ui/theme";
import { images } from "../../data/images";
import { products } from "../../data/catalog";
import { useCustomer } from "../../store/customer";
import { Row } from "../../ui/account";
import ProductCard from "../../ui/ProductCard";
export default function Home() {
  const { data: customer } = useCustomer();
  const preferredGender = products.find(
    (p) => p.id === customer.viewed[0],
  )?.gender;
  const recommendations = products
    .filter(
      (p) => p.gender === preferredGender && !customer.viewed.includes(p.id),
    )
    .slice(0, 4);
  return (
    <View testID="home-screen" style={ui.screen}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.announcement}>
          <Text style={s.announcementText}>
            A little extra comfort. Free standard shipping $75+
          </Text>
          <ArrowRight size={11} color={C.ink} />
        </View>
        <View style={s.hero}>
          <Image
            source={images["meta-mobile"]}
            contentFit="cover"
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: "#12271d2b" }]}
          />
          <View style={s.heroCopy}>
            <Text style={[ui.eyebrow, { color: "#fff", fontSize: 8 }]}>
              THE EVERYDAY COLLECTION
            </Text>
            <Text style={s.heroTitle}>A life{`\n`}in motion.</Text>
            <Text style={s.heroSub}>Made for wherever the day takes you.</Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 26 }}>
              <Button
                light
                style={{ flex: 1, paddingHorizontal: 12, gap: 6 }}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/shop",
                    params: { department: "Women" },
                  })
                }
              >
                Shop Women
              </Button>
              <Button
                light
                style={{ flex: 1, paddingHorizontal: 12, gap: 6 }}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/shop",
                    params: { department: "Men" },
                  })
                }
              >
                Shop Men
              </Button>
            </View>
          </View>
        </View>
        <View style={s.note}>
          <Mark size={18} />
          <Text style={s.noteText}>
            Inspired by the coast. Built for the everyday.
          </Text>
        </View>
        <View style={ui.section}>
          <View style={ui.row}>
            <View>
              <Text style={ui.eyebrow}>A FRESH PERSPECTIVE</Text>
              <Text style={[ui.h2, { marginTop: 12 }]}>
                Your next favorites.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Shop all new arrivals"
              onPress={() => router.push("/(tabs)/shop")}
              style={ui.iconButton}
            >
              <ArrowRight color={C.ink} size={21} />
            </Pressable>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 22,
            gap: 13,
            paddingBottom: 30,
          }}
        >
          {products
            .filter((p) => [0, 2, 4, 5].includes(p.id))
            .map((p) => (
              <ProductCard key={p.id} product={p} width={175} />
            ))}
        </ScrollView>
        <View style={s.campaign}>
          <Image
            source={images["gift-mobile"]}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: "#18291d40" }]}
          />
          <View style={s.campaignCopy}>
            <Text style={[ui.eyebrow, { color: C.white, fontSize: 8 }]}>
              THE SEASON OF GIVING
            </Text>
            <Text style={s.campaignTitle}>
              Good things.{`\n`}Great company.
            </Text>
            <Text style={s.heroSub}>A little warmth goes a long way.</Text>
            <Button
              light
              style={{ marginTop: 25, alignSelf: "flex-start" }}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/shop",
                  params: { collection: "gifts" },
                })
              }
            >
              Explore the gift edit
            </Button>
          </View>
        </View>
        <View style={ui.section}>
          <Text style={ui.eyebrow}>MORE WAYS TO FEEL GOOD</Text>
          <Text style={[ui.h2, { marginTop: 12 }]}>
            For every version of you.
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 22,
            gap: 15,
            paddingBottom: 35,
          }}
        >
          {[
            {
              image: "fleece",
              title: "The softer side.",
              label: "Fleece favorites",
              slug: "fleece",
            },
            {
              image: "outerwear",
              title: "Take the outside route.",
              label: "New outerwear",
              slug: "outerwear",
            },
            {
              image: "dream",
              title: "Your comfort zone.",
              label: "Everyday comfort",
              slug: "dreamknit",
            },
          ].map((x) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={x.label}
              key={x.image}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/shop",
                  params: { collection: x.slug },
                })
              }
              style={{ width: 235 }}
            >
              <Image
                source={images[x.image]}
                style={{ width: 235, height: 310 }}
                contentFit="cover"
              />
              <Text style={[ui.eyebrow, { marginTop: 17, fontSize: 7 }]}>
                {x.label.toUpperCase()}
              </Text>
              <Text style={[ui.h2, { fontSize: 21, marginTop: 7 }]}>
                {x.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        {recommendations.length > 0 && (
          <View style={ui.section}>
            <Text style={ui.eyebrow}>INSPIRED BY YOUR BROWSING</Text>
            <Text style={[ui.h2, { marginTop: 12, marginBottom: 20 }]}>
              A few more you might love.
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 13 }}
            >
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} width={160} />
              ))}
            </ScrollView>
          </View>
        )}
        {customer.viewed.length > 0 && (
          <View style={ui.section}>
            <Row
              title="Recently viewed"
              subtitle="A second look at the pieces you loved"
              onPress={() => router.push("/account/recent")}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 13, paddingTop: 20 }}
            >
              {customer.viewed.slice(0, 5).map((id) => (
                <ProductCard
                  key={id}
                  product={products.find((p) => p.id === id)!}
                  width={160}
                />
              ))}
            </ScrollView>
          </View>
        )}
        <View style={s.story}>
          <Mark size={30} />
          <Text style={[ui.h2, { marginTop: 20, textAlign: "center" }]}>
            More than what you wear.{`\n`}How you feel.
          </Text>
          <Text style={[ui.body, { textAlign: "center", marginTop: 18 }]}>
            Versatile essentials for the morning movement, the long way home,
            and everything in between.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Read our story"
            onPress={() =>
              router.push({
                pathname: "/info/[slug]",
                params: { slug: "our-story" },
              })
            }
          >
            <Text style={[ui.link, { marginTop: 22 }]}>Get to know AVEN</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  announcement: {
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 11,
    flexDirection: "row",
  },
  announcementText: { fontSize: 10, color: C.muted, flexShrink: 1 },
  hero: { height: 550, position: "relative" },
  heroCopy: { position: "absolute", bottom: 38, left: 24, right: 24 },
  heroTitle: {
    color: "#fff",
    fontSize: 50,
    lineHeight: 52,
    letterSpacing: -2,
    marginTop: 16,
  },
  heroSub: { color: "#fff", fontSize: 12, lineHeight: 21, marginTop: 16 },
  note: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 11,
    backgroundColor: C.cream,
  },
  noteText: { fontSize: 10, color: C.muted, flexShrink: 1, lineHeight: 16 },
  campaign: { height: 460, position: "relative" },
  campaignCopy: { position: "absolute", left: 25, right: 25, bottom: 35 },
  campaignTitle: {
    fontSize: 37,
    lineHeight: 41,
    letterSpacing: -1.3,
    color: C.white,
    marginTop: 16,
  },
  story: {
    padding: 35,
    alignItems: "center",
    backgroundColor: C.cream,
    paddingBottom: 45,
  },
});
