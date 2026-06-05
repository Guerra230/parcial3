import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../../types/product';
import type { RootState } from '../index';
import { STORAGE_KEYS } from '../../../constants';
import * as favoritesService from '../../../services/favoritesService';

interface FavoritesState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const loadFromStorage = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
};

const initialState: FavoritesState = {
  items: loadFromStorage(),
  loading: false,
  error: null,
};

export const syncFavoritesFromServer = createAsyncThunk(
  'favorites/syncFromServer',
  async (userId: string) => favoritesService.getFavorites(userId)
);

export const toggleFavoriteOnServer = createAsyncThunk(
  'favorites/toggleOnServer',
  async ({ userId, product }: { userId: string; product: Product }) =>
    favoritesService.toggleFavorite(userId, product)
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const idx = state.items.findIndex((f) => f.id === product.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(product);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.items = state.items.filter((f) => f.id !== action.payload);
    },
    clearFavorites(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncFavoritesFromServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncFavoritesFromServer.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Merge server favorites with local
        payload.forEach((serverFav) => {
          if (!state.items.some((f) => f.id === serverFav.id)) {
            state.items.push(serverFav);
          }
        });
      })
      .addCase(syncFavoritesFromServer.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

// Selectors
export const selectFavoriteItems = (state: RootState) => state.favorites.items;

export const selectFavoriteIds = createSelector(selectFavoriteItems, (items) =>
  new Set(items.map((f) => f.id))
);

export const selectFavoriteCount = createSelector(
  selectFavoriteItems,
  (items) => items.length
);

export const selectIsFavorite = (productId: string) =>
  createSelector(selectFavoriteIds, (ids) => ids.has(productId));
