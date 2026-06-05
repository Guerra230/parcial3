import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '../types/database';

interface AuthResult {
  user: User | null;
  session: Session | null;
}

export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  if (!isSupabaseConfigured) throw new Error('Supabase no está configurado');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return { user: data.user, session: data.session };
};

export const signUp = async (
  email: string,
  password: string,
  metadata?: Record<string, string>
): Promise<AuthResult> => {
  if (!isSupabaseConfigured) throw new Error('Supabase no está configurado');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  if (error) throw new Error(error.message);
  return { user: data.user, session: data.session };
};

export const signOut = async (): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const resetPassword = async (email: string): Promise<void> => {
  if (!isSupabaseConfigured) throw new Error('Supabase no está configurado');
  const redirectTo = `${window.location.origin}/login?reset=true`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error(error.message);
};

export const getSession = async (): Promise<Session | null> => {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const getProfile = async (userId: string): Promise<Profile | null> => {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as Profile;
};

export const updateProfile = async (
  userId: string,
  updates: { full_name?: string; avatar_url?: string }
): Promise<Profile | null> => {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() } as never)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Profile;
};

export const onAuthStateChange = (
  callback: (user: User | null, session: Session | null) => void
) => {
  if (!isSupabaseConfigured) return { unsubscribe: () => {} };
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null, session);
  });
  return data.subscription;
};
