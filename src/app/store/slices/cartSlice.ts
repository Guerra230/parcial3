import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartSummary } from '../../../types/cart';
import type { Product } from '../../../types/product';
import type { RootState } from '../index';
import { STORAGE_KEYS } from '../../../constants';
import * as cartService from '../../../services/cartService';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const loadFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: loadFromStorage(),
  loading: false,
  error: null,
};

export const syncCartFromServer = createAsyncThunk(
  'cart/syncFromServer',
  async (userId: string) => cartService.getCart(userId)
);

export const pushCartToServer = createAsyncThunk(
  'cart/pushToServer',
  async ({ userId, items }: { userId: string; items: CartItem[] }) =>
    cartService.syncCart(userId, items)
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((it) => it.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((it) => it.product.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((it) => it.product.id !== productId);
        return;
      }
      const item = state.items.find((it) => it.product.id === productId);
      if (item) item.quantity = quantity;
    },
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCartFromServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncCartFromServer.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Merge server cart with local cart
        payload.forEach((serverItem) => {
          const local = state.items.find((it) => it.product.id === serverItem.product.id);
          if (local) {
            local.quantity = Math.max(local.quantity, serverItem.quantity);
          } else {
            state.items.push(serverItem);
          }
        });
      })
      .addCase(syncCartFromServer.rejected, (state) => {
        state.loading = false;
      })
      .addCase(pushCartToServer.rejected, (state, { error }) => {
        state.error = error.message ?? null;
      });
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartItemCount = createSelector(selectCartItems, (items) =>
  items.reduce((acc, it) => acc + it.quantity, 0)
);

export const selectCartSummary = createSelector(
  selectCartItems,
  (items): CartSummary => {
    const subtotal = items.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
    return {
      subtotal,
      shipping: 0,
      discounts: 0,
      total: subtotal,
      currency: 'COP',
    };
  }
);
