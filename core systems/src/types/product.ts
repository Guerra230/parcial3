export type ProductCategory =
  | 'smartphones'
  | 'laptops'
  | 'tablets'
  | 'consoles'
  | 'televisions'
  | 'smartwatches'
  | 'audio'
  | 'gaming-pc';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductSection {
  title: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  currency: 'COP' | 'USD';
  rating: number;
  reviews: number;
  stock: number;
  color: string;
  images: string[];
  shortSpecs: ProductSpec[];
  description: string;
  sections?: ProductSection[];
  badges?: ('insurance' | 'bank-interest' | 'on-sale' | 'trending')[];
  freeShipping?: boolean;
}
