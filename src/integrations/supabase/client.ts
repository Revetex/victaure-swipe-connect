import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfjllillnpleasclqabb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI0MTAsImV4cCI6MjAyNTM5ODQxMH0.0Qx1HWVbZJlhDh-PLBDHGg8dqBWPX-_dWBE8lKZOxZY';

if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});