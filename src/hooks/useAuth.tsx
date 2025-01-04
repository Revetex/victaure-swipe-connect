import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // First, clear all storage to remove any stale tokens
      localStorage.clear();
      sessionStorage.clear();
      
      // Then attempt to sign out globally
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (signOutError) {
        console.error("Sign out error:", signOutError);
        throw signOutError;
      }
      
      setIsAuthenticated(false);
      navigate('/auth');
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, ensure we clear the local state
      setIsAuthenticated(false);
      navigate('/auth');
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          await signOut();
          return;
        }
        
        if (!session) {
          if (mounted) {
            setIsAuthenticated(false);
            if (window.location.pathname !== '/auth') {
              navigate('/auth');
            }
          }
          return;
        }

        // Verify session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User verification error:", userError);
          await signOut();
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          await signOut();
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
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        await signOut();
      } else if (event === 'USER_UPDATED') {
        // Handle user updates if needed
        if (session) {
          setIsAuthenticated(true);
        } else {
          await signOut();
        }
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Only update auth state if we have a valid session
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && !error) {
          setIsAuthenticated(true);
          console.log("Token refreshed successfully");
        } else {
          await signOut();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { isLoading, isAuthenticated, signOut };
}