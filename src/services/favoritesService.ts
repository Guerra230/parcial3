import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product } from '../types/product';
import type { FavoriteRow } from '../types/database';
import { getProductById } from './productService';

export const getFavorites = async (userId: string): Promise<Product[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId);
  if (error) return [];

  const rows = (data ?? []) as Pick<FavoriteRow, 'product_id'>[];
  const products = await Promise.all(rows.map((row) => getProductById(row.product_id)));
  return products.filter((p): p is Product => p !== undefined);
};

export const addFavorite = async (userId: string, productId: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, product_id: productId } as never);
  if (error && (error as { code?: string }).code !== '23505') throw new Error(error.message);
};

export const removeFavorite = async (userId: string, productId: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  if (error) throw new Error(error.message);
};

export const toggleFavorite = async (
  userId: string,
  product: Product
): Promise<Product[]> => {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', product.id)
    .single();

  if (data) {
    await removeFavorite(userId, product.id);
  } else {
    await addFavorite(userId, product.id);
  }
  return getFavorites(userId);
};
