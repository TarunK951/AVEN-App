import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { products, sizesFor } from "../data/catalog";
import { checkoutTotals, type ShippingMethod } from "../data/totals";
import { validBag, subtotalFor, addItem, type BagItem } from "./logic";
import { View, ActivityIndicator } from "react-native";
export type { BagItem } from "./logic";
export type Receipt = {
  id: string;
  items: BagItem[];
  totals: ReturnType<typeof checkoutTotals>;
  country: string;
  shipping: ShippingMethod;
};
type Store = {
  bag: BagItem[];
  favorites: number[];
  ready: boolean;
  storageError: boolean;
  receipt: Receipt | null;
  count: number;
  subtotal: number;
  add: (id: number, size: string, quantity?: number) => void;
  quantity: (id: number, size: string, delta: number) => void;
  remove: (id: number, size: string) => void;
  toggleFavorite: (id: number) => void;
  complete: (
    shipping: ShippingMethod,
    country: string,
    promo: boolean,
  ) => Receipt | null;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<BagItem[]>([]),
    [favorites, setFavorites] = useState<number[]>([]),
    [receipt, setReceipt] = useState<Receipt | null>(null),
    [ready, setReady] = useState(false),
    [storageError, setStorageError] = useState(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem("@aven/store/v1")
      .then((raw) => {
        if (!active) return;
        if (raw) {
          try {
            const data = JSON.parse(raw);
            setBag(validBag(data.bag));
            setFavorites(
              Array.isArray(data.favorites)
                ? data.favorites.filter((id: number) =>
                    products.some((p) => p.id === id),
                  )
                : [],
            );
            if (
              data.receipt?.id?.startsWith("AVN-") &&
              Array.isArray(data.receipt.items) &&
              Number.isFinite(data.receipt.totals?.total)
            )
              setReceipt(data.receipt);
          } catch {
            setStorageError(true);
          }
        }
      })
      .catch(() => {
        if (active) setStorageError(true);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (ready)
      AsyncStorage.setItem(
        "@aven/store/v1",
        JSON.stringify({ bag, favorites, receipt }),
      ).catch(() => setStorageError(true));
  }, [bag, favorites, receipt, ready]);
  const store: Store = {
    bag,
    favorites,
    receipt,
    ready,
    storageError,
    count: bag.reduce((s, i) => s + i.quantity, 0),
    subtotal: subtotalFor(bag),
    add: (id, size, quantity = 1) =>
      setBag((old) => addItem(old, id, size, quantity)),
    quantity: (id, size, delta) =>
      setBag((old) =>
        old.flatMap((i) =>
          i.id === id && i.size === size
            ? i.quantity + delta > 0
              ? [{ ...i, quantity: Math.min(99, i.quantity + delta) }]
              : []
            : [i],
        ),
      ),
    remove: (id, size) =>
      setBag((old) => old.filter((i) => i.id !== id || i.size !== size)),
    toggleFavorite: (id) =>
      setFavorites((old) =>
        old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
      ),
    complete: (shipping, country, promo) => {
      if (!bag.length) return null;
      const next: Receipt = {
        id: "AVN-" + Date.now().toString(36).toUpperCase(),
        items: bag.map((i) => ({ ...i })),
        totals: checkoutTotals(subtotalFor(bag), shipping, country, promo),
        country,
        shipping,
      };
      setReceipt(next);
      setBag([]);
      return next;
    },
  };
  return (
    <Context.Provider value={store}>
      {ready ? (
        children
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f4f5ee",
          }}
        >
          <ActivityIndicator color="#263d33" />
        </View>
      )}
    </Context.Provider>
  );
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw Error("StoreProvider is required");
  return store;
}
