import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://achjuopckjmcqtpeolob.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaGp1b3Bja2ptY3F0cGVvbG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjEwNDEsImV4cCI6MjA2ODgzNzA0MX0.KeGwez6dlTkwsImgSiaH3qlZBZTgehbXw_MWW2uH8LY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);