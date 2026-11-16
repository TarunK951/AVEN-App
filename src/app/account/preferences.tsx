import { Text, View } from "react-native";
import { Page, Choice, Toggle, Notice, a } from "../../ui/account";
import { useCustomer } from "../../store/customer";
import { countries, checkoutTotals, money } from "../../data/totals";
import { products } from "../../data/catalog";
import { ui } from "../../ui/theme";
export default function Preferences() {
  const { data, update } = useCustomer(),
    p = data.preferences;
  return (
    <Page
      title="Your kind of everyday."
      intro="A few little preferences, made yours."
      testID="preferences-screen"
    >
      <View>
        {(
          [
            [
              "orderUpdates",
              "Order updates",
              "Keep order updates in your activity.",
            ],
            [
              "backInStock",
              "Back-in-stock alerts",
              "Keep track of the pieces you love.",
            ],
            [
              "offers",
              "New arrivals & offers",
              "Remember your preference for future collections.",
            ],
          ] as const
        ).map(([key, label, description]) => (
          <Toggle
            key={key}
            label={label}
            description={description}
            value={p[key]}
            onChange={(value) =>
              update((old) => ({
                ...old,
                preferences: { ...old.preferences, [key]: value },
              }))
            }
          />
        ))}
      </View>
      <Text style={ui.eyebrow}>DELIVERY REGION</Text>
      <View style={a.wrap}>
        {countries.map((c) => (
          <Choice
            key={c}
            label={c}
            selected={p.country === c}
            onPress={() =>
              update((old) => ({
                ...old,
                preferences: { ...old.preferences, country: c },
              }))
            }
          />
        ))}
      </View>

      <View style={a.card}>
        <Text style={ui.h2}>Delivery options</Text>
        <Text style={ui.body}>
          {p.country}
          {"\n"}For a $128 bag: standard{" "}
          {money(checkoutTotals(12800, "standard", p.country, false).shipping)},
          express{" "}
          {money(checkoutTotals(12800, "express", p.country, false).shipping)}.
          Estimated 4–7 / 2–3 business days.
        </Text>
      </View>
      <Text style={ui.eyebrow}>SAVED STOCK ALERTS</Text>
      {data.alerts.length ? (
        data.alerts.map((id) => (
          <View style={a.card} key={id}>
            <Text style={a.label}>
              {products.find((p) => p.id === id)?.name}
            </Text>
            <Text style={ui.small}>Alert saved</Text>
            <Choice
              label="Remove alert"
              selected={false}
              onPress={() =>
                update((old) => ({
                  ...old,
                  alerts: old.alerts.filter((x) => x !== id),
                }))
              }
            />
          </View>
        ))
      ) : (
        <Text style={ui.body}>
          No alerts yet. Open a product to save a stock alert.
        </Text>
      )}
    </Page>
  );
}
