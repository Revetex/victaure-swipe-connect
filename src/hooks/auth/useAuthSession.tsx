import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AuthState, AuthStateDispatch } from './useAuthState';
import { useAuthHandlers } from './useAuthHandlers';

export const useAuthSession = (state: AuthState, setState: AuthStateDispatch) => {
  const navigate = useNavigate();
  const { handleAuthError, retryCount, setRetryCount } = useAuthHandlers(setState);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const checkAuth = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          
          if ((sessionError.message.includes('Failed to fetch') || 
               sessionError.message.includes('NetworkError')) && 
              retryCount < 3) {
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(checkAuth, 2000);
            return;
          }
          
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
              isAuthenticated: false
            }));
          }
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
      if (retryTimeout) clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, retryCount, setState, handleAuthError, setRetryCount]);
};