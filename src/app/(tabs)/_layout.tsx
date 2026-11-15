import { Tabs } from "expo-router/js-tabs";
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingBag,
  UserRound,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "../../store/store";
import { C } from "../../ui/theme";
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { count } = useStore();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "none",
        tabBarActiveTintColor: C.ink,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: {
          height: 62 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: C.line,
          backgroundColor: "#fff",
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 10, marginTop: 4 },
        tabBarBadgeStyle: {
          backgroundColor: C.ink,
          color: C.white,
          fontSize: 9,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Home color={color} size={21} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => (
            <LayoutGrid color={color} size={21} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => (
            <Heart color={color} size={21} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="bag"
        options={{
          title: "Bag",
          tabBarBadge: count || undefined,
          tabBarIcon: ({ color }) => (
            <ShoppingBag color={color} size={21} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: "You",
          tabBarIcon: ({ color }) => (
            <UserRound color={color} size={21} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}
