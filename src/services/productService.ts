import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  PRODUCTS,
  TODAY_DEALS_IDS,
  RECOMMENDED_IDS,
  RELATED_TO_IPHONE,
} from '../data/products';
import type { Product, ProductCategory } from '../types/product';
import type { ProductRow } from '../types/database';

// --- Types ---

export interface SearchFilters {
  brand?: string[];
  color?: string[];
  minPrice?: number;
  maxPrice?: number;
}

// Mapping from DB badge label → frontend badge type
const BADGE_LABEL_MAP: Record<string, NonNullable<Product['badges']>[number]> = {
  'Free insurance': 'insurance',
  '0% bank interest': 'bank-interest',
};

// --- Transform DB row → Product ---

const transformProduct = (row: ProductRow): Product => {
  const badgesFromLabels = ((row.badges as string[]) ?? [])
    .map((b) => BADGE_LABEL_MAP[b])
    .filter((b): b is NonNullable<Product['badges']>[number] => Boolean(b));

  if (row.is_on_sale) badgesFromLabels.push('on-sale');
  if (row.is_trending) badgesFromLabels.push('trending');

  return {
    id: row.id,
    name: row.name,
    brand: row.brand_name,
    category: (row.category_id ?? 'smartphones') as ProductCategory,
    price: row.price,
    oldPrice: row.original_price ?? undefined,
    currency: 'COP',
    rating: row.rating,
    reviews: row.review_count,
    stock: row.stock,
    color: row.color ?? '',
    description: row.description ?? '',
    images: row.image_url ? [row.image_url] : [],
    shortSpecs: Object.entries((row.specs as Record<string, string>) ?? {}).map(
      ([label, value]) => ({ label, value })
    ),
    sections: undefined,
    badges: badgesFromLabels as Product['badges'],
    freeShipping: true,
  };
};

// --- Static fallback (used when Supabase is not configured) ---

const staticFallback = {
  getAll: () => Promise.resolve(PRODUCTS),
  getById: (id: string) => Promise.resolve(PRODUCTS.find((p) => p.id === id)),
  getByCategory: (category: ProductCategory) =>
    Promise.resolve(PRODUCTS.filter((p) => p.category === category)),
  getTodayDeals: () =>
    Promise.resolve(
      TODAY_DEALS_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
        (p): p is Product => Boolean(p)
      )
    ),
  getRecommended: () =>
    Promise.resolve(
      RECOMMENDED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
        (p): p is Product => Boolean(p)
      )
    ),
  getRelatedTo: (productId: string) => {
    if (productId.includes('iphone')) {
      return Promise.resolve(
        RELATED_TO_IPHONE.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
          (p): p is Product => Boolean(p)
        )
      );
    }
    return Promise.resolve(PRODUCTS.filter((p) => p.id !== productId).slice(0, 3));
  },
  search: (query: string, filters: SearchFilters = {}) => {
    const q = query.trim().toLowerCase();
    let result = PRODUCTS.filter((p) => {
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
    if (filters.brand?.length)
      result = result.filter((p) =>
        filters.brand!.map((b) => b.toLowerCase()).includes(p.brand.toLowerCase())
      );
    if (filters.color?.length)
      result = result.filter((p) =>
        filters.color!.map((c) => c.toLowerCase()).includes(p.color.toLowerCase())
      );
    if (typeof filters.minPrice === 'number')
      result = result.filter((p) => p.price >= filters.minPrice!);
    if (typeof filters.maxPrice === 'number')
      result = result.filter((p) => p.price <= filters.maxPrice!);
    return Promise.resolve(result);
  },
};

// --- Public API ---

export const getAllProducts = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured) return staticFallback.getAll();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return staticFallback.getAll();
  return (data as ProductRow[]).map(transformProduct);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  if (!isSupabaseConfigured) return staticFallback.getById(id);
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return staticFallback.getById(id);
  return transformProduct(data as ProductRow);
};

export const getProductsByCategory = async (
  category: ProductCategory
): Promise<Product[]> => {
  if (!isSupabaseConfigured) return staticFallback.getByCategory(category);
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category)
    .order('rating', { ascending: false });
  if (error || !data?.length) return staticFallback.getByCategory(category);
  return (data as ProductRow[]).map(transformProduct);
};

export const getTodayDeals = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured) return staticFallback.getTodayDeals();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_on_sale', true)
    .order('discount', { ascending: false })
    .limit(6);
  if (error || !data?.length) return staticFallback.getTodayDeals();
  return (data as ProductRow[]).map(transformProduct);
};

export const getRecommended = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured) return staticFallback.getRecommended();
  // Use top-rated products as recommendations for the navbar panel
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gte('rating', 4.7)
    .order('review_count', { ascending: false })
    .limit(3);
  if (error || !data?.length) return staticFallback.getRecommended();
  return (data as ProductRow[]).map(transformProduct);
};

export const getRelatedTo = async (productId: string): Promise<Product[]> => {
  if (!isSupabaseConfigured) return staticFallback.getRelatedTo(productId);
  // Get products from the same category, excluding current product
  const current = await getProductById(productId);
  if (!current) return staticFallback.getRelatedTo(productId);
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', current.category)
    .neq('id', productId)
    .limit(3);
  if (error || !data?.length) return staticFallback.getRelatedTo(productId);
  return (data as ProductRow[]).map(transformProduct);
};

export const searchProducts = async (
  query: string,
  filters: SearchFilters = {}
): Promise<Product[]> => {
  if (!isSupabaseConfigured) return staticFallback.search(query, filters);
  const q = query.trim().toLowerCase();
  let queryBuilder = supabase.from('products').select('*');

  if (q) {
    queryBuilder = queryBuilder.or(`name.ilike.%${q}%,brand_name.ilike.%${q}%`);
  }
  if (filters.minPrice !== undefined)
    queryBuilder = queryBuilder.gte('price', filters.minPrice);
  if (filters.maxPrice !== undefined)
    queryBuilder = queryBuilder.lte('price', filters.maxPrice);
  if (filters.color?.length)
    queryBuilder = queryBuilder.in('color', filters.color);

  const { data, error } = await queryBuilder.order('rating', { ascending: false });
  if (error) return staticFallback.search(query, filters);

  let result = (data as ProductRow[]).map(transformProduct);
  if (filters.brand?.length) {
    result = result.filter((p) =>
      filters.brand!.map((b) => b.toLowerCase()).includes(p.brand.toLowerCase())
    );
  }
  return result;
};
