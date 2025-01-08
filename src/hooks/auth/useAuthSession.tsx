import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AuthState, AuthStateDispatch } from './useAuthState';
import { useAuthHandlers } from './useAuthHandlers';
import { toast } from 'sonner';

export const useAuthSession = (state: AuthState, setState: AuthStateDispatch) => {
  const navigate = useNavigate();
  const { handleAuthError, retryCount, setRetryCount } = useAuthHandlers(setState);
  const mounted = useRef(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!mounted.current) return;
      
      console.log('Checking auth status...');
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!mounted.current) return;

        if (sessionError) {
          console.error("Session error:", sessionError);
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
          console.log('No session found');
          setState({
            isLoading: false,
            isAuthenticated: false,
            error: null,
            user: null
          });
          return;
        }

        console.log('Session found:', session.user.id);
        setState({
          isLoading: false,
          isAuthenticated: true,
          error: null,
          user: session.user
        });
      } catch (error) {
        console.error('Auth check error:', error);
        if (!mounted.current) return;
        
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
      if (!mounted.current) return;

      console.log('Auth state changed:', event);

      switch (event) {
        case 'SIGNED_IN':
          if (session) {
            setState({
              isLoading: false,
              isAuthenticated: true,
              error: null,
              user: session.user
            });
            navigate('/dashboard');
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

        case 'USER_UPDATED':
          if (session) {
            setState({
              isLoading: false,
              isAuthenticated: true,
              error: null,
              user: session.user
            });
          }
          break;
      }
    });

    mounted.current = true;

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [navigate, setState, handleAuthError]);
};