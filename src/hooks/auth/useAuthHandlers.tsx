import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthStateDispatch } from './useAuthState';
import { AuthError } from '@supabase/supabase-js';

export const useAuthHandlers = (setState: AuthStateDispatch) => {
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const handleAuthError = (error: Error) => {
    console.error('Auth error:', error);
    
    setState(prev => ({
      ...prev,
      isLoading: false,
      error,
      isAuthenticated: false,
      user: null
    }));

    if (error instanceof AuthError) {
      switch (error.message) {
        case 'Failed to fetch':
          toast.error("Erreur de connexion. Vérifiez votre connexion internet.");
          break;
        case 'Invalid login credentials':
          toast.error("Identifiants invalides");
          break;
        default:
          toast.error("Erreur d'authentification");
      }
    } else {
      toast.error("Une erreur est survenue");
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      setState({
        isLoading: false,
        isAuthenticated: false,
        error: null,
        user: null
      });

      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to sign out')
      }));
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return {
    handleAuthError,
    signOut,
    retryCount,
    setRetryCount
  };
};