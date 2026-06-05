import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CategoryNavItem } from '../../../types/category';
import * as categoryService from '../../../services/categoryService';

interface CategoriesState {
  items: CategoryNavItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () =>
  categoryService.getAllCategories()
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(fetchCategories.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message ?? 'Error al cargar categorías';
      });
  },
});

export default categoriesSlice.reducer;
