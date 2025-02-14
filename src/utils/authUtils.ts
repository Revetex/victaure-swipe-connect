import { AuthError } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const handleAuthError = (error: AuthError, signOut: () => Promise<void>) => {
  console.error('Auth error:', error);
  
  if (isRefreshTokenError(error)) {
    console.log('Invalid refresh token, clearing session...');
    signOut();
    return;
  }

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

export const isRefreshTokenError = (error: AuthError): boolean => {
  return error.message.includes('refresh_token_not_found') || 
         error.message.includes('Invalid Refresh Token');
};

export const clearStorages = () => {
  localStorage.clear();
  sessionStorage.clear();
};