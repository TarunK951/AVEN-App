import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { Page, Field, Choice, Notice, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useCustomer } from "../../store/customer";
import {
  blankAddress,
  validateAddress,
  type Address,
} from "../../data/address";
import { type SavedAddress } from "../../data/customer";
import { countries } from "../../data/totals";
import { C, ui } from "../../ui/theme";
export default function Addresses() {
  const { data, update } = useCustomer(),
    { select } = useLocalSearchParams<{ select?: string }>();
  const [form, setForm] = useState<SavedAddress | null>(null),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [message, setMessage] = useState(""),
    [removed, setRemoved] = useState<SavedAddress | null>(null);
  function save() {
    if (!form) return;
    const e = validateAddress(form);
    if (!form.label.trim()) e.label = "Give this address a name.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const next = { ...form, id: form.id || `ADDR-${Date.now()}` };
    update((old) => ({
      ...old,
      addresses: old.addresses.some((x) => x.id === next.id)
        ? old.addresses.map((x) => (x.id === next.id ? next : x))
        : [...old.addresses, next],
      defaultAddressId: old.defaultAddressId || next.id,
    }));
    setForm(null);
    setMessage("Address saved on this device.");
  }
  return (
    <Page
      title="Your familiar places."
      intro="Save a home for your next favorites."
      testID="addresses-screen"
    >
      <Notice>
        Addresses are stored locally when you tap Save address. No delivery or
        online account is created.
      </Notice>
      {!!message && (
        <Text accessibilityRole="alert" style={a.success}>
          {message}
        </Text>
      )}
      {removed && (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            update((old) => ({
              ...old,
              addresses: [...old.addresses, removed],
              defaultAddressId: old.defaultAddressId || removed.id,
            }));
            setRemoved(null);
            setMessage("Address restored.");
          }}
        >
          <Text style={a.link}>Undo address removal</Text>
        </Pressable>
      )}
      {!form ? (
        <>
          {data.addresses.length === 0 && (
            <View style={a.card}>
              <MapPin size={27} color={C.ink} />
              <Text style={ui.h2}>A place to start.</Text>
              <Text style={ui.body}>
                Add an address to make your next demo checkout a little easier.
              </Text>
            </View>
          )}
          {data.addresses.map((x) => (
            <View key={x.id} style={a.card}>
              <View style={ui.row}>
                <Text style={a.label}>{x.label}</Text>
                {data.defaultAddressId === x.id && (
                  <Text style={ui.eyebrow}>DEFAULT</Text>
                )}
              </View>
              <Text style={ui.body}>
                {x.firstName} {x.lastName}
                {"\n"}
                {x.street}
                {x.apartment ? `, ${x.apartment}` : ""}
                {"\n"}
                {x.city}, {x.region} {x.postal}
                {"\n"}
                {x.country}
              </Text>
              <View style={a.wrap}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${x.label}`}
                  onPress={() => {
                    setForm({ ...x });
                    setErrors({});
                    setMessage("");
                  }}
                >
                  <Text style={a.link}>Edit</Text>
                </Pressable>
                {data.defaultAddressId !== x.id && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Make ${x.label} default`}
                    onPress={() =>
                      update((old) => ({ ...old, defaultAddressId: x.id }))
                    }
                  >
                    <Text style={a.link}>Make default</Text>
                  </Pressable>
                )}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${x.label}`}
                  onPress={() => {
                    setRemoved(x);
                    update((old) => ({
                      ...old,
                      addresses: old.addresses.filter((a) => a.id !== x.id),
                      defaultAddressId:
                        old.defaultAddressId === x.id
                          ? (old.addresses.find((a) => a.id !== x.id)?.id ?? "")
                          : old.defaultAddressId,
                    }));
                    setMessage("Address removed. You can undo this below.");
                  }}
                >
                  <Text style={a.link}>Remove</Text>
                </Pressable>
              </View>
              {!!select && (
                <Button
                  onPress={() => {
                    update((old) => ({ ...old, defaultAddressId: x.id }));
                    router.back();
                  }}
                >
                  Use for checkout
                </Button>
              )}
            </View>
          ))}
          <Button
            onPress={() => {
              setForm({ ...blankAddress, id: "", label: "Home" });
              setErrors({});
              setMessage("");
            }}
          >
            Add address
          </Button>
        </>
      ) : (
        <>
          <Field
            label="Address label"
            value={form.label}
            error={errors.label}
            onChange={(v) => setForm({ ...form, label: v })}
          />
          {(
            [
              ["firstName", "First name"],
              ["lastName", "Last name"],
              ["street", "Street address"],
              ["apartment", "Apartment, suite, etc."],
              ["city", "City"],
              ["region", "State / region"],
              ["postal", "ZIP / postal code"],
            ] as [keyof Address, string][]
          ).map(([key, label]) => (
            <Field
              key={key}
              label={label}
              value={form[key]}
              optional={key === "apartment"}
              error={errors[key]}
              onChange={(v) => {
                setForm({ ...form, [key]: v });
                setErrors({ ...errors, [key]: "" });
              }}
            />
          ))}
          <Text style={ui.label}>Country / region</Text>
          <View style={a.wrap}>
            {countries.map((c) => (
              <Choice
                key={c}
                label={c}
                selected={form.country === c}
                onPress={() => setForm({ ...form, country: c })}
              />
            ))}
          </View>
          <Button onPress={save}>Save address</Button>
          <Pressable accessibilityRole="button" onPress={() => setForm(null)}>
            <Text style={a.link}>Cancel editing</Text>
          </Pressable>
        </>
      )}
    </Page>
  );
}
