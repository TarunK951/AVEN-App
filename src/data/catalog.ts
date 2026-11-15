export type Product = {
  id: number;
  name: string;
  color: string;
  price: number;
  gender: string;
  category: string;
};
export const products: Product[] = [
  {
    id: 0,
    name: "Restore Oversized Mock Neck",
    color: "Pink Taffy",
    price: 128,
    gender: "Women",
    category: "Tops",
  },
  {
    id: 1,
    name: "Taika Snow Pant",
    color: "Silt",
    price: 378,
    gender: "Men",
    category: "Bottoms",
  },
  {
    id: 2,
    name: "AllTheFeels™ Slim Flare",
    color: "Cherry Noir",
    price: 118,
    gender: "Women",
    category: "Bottoms",
  },
  {
    id: 3,
    name: "Taika Snow Shell",
    color: "Silt",
    price: 478,
    gender: "Men",
    category: "Outerwear",
  },
  {
    id: 4,
    name: "Émilie Cashmere Crew",
    color: "Pink Taffy",
    price: 198,
    gender: "Women",
    category: "Tops",
  },
  {
    id: 5,
    name: "Pique Fleece Pullover Hoodie",
    color: "Ink",
    price: 138,
    gender: "Men",
    category: "Tops",
  },
  {
    id: 6,
    name: "AllTheFeels™ Legging",
    color: "Pink Taffy",
    price: 110,
    gender: "Women",
    category: "Bottoms",
  },
  {
    id: 7,
    name: "Seaside Sweatpant",
    color: "Raisin",
    price: 128,
    gender: "Men",
    category: "Bottoms",
  },
  {
    id: 8,
    name: "Plaid Scarf",
    color: "Grey Vail Plaid",
    price: 98,
    gender: "Unisex",
    category: "Accessories",
  },
  {
    id: 9,
    name: "Cashmere Balaclava",
    color: "Pale Grey Heather",
    price: 128,
    gender: "Unisex",
    category: "Accessories",
  },
  {
    id: 10,
    name: "Chunky Knit Scarf",
    color: "Pale Grey Heather",
    price: 118,
    gender: "Unisex",
    category: "Accessories",
  },
];

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/™/g, "")
    .replace(/é/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const productUrl = (p: Product) => "/products/" + slugify(p.name);
export const collections: Record<
  string,
  {
    title: string;
    description: string;
    gender?: string;
    category?: string;
    ids?: number[];
  }
> = {
  womens: {
    title: "Women's Collection",
    description:
      "From your first stretch to your last layer. Discover versatile essentials for every way you move.",
    gender: "Women",
  },
  mens: {
    title: "Men's Collection",
    description:
      "Performance meets everyday comfort. Thoughtful essentials, made to move with you.",
    gender: "Men",
  },
  "all-new": {
    title: "New Arrivals",
    description:
      "A fresh perspective on performance. Meet the newest additions to your everyday.",
  },
  "womens-new": {
    title: "Women's New Arrivals",
    description: "New textures. Fresh colors. Your next everyday favorites.",
    gender: "Women",
  },
  "mens-new": {
    title: "Men's New Arrivals",
    description:
      "Discover the latest in movement, comfort, and everyday versatility.",
    gender: "Men",
  },
  gifts: {
    title: "The Gift Edit",
    description:
      "Thoughtful picks for the people who move you. A little comfort goes a long way.",
  },
  accessories: {
    title: "Accessories",
    description:
      "The finishing touches. Warm textures and considered details for the days ahead.",
    ids: [8, 9, 10],
  },
  fleece: {
    title: "Fleece Favorites",
    description:
      "The softer side of the season. Easy layers for slowing down and heading out.",
    ids: [0, 5, 7],
  },
  outerwear: {
    title: "Outerwear",
    description:
      "Take the outside route. Technical layers built for the elements.",
    ids: [3],
  },
  dreamknit: {
    title: "The Comfort Collection",
    description:
      "Softness that goes wherever you do. Discover your new comfort zone.",
    ids: [2, 6, 7],
  },
  "womens-winter": {
    title: "Women's Winter Collection",
    description: "Soft layers and versatile essentials for a season outside.",
    gender: "Women",
  },
  "mens-winter": {
    title: "Men's Winter Collection",
    description:
      "Reach new peaks in technical outerwear and warming everyday layers.",
    gender: "Men",
  },
};
export function collectionUrl(name: string, gender = "") {
  const n = name.toLowerCase();
  if (n === "women") return "/collections/womens";
  if (n === "men") return "/collections/mens";
  if (n.includes("winter"))
    return "/collections/" + (gender === "Men" ? "mens" : "womens") + "-winter";
  if (n.includes("gift")) return "/collections/gifts";
  if (n.includes("accessor")) return "/collections/accessories";
  if (n.includes("fleece")) return "/collections/fleece";
  if (n.includes("outerwear")) return "/collections/outerwear";
  if (n.includes("dream")) return "/collections/dreamknit";
  return (
    "/collections/" +
    (gender ? (gender === "Men" ? "mens-new" : "womens-new") : "all-new")
  );
}
export const navigation = [
  ["New", "/collections/all-new"],
  ["Women", "/collections/womens"],
  ["Men", "/collections/mens"],
  ["Accessories", "/collections/accessories"],
  ["Gifting", "/collections/gifts"],
  ["Explore", "/pages/our-story"],
];

export const sizesFor = (p: Product) =>
  p.category === "Accessories" ? ["One Size"] : ["XS", "S", "M", "L", "XL"];
export const genderCollection = (p: Product) =>
  "/collections/" +
  (p.gender === "Women"
    ? "womens"
    : p.gender === "Men"
      ? "mens"
      : "accessories");
