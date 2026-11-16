import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  ShoppingBag,
} from "lucide-react-native";
import { useStore } from "../store/store";
import { C, ui } from "./theme";
export function Mark({
  color = C.ink,
  size = 26,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="M4 26 14.5 5h3L28 26h-5L16 11 9 26H4Z M10.5 23l5.5-8 5.5 8H10.5Z"
        fill={color}
      />
    </Svg>
  );
}
export function Brand() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
      <Mark size={23} />
      <Text
        style={{
          fontSize: 25,
          letterSpacing: 3.5,
          color: C.ink,
          fontWeight: "500",
        }}
      >
        AVEN
      </Text>
    </View>
  );
}
export function Header({
  title,
  back = false,
  onBack,
  search = true,
}: {
  title?: string;
  back?: boolean;
  onBack?: () => void;
  search?: boolean;
}) {
  const { count } = useStore();
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ backgroundColor: C.white, flexShrink: 0 }}
    >
      <View style={s.header}>
        <View style={{ width: 42 }}>
          {back ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={ui.iconButton}
              onPress={
                onBack ??
                (() =>
                  router.canGoBack()
                    ? router.back()
                    : router.replace("/(tabs)"))
              }
            >
              <ArrowLeft color={C.ink} size={21} />
            </Pressable>
          ) : null}
        </View>
        {title ? (
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              color: C.ink,
              flexShrink: 1,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="AVEN Home"
            onPress={() => router.navigate("/(tabs)")}
          >
            <Brand />
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
          style={ui.iconButton}
          onPress={() => router.navigate("/(tabs)/bag")}
        >
          <ShoppingBag color={C.ink} size={21} />
          {count > 0 && (
            <View style={s.count}>
              <Text style={{ color: C.white, fontSize: 8 }}>{count}</Text>
            </View>
          )}
        </Pressable>
      </View>
      {search && (
        <View style={s.searchWrap}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search products"
            onPress={() => router.push("/search")}
            style={({ pressed }) => [s.searchBar, pressed && { opacity: 0.7 }]}
          >
            <Search size={18} color={C.muted} strokeWidth={1.5} />
            <Text style={s.searchText}>Search your everyday essentials</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
export function Button({
  children,
  onPress,
  disabled = false,
  light = false,
  style,
}: {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  light?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        ui.button,
        light && ui.lightButton,
        disabled && ui.disabled,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      <Text style={[ui.buttonText, light && ui.lightButtonText]}>
        {children}
      </Text>
      <ArrowRight size={17} color={light ? C.ink : C.white} />
    </Pressable>
  );
}
export function Empty({
  title,
  body,
  button = "Explore new arrivals",
  onPress,
}: {
  title: string;
  body: string;
  button?: string;
  onPress?: () => void;
}) {
  return (
    <View style={ui.center}>
      <Mark size={37} />
      <Text style={[ui.h2, { textAlign: "center" }]}>{title}</Text>
      <Text style={[ui.body, { textAlign: "center" }]}>{body}</Text>
      <Button onPress={onPress ?? (() => router.navigate("/(tabs)/shop"))}>
        {button}
      </Button>
    </View>
  );
}
const s = StyleSheet.create({
  header: {
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#ededee",
  },
  searchWrap: { paddingHorizontal: 20, paddingBottom: 14, paddingTop: 10 },
  searchBar: {
    minHeight: 46,
    backgroundColor: C.cream,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: C.line,
  },
  searchText: { fontSize: 12, color: C.muted, flexShrink: 1 },
  count: {
    position: "absolute",
    top: 2,
    right: 1,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 10,
    backgroundColor: C.ink,
    alignItems: "center",
    justifyContent: "center",
  },
});
