export type Product = {
  id: number;
  name: string;
  color: string;
  swatch: string;
  price: number;
  gender: string;
  category: string;
  tagline: string;
  description: string;
  fit: string;
  fabric: string;
  care: string;
  features: string[];
  qualityTitle: string;
  qualityCopy: string;
  model: string;
};
export const products: Product[] = [
  {
    id: 100,
    name: "Coast Half-Zip Fleece",
    color: "Oat",
    swatch: "#dfd6bd",
    price: 128,
    gender: "Women",
    category: "Outerwear",
    tagline: "The softer side of getting outside.",
    description:
      "A little warmth for the long way home. Our Coast Half-Zip brings a plush texture, sculpted seams and an easy silhouette to the everyday layer.",
    fit: "Relaxed fit with room to layer. A high collar and half-zip opening let you find your own level of comfort. Choose your usual size for an easy fit.",
    fabric: "Plush fleece with smooth woven trim and a soft-touch half zip.",
    care: "Machine wash cold with similar colors. Close the zip before washing. Do not bleach. Air dry and avoid ironing the fleece pile.",
    features: [
      "Plush, tactile fleece",
      "Easy layering fit",
      "High half-zip collar",
      "Curved panel seams",
    ],
    qualityTitle: "Softness you can see.",
    qualityCopy:
      "A generous fleece pile brings texture and warmth. Smooth trim and considered seam placement finish the piece with a quiet, clean feel.",
    model: "Styled with relaxed trousers. Available in XS–XL.",
  },
  {
    id: 101,
    name: "Ridge Trail Pant",
    color: "Olive",
    swatch: "#73785c",
    price: 178,
    gender: "Men",
    category: "Bottoms",
    tagline: "Made to take the long way.",
    description:
      "From an early start to a slower afternoon. The Ridge Trail Pant pairs an easy waist with a clean tapered leg and practical pockets.",
    fit: "Regular through the hip with a gently tapered leg. An elasticated waist gives an easy, adjustable fit. Choose your usual size.",
    fabric: "Lightly textured woven fabric with a smooth hand feel.",
    care: "Machine wash cold. Wash inside out with similar colors. Air dry. Do not bleach or use high heat.",
    features: [
      "Easy elastic waist",
      "Clean tapered leg",
      "Practical zip pockets",
      "Lightweight woven feel",
    ],
    qualityTitle: "Considered from the waist down.",
    qualityCopy:
      "Neat seams, an easy waistband and low-profile pocket openings keep the silhouette simple while giving the details room to work.",
    model: "Styled with an ivory tee. Available in XS–XL.",
  },
  {
    id: 102,
    name: "Form 7/8 Legging",
    color: "Graphite",
    swatch: "#333537",
    price: 98,
    gender: "Women",
    category: "Bottoms",
    tagline: "Find your own rhythm.",
    description:
      "A clean line from the first stretch to the last errand. The Form 7/8 Legging has a high-rise waist, a close-to-body fit and understated seams.",
    fit: "Close fit with a high waistband and 7/8 length. Choose your usual size for a supportive feel, or size up for a little more ease.",
    fabric: "Fine, matte stretch knit with a smooth surface and gentle drape.",
    care: "Machine wash cold inside out. Wash with similar colors. Avoid fabric softener. Air dry and do not iron.",
    features: [
      "High-rise waistband",
      "7/8 length",
      "Smooth matte texture",
      "Minimal curved seams",
    ],
    qualityTitle: "A smoother kind of movement.",
    qualityCopy:
      "A broad waistband and fine knit texture create a clean foundation. Curved seams follow the silhouette without adding visual noise.",
    model: "Styled with a matching graphite bra. Available in XS–XL.",
  },
  {
    id: 103,
    name: "Field Cotton Overshirt",
    color: "Sage",
    swatch: "#8f9a83",
    price: 148,
    gender: "Men",
    category: "Tops",
    tagline: "An easy layer. A fresh perspective.",
    description:
      "A little structure without the fuss. The Field Overshirt pairs a softly textured weave with two chest pockets and a straight, relaxed silhouette.",
    fit: "Relaxed fit, designed to wear open over a tee or buttoned as a light layer. Straight hem and an easy shoulder. Choose your usual size.",
    fabric: "Softly textured cotton weave with matte buttons.",
    care: "Machine wash cold on a gentle cycle. Reshape while damp. Line dry and use a cool iron if needed.",
    features: [
      "Textured cotton weave",
      "Two chest pockets",
      "Matte button finish",
      "Straight, easy hem",
    ],
    qualityTitle: "Texture, quietly done.",
    qualityCopy:
      "A subtle woven grain gives the overshirt its character. Clean pocket construction and tonal buttons keep the finish understated.",
    model: "Styled over an ivory tee. Available in XS–XL.",
  },
  {
    id: 104,
    name: "Everyday Canvas Tote",
    color: "Sand",
    swatch: "#c4b399",
    price: 68,
    gender: "Unisex",
    category: "Accessories",
    tagline: "A little room for your everyday.",
    description:
      "For the market, the shoreline and everything in between. The Everyday Tote brings a softly structured shape and generous shoulder straps to a natural canvas carryall.",
    fit: "One size. Broad shoulder handles and an open, softly structured silhouette make room for the things you reach for most.",
    fabric: "Heavyweight cotton canvas with reinforced handle stitching.",
    care: "Spot clean with a damp cloth and mild soap. Reshape and air dry. Do not bleach or tumble dry.",
    features: [
      "Heavyweight canvas",
      "Broad shoulder straps",
      "Reinforced stitching",
      "Softly structured shape",
    ],
    qualityTitle: "Built around the little details.",
    qualityCopy:
      "Natural canvas texture, generous handles and reinforced joins make for a bag that feels considered from the first carry.",
    model: "One size. Shown in Sand.",
  },
];
export const sizesFor = (p: Product) =>
  p.category === "Accessories" ? ["One Size"] : ["XS", "S", "M", "L", "XL"];
export const isAvailable = (id: number, size?: string) =>
  products.some((p) => p.id === id) && !(id === 101 && size === "XL");
export const slugify = (s: string) =>
  s
    .toLowerCase()
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
    description: "Soft layers and clean lines, made for your everyday.",
    gender: "Women",
  },
  mens: {
    title: "Men's Collection",
    description: "Easy essentials for the long way home.",
    gender: "Men",
  },
  "all-new": {
    title: "The Everyday Collection",
    description: "Five considered pieces. A fresh perspective on comfort.",
  },
  "womens-new": {
    title: "Women's New Arrivals",
    description: "Meet your next everyday favorites.",
    gender: "Women",
  },
  "mens-new": {
    title: "Men's New Arrivals",
    description: "Fresh texture. Familiar comfort.",
    gender: "Men",
  },
  gifts: {
    title: "The Gift Edit",
    description: "A little comfort for the people who move you.",
  },
  accessories: {
    title: "The Finishing Touch",
    description: "Thoughtful details for the things you carry.",
    ids: [104],
  },
  fleece: {
    title: "The Softer Side",
    description: "A little warmth goes a long way.",
    ids: [100],
  },
  outerwear: {
    title: "Easy Layers",
    description: "Find comfort in a fresh layer.",
    ids: [100, 103],
  },
  dreamknit: {
    title: "Your Comfort Zone",
    description: "A smoother kind of everyday.",
    ids: [100, 102],
  },
  "womens-winter": {
    title: "Women's Layers",
    description: "Softness for the season.",
    gender: "Women",
  },
  "mens-winter": {
    title: "Men's Layers",
    description: "Take the outside route.",
    gender: "Men",
  },
};
export const navigation = [
  ["New", "/collections/all-new"],
  ["Women", "/collections/womens"],
  ["Men", "/collections/mens"],
  ["Accessories", "/collections/accessories"],
  ["Gifting", "/collections/gifts"],
  ["Explore", "/pages/our-story"],
];
export const genderCollection = (p: Product) =>
  "/collections/" +
  (p.gender === "Women"
    ? "womens"
    : p.gender === "Men"
      ? "mens"
      : "accessories");
export function collectionUrl(name: string, gender = "") {
  const n = name.toLowerCase();
  if (n === "women") return "/collections/womens";
  if (n === "men") return "/collections/mens";
  if (n.includes("gift")) return "/collections/gifts";
  if (n.includes("accessor")) return "/collections/accessories";
  if (n.includes("fleece")) return "/collections/fleece";
  if (n.includes("outerwear")) return "/collections/outerwear";
  return (
    "/collections/" +
    (gender === "Women"
      ? "womens-new"
      : gender === "Men"
        ? "mens-new"
        : "all-new")
  );
}
