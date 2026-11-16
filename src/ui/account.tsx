import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
  type KeyboardTypeOptions,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Header } from "./components";
import { useCustomer } from "../store/customer";
import { C, ui } from "./theme";
import { type ReactNode } from "react";
export function Page({
  title,
  eyebrow = "YOUR AVEN",
  intro,
  children,
  testID,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  children: ReactNode;
  testID?: string;
}) {
  const { storageError } = useCustomer();
  return (
    <View testID={testID} style={ui.screen}>
      <Header back />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
        contentContainerStyle={a.content}
      >
        <Text style={ui.eyebrow}>{eyebrow}</Text>
        <Text style={[ui.title, { marginTop: 14 }]}>{title}</Text>
        {!!intro && <Text style={[ui.body, { marginTop: 12 }]}>{intro}</Text>}
        {storageError && (
          <Text style={ui.error}>
            Device storage is unavailable. Changes last for this session only.
          </Text>
        )}
        <View style={{ marginTop: 26, gap: 18 }}>{children}</View>
      </ScrollView>
    </View>
  );
}
export function Field({
  label,
  value,
  onChange,
  error,
  optional = false,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  error?: string;
  optional?: boolean;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
}) {
  return (
    <View>
      <Text style={ui.label}>
        {label}
        {optional ? " (optional)" : ""}
      </Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        maxLength={multiline ? 1000 : 150}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        style={[
          ui.input,
          multiline && { minHeight: 110, textAlignVertical: "top" },
          !!error && { borderColor: C.red },
        ]}
      />
      {!!error && (
        <Text accessibilityRole="alert" style={ui.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
export function Row({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={a.row}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={a.label}>{title}</Text>
        {!!subtitle && <Text style={ui.small}>{subtitle}</Text>}
      </View>
      <ChevronRight size={18} color={C.muted} />
    </Pressable>
  );
}
export function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[ui.chip, selected && ui.chipActive]}
    >
      <Text style={[ui.chipText, selected && ui.chipActiveText]}>{label}</Text>
    </Pressable>
  );
}
export function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={[a.row, { paddingVertical: 14 }]}>
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={a.label}>{label}</Text>
        <Text style={ui.small}>{description}</Text>
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: C.line, true: C.ink }}
        thumbColor={C.white}
      />
    </View>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return <Text style={a.notice}>{children}</Text>;
}
export const a = StyleSheet.create({
  content: {
    padding: 22,
    paddingTop: 28,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  card: {
    padding: 18,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.cream,
    gap: 12,
  },
  row: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 1,
    borderColor: C.line,
    paddingVertical: 17,
  },
  label: { fontSize: 14, color: C.ink, lineHeight: 21 },
  notice: {
    backgroundColor: C.cream,
    padding: 15,
    fontSize: 11,
    lineHeight: 18,
    color: C.muted,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  link: {
    fontSize: 12,
    color: C.ink,
    textDecorationLine: "underline",
    paddingVertical: 12,
  },
  success: {
    fontSize: 12,
    lineHeight: 19,
    color: C.ink,
    padding: 15,
    backgroundColor: C.soft,
  },
});
