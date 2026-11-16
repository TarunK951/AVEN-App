const originals: Record<string, number> = {
  fleece: require("../../assets/originals/aven-fleece.png"),
  pants: require("../../assets/originals/aven-pants.png"),
  leggings: require("../../assets/originals/aven-leggings.png"),
  overshirt: require("../../assets/originals/aven-overshirt.png"),
  tote: require("../../assets/originals/aven-tote.png"),
  "fleece-detail": require("../../assets/originals/aven-fleece-detail.png"),
  "pants-detail": require("../../assets/originals/aven-pants-detail.png"),
  "leggings-detail": require("../../assets/originals/aven-leggings-detail.png"),
  "overshirt-detail": require("../../assets/originals/aven-overshirt-detail.png"),
  "tote-detail": require("../../assets/originals/aven-tote-detail.png"),
};
const keys: Record<number, string> = {
  100: "fleece",
  101: "pants",
  102: "leggings",
  103: "overshirt",
  104: "tote",
};
export const productImage = (id: number, detail = false) =>
  originals[(keys[id] ?? "fleece") + (detail ? "-detail" : "")];
export const images: Record<string, number> = {
  ...originals,
  "meta-mobile": originals.fleece,
  meta: originals.fleece,
  "hero-mobile": originals.fleece,
  hero: originals.fleece,
  "gift-mobile": originals.overshirt,
  gift: originals.overshirt,
  outerwear: originals.overshirt,
  dream: originals.leggings,
  active: originals.pants,
  cozy: originals.fleece,
};
