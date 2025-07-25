import { supabase } from '../supabaseClient';
import { User } from '../types';

export async function getFullUser(): Promise<User | null> {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Erreur récupération utilisateur :', error.message);
    return null;
  }

  return data as User;
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  if (error) throw error;
  return data as User[];
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) throw authError;

  const userId = authData.user.id;

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profile) throw profileError;

  return profile as User;
}

interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: User['role'];
  customRole?: string;
  permissions: User['permissions'];
}

export async function signUp(data: SignUpData) {
  const { email, password, first_name, last_name, role, customRole, permissions } = data;

  // 1. Créer l'utilisateur dans Supabase Auth
  const { data: authUser, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError || !authUser.user) {
    throw signUpError || new Error('Échec de la création de l’utilisateur dans Auth.');
  }

  const userId = authUser.user.id;

  // 2. Ajouter l'utilisateur dans la table `users`
  const { error: insertError } = await supabase.from('users').insert([
    {
      id: userId,
      email,
      first_name,
      last_name,
      role,
      customRole,
      permissions,
      created_at: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    throw insertError;
  }

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}

