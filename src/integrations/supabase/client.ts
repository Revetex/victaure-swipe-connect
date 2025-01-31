import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from "sonner";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  // Use default development credentials if env vars are not set
  const SUPABASE_URL = "https://mfjllillnpleasclqabb.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMjI0NjAsImV4cCI6MjA1MDU5ODQ2MH0.N6tcfkT23zJcZm-kcP2_KYfN1G8e_cuaLf_vd20Vu7E";
  
  export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  export const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    toast.info("Vous avez été déconnecté");
  } else if (event === 'SIGNED_IN') {
    toast.success("Connexion réussie");
  }
});