import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      localStorage.clear();
      sessionStorage.clear();
      
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (signOutError) {
        console.error("Sign out error:", signOutError);
        throw signOutError;
      }
      
      setIsAuthenticated(false);
      navigate('/auth', { replace: true });
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Sign out error:', error);
      setIsAuthenticated(false);
      navigate('/auth', { replace: true });
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;

    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First try to get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          
          // Retry logic for network errors
          if ((sessionError.message === "Failed to fetch" || 
               sessionError.message.includes("NetworkError")) && 
               retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(checkAuth, RETRY_DELAY);
            return;
          }
          
          if (mounted) {
            setError(sessionError);
            setIsAuthenticated(false);
            navigate('/auth', { replace: true });
          }
          return;
        }
        
        if (!session) {
          if (mounted) {
            setIsAuthenticated(false);
            if (window.location.pathname !== '/auth') {
              navigate('/auth', { replace: true });
            }
          }
          return;
        }

        // Verify the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User verification error:", userError);
          if (mounted) {
            setError(userError);
            setIsAuthenticated(false);
            navigate('/auth', { replace: true });
          }
          return;
        }

        if (!user) {
          if (mounted) {
            setIsAuthenticated(false);
            navigate('/auth', { replace: true });
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
          setRetryCount(0);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          if (retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(checkAuth, RETRY_DELAY);
          } else {
            setError(error instanceof Error ? error : new Error('Authentication check failed'));
            setIsAuthenticated(false);
            navigate('/auth', { replace: true });
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        navigate('/dashboard', { replace: true });
      } else if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        setIsAuthenticated(false);
        navigate('/auth', { replace: true });
      }
    });

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, retryCount]);

  return { isLoading, isAuthenticated, error, signOut };
}