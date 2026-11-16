import { demoStock } from "../data/customer";
import { isReceipt } from "../data/orders";
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
  createdAt?: string;
};
type Store = {
  bag: BagItem[];
  favorites: number[];
  ready: boolean;
  storageError: boolean;
  receipt: Receipt | null;
  orders: Receipt[];
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
    [orders, setOrders] = useState<Receipt[]>([]),
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
            if (Array.isArray(data.orders))
              setOrders(data.orders.filter(isReceipt).slice(0, 100));
            else if (isReceipt(data.receipt)) setOrders([data.receipt]);
            setFavorites(
              Array.isArray(data.favorites)
                ? data.favorites.filter((id: number) =>
                    products.some((p) => p.id === id),
                  )
                : [],
            );
            if (isReceipt(data.receipt)) setReceipt(data.receipt);
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
        JSON.stringify({ bag, favorites, receipt, orders }),
      ).catch(() => setStorageError(true));
  }, [bag, favorites, receipt, orders, ready]);
  const store: Store = {
    bag,
    favorites,
    receipt,
    orders,
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
      if (!bag.length || bag.some((i) => !demoStock(i.id, i.size))) return null;
      const next: Receipt = {
        id: "AVN-" + Date.now().toString(36).toUpperCase(),
        createdAt: new Date().toISOString(),
        items: bag.map((i) => ({ ...i })),
        totals: checkoutTotals(subtotalFor(bag), shipping, country, promo),
        country,
        shipping,
      };
      setReceipt(next);
      setOrders((old) => [next, ...old].slice(0, 100));
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
