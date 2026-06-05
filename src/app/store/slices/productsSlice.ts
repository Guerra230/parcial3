import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '../../../types/product';
import * as productService from '../../../services/productService';
import type { SearchFilters } from '../../../services/productService';

interface ProductsState {
  items: Product[];
  todayDeals: Product[];
  recommended: Product[];
  currentProduct: Product | null;
  relatedProducts: Product[];
  searchResults: Product[];
  loading: {
    items: boolean;
    todayDeals: boolean;
    recommended: boolean;
    currentProduct: boolean;
    relatedProducts: boolean;
    search: boolean;
  };
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  todayDeals: [],
  recommended: [],
  currentProduct: null,
  relatedProducts: [],
  searchResults: [],
  loading: {
    items: false,
    todayDeals: false,
    recommended: false,
    currentProduct: false,
    relatedProducts: false,
    search: false,
  },
  error: null,
};

export const fetchAllProducts = createAsyncThunk('products/fetchAll', async () =>
  productService.getAllProducts()
);

export const fetchTodayDeals = createAsyncThunk('products/fetchTodayDeals', async () =>
  productService.getTodayDeals()
);

export const fetchRecommended = createAsyncThunk('products/fetchRecommended', async () =>
  productService.getRecommended()
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue }) => {
    const product = await productService.getProductById(id);
    if (!product) return rejectWithValue('Producto no encontrado');
    return product;
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelated',
  async (productId: string) => productService.getRelatedTo(productId)
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (category: string) => productService.getProductsByCategory(category as Product['category'])
);

export const searchProductsThunk = createAsyncThunk(
  'products/search',
  async ({ query, filters }: { query: string; filters?: SearchFilters }) =>
    productService.searchProducts(query, filters)
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.relatedProducts = [];
    },
    clearSearchResults(state) {
      state.searchResults = [];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading.items = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, { payload }) => {
        state.loading.items = false;
        state.items = payload;
      })
      .addCase(fetchAllProducts.rejected, (state, { error }) => {
        state.loading.items = false;
        state.error = error.message ?? 'Error al cargar productos';
      })
      .addCase(fetchTodayDeals.pending, (state) => {
        state.loading.todayDeals = true;
      })
      .addCase(fetchTodayDeals.fulfilled, (state, { payload }) => {
        state.loading.todayDeals = false;
        state.todayDeals = payload;
      })
      .addCase(fetchTodayDeals.rejected, (state) => {
        state.loading.todayDeals = false;
      })
      .addCase(fetchRecommended.pending, (state) => {
        state.loading.recommended = true;
      })
      .addCase(fetchRecommended.fulfilled, (state, { payload }) => {
        state.loading.recommended = false;
        state.recommended = payload;
      })
      .addCase(fetchRecommended.rejected, (state) => {
        state.loading.recommended = false;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading.currentProduct = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, { payload }) => {
        state.loading.currentProduct = false;
        state.currentProduct = payload;
      })
      .addCase(fetchProductById.rejected, (state, { payload }) => {
        state.loading.currentProduct = false;
        state.error = payload as string;
      })
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.loading.relatedProducts = true;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, { payload }) => {
        state.loading.relatedProducts = false;
        state.relatedProducts = payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state) => {
        state.loading.relatedProducts = false;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading.items = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, { payload }) => {
        state.loading.items = false;
        state.items = payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state) => {
        state.loading.items = false;
      })
      .addCase(searchProductsThunk.pending, (state) => {
        state.loading.search = true;
      })
      .addCase(searchProductsThunk.fulfilled, (state, { payload }) => {
        state.loading.search = false;
        state.searchResults = payload;
      })
      .addCase(searchProductsThunk.rejected, (state) => {
        state.loading.search = false;
      });
  },
});

export const { clearCurrentProduct, clearSearchResults, clearError } = productsSlice.actions;
export default productsSlice.reducer;
