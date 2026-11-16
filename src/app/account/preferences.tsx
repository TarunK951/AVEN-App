import { useState } from "react";
import { Text, View } from "react-native";
import { Page, Choice, Toggle, Notice, a } from "../../ui/account";
import { useCustomer } from "../../store/customer";
import { countries, checkoutTotals, money } from "../../data/totals";
import { products } from "../../data/catalog";
import { ui } from "../../ui/theme";
export default function Preferences() {
  const { data, update } = useCustomer(),
    p = data.preferences;
  const [currency, setCurrency] = useState("USD");
  return (
    <Page
      title="Your kind of everyday."
      intro="A few little preferences, made yours."
      testID="preferences-screen"
    >
      <Notice>
        Local preferences only. These switches do not request device permissions
        or send push notifications.
      </Notice>
      <View>
        {(
          [
            [
              "orderUpdates",
              "Order updates",
              "Keep demo order updates in your local activity.",
            ],
            [
              "backInStock",
              "Back-in-stock alerts",
              "Save product alert requests on this device.",
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
      <Notice>
        All catalog and checkout prices remain in USD. Shipping rates are demo
        estimates; no postcode serviceability or taxes are verified.
      </Notice>
      <View style={a.card}>
        <Text style={ui.h2}>Delivery preview</Text>
        <Text style={ui.body}>
          {p.country}
          {"\n"}For a $128 bag: standard{" "}
          {money(checkoutTotals(12800, "standard", p.country, false).shipping)},
          express{" "}
          {money(checkoutTotals(12800, "express", p.country, false).shipping)}.
          Estimated 4–7 / 2–3 business days.
        </Text>
      </View>
      <Text style={ui.eyebrow}>CURRENCY ESTIMATE</Text>
      <View style={a.wrap}>
        {["USD", "INR", "GBP", "CAD", "AUD"].map((c) => (
          <Choice
            key={c}
            label={c}
            selected={currency === c}
            onPress={() => setCurrency(c)}
          />
        ))}
      </View>
      <View style={a.card}>
        <Text style={a.label}>
          A $128 piece ≈{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
          }).format(
            128 *
              ({ USD: 1, INR: 83, GBP: 0.79, CAD: 1.36, AUD: 1.52 }[currency] ??
                1),
          )}
        </Text>
        <Text style={ui.small}>
          Illustrative fixed conversion only, not a current exchange quote.
          Catalog, orders and checkout remain USD. This estimate is not used for
          charges.
        </Text>
      </View>
      <Text style={ui.eyebrow}>SAVED STOCK ALERTS</Text>
      {data.alerts.length ? (
        data.alerts.map((id) => (
          <View style={a.card} key={id}>
            <Text style={a.label}>
              {products.find((p) => p.id === id)?.name}
            </Text>
            <Text style={ui.small}>
              Request saved locally · No live inventory monitoring.
            </Text>
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
