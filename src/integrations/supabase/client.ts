
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mfjllillnpleasclqabb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMjI0NjAsImV4cCI6MjA1MDU5ODQ2MH0.N6tcfkT23zJcZm-kcP2_KYfN1G8e_cuaLf_vd20Vu7E";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item;
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    }
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...options.headers,
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
    }
  },
  db: {
    schema: 'public'
  },
  queries: {
    retryInterval: 1000,
    maxRetries: 3
  }
});

// Add interceptor for request errors
supabase.rest.onError((error) => {
  console.error('Supabase API Error:', error);
  return Promise.reject(error);
});
