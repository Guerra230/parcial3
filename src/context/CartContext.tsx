import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { CartItem, CartSummary } from '../types/cart';
import type { Product } from '../types/product';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  summary: CartSummary;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const STORAGE_KEY = 'coresystems.cart.v1';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const loadFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.product.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.product.id === product.id
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prev) =>
        prev.map((it) =>
          it.product.id === productId ? { ...it, quantity } : it
        )
      );
    },
    [removeItem]
  );

  const clear = useCallback(() => setItems([]), []);

  const summary: CartSummary = useMemo(() => {
    const subtotal = items.reduce(
      (acc, it) => acc + it.product.price * it.quantity,
      0
    );
    const shipping = 0;
    const discounts = 0;
    return {
      subtotal,
      shipping,
      discounts,
      total: subtotal + shipping - discounts,
      currency: 'COP',
    };
  }, [items]);

  const itemCount = useMemo(
    () => items.reduce((acc, it) => acc + it.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    itemCount,
    summary,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
