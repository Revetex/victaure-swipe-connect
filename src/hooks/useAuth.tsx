
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useSession } from './useSession';
import { clearStorages, handleAuthError } from '@/utils/authUtils';
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
    let refreshTimeout: NodeJS.Timeout | null = null;
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          handleAuthError(sessionError, signOut);
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

        // Calculate time until token expiry and set up refresh
        const expiresAt = session.expires_at;
        if (expiresAt) {
          const timeUntilExpiry = (expiresAt * 1000) - Date.now();
          const refreshTime = Math.max(0, timeUntilExpiry - (5 * 60 * 1000)); // 5 minutes before expiry
          
          if (refreshTimeout) clearTimeout(refreshTimeout);
          refreshTimeout = setTimeout(async () => {
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error('Session refresh error:', refreshError);
              handleAuthError(refreshError, signOut);
            }
          }, refreshTime);
        }

        // Verify user with retry logic
        const verifyUser = async (attempt = 0): Promise<void> => {
          try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError) {
              if (attempt < 3) {
                console.log(`Retrying user verification (${attempt + 1}/3)...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return verifyUser(attempt + 1);
              }
              throw userError;
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
            handleAuthError(error as Error, signOut);
            if (mounted) {
              setState({
                isLoading: false,
                isAuthenticated: false,
                error: error instanceof Error ? error : new Error('Authentication failed'),
                user: null
              });
            }
          }
        };

        await verifyUser();

      } catch (error) {
        console.error("Auth initialization error:", error);
        handleAuthError(error as Error, signOut);
        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: false,
            error: error instanceof Error ? error : new Error('Authentication failed'),
            user: null
          });
        }
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
        const { data: { user } } = await supabase.auth.getUser();
        setState({
          isLoading: false,
          isAuthenticated: true,
          error: null,
          user: user
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
        initializeAuth();
      }
    });

    // Initial auth check
    initializeAuth();

    // Periodic auth check every 5 minutes
    const authCheckInterval = setInterval(initializeAuth, 300000);

    return () => {
      mounted = false;
      if (refreshTimeout) clearTimeout(refreshTimeout);
      clearInterval(authCheckInterval);
      subscription.unsubscribe();
    };
  }, [navigate, signOut]);

  return { 
    ...state,
    signOut
  };
}
