import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  globalLoading: boolean;
  mobileMenuOpen: boolean;
  filterSidebarOpen: boolean;
}

const initialState: UiState = {
  globalLoading: false,
  mobileMenuOpen: false,
  filterSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    toggleFilterSidebar(state) {
      state.filterSidebarOpen = !state.filterSidebarOpen;
    },
  },
});

export const {
  setGlobalLoading,
  toggleMobileMenu,
  closeMobileMenu,
  toggleFilterSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;
