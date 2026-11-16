import { useState } from "react";
import { Text } from "react-native";
import { Page, Field, Notice, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useCustomer } from "../../store/customer";
import { validateProfile } from "../../data/customer";
export default function Profile() {
  const { data, update } = useCustomer();
  const [form, setForm] = useState({ ...data.profile }),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [saved, setSaved] = useState(false);
  return (
    <Page
      title="A little more you."
      intro="Your details, ready for your next visit."
      testID="profile-screen"
    >
      <Notice>
        Saved only on this device. Use sample details for this preview; no
        account or verification email is created.
      </Notice>
      {(
        [
          ["firstName", "First name"],
          ["lastName", "Last name"],
          ["email", "Email address"],
          ["phone", "Phone number"],
        ] as const
      ).map(([key, label]) => (
        <Field
          key={key}
          label={label}
          optional={key === "phone"}
          keyboardType={
            key === "email"
              ? "email-address"
              : key === "phone"
                ? "phone-pad"
                : "default"
          }
          value={form[key]}
          error={errors[key]}
          onChange={(value) => {
            setForm({ ...form, [key]: value });
            setSaved(false);
            setErrors({ ...errors, [key]: "" });
          }}
        />
      ))}
      <Button
        onPress={() => {
          const e = validateProfile(form);
          setErrors(e);
          if (!Object.keys(e).length) {
            update((old) => ({ ...old, profile: form }));
            setSaved(true);
          }
        }}
      >
        Save profile
      </Button>
      {saved && (
        <Text accessibilityRole="alert" style={a.success}>
          Your profile is saved on this device.
        </Text>
      )}
    </Page>
  );
}
