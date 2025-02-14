
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useSession } from './useSession';
import { clearStorages } from '@/utils/authUtils';
import { toast } from 'sonner';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  user: User | null;
}

export function useAuth() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null
  });

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      toast.loading("Déconnexion en cours...");
      
      clearStorages();
      
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

      toast.dismiss();
      toast.success("Déconnexion réussie");
      navigate('/auth');
      
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }));
      toast.dismiss();
      toast.error("Erreur lors de la déconnexion");
      navigate('/auth');
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
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

        // Verify user data with retry logic
        const verifyUser = async (attempt = 0): Promise<void> => {
          try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
              if (attempt < 3) {
                console.log(`Retrying user verification (${attempt + 1}/3)...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return verifyUser(attempt + 1);
              }
              throw userError || new Error("User not found");
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
            console.error("User verification error:", error);
            toast.error("Erreur de vérification utilisateur");
            await supabase.auth.signOut();
            setState({
              isLoading: false,
              isAuthenticated: false,
              error: error instanceof Error ? error : new Error('Authentication failed'),
              user: null
            });
          }
        };

        await verifyUser();

      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: false,
            error: error instanceof Error ? error : new Error('Authentication failed'),
            user: null
          });
        }
        toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
        navigate('/auth');
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT' || !session) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          error: null,
          user: null
        });
      } else if (event === 'SIGNED_IN' && session) {
        setState({
          isLoading: false,
          isAuthenticated: true,
          error: null,
          user: session.user
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
        setState(prev => ({
          ...prev,
          isAuthenticated: true
        }));
      }
    });

    // Initial auth check
    initializeAuth();

    // Periodic auth check every 5 minutes
    const authCheckInterval = setInterval(initializeAuth, 300000);

    return () => {
      mounted = false;
      clearInterval(authCheckInterval);
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { 
    ...state,
    signOut
  };
}
