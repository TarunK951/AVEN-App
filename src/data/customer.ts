import { orderStages, type Fulfillment } from "./fulfillment";
import { products, isAvailable } from "./catalog";
export { isAvailable };
import {
  blankAddress,
  validateAddress,
  validEmail,
  type Address,
} from "./address";
export type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};
export type SavedAddress = Address & { id: string; label: string };
export type LocalReview = {
  id: string;
  productId: number;
  rating: number;
  text: string;
  name: string;
};
export type CustomerData = {
  profile: Profile;
  addresses: SavedAddress[];
  defaultAddressId: string;
  recentSearches: string[];
  viewed: number[];
  alerts: number[];
  reviews: LocalReview[];
  preferences: {
    orderUpdates: boolean;
    backInStock: boolean;
    offers: boolean;
    country: string;
  };
  orderActions: Partial<
    Record<
      string,
      {
        status: "cancelled" | "return requested" | "exchange requested";
        reason: string;
      }
    >
  >;
  tickets: { id: string; topic: string; message: string }[];
  loyalty: boolean;
  fulfillment: Partial<Record<string, Fulfillment>>;
};
export const emptyCustomer: CustomerData = {
  profile: { firstName: "", lastName: "", email: "", phone: "" },
  addresses: [],
  defaultAddressId: "",
  recentSearches: [],
  viewed: [],
  alerts: [],
  reviews: [],
  preferences: {
    orderUpdates: true,
    backInStock: true,
    offers: false,
    country: "United States",
  },
  orderActions: {},
  tickets: [],
  loyalty: false,
  fulfillment: {},
};
export function validateProfile(p: CustomerData["profile"]) {
  const errors: Record<string, string> = {};
  if (!p.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!p.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!validEmail(p.email)) errors.email = "Enter a valid email address.";
  if (p.phone.trim() && !/^\+?[\d\s().-]{8,25}$/.test(p.phone.trim()))
    errors.phone = "Enter a valid phone number or leave it blank.";
  return errors;
}
export function hydrateCustomer(raw: unknown): CustomerData {
  if (!raw || typeof raw !== "object") return { ...emptyCustomer };
  const v = raw as Partial<CustomerData>;
  const addresses = Array.isArray(v.addresses)
    ? v.addresses
        .filter(
          (a) =>
            a &&
            typeof a.id === "string" &&
            typeof a.label === "string" &&
            Object.keys(blankAddress).every(
              (k) => typeof a[k as keyof Address] === "string",
            ) &&
            !Object.keys(validateAddress(a)).length,
        )
        .slice(0, 20)
    : [];
  const ids = (x: unknown) =>
    Array.isArray(x)
      ? [
          ...new Set(
            x.filter(
              (n) => Number.isInteger(n) && products.some((p) => p.id === n),
            ),
          ),
        ].slice(0, 30)
      : [];
  return {
    ...emptyCustomer,
    profile: Object.fromEntries(
      Object.keys(emptyCustomer.profile).map((k) => [
        k,
        typeof v.profile?.[k as keyof Profile] === "string"
          ? v.profile[k as keyof Profile].slice(0, 150)
          : "",
      ]),
    ) as Profile,
    addresses,
    defaultAddressId: addresses.some((a) => a.id === v.defaultAddressId)
      ? v.defaultAddressId!
      : (addresses[0]?.id ?? ""),
    recentSearches: Array.isArray(v.recentSearches)
      ? v.recentSearches
          .filter((x) => typeof x === "string" && x.trim())
          .slice(0, 8)
          .map((x) => x.slice(0, 80))
      : [],
    viewed: ids(v.viewed),
    alerts: ids(v.alerts),
    reviews: Array.isArray(v.reviews)
      ? v.reviews
          .filter(
            (r) =>
              r &&
              typeof r.id === "string" &&
              typeof r.text === "string" &&
              typeof r.name === "string" &&
              Number.isInteger(r.productId) &&
              products.some((p) => p.id === r.productId) &&
              Number.isInteger(r.rating) &&
              r.rating >= 1 &&
              r.rating <= 5,
          )
          .slice(0, 100)
      : [],
    preferences: {
      orderUpdates: v.preferences?.orderUpdates !== false,
      backInStock: v.preferences?.backInStock !== false,
      offers: v.preferences?.offers === true,
      country: [
        "United States",
        "India",
        "United Kingdom",
        "Canada",
        "Australia",
      ].includes(v.preferences?.country ?? "")
        ? v.preferences!.country
        : "United States",
    },
    orderActions:
      v.orderActions && typeof v.orderActions === "object"
        ? Object.fromEntries(
            Object.entries(v.orderActions).filter(
              ([id, a]) =>
                id.startsWith("AVN-") &&
                a &&
                [
                  "cancelled",
                  "return requested",
                  "exchange requested",
                ].includes(a.status) &&
                typeof a.reason === "string",
            ),
          )
        : {},
    tickets: Array.isArray(v.tickets)
      ? v.tickets
          .filter(
            (t) =>
              t &&
              typeof t.id === "string" &&
              typeof t.topic === "string" &&
              typeof t.message === "string",
          )
          .slice(0, 50)
      : [],
    loyalty: v.loyalty === true,
    fulfillment:
      v.fulfillment && typeof v.fulfillment === "object"
        ? Object.fromEntries(
            Object.entries(v.fulfillment)
              .filter(
                ([id, f]) =>
                  id.startsWith("AVN-") &&
                  f &&
                  orderStages.some((s) => s.key === f.stage) &&
                  Array.isArray(f.events),
              )
              .map(([id, f]) => [
                id,
                {
                  stage: f!.stage,
                  events: f!.events
                    .filter(
                      (e) =>
                        e &&
                        orderStages.some((s) => s.key === e.stage) &&
                        typeof e.at === "string" &&
                        Number.isFinite(Date.parse(e.at)),
                    )
                    .slice(0, 6),
                },
              ]),
          )
        : {},
  };
}
