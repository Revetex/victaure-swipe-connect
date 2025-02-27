
import { toast } from 'sonner';

export const handleAuthError = (error: any, signOut: () => Promise<void>) => {
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

export const isRefreshTokenError = (error: any): boolean => {
  return error.message.includes('refresh_token_not_found') || 
         error.message.includes('Invalid Refresh Token');
};

export const clearStorages = () => {
  localStorage.clear();
  sessionStorage.clear();
  
  // Essayer de supprimer tous les cookies
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
};

/**
 * Stocke l'URL actuelle pour rediriger après connexion
 */
export const saveRedirectUrl = (path: string) => {
  if (path !== '/auth' && path !== '/login' && path !== '/signup') {
    sessionStorage.setItem('redirectTo', path);
  }
};

/**
 * Récupère l'URL de redirection
 */
export const getRedirectUrl = (): string => {
  return sessionStorage.getItem('redirectTo') || '/dashboard';
};

/**
 * Efface l'URL de redirection
 */
export const clearRedirectUrl = () => {
  sessionStorage.removeItem('redirectTo');
};
