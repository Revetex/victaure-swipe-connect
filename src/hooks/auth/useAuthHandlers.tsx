import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthState, AuthStateDispatch } from './useAuthState';

export const useAuthHandlers = (setState: AuthStateDispatch) => {
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const handleAuthError = (error: Error) => {
    console.error('Auth error:', error);
    
    setState(prev => ({
      ...prev,
      isLoading: false,
      error,
      isAuthenticated: false
    }));

    if (error.message.includes('Failed to fetch')) {
      toast.error("Erreur de connexion. Vérifiez votre connexion internet.");
    } else {
      toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
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
      toast.error("Erreur lors de la déconnexion. Veuillez réessayer.");
    }
  };

  return {
    handleAuthError,
    signOut,
    retryCount,
    setRetryCount
  };
};