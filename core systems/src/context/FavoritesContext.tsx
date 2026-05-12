import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types/product';

interface FavoritesContextValue {
  favorites: Product[];
  ids: Set<string>;
  count: number;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'coresystems.favorites.v1';

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

const loadFromStorage = (): Product[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>(() => loadFromStorage());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const ids = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorite = useCallback(
    (productId: string) => ids.has(productId),
    [ids]
  );

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === product.id)) {
        return prev.filter((f) => f.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== productId));
  }, []);

  const clear = useCallback(() => setFavorites([]), []);

  const value: FavoritesContextValue = {
    favorites,
    ids,
    count: favorites.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clear,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = (): FavoritesContextValue => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};
