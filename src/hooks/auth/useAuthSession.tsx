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
      if (!mounted) return;

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          
          if (!mounted) return;

          if (sessionError.message.includes('Failed to fetch') && retryCount < 3) {
            console.log(`Retrying auth check... Attempt ${retryCount + 1}`);
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(checkAuth, 2000);
            return;
          }

          setState({
            isLoading: false,
            isAuthenticated: false,
            error: sessionError,
            user: null
          });
          
          handleAuthError(sessionError);
          return;
        }

        if (!session) {
          if (!mounted) return;
          
          setState({
            isLoading: false,
            isAuthenticated: false,
            error: null,
            user: null
          });
          return;
        }

        if (!mounted) return;

        setState({
          isLoading: false,
          isAuthenticated: true,
          error: null,
          user: session.user
        });
        
        setRetryCount(0);
      } catch (error) {
        console.error('Auth check error:', error);
        
        if (!mounted) return;

        setState({
          isLoading: false,
          isAuthenticated: false,
          error: error instanceof Error ? error : new Error('Authentication check failed'),
          user: null
        });
        
        toast.error("Erreur d'authentification");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("Auth state changed:", event);

      switch (event) {
        case 'SIGNED_IN':
          if (session) {
            setState({
              isLoading: false,
              isAuthenticated: true,
              error: null,
              user: session.user
            });
          }
          break;

        case 'SIGNED_OUT':
          setState({
            isLoading: false,
            isAuthenticated: false,
            error: null,
            user: null
          });
          navigate('/auth');
          break;

        case 'TOKEN_REFRESHED':
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
          break;
      }
    });

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, retryCount, setState, handleAuthError, setRetryCount]);
};