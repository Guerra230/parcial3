import {
  PRODUCTS,
  TODAY_DEALS_IDS,
  RECOMMENDED_IDS,
  RELATED_TO_IPHONE,
} from '../data/products';
import type { Product, ProductCategory } from '../types/product';

const wait = <T,>(value: T, ms = 80): Promise<T> =>
  new Promise((res) => setTimeout(() => res(value), ms));

export const getAllProducts = (): Promise<Product[]> => wait(PRODUCTS);

export const getProductById = (id: string): Promise<Product | undefined> =>
  wait(PRODUCTS.find((p) => p.id === id));

export const getProductsByCategory = (
  category: ProductCategory
): Promise<Product[]> => wait(PRODUCTS.filter((p) => p.category === category));

export const getTodayDeals = (): Promise<Product[]> =>
  wait(
    TODAY_DEALS_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
      (p): p is Product => Boolean(p)
    )
  );

export const getRecommended = (): Promise<Product[]> =>
  wait(
    RECOMMENDED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
      (p): p is Product => Boolean(p)
    )
  );

export const getRelatedTo = (productId: string): Promise<Product[]> => {
  if (productId.startsWith('iphone')) {
    return wait(
      RELATED_TO_IPHONE.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
        (p): p is Product => Boolean(p)
      )
    );
  }
  return wait(PRODUCTS.filter((p) => p.id !== productId).slice(0, 3));
};

export interface SearchFilters {
  brand?: string[];
  color?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export const searchProducts = (
  query: string,
  filters: SearchFilters = {}
): Promise<Product[]> => {
  const q = query.trim().toLowerCase();
  let result = PRODUCTS.filter((p) => {
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  if (filters.brand && filters.brand.length) {
    result = result.filter((p) =>
      filters.brand!.map((b) => b.toLowerCase()).includes(p.brand.toLowerCase())
    );
  }
  if (filters.color && filters.color.length) {
    result = result.filter((p) =>
      filters.color!.map((c) => c.toLowerCase()).includes(p.color.toLowerCase())
    );
  }
  if (typeof filters.minPrice === 'number') {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === 'number') {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  return wait(result);
};
