import { useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  user: User | null;
}

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null
  });

  return {
    state,
    setState
  };
};