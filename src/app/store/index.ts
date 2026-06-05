import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import uiReducer from './slices/uiSlice';
import { STORAGE_KEYS } from '../../constants';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Supabase session fields that may contain non-serializable values
        ignoredActions: ['auth/initialize/fulfilled', 'auth/signIn/fulfilled'],
        ignoredPaths: ['auth.session'],
      },
    }),
});

// Persist cart and favorites to localStorage on every change
store.subscribe(() => {
  const { cart, favorites } = store.getState();
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart.items));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites.items));
  } catch {
    // Ignore storage errors (private browsing, quota exceeded)
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
