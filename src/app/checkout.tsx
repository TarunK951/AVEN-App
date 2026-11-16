import { useEffect, useRef, useState, type ComponentRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  BackHandler,
  Keyboard,
  type KeyboardTypeOptions,
} from "react-native";
import { router } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Check,
  ChevronDown,
  CreditCard,
  LockKeyhole,
  Truck,
  ArrowLeft,
  X,
  Plus,
  Minus,
} from "lucide-react-native";
import { Image } from "expo-image";
import { Header, Button, Empty } from "../ui/components";
import { ui, C } from "../ui/theme";
import { demoStock } from "../data/customer";
import { useCustomer } from "../store/customer";
import { Row, Notice } from "../ui/account";
import { useStore } from "../store/store";
import { products } from "../data/catalog";
import { productImage } from "../data/images";
import {
  checkoutTotals,
  countries,
  money,
  type ShippingMethod,
} from "../data/totals";
import {
  blankAddress,
  validateAddress,
  validEmail,
  type Address,
} from "../data/address";
type Errors = Record<string, string>;
function Field({
  label,
  value,
  onChange,
  error,
  optional = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
  keyboardType?: KeyboardTypeOptions;
}) {
  return (
    <View style={[ui.field, { flex: 1 }]}>
      <View style={ui.row}>
        <Text style={ui.label}>{label}</Text>
        {optional && (
          <Text style={[ui.small, { fontSize: 9, marginBottom: 9 }]}>
            Optional
          </Text>
        )}
      </View>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
        autoCorrect={false}
        maxLength={150}
        style={[
          ui.input,
          error && { borderColor: C.red, backgroundColor: "#fdf8f5" },
        ]}
      />
      {error && <Text style={ui.error}>{error}</Text>}
    </View>
  );
}
function AddressFields({
  address,
  onChange,
  errors,
  prefix = "",
}: {
  address: Address;
  onChange: (value: Address) => void;
  errors: Errors;
  prefix?: string;
}) {
  const [selectCountry, setSelectCountry] = useState(false);
  const field = (name: keyof Address, label: string, optional = false) => (
    <Field
      label={(prefix ? "Billing " : "") + label}
      value={address[name]}
      onChange={(value) => onChange({ ...address, [name]: value })}
      error={errors[prefix + name]}
      optional={optional}
    />
  );
  return (
    <>
      <View style={ui.pair}>
        {field("firstName", "First name")}
        {field("lastName", "Last name")}
      </View>
      <Text style={ui.label}>
        {prefix ? "Billing country" : "Country / region"}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          prefix ? "Select billing country" : "Select country"
        }
        onPress={() => setSelectCountry(true)}
        style={[ui.input, ui.row, { marginBottom: 18 }]}
      >
        <Text style={{ color: C.ink, fontSize: 14 }}>{address.country}</Text>
        <ChevronDown size={17} color={C.muted} />
      </Pressable>
      {field("street", "Street address")}
      {field("apartment", "Apartment, suite, etc.", true)}
      {field("city", "City")}
      <View style={ui.pair}>
        {field(
          "region",
          address.country === "United States" ? "State" : "State / province",
        )}
        {field(
          "postal",
          address.country === "United States"
            ? "ZIP code"
            : address.country === "India"
              ? "PIN code"
              : "Postal code",
        )}
      </View>
      <Modal
        visible={selectCountry}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectCountry(false)}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close country selector"
          onPress={() => setSelectCountry(false)}
          style={ui.modalBackdrop}
        >
          <View style={ui.sheet}>
            <View style={ui.row}>
              <Text style={ui.h2}>Where to?</Text>
              <X color={C.ink} size={21} />
            </View>
            {countries.map((c) => (
              <Pressable
                accessibilityRole="button"
                key={c}
                accessibilityLabel={`Choose ${c}`}
                onPress={() => {
                  onChange({ ...address, country: c, region: "", postal: "" });
                  setSelectCountry(false);
                }}
                style={[ui.row, { paddingVertical: 12 }]}
              >
                <Text style={{ color: C.ink, fontSize: 14 }}>{c}</Text>
                {address.country === c && <Check size={18} color={C.ink} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
export default function Checkout() {
  const store = useStore();
  const { data: customer } = useCustomer();
  const savedAddress = customer.addresses.find(
    (a) => a.id === customer.defaultAddressId,
  );
  const [step, setStep] = useState(1),
    [address, setAddress] = useState<Address>(
      savedAddress
        ? { ...savedAddress }
        : { ...blankAddress, country: customer.preferences.country },
    ),
    [billing, setBilling] = useState<Address>({ ...blankAddress }),
    [email, setEmail] = useState(customer.profile.email),
    [phone, setPhone] = useState(customer.profile.phone),
    [errors, setErrors] = useState<Errors>({}),
    [shipping, setShipping] = useState<ShippingMethod>("standard"),
    [demoCard, setDemoCard] = useState(false),
    [sameBilling, setSameBilling] = useState(true),
    [promo, setPromo] = useState(false),
    [promoText, setPromoText] = useState(""),
    [promoError, setPromoError] = useState(""),
    [summary, setSummary] = useState(false),
    [posting, setPosting] = useState(false),
    [simulateFailure, setSimulateFailure] = useState(false);
  const locked = useRef(false),
    scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (savedAddress) {
      setAddress({ ...savedAddress });
      setErrors({});
    }
  }, [savedAddress]);
  const totals = checkoutTotals(
      store.subtotal,
      shipping,
      address.country,
      promo,
    ),
    standard = checkoutTotals(
      store.subtotal,
      "standard",
      address.country,
      promo,
    ).shipping,
    express = checkoutTotals(
      store.subtotal,
      "express",
      address.country,
      promo,
    ).shipping;
  function clearFieldError(key: string) {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }
  function updateAddress(next: Address, isBilling = false) {
    const previous = isBilling ? billing : address;
    (Object.keys(next) as (keyof Address)[]).forEach((key) => {
      if (next[key] !== previous[key])
        clearFieldError((isBilling ? "billing-" : "") + key);
    });
    if (isBilling) setBilling(next);
    else setAddress(next);
  }
  function back() {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    } else if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/bag");
  }
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (step > 1) {
          setStep(step - 1);
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [step]);
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: true });
  }, [step]);
  function next() {
    Keyboard.dismiss();
    let validation: Errors = {};
    if (step === 1) {
      if (!validEmail(email)) validation.email = "Enter a valid email address.";
      validation = { ...validation, ...validateAddress(address) };
      if (phone.trim() && !/^\+?[\d\s().-]{8,25}$/.test(phone.trim()))
        validation.phone = "Enter a valid phone number or leave it blank.";
    }
    if (step === 3) {
      if (!demoCard) validation.payment = "Select the demo card to continue.";
      if (!sameBilling)
        validation = { ...validation, ...validateAddress(billing, "billing-") };
    }
    if (Object.keys(validation).length) {
      setErrors(validation);
      scroll.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    setErrors({});
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (simulateFailure) {
      setSimulateFailure(false);
      setErrors({
        payment:
          "Demo payment declined. Your bag is safe. Tap Place demo order again to retry.",
      });
      return;
    }
    if (locked.current) return;
    locked.current = true;
    setPosting(true);
    const receipt = store.complete(shipping, address.country, promo);
    if (receipt) router.replace("/confirmation");
    else {
      locked.current = false;
      setPosting(false);
    }
  }
  if (!store.ready)
    return (
      <View testID="checkout-screen" style={ui.screen}>
        <Header title="Checkout" back search={false} />
        <Empty
          title="Getting your bag ready…"
          body="A little comfort is on its way."
        />
      </View>
    );
  if (store.bag.some((i) => !demoStock(i.id, i.size)))
    return (
      <View style={ui.screen}>
        <Header back title="Checkout" search={false} />
        <Empty
          title="A piece needs another look."
          body="A variant in your bag is unavailable in the sample inventory. Remove it or choose another size before continuing."
          button="Review your bag"
          onPress={() => router.navigate("/(tabs)/bag")}
        />
      </View>
    );
  if (!store.bag.length && !posting)
    return (
      <View testID="checkout-screen" style={ui.screen}>
        <Header title="Checkout" back search={false} />
        <Empty
          title="Your bag is waiting."
          body="Add an everyday favorite before you head to checkout."
        />
      </View>
    );
  if (posting)
    return (
      <View testID="checkout-screen" style={ui.screen}>
        <Empty title="Finishing your demo…" body="No payment is being taken." />
      </View>
    );
  return (
    <View testID="checkout-screen" style={ui.screen}>
      <Header back onBack={back} title="Checkout" search={false} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Toggle order summary"
            accessibilityState={{ expanded: summary }}
            onPress={() => setSummary(!summary)}
            style={s.summaryToggle}
          >
            <Text style={{ fontSize: 11, color: C.ink }}>
              Order summary ({store.count}){" "}
              <ChevronDown size={13} color={C.ink} />
            </Text>
            <Text style={{ fontSize: 17, color: C.ink }}>
              {money(totals.total)}
            </Text>
          </Pressable>
          {summary && (
            <View style={s.summary}>
              {store.bag.map((item) => {
                const p = products.find((p) => p.id === item.id)!;
                return (
                  <View
                    key={`${item.id}-${item.size}`}
                    style={{ flexDirection: "row", gap: 13, marginBottom: 22 }}
                  >
                    <Image
                      source={productImage(p.id)}
                      style={{ width: 60, height: 77 }}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{ fontSize: 12, color: C.ink, lineHeight: 18 }}
                      >
                        {p.name}
                      </Text>
                      <Text style={[ui.small, { fontSize: 10, marginTop: 6 }]}>
                        {p.color} / {item.size}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 13,
                          marginTop: 8,
                        }}
                      >
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Decrease checkout quantity"
                          onPress={() => store.quantity(p.id, item.size, -1)}
                        >
                          <Minus size={14} color={C.ink} />
                        </Pressable>
                        <Text style={{ fontSize: 11, color: C.ink }}>
                          {item.quantity}
                        </Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Increase checkout quantity"
                          onPress={() => store.quantity(p.id, item.size, 1)}
                        >
                          <Plus size={14} color={C.ink} />
                        </Pressable>
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, color: C.ink }}>
                      {money(p.price * 100 * item.quantity)}
                    </Text>
                  </View>
                );
              })}
              <View style={ui.rule} />
              {promo ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Remove AVEN10 discount"
                  onPress={() => setPromo(false)}
                  style={ui.row}
                >
                  <Text style={{ fontSize: 11, color: "#60774e" }}>
                    AVEN10 · 10% off
                  </Text>
                  <X size={15} color={C.muted} />
                </Pressable>
              ) : (
                <>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <TextInput
                      accessibilityLabel="Discount code"
                      placeholder="Discount code"
                      value={promoText}
                      onChangeText={setPromoText}
                      autoCapitalize="characters"
                      style={[ui.input, { flex: 1, fontSize: 13 }]}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Apply discount"
                      onPress={() => {
                        if (promoText.trim().toUpperCase() === "AVEN10") {
                          setPromo(true);
                          setPromoError("");
                          setPromoText("");
                        } else
                          setPromoError("Try AVEN10 for 10% off in this demo.");
                      }}
                      style={[ui.chip, { justifyContent: "center" }]}
                    >
                      <Text style={ui.chipText}>Apply</Text>
                    </Pressable>
                  </View>
                  <Text
                    style={
                      promoError
                        ? ui.error
                        : [ui.small, { fontSize: 9, marginTop: 9 }]
                    }
                  >
                    {promoError || "A little welcome: try AVEN10 for 10% off."}
                  </Text>
                </>
              )}
              <View style={ui.rule} />
              {[
                ["Subtotal", money(totals.subtotal)],
                ...(promo
                  ? [["Welcome discount", "−" + money(totals.discount)]]
                  : []),
                [
                  "Shipping",
                  totals.shipping ? money(totals.shipping) : "Complimentary",
                ],
                ["Tax (demo)", money(0)],
              ].map(([label, value]) => (
                <View key={label} style={[ui.row, { marginBottom: 14 }]}>
                  <Text style={ui.small}>{label}</Text>
                  <Text style={{ fontSize: 12, color: C.ink }}>{value}</Text>
                </View>
              ))}
              <View
                style={[
                  ui.row,
                  { borderTopWidth: 1, borderColor: C.line, paddingTop: 19 },
                ]}
              >
                <Text style={{ fontSize: 17, color: C.ink }}>Total · USD</Text>
                <Text style={{ fontSize: 22, color: C.ink }}>
                  {money(totals.total)}
                </Text>
              </View>
            </View>
          )}
          <View style={{ padding: 23 }}>
            <Text style={ui.eyebrow}>THE LAST STEP TO EVERYDAY COMFORT</Text>
            <Text style={[ui.title, { fontSize: 30, marginTop: 15 }]}>
              Make yourself at home.
            </Text>
            <View style={s.progress}>
              {["Address", "Shipping", "Payment"].map((label, i) => (
                <Pressable
                  accessibilityRole="button"
                  key={label}
                  disabled={i + 1 > step}
                  accessibilityLabel={`Checkout ${label}`}
                  onPress={() => {
                    setStep(i + 1);
                    setErrors({});
                  }}
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    opacity: i + 1 > step ? 0.4 : 1,
                  }}
                >
                  <View
                    style={[
                      s.step,
                      step === i + 1 && {
                        backgroundColor: C.ink,
                        borderColor: C.ink,
                      },
                    ]}
                  >
                    {step > i + 1 ? (
                      <Check size={11} color={C.ink} />
                    ) : (
                      <Text
                        style={{
                          fontSize: 8,
                          color: step === i + 1 ? "white" : C.muted,
                        }}
                      >
                        0{i + 1}
                      </Text>
                    )}
                  </View>
                  <Text style={{ fontSize: 10, color: C.ink }}>{label}</Text>
                </Pressable>
              ))}
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                marginBottom: 25,
              }}
            >
              <LockKeyhole size={12} color={C.muted} />
              <Text style={{ fontSize: 9, color: C.muted }}>
                Demo only · No real payment or order is processed.
              </Text>
            </View>
            {step > 1 && (
              <View style={s.review}>
                <View style={ui.row}>
                  <Text style={[ui.small, { fontSize: 10, flex: 1 }]}>
                    {email}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit address"
                    onPress={() => setStep(1)}
                  >
                    <Text style={[ui.link, { fontSize: 10 }]}>Edit</Text>
                  </Pressable>
                </View>
                <Text style={[ui.small, { fontSize: 10, marginTop: 8 }]}>
                  {address.street}, {address.city}, {address.region}{" "}
                  {address.postal}, {address.country}
                </Text>
                {step === 3 && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit shipping method"
                    onPress={() => setStep(2)}
                  >
                    <Text style={[ui.link, { fontSize: 10, marginTop: 12 }]}>
                      {shipping === "standard" ? "Standard" : "Express"}{" "}
                      shipping ·{" "}
                      {totals.shipping
                        ? money(totals.shipping)
                        : "Complimentary"}{" "}
                      · Edit
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
            <Text style={[ui.h2, { fontSize: 24, marginBottom: 13 }]}>
              {step === 1
                ? "Your details"
                : step === 2
                  ? "A little closer to your doorstep."
                  : "The finishing touch."}
            </Text>
            <Text style={[ui.body, { fontSize: 11, marginBottom: 25 }]}>
              {step === 1
                ? "Where should your next favorites feel at home?"
                : step === 2
                  ? "Choose the delivery that works for you."
                  : "Preview payment with a fixed demo card. No real card details needed."}
            </Text>
            {step === 1 ? (
              <>
                <Row
                  title="Choose a saved address"
                  subtitle={
                    savedAddress
                      ? `Default: ${savedAddress.label}`
                      : "Add or select an address on this device"
                  }
                  onPress={() =>
                    router.push({
                      pathname: "/account/addresses",
                      params: { select: "checkout" },
                    })
                  }
                />
                <View style={{ height: 20 }} />
                <Field
                  label="Email address"
                  value={email}
                  onChange={(value) => {
                    setEmail(value);
                    clearFieldError("email");
                  }}
                  keyboardType="email-address"
                  error={errors.email}
                />
                <Field
                  label="Phone number"
                  value={phone}
                  onChange={(value) => {
                    setPhone(value);
                    clearFieldError("phone");
                  }}
                  keyboardType="phone-pad"
                  optional
                  error={errors.phone}
                />
                <Text style={[ui.eyebrow, { marginTop: 15, marginBottom: 20 }]}>
                  SHIPPING ADDRESS
                </Text>
                <AddressFields
                  address={address}
                  onChange={(value) => updateAddress(value)}
                  errors={errors}
                />
                <Text style={[ui.small, { fontSize: 9 }]}>
                  Contact and address details stay in this screen and aren’t
                  saved with the receipt.
                </Text>
              </>
            ) : step === 2 ? (
              <>
                {(
                  [
                    {
                      id: "standard",
                      title: "Standard shipping",
                      days:
                        address.country === "United States"
                          ? "4–7 business days"
                          : "8–12 business days",
                      price: standard,
                    },
                    {
                      id: "express",
                      title: "Express shipping",
                      days:
                        address.country === "United States"
                          ? "2–3 business days"
                          : "3–5 business days",
                      price: express,
                    },
                  ] as const
                ).map((option) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: shipping === option.id }}
                    accessibilityLabel={option.title}
                    onPress={() => setShipping(option.id)}
                    key={option.id}
                    style={[
                      s.shipping,
                      shipping === option.id && {
                        borderColor: "#6d865c",
                        backgroundColor: "#f4f7ee",
                      },
                    ]}
                  >
                    <View
                      style={[
                        s.radio,
                        shipping === option.id && {
                          backgroundColor: C.ink,
                          borderColor: C.ink,
                        },
                      ]}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, color: C.ink }}>
                        {option.title}
                      </Text>
                      <Text style={[ui.small, { fontSize: 10, marginTop: 7 }]}>
                        {option.days}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: C.ink }}>
                      {option.price ? money(option.price) : "Free"}
                    </Text>
                  </Pressable>
                ))}
                <Text style={[ui.small, { fontSize: 9, marginTop: 8 }]}>
                  Delivery windows and fees are demo examples. Free standard
                  shipping on{" "}
                  {address.country === "United States" ? "$75" : "$150"}+ after
                  discounts.
                </Text>
              </>
            ) : (
              <>
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: demoCard }}
                  accessibilityLabel="Demo Visa"
                  onPress={() => {
                    setDemoCard(true);
                    clearFieldError("payment");
                  }}
                  style={[
                    s.card,
                    demoCard && {
                      borderColor: "#6d865c",
                      backgroundColor: "#f6f8f1",
                    },
                  ]}
                >
                  <View style={ui.row}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View
                        style={[
                          s.radio,
                          demoCard && {
                            backgroundColor: C.ink,
                            borderColor: C.ink,
                          },
                        ]}
                      />
                      <CreditCard size={23} color={C.ink} />
                      <Text style={{ fontSize: 13, color: C.ink }}>
                        Demo Visa
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontStyle: "italic",
                        fontWeight: "700",
                        fontSize: 15,
                        color: C.ink,
                      }}
                    >
                      VISA
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      color: C.ink,
                      letterSpacing: 1,
                      marginTop: 27,
                    }}
                  >
                    4242 4242 4242 4242
                  </Text>
                  <View
                    style={[
                      ui.row,
                      { marginTop: 20, flexWrap: "wrap", rowGap: 8 },
                    ]}
                  >
                    <Text style={[ui.small, { fontSize: 9 }]}>
                      EXPIRY 12/30
                    </Text>
                    <Text style={[ui.small, { fontSize: 9 }]}>
                      FIXED TEST CARD · NO CHARGE
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityLabel="Simulate a payment failure"
                  accessibilityState={{ checked: simulateFailure }}
                  onPress={() => setSimulateFailure(!simulateFailure)}
                  style={{ paddingVertical: 18 }}
                >
                  <Text style={ui.link}>
                    {simulateFailure ? "Enabled: " : ""}Simulate a payment
                    failure (demo)
                  </Text>
                </Pressable>
                {errors.payment && (
                  <Text style={ui.error}>{errors.payment}</Text>
                )}
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: sameBilling }}
                  accessibilityLabel="Billing address is the same as shipping"
                  onPress={() => setSameBilling(!sameBilling)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 11,
                    marginVertical: 26,
                  }}
                >
                  <View
                    style={[
                      s.checkbox,
                      sameBilling && { backgroundColor: C.ink },
                    ]}
                  >
                    {sameBilling && <Check size={12} color="white" />}
                  </View>
                  <Text style={{ fontSize: 11, color: C.ink, flex: 1 }}>
                    Billing address is the same as shipping
                  </Text>
                </Pressable>
                {!sameBilling && (
                  <AddressFields
                    address={billing}
                    onChange={(value) => updateAddress(value, true)}
                    errors={errors}
                    prefix="billing-"
                  />
                )}
                <Text style={[ui.small, { fontSize: 10, lineHeight: 19 }]}>
                  Review your items before finishing. Placing a demo order
                  clears your bag and opens a sample confirmation. Nothing is
                  charged or shipped.
                </Text>
              </>
            )}
          </View>
        </ScrollView>
        <View
          style={[ui.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
        >
          <View style={ui.row}>
            <Text style={ui.small}>Total · USD</Text>
            <Text style={{ fontSize: 21, color: C.ink }}>
              {money(totals.total)}
            </Text>
          </View>
          <Button onPress={next} disabled={posting}>
            {step === 1
              ? "Continue to shipping"
              : step === 2
                ? "Continue to payment"
                : `Place demo order · ${money(totals.total)}`}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
const s = StyleSheet.create({
  summaryToggle: {
    padding: 20,
    backgroundColor: C.cream,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  summary: { padding: 22, backgroundColor: C.cream },
  progress: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 27,
    marginBottom: 23,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  step: {
    width: 23,
    height: 23,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  review: {
    padding: 17,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: "#fafbf7",
    marginBottom: 27,
  },
  shipping: {
    padding: 19,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 13,
  },
  radio: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: "#b7c4aa",
    borderRadius: 8,
  },
  card: { padding: 20, borderWidth: 1, borderColor: C.line },
  checkbox: {
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: "center",
    justifyContent: "center",
  },
});
