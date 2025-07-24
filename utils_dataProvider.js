import * as supabaseService from '../supabaseService';

// Pour centraliser les accès à Supabase dans les composants

// INCIDENTS
export const getIncidents = supabaseService.fetchIncidents;
export const createIncident = supabaseService.addIncident;
export const updateIncident = supabaseService.updateIncident;
export const removeIncident = supabaseService.deleteIncident;

// RAPPORTS
export const getRapports = supabaseService.fetchRapports;
export const createRapport = supabaseService.addRapport;
export const updateRapport = supabaseService.updateRapport;
export const removeRapport = supabaseService.deleteRapport;

// USERS
export const getUsers = supabaseService.fetchUsers;
export const createUser = supabaseService.addUser;
export const updateUser = supabaseService.updateUser;
export const removeUser = supabaseService.deleteUser;