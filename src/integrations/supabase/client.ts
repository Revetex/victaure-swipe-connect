import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = "https://mfjllillnpleasclqabb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI0MDAsImV4cCI6MjAyNTM5ODQwMH0.7XAD63DVKgQvJ9TM6HJBpbaGOZU_V9Ey3_Qd0qGF3Eo";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: {
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item;
        } catch (error) {
          console.error("Error accessing localStorage:", error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error("Error setting localStorage:", error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error("Error removing from localStorage:", error);
        }
      }
    },
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      "Content-Type": "application/json",
    }
  }
});