import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // First, get current session to verify
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }

      if (!session) {
        console.log('No active session found, clearing storage');
        localStorage.clear();
        sessionStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
        navigate('/auth');
        return;
      }

      // Clear all storage first
      localStorage.clear();
      sessionStorage.clear();
      
      // Attempt signout
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error("Sign out error:", signOutError);
        throw signOutError;
      }
      
      setIsAuthenticated(false);
      setUser(null);
      navigate('/auth');
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }
        
        if (!session) {
          if (mounted) {
            setIsAuthenticated(false);
            setUser(null);
            if (window.location.pathname !== '/auth') {
              navigate('/auth');
            }
          }
          return;
        }

        // Verify the session is valid
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User verification error:", userError);
          throw userError;
        }

        if (!currentUser) {
          throw new Error('No user found');
        }

        if (mounted) {
          setIsAuthenticated(true);
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setUser(null);
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
        setUser(session.user);
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT' || !session) {
        await signOut();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { isLoading, isAuthenticated, user, signOut };
}