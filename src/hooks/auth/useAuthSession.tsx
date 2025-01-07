import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AuthState, AuthStateDispatch } from './useAuthState';
import { useAuthHandlers } from './useAuthHandlers';
import { toast } from 'sonner';

export const useAuthSession = (state: AuthState, setState: AuthStateDispatch) => {
  const navigate = useNavigate();
  const { handleAuthError, retryCount, setRetryCount } = useAuthHandlers(setState);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const checkAuth = async () => {
      try {
        if (!mounted) return;
        
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          
          if (mounted) {
            setState(prev => ({
              ...prev,
              isLoading: false,
              isAuthenticated: false,
              error: sessionError,
              user: null
            }));
            
            if (sessionError.message.includes('Failed to fetch') && retryCount < 3) {
              setRetryCount(prev => prev + 1);
              retryTimeout = setTimeout(checkAuth, 2000);
              return;
            }
            
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

        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: true,
            error: null,
            user: session.user
          });
          setRetryCount(0);
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
          toast.error("Erreur d'authentification. Veuillez réessayer.");
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        setState({
          isLoading: false,
          isAuthenticated: true,
          error: null,
          user: session.user
        });
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        setState({
          isLoading: false,
          isAuthenticated: false,
          error: null,
          user: null
        });
        navigate('/auth');
      } else if (event === 'TOKEN_REFRESHED') {
        if (session) {
          setState({
            isLoading: false,
            isAuthenticated: true,
            error: null,
            user: session.user
          });
        } else {
          setState({
            isLoading: false,
            isAuthenticated: false,
            error: null,
            user: null
          });
          navigate('/auth');
        }
      }
    });

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, retryCount, setState, handleAuthError, setRetryCount]);
};