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
  loading: boolean;
}

export function useAuth() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null,
    loading: false
  });

  const signIn = async (email: string, password: string, redirectTo?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate(redirectTo || '/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string, redirectTo?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (signUpError) throw signUpError;

      toast.success("Compte créé avec succès ! Veuillez vérifier votre email.");
      navigate(redirectTo || '/auth');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du compte');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      clearStorages();
      
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (signOutError) throw signOutError;
      
      setState({
        isLoading: false,
        isAuthenticated: false,
        error: null,
        user: null,
        loading: false
      });

      navigate('/auth');
      
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        loading: false
      }));
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
              user: null,
              loading: false
            });
          }
          return;
        }

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
                user,
                loading: false
              });
            }
          } catch (error) {
            console.error("User verification error:", error);
            await supabase.auth.signOut();
            setState({
              isLoading: false,
              isAuthenticated: false,
              error: error instanceof Error ? error : new Error('Authentication failed'),
              user: null,
              loading: false
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
            user: null,
            loading: false
          });
        }
        navigate('/auth');
      }
    };

    initializeAuth();
    
    const authCheckInterval = setInterval(initializeAuth, 300000);

    return () => {
      mounted = false;
      clearInterval(authCheckInterval);
    };
  }, [navigate]);

  return { 
    ...state,
    signIn,
    signUp,
    signOut
  };
}
