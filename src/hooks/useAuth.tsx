import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useSession } from './useSession';
import { clearStorages } from '@/utils/authUtils';
import { toast } from 'sonner';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  user: User | null;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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

  const verifyUser = async (retryCount = 0): Promise<User | null> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('User verification error:', error);
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying verification (${retryCount + 1}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return verifyUser(retryCount + 1);
        }
        throw error;
      }
      
      return user;
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying after fetch error (${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return verifyUser(retryCount + 1);
      }
      throw error;
    }
  };

  const { session, user, isLoading: sessionLoading } = useSession(signOut);

  // Update auth state based on session
  if (!state.isAuthenticated && user && !sessionLoading) {
    setState({
      isLoading: false,
      isAuthenticated: true,
      error: null,
      user
    });
  }

  // Set up auth state change listener
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth state changed:", event);
    
    if (event === 'SIGNED_IN' && session) {
      try {
        const currentUser = await verifyUser();
        
        if (currentUser) {
          setState({
            isLoading: false,
            isAuthenticated: true,
            error: null,
            user: currentUser
          });
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        setState({
          isLoading: false,
          isAuthenticated: false,
          error: error instanceof Error ? error : new Error('Session verification failed'),
          user: null
        });
        toast.error("Erreur de vérification de session. Veuillez vous reconnecter.");
        navigate('/auth', { replace: true });
      }
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

  // Update loading state based on session loading
  if (state.isLoading && !sessionLoading) {
    setState(prev => ({
      ...prev,
      isLoading: false
    }));
  }

  return { 
    ...state,
    signOut
  };
}