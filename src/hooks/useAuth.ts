import { useAppSelector, useAppDispatch } from '../app/store/hooks';
import { signIn, signOut, signUp, resetPassword, clearError } from '../app/store/slices/authSlice';
import type { LoginFormData, RegisterFormData } from '../utils/validators';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, profile, session, loading, error, initialized } = useAppSelector(
    (state) => state.auth
  );

  return {
    user,
    profile,
    session,
    loading,
    error,
    initialized,
    isAuthenticated: Boolean(user),
    signIn: (data: LoginFormData) =>
      dispatch(signIn({ email: data.email, password: data.password })),
    signUp: (data: RegisterFormData) =>
      dispatch(signUp({ email: data.email, password: data.password, fullName: data.fullName })),
    signOut: () => dispatch(signOut()),
    resetPassword: (email: string) => dispatch(resetPassword(email)),
    clearError: () => dispatch(clearError()),
  };
};
