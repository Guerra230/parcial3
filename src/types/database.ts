// ============================================================
// CoreSystems — Database types (aligned with production schema)
// ============================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'buyer' | 'seller';
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  owner_id: string;
  username: string;
  store_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;       // TEXT PK (e.g. 'smartphones')
  label: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface CategoryFilterRow {
  id: string;
  category_id: string;
  section: 'main' | 'accessories' | 'more';
  section_title: string;
  filter_label: string | null;
  filter_items: string[] | null;
  more_label: string | null;
  sort_order: number;
}

export interface BrandRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  brand_id: string | null;
  brand_name: string;
  price: number;           // BIGINT — integer COP
  original_price: number | null;
  image_url: string | null;
  category_id: string | null;
  subcategory: string | null;
  rating: number;
  review_count: number;
  stock: number;
  is_trending: boolean;
  is_on_sale: boolean;
  discount: number;
  color: string | null;
  specs: Record<string, string>;    // JSONB {label: value, ...}
  badges: string[];                 // JSONB ["Free insurance", "0% bank interest"]
  description: string | null;
  seller_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PopularSearch {
  id: number;
  term: string;
  sort_order: number;
}

export interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  rating: number;
  review_count: number;
  badge: string | null;
  is_on_sale: boolean;
  sort_order: number;
}

export interface CartItemRow {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  added_at: string;
}

export interface FavoriteRow {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
}

// Database type map for documentation
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile };
      stores: { Row: Store };
      categories: { Row: CategoryRow };
      category_filters: { Row: CategoryFilterRow };
      brands: { Row: BrandRow };
      products: { Row: ProductRow };
      popular_searches: { Row: PopularSearch };
      recommended_products: { Row: RecommendedProduct };
      cart_items: { Row: CartItemRow };
      favorites: { Row: FavoriteRow };
    };
  };
}
