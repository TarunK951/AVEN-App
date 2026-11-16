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
          {data.profile.email ||
            "Create a local profile to personalize your AVEN preview."}
        </Text>
      </View>
      <Notice>
        Local profile · No sign-in or online account. Details stay on this
        device.
      </Notice>
      <View>
        <Row
          title="Edit profile"
          subtitle="Your name and contact details"
          onPress={() => router.push("/account/profile")}
        />
        <Row
          title="Saved addresses"
          subtitle={`${data.addresses.length} addresses · Choose a default for checkout`}
          onPress={() => router.push("/account/addresses")}
        />
        <Row
          title="My orders"
          subtitle="Demo purchases, tracking and returns"
          onPress={() => router.push("/account/orders")}
        />
        <Row
          title="Preferences & alerts"
          subtitle="Delivery region and local notification preferences"
          onPress={() => router.push("/account/preferences")}
        />
        <Row
          title="Activity"
          subtitle="Local order updates and stock alerts"
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
          subtitle="FAQs and local support drafts"
          onPress={() => router.push("/account/support")}
        />
      </View>
    </Page>
  );
}
