
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AuthError } from '@supabase/supabase-js';
import { clearStorages, handleAuthError } from '@/utils/authUtils';
import { toast } from 'sonner';
import { AuthState } from '@/types/auth';
import { useAuthSession } from './auth/useAuthSession';
import { useTokenRefresh } from './auth/useTokenRefresh';

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
      toast.loading("Déconnexion en cours...");
      
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

      toast.dismiss();
      toast.success("Déconnexion réussie");
      navigate('/auth');
      
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }));
      toast.dismiss();
      toast.error("Erreur lors de la déconnexion");
      navigate('/auth');
    }
  };

  let mounted = true;
  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);

  const { initializeAuth } = useAuthSession(setState, signOut, mounted);
  useTokenRefresh(signOut);

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT' || !session) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          error: null,
          user: null
        });
      } else if (event === 'SIGNED_IN' && session) {
        const { data: { user } } = await supabase.auth.getUser();
        setState({
          isLoading: false,
          isAuthenticated: true,
          error: null,
          user: user
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
        initializeAuth();
      }
    });

    // Initial auth check
    initializeAuth();

    // Periodic auth check every 5 minutes
    const authCheckInterval = setInterval(initializeAuth, 300000);

    return () => {
      clearInterval(authCheckInterval);
      subscription.unsubscribe();
    };
  }, [navigate, signOut, initializeAuth]);

  return { 
    ...state,
    signOut
  };
}
