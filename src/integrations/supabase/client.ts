import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from "sonner";

// Default development credentials
const SUPABASE_URL = "https://mfjllillnpleasclqabb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMjI0NjAsImV4cCI6MjA1MDU5ODQ2MH0.N6tcfkT23zJcZm-kcP2_KYfN1G8e_cuaLf_vd20Vu7E";

// Create Supabase client with environment variables or fallback to development credentials
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: localStorage,
      storageKey: 'supabase.auth.token',
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
    console.log('Auth state changed:', event);
    // Clear all storage to ensure no stale tokens remain
    localStorage.clear();
    sessionStorage.clear();
    
    if (event === 'SIGNED_OUT') {
      toast.info("Vous avez été déconnecté");
    } else {
      toast.error("Session expirée, veuillez vous reconnecter");
    }
    
    window.location.href = '/auth';
  }
});