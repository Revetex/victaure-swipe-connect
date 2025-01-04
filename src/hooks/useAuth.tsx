import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clear all storage to remove any stale tokens
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

    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // First try to get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          
          // If we get a network error and haven't exceeded retry attempts, try again
          if ((sessionError.message === "Failed to fetch" || sessionError.message.includes("NetworkError")) && retryCount < 3) {
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(checkAuth, 2000); // Retry after 2 seconds
            return;
          }
          
          if (mounted) {
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

        // Verify session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User verification error:", userError);
          if (mounted) {
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
          setRetryCount(0); // Reset retry count on successful auth
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(checkAuth, 2000);
          } else {
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
      } else if (event === 'USER_UPDATED') {
        if (session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/auth', { replace: true });
        }
      } else if (event === 'TOKEN_REFRESHED' && session) {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && !error) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/auth', { replace: true });
        }
      }
    });

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, retryCount]);

  return { isLoading, isAuthenticated, signOut };
}