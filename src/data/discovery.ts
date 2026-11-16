import { type Product, sizesFor } from "./catalog";
import { isAvailable } from "./customer";
export type DiscoveryFilters = {
  size: string;
  color: string;
  under150: boolean;
  inStock: boolean;
};
export function matchesDiscovery(p: Product, f: DiscoveryFilters) {
  return (
    (!f.size || sizesFor(p).includes(f.size)) &&
    (!f.color || p.color === f.color) &&
    (!f.under150 || p.price <= 150) &&
    (!f.inStock || isAvailable(p.id, f.size || undefined))
  );
}
