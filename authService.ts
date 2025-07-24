import { supabase } from './supabaseClient';
import { User } from './types';

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw error;
  return data.user as User;
}

export async function signUp(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) throw error;
  return data.user as User;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}

