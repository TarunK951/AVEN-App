export type Address = {
  firstName: string;
  lastName: string;
  street: string;
  apartment: string;
  city: string;
  region: string;
  postal: string;
  country: string;
};
export const blankAddress: Address = {
  firstName: "",
  lastName: "",
  street: "",
  apartment: "",
  city: "",
  region: "",
  postal: "",
  country: "United States",
};
export function validateAddress(address: Address, prefix = "") {
  const errors: Record<string, string> = {};
  for (const key of [
    "firstName",
    "lastName",
    "street",
    "city",
    "region",
    "postal",
  ] as const) {
    if (!address[key].trim())
      errors[prefix + key] = "Please fill in this field.";
  }
  if (address.postal.trim()) {
    const zip = address.postal.trim();
    if (address.country === "United States" && !/^\d{5}(-\d{4})?$/.test(zip))
      errors[prefix + "postal"] = "Enter a valid 5-digit ZIP code.";
    if (address.country === "India" && !/^\d{6}$/.test(zip))
      errors[prefix + "postal"] = "Enter a valid 6-digit PIN code.";
    if (
      !["United States", "India"].includes(address.country) &&
      !/^[A-Za-z0-9][A-Za-z0-9 -]{1,11}$/.test(zip)
    )
      errors[prefix + "postal"] = "Enter a valid postal code.";
  }
  return errors;
}
export const validEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
