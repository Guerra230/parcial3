import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CartItem } from '../types/cart';
import type { CartItemRow } from '../types/database';
import { getProductById } from './productService';

export const getCart = async (userId: string): Promise<CartItem[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('cart_items')
    .select('product_id, quantity')
    .eq('user_id', userId);
  if (error) return [];

  const rows = (data ?? []) as Pick<CartItemRow, 'product_id' | 'quantity'>[];
  const items = await Promise.all(
    rows.map(async (row) => {
      const product = await getProductById(row.product_id);
      if (!product) return null;
      return { product, quantity: row.quantity } as CartItem;
    })
  );
  return items.filter((item): item is CartItem => item !== null);
};

export const upsertCartItem = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<void> => {
  if (!isSupabaseConfigured) return;
  // cart_items FK → profiles(id), user_id = auth.uid() which matches profiles.id
  const { error } = await supabase.from('cart_items').upsert(
    { user_id: userId, product_id: productId, quantity } as never,
    { onConflict: 'user_id,product_id' }
  );
  if (error) throw new Error(error.message);
};

export const deleteCartItem = async (userId: string, productId: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  if (error) throw new Error(error.message);
};

export const clearCart = async (userId: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
};

export const syncCart = async (userId: string, items: CartItem[]): Promise<CartItem[]> => {
  if (!isSupabaseConfigured) return items;
  await clearCart(userId);
  if (!items.length) return [];
  await Promise.all(
    items.map((item) => upsertCartItem(userId, item.product.id, item.quantity))
  );
  return items;
};
