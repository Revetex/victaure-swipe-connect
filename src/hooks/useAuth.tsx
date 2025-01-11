import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!session) {
          if (mounted) {
            setState({
              isLoading: false,
              isAuthenticated: false,
              error: null,
              user: null
            });
          }
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User error:', userError);
          throw userError;
        }

        if (mounted && user) {
          setState({
            isLoading: false,
            isAuthenticated: true,
            error: null,
            user
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: false,
            error: error instanceof Error ? error : new Error('Authentication failed'),
            user: null
          });
        }
        toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
        navigate('/auth', { replace: true });
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        setState({
          isLoading: false,
          isAuthenticated: true,
          error: null,
          user: session.user
        });
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

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { 
    ...state,
    signOut
  };
}