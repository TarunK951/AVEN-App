import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "../store/store";
export default function RootLayout() {
  return (
    <SafeAreaProvider>

      <StoreProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#fff" },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="search" options={{ presentation: "modal" }} />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="confirmation" />
          <Stack.Screen name="info/[slug]" />
        </Stack>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
