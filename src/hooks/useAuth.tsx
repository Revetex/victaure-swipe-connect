import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthError, User } from '@supabase/supabase-js';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  user: User | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null
  });
  const navigate = useNavigate();

  const handleAuthError = (error: AuthError) => {
    console.error('Auth error:', error);
    
    // Handle refresh token errors specifically
    if (error.message.includes('refresh_token_not_found') || 
        error.message.includes('Invalid Refresh Token')) {
      console.log('Invalid refresh token, clearing session...');
      signOut(); // Force a clean sign out
      return;
    }

    setState(prev => ({ ...prev, error, isAuthenticated: false }));
    
    if (error.message.includes('JWT expired')) {
      toast.error('Votre session a expiré. Veuillez vous reconnecter.');
      signOut();
    } else if (error.message.includes('No user found')) {
      toast.error('Utilisateur non trouvé. Veuillez vous reconnecter.');
      signOut();
    } else {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Clean up storage
      localStorage.clear();
      sessionStorage.clear();
      
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

    const checkAuth = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            handleAuthError(sessionError);
          }
          return;
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

        // Verify user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User verification error:", userError);
          if (mounted) {
            handleAuthError(userError);
          }
          return;
        }

        if (!user) {
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

        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: true,
            error: null,
            user
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Authentication check failed'),
            isAuthenticated: false
          }));
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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