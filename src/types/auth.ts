
import { User } from '@supabase/supabase-js';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  user: User | null;
}
