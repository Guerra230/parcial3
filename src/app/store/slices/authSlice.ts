import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../../../types/database';
import * as authService from '../../../services/authService';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  loading: false,
  error: null,
  initialized: false,
};

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const session = await authService.getSession();
  if (!session) return { session: null, user: null, profile: null };
  const profile = await authService.getProfile(session.user.id);
  return { session, user: session.user, profile };
});

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { session, user } = await authService.signIn(credentials.email, credentials.password);
      const profile = user ? await authService.getProfile(user.id) : null;
      return { session, user, profile };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    data: { email: string; password: string; fullName: string },
    { rejectWithValue }
  ) => {
    try {
      const { session, user } = await authService.signUp(data.email, data.password, {
        full_name: data.fullName,
      });
      return { session, user, profile: null };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al registrarse');
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    await authService.signOut();
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Error al cerrar sesión');
  }
});

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.resetPassword(email);
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Error al enviar email de recuperación'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setSession(state, action) {
      state.session = action.payload.session;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, { payload }) => {
        state.session = payload.session;
        state.user = payload.user;
        state.profile = payload.profile;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.initialized = true;
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.session = payload.session;
        state.user = payload.user;
        state.profile = payload.profile;
      })
      .addCase(signIn.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.session = payload.session;
        state.user = payload.user;
      })
      .addCase(signUp.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.session = null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export const { clearError, setSession } = authSlice.actions;
export default authSlice.reducer;
