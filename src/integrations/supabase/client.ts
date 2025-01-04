import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfjllillnpleasclqabb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2MDI1ODAsImV4cCI6MjAxOTE3ODU4MH0.7bS0qZvxqZwPVxFjZXJBYIVYzQZaZeGqkPpHvBTD2RM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
});