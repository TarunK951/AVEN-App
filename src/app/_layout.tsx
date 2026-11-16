import { View, Text } from "react-native";
import { type ErrorBoundaryProps } from "expo-router";
import { Button, Mark } from "../ui/components";
import { C, ui } from "../ui/theme";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CustomerProvider } from "../store/customer";
import { StoreProvider } from "../store/store";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CustomerProvider>
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
      </CustomerProvider>
    </SafeAreaProvider>
  );
}

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.white,
        justifyContent: "center",
        padding: 28,
        gap: 24,
      }}
    >
      <Mark size={36} />
      <Text style={ui.title}>A little pause.</Text>
      <Text style={ui.body}>
        Something interrupted this screen. Your saved profile, addresses and
        shopping history stay on this device. Try loading the screen again.
      </Text>
      <Button
        onPress={() => {
          void retry();
        }}
      >
        Try again
      </Button>
    </View>
  );
}
