import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import {
  emptyCustomer,
  hydrateCustomer,
  type CustomerData,
} from "../data/customer";
import { C } from "../ui/theme";
type Customer = {
  data: CustomerData;
  update: (fn: (old: CustomerData) => CustomerData) => void;
  storageError: boolean;
  rememberSearch: (q: string) => void;
  viewProduct: (id: number) => void;
};
const Context = createContext<Customer | null>(null);
export function CustomerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CustomerData>(emptyCustomer),
    [ready, setReady] = useState(false),
    [storageError, setStorageError] = useState(false);
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem("@aven/customer/v1")
      .then((raw) => {
        if (alive && raw) setData(hydrateCustomer(JSON.parse(raw)));
      })
      .catch(() => {
        if (alive) setStorageError(true);
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (ready)
      AsyncStorage.setItem("@aven/customer/v1", JSON.stringify(data)).catch(
        () => setStorageError(true),
      );
  }, [data, ready]);
  return (
    <Context.Provider
      value={{
        data,
        update: setData,
        storageError,
        rememberSearch: (q) => {
          const clean = q.trim().slice(0, 80);
          if (clean)
            setData((old) => ({
              ...old,
              recentSearches: [
                clean,
                ...old.recentSearches.filter(
                  (x) => x.toLowerCase() !== clean.toLowerCase(),
                ),
              ].slice(0, 8),
            }));
        },
        viewProduct: (id) =>
          setData((old) =>
            old.viewed[0] === id
              ? old
              : {
                  ...old,
                  viewed: [id, ...old.viewed.filter((x) => x !== id)].slice(
                    0,
                    12,
                  ),
                },
          ),
      }}
    >
      {ready ? (
        children
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: C.cream,
          }}
        >
          <ActivityIndicator color={C.ink} />
        </View>
      )}
    </Context.Provider>
  );
}
export function useCustomer() {
  const value = useContext(Context);
  if (!value) throw Error("CustomerProvider is required");
  return value;
}
