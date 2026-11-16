import { Text, View } from "react-native";
import { router } from "expo-router";
import { UserRound } from "lucide-react-native";
import { Page, Row, Notice, a } from "../../ui/account";
import { C, ui } from "../../ui/theme";
import { useCustomer } from "../../store/customer";
export default function Account() {
  const { data } = useCustomer();
  return (
    <Page
      title={
        data.profile.firstName
          ? `Hello, ${data.profile.firstName}.`
          : "Your everyday, together."
      }
      intro="A little space for the things that matter."
      testID="account-screen"
    >
      <View style={a.card}>
        <UserRound size={25} color={C.ink} />
        <Text style={ui.h2}>
          {data.profile.firstName
            ? `${data.profile.firstName} ${data.profile.lastName}`
            : "Make it yours"}
        </Text>
        <Text style={ui.small}>
          {data.profile.email || "Your details, ready for your next visit."}
        </Text>
      </View>

      <View>
        <Row
          title="Edit profile"
          subtitle="Your name and contact details"
          onPress={() => router.push("/account/profile")}
        />
        <Row
          title="Saved addresses"
          subtitle={`${data.addresses.length} ${data.addresses.length === 1 ? "address" : "addresses"} · Choose a default for checkout`}
          onPress={() => router.push("/account/addresses")}
        />
        <Row
          title="My orders"
          subtitle="Purchases, tracking and returns"
          onPress={() => router.push("/account/orders")}
        />
        <Row
          title="Preferences & alerts"
          subtitle="Delivery region and notification preferences"
          onPress={() => router.push("/account/preferences")}
        />
        <Row
          title="Activity"
          subtitle="Order updates and stock alerts"
          onPress={() => router.push("/account/activity")}
        />
        <Row
          title="AVEN Circle"
          subtitle="A little something for your everyday"
          onPress={() => router.push("/account/rewards")}
        />
        <Row
          title="Recently viewed"
          subtitle="Pick up where you left off"
          onPress={() => router.push("/account/recent")}
        />
        <Row
          title="Help & support"
          subtitle="FAQs and  messages"
          onPress={() => router.push("/account/support")}
        />
      </View>
    </Page>
  );
}
