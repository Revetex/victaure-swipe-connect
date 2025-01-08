import { useState } from 'react';
import { User } from '@supabase/supabase-js';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  user: User | null;
}

export type AuthStateDispatch = (state: AuthState | ((prev: AuthState) => AuthState)) => void;

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null
  });

  const safeSetState = (newState: AuthState | ((prev: AuthState) => AuthState)) => {
    setState(prev => {
      const nextState = typeof newState === 'function' ? newState(prev) : newState;
      console.log('Auth state updated:', nextState);
      return nextState;
    });
  };

  return { state, setState: safeSetState };
};