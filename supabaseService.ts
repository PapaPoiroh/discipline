import { supabase } from '../supabaseClient';

// INCIDENTS
export async function fetchIncidents() {
  const { data, error } = await supabase.from('incidents').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addIncident(incident) {
  const { data, error } = await supabase.from('incidents').insert([incident]).select();
  if (error) throw error;
  return data[0];
}

export async function updateIncident(id, update) {
  const { data, error } = await supabase.from('incidents').update(update).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteIncident(id) {
  const { error } = await supabase.from('incidents').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// RAPPORTS
export async function fetchRapports() {
  const { data, error } = await supabase.from('rapports').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addRapport(rapport) {
  const { data, error } = await supabase.from('rapports').insert([rapport]).select();
  if (error) throw error;
  return data[0];
}

export async function updateRapport(id, update) {
  const { data, error } = await supabase.from('rapports').update(update).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteRapport(id) {
  const { error } = await supabase.from('rapports').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// UTILISATEURS
export async function fetchUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
}

export async function addUser(user) {
  const { data, error } = await supabase.from('users').insert([user]).select();
  if (error) throw error;
  return data[0];
}

export async function updateUser(id, update) {
  const { data, error } = await supabase.from('users').update(update).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
  return true;
}