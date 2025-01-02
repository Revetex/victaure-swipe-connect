import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://mfjllillnpleasclqabb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI0MDAsImV4cCI6MjAyNTM5ODQwMH0.ZPgvNWrGqhU9VqXG8HXqo9QO9Gh0tPm5JO-STfEqGLw';

if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});