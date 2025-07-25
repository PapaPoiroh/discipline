import { createClient } from '@supabase/supabase-js'

// Les variables doivent être définies dans Netlify et/ou un fichier .env local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// On crée le client Supabase avec les valeurs sécurisées
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
