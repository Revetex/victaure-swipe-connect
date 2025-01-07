import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthError, AuthTokenResponse, User } from '@supabase/supabase-js';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  user: User | null;
  isInitializing: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null,
    isInitializing: true
  });
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const handleAuthError = (error: AuthError) => {
    console.error('Auth error:', error);
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
        user: null,
        isInitializing: false
      });

      const redirectTo = sessionStorage.getItem('redirectTo') || '/auth';
      navigate(redirectTo, { replace: true });
      
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        isInitializing: false
      }));
      navigate('/auth', { replace: true });
      toast.error('Erreur lors de la déconnexion');
    }
  };

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const checkAuth = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          if ((sessionError.message.includes('Failed to fetch') || 
               sessionError.message.includes('NetworkError')) && 
              retryCount < 3) {
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(checkAuth, 2000);
            return;
          }
          
          if (mounted) {
            handleAuthError(sessionError);
            setState(prev => ({ ...prev, isInitializing: false }));
          }
          return;
        }
        
        if (!session) {
          if (mounted) {
            setState({
              isLoading: false,
              isAuthenticated: false,
              error: null,
              user: null,
              isInitializing: false
            });
          }
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          if (mounted) {
            handleAuthError(userError);
            setState(prev => ({ ...prev, isInitializing: false }));
          }
          return;
        }

        if (!user) {
          if (mounted) {
            setState({
              isLoading: false,
              isAuthenticated: false,
              error: null,
              user: null,
              isInitializing: false
            });
          }
          return;
        }

        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: true,
            error: null,
            user,
            isInitializing: false
          });
          setRetryCount(0);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(checkAuth, 2000);
          } else {
            setState(prev => ({
              ...prev,
              isLoading: false,
              error: error instanceof Error ? error : new Error('Authentication check failed'),
              isAuthenticated: false,
              isInitializing: false
            }));
          }
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: session.user,
          isInitializing: false
        }));
        navigate('/dashboard', { replace: true });
      } else if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          error: null,
          user: null,
          isInitializing: false
        });
        navigate('/auth', { replace: true });
      }
    });

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, retryCount]);

  return { 
    ...state,
    signOut
  };
}