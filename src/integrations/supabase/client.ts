import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfjllillnpleasclqabb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQyMTI0NTUsImV4cCI6MjAxOTc4ODQ1NX0.0sTtXqBaXHxRtZNqhqbIY9mTGnl9mF7Ae_IMZZ-JkEY';

if (!supabaseUrl) throw new Error('Missing env.SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing env.SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});