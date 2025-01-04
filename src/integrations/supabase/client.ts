import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from "sonner";

const SUPABASE_URL = "https://mfjllillnpleasclqabb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMjI0NjAsImV4cCI6MjA1MDU5ODQ2MH0.N6tcfkT23zJcZm-kcP2_KYfN1G8e_cuaLf_vd20Vu7E";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
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
    },
    db: {
      schema: 'public'
    },
    // Add retry configuration
    fetch: (url, options = {}) => {
      const retryCount = 3;
      const retryDelay = 1000; // 1 second

      const fetchWithRetry = async (attempt = 0): Promise<Response> => {
        try {
          const response = await fetch(url, {
            ...options,
            credentials: 'include'
          });

          if (!response.ok && attempt < retryCount) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response;
        } catch (error) {
          if (attempt < retryCount) {
            console.log(`Retry attempt ${attempt + 1} of ${retryCount}`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return fetchWithRetry(attempt + 1);
          }
          
          console.error('Supabase request failed:', error);
          toast.error("Une erreur de connexion est survenue. Veuillez réessayer.");
          throw error;
        }
      };

      return fetchWithRetry();
    }
  }
);

// Add a listener for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
    console.log('Auth state changed:', event);
    toast.error("Votre session a expiré. Veuillez vous reconnecter.");
    // Clear any cached data
    localStorage.clear();
    // Redirect to auth page
    window.location.href = '/auth';
  }
});