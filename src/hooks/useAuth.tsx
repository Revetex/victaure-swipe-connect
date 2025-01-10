import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useSession } from './useSession';
import { clearStorages } from '@/utils/authUtils';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  user: User | null;
}

export function useAuth() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null
  });

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      clearStorages();
      
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (signOutError) throw signOutError;
      
      setState({
        isLoading: false,
        isAuthenticated: false,
        error: null,
        user: null
      });

      navigate('/auth', { replace: true });
      
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }));
      navigate('/auth', { replace: true });
    }
  };

  const sessionState = useSession(signOut);

  // Update auth state based on session
  if (!state.isAuthenticated && sessionState.user) {
    setState({
      isLoading: false,
      isAuthenticated: true,
      error: null,
      user: sessionState.user
    });
  }

  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event);
    
    if (event === 'SIGNED_IN' && session) {
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: session.user
      }));
      navigate('/dashboard', { replace: true });
    } else if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
      setState({
        isLoading: false,
        isAuthenticated: false,
        error: null,
        user: null
      });
      navigate('/auth', { replace: true });
    }
  });

  return { 
    ...state,
    signOut
  };
}