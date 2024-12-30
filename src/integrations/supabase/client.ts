import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mfjllillnpleasclqabb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMjI0NjAsImV4cCI6MjA1MDU5ODQ2MH0.N6tcfkT23zJcZm-kcP2_KYfN1G8e_cuaLf_vd20Vu7E";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => {
          try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, JSON.stringify(value));
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
    }
  }
);