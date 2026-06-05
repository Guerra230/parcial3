import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CATEGORIES } from '../data/categories';
import type { CategoryNavItem } from '../types/category';
import type { CategoryRow } from '../types/database';

export const getAllCategories = async (): Promise<CategoryNavItem[]> => {
  if (!isSupabaseConfigured) return CATEGORIES;
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');
  if (error || !data?.length) return CATEGORIES;
  return (data as CategoryRow[]).map((c) => ({
    id: c.id,
    label: c.label,
    slug: c.id,  // categories.id IS the slug (e.g. 'smartphones')
    megaMenu: undefined, // built from category_filters if needed
    highlight: c.id === 'trending' || c.id === 'on-sale',
  }));
};

export const getCategoryBySlug = async (slug: string): Promise<CategoryNavItem | undefined> => {
  if (!isSupabaseConfigured) return CATEGORIES.find((c) => c.slug === slug);
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', slug)
    .single();
  if (error || !data) return CATEGORIES.find((c) => c.slug === slug);
  const c = data as CategoryRow;
  return {
    id: c.id,
    label: c.label,
    slug: c.id,
    megaMenu: undefined,
    highlight: c.id === 'trending' || c.id === 'on-sale',
  };
};
