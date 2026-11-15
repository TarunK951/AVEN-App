import { View } from "react-native";
import { Header, Empty } from "../ui/components";
import { ui } from "../ui/theme";
export default function NotFound() {
  return (
    <View style={ui.screen}>
      <Header back />
      <Empty
        title="This page wandered off."
        body="Let’s find you something good."
      />
    </View>
  );
}
