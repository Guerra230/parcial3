import type { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  discounts: number;
  total: number;
  currency: 'COP' | 'USD';
}
