import { useState } from 'react';
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthState } from './useAuthState';

export const useAuthHandlers = (setState: (state: AuthState) => void) => {
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const handleAuthError = (error: AuthError) => {
    console.error('Auth error:', error);
    setState(prev => ({ ...prev, error, isAuthenticated: false }));
    
    if (error.message.includes('JWT expired')) {
      toast.error('Votre session a expiré. Veuillez vous reconnecter.');
      signOut();
    } else if (error.message.includes('No user found')) {
      toast.error('Utilisateur non trouvé. Veuillez vous reconnecter.');
      signOut();
    } else {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      localStorage.clear();
      sessionStorage.clear();
      
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

      const redirectTo = sessionStorage.getItem('redirectTo') || '/auth';
      navigate(redirectTo, { replace: true });
      
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }));
      navigate('/auth', { replace: true });
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return {
    handleAuthError,
    signOut,
    retryCount,
    setRetryCount
  };
};